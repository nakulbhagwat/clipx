import { load } from 'cheerio';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Extracts the direct MP4/HLS video stream URL from a source page.
 * This is how sites like TubeSafari work - they scrape the actual video URL
 * and play it in their own HTML5 player.
 */
export async function extractVideoUrl(videoId: string): Promise<{ videoUrl: string; title: string; thumbnail: string } | null> {
  try {
    if (videoId.startsWith('redtube-')) return await extractRedtube(videoId.replace('redtube-', ''));
    if (videoId.startsWith('xhamster-')) return await extractXhamster(videoId.replace('xhamster-', ''));
    if (videoId.startsWith('yp-')) return await extractYouporn(videoId.replace('yp-', ''));
    if (videoId.startsWith('ph-')) return await extractPornhub(videoId.replace('ph-', ''));
    return null;
  } catch (e) {
    console.error('Video extraction failed:', e);
    return null;
  }
}

// ========== REDTUBE ==========
async function extractRedtube(id: string): Promise<{ videoUrl: string; title: string; thumbnail: string } | null> {
  const url = `https://www.redtube.com/${id}`;
  const html = await fetchPage(url);
  const $ = load(html);

  const title = $('title').text().replace(' - RedTube', '').trim() || 'Video';
  const thumbnail = $('meta[property="og:image"]').attr('content') || '';
  
  // Redtube stores video URLs in page scripts as mediaDefinitions JSON
  const mediaMatch = html.match(/mediaDefinitions["']?\s*:\s*(\[[\s\S]*?\])/);
  if (mediaMatch) {
    try {
      const mediaDefs = JSON.parse(mediaMatch[1]);
      // Find the best quality MP4
      const mp4 = mediaDefs.filter((m: any) => m.format === 'mp4').sort((a: any, b: any) => (b.quality || 0) - (a.quality || 0));
      if (mp4.length > 0 && mp4[0].videoUrl) {
        return { videoUrl: mp4[0].videoUrl, title, thumbnail };
      }
    } catch (e) { /* parse error, try regex fallback */ }
  }
  
  // Fallback: look for direct MP4 URL in page
  const mp4Url = extractRegex(html, /"videoUrl"\s*:\s*"([^"]+\.mp4[^"]*)"/);
  if (mp4Url) return { videoUrl: mp4Url.replace(/\\\//g, '/'), title, thumbnail };
  
  return null;
}

// ========== XHAMSTER ==========
async function extractXhamster(id: string): Promise<{ videoUrl: string; title: string; thumbnail: string } | null> {
  const url = `https://xhamster.com/videos/${id}`;
  const html = await fetchPage(url);
  const $ = load(html);
  
  const title = $('title').text().replace(' - xHamster', '').trim() || 'Video';
  const thumbnail = $('meta[property="og:image"]').attr('content') || '';
  
  // xHamster stores video data in window.initials JSON
  const initialsMatch = html.match(/window\.initials\s*=\s*({[\s\S]*?});\s*<\/script>/);
  if (initialsMatch) {
    try {
      const initials = JSON.parse(initialsMatch[1]);
      const sources = initials?.videoModel?.sources;
      if (sources?.mp4) {
        // Get highest quality
        const qualities = Object.entries(sources.mp4).sort((a: any, b: any) => parseInt(b[0]) - parseInt(a[0]));
        if (qualities.length > 0) {
          return { videoUrl: (qualities[0][1] as string), title, thumbnail };
        }
      }
      if (sources?.hls?.url) {
        return { videoUrl: sources.hls.url, title, thumbnail };
      }
    } catch (e) { /* parse error */ }
  }
  
  // Fallback regex
  const mp4 = extractRegex(html, /"mp4"\s*:\s*\{[^}]*"(\d+)"\s*:\s*"(https?:[^"]+)"/);
  if (mp4) return { videoUrl: mp4.replace(/\\\//g, '/'), title, thumbnail };
  
  return null;
}

// ========== YOUPORN ==========
async function extractYouporn(id: string): Promise<{ videoUrl: string; title: string; thumbnail: string } | null> {
  const url = `https://www.youporn.com/watch/${id}/`;
  const html = await fetchPage(url);
  const $ = load(html);

  const title = $('title').text().replace(' - YouPorn', '').trim() || 'Video';
  const thumbnail = $('meta[property="og:image"]').attr('content') || '';
  
  // YouPorn stores video in mediaDefinitions similar to Redtube (same network)
  const mediaMatch = html.match(/mediaDefinitions["']?\s*:\s*(\[[\s\S]*?\])/);
  if (mediaMatch) {
    try {
      const mediaDefs = JSON.parse(mediaMatch[1]);
      const mp4 = mediaDefs.filter((m: any) => m.format === 'mp4').sort((a: any, b: any) => (b.quality || 0) - (a.quality || 0));
      if (mp4.length > 0 && mp4[0].videoUrl) {
        return { videoUrl: mp4[0].videoUrl, title, thumbnail };
      }
    } catch (e) { /* parse error */ }
  }
  
  return null;
}

// ========== PORNHUB ==========
async function extractPornhub(viewkey: string): Promise<{ videoUrl: string; title: string; thumbnail: string } | null> {
  const { solveChallenge } = await import('./ph-solver');
  const url = `https://www.pornhub.com/view_video.php?viewkey=${viewkey}`;
  
  let html = await fetchPage(url);
  
  // Handle JS challenge
  if (html.includes('document.cookie="KEY="')) {
    const cookie = await solveChallenge(html);
    html = await fetchPage(url, cookie);
  }
  
  const $ = load(html);
  const title = $('title').text().replace(' - Pornhub.com', '').trim() || 'Video';
  const thumbnail = $('meta[property="og:image"]').attr('content') || '';
  
  // Pornhub stores video URLs in flashvars_ object or mediaDefinitions
  const mediaMatch = html.match(/mediaDefinitions["']?\s*:\s*(\[[\s\S]*?\])/);
  if (mediaMatch) {
    try {
      const mediaDefs = JSON.parse(mediaMatch[1]);
      const mp4 = mediaDefs
        .filter((m: any) => m.format === 'mp4' && m.videoUrl)
        .sort((a: any, b: any) => (parseInt(b.quality) || 0) - (parseInt(a.quality) || 0));
      if (mp4.length > 0) {
        return { videoUrl: mp4[0].videoUrl, title, thumbnail };
      }
    } catch (e) { /* parse error */ }
  }
  
  // Fallback: look for quality_ URLs
  const mp4Url = extractRegex(html, /"quality_\d+p"\s*:\s*"(https?:[^"]+\.mp4[^"]*)"/);
  if (mp4Url) return { videoUrl: mp4Url.replace(/\\\//g, '/'), title, thumbnail };
  
  return null;
}

// ========== HELPERS ==========
async function fetchPage(url: string, cookie?: string): Promise<string> {
  const headers: Record<string, string> = {
    'User-Agent': USER_AGENT,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
  };
  if (cookie) headers['Cookie'] = cookie;
  
  const res = await fetch(url, { headers, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function extractRegex(text: string, regex: RegExp): string | null {
  const match = text.match(regex);
  return match ? match[1] : null;
}
