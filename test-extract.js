// Quick test to debug video extraction
import { load } from 'cheerio';

async function test() {
  const url = 'https://www.xvideos.com/video.44784753/aaa';
  console.log('Fetching:', url);
  
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    redirect: 'follow'
  });
  
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('HTML length:', html.length);
  
  // Check for video URL patterns
  const hlsMatch = html.match(/html5player\.setVideoHLS\('([^']+)'\)/);
  const highMatch = html.match(/html5player\.setVideoUrlHigh\('([^']+)'\)/);
  const lowMatch = html.match(/html5player\.setVideoUrlLow\('([^']+)'\)/);
  
  console.log('HLS:', hlsMatch ? hlsMatch[1].substring(0, 80) + '...' : 'NOT FOUND');
  console.log('High:', highMatch ? highMatch[1].substring(0, 80) + '...' : 'NOT FOUND');
  console.log('Low:', lowMatch ? lowMatch[1].substring(0, 80) + '...' : 'NOT FOUND');
  
  // Check title
  const $ = load(html);
  console.log('Title:', $('title').text().substring(0, 80));
  
  // Check if we got a challenge/blocked page
  if (html.includes('captcha') || html.includes('challenge') || html.includes('blocked')) {
    console.log('WARNING: Page appears to be a captcha/challenge page');
  }
  
  // Look for any video-related URLs in the HTML
  const videoUrls = html.match(/https?:\/\/[^"'\s]+\.(mp4|m3u8|webm)[^"'\s]*/g);
  if (videoUrls) {
    console.log('\nFound video URLs:');
    videoUrls.slice(0, 5).forEach(u => console.log(' -', u.substring(0, 100)));
  } else {
    console.log('\nNo video URLs found in page');
    // Print a sample of the HTML to see what we got
    console.log('\nFirst 500 chars of HTML:');
    console.log(html.substring(0, 500));
  }
}

test().catch(console.error);
