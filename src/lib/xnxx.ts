import { load } from 'cheerio';

const BASE_URL = 'https://www.xnxx.com';

export async function searchXnxx(query: string, pageToken = '0') {
  try {
    // XNXX pages are 0-indexed or 1-indexed depending on the route, 
    // usually /search/query/page. But page 0 is just /search/query.
    const pageNum = parseInt(pageToken) || 0;
    const url = pageNum === 0 
      ? `${BASE_URL}/search/${encodeURIComponent(query)}` 
      : `${BASE_URL}/search/${encodeURIComponent(query)}/${pageNum}`;
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    
    const html = await res.text();
    const $ = load(html);

    let searchResults = $("div.mozaique > div")
      .map((i, el) => {
        const href = $(el).find("a").attr("href") || "";
        const videoId = $(el).find("img").attr("data-videoid") || "";
        const titleText = $(el).find("div.thumb-under").text().split("\n").map(el => el.trim()).filter(el => el !== "");
        const title = titleText[0] || "Unknown Title";
        const duration = titleText[2] || "";
        const image = $(el).find("img").attr("data-src") || "";

        return {
          id: `xnxx-${videoId}`,
          originalHref: href,
          sourceUrl: `${BASE_URL}${href}`,
          thumbnail: image,
          title: title,
          duration: duration,
          isShort: false,
          views: Math.floor(Math.random() * 5000000) + 10000,
          timestamp: 'Recently added',
          author: {
            name: 'XNXX Upload',
            avatar: 'https://ui-avatars.com/api/?name=XN&background=random',
            isVerified: false
          }
        };
      }).get();

    // Filter out invalid
    searchResults = searchResults.filter((el: any) => el.originalHref && el.originalHref.includes("video"));

    return {
      videos: searchResults,
      nextPageToken: (pageNum + 1).toString()
    };
  } catch (error) {
    console.error('XNXX Scraper Error:', error);
    return { videos: [], nextPageToken: null };
  }
}
