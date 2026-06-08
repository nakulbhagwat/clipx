import { load } from 'cheerio';

const BASE_URL = 'https://www.youporn.com';

export async function searchYouporn(query: string, pageToken = '1') {
  try {
    const page = parseInt(pageToken) || 1;
    const url = `${BASE_URL}/search/?query=${encodeURIComponent(query)}&page=${page}`;
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    
    const html = await res.text();
    const $ = load(html);

    const cards = $("div.video-box.pc");

    let searchResults = cards.map((i, el) => {
      const link = $(el).find("a.tm_video_link").attr("href") || "";
      const rawId = link.split("/")[2] || ""; 
      const title = $(el).find("a.tm_video_title span").text().trim();
      const image = $(el).find("img.thumb-image").attr("data-src") || $(el).find("img.thumb-image").attr("src") || "";
      const duration = $(el).find("div.tm_video_duration span").text().trim();
      const viewsRaw = $(el).find(".view-rating-container .info-views").first().text().trim();

      return {
        id: `yp-${rawId}`,
        originalHref: link,
        sourceUrl: `https://www.youporn.com${link}`,
        thumbnail: image,
        title: title || "Unknown Title",
        duration: duration || "",
        isShort: false,
        views: viewsRaw ? parseInt(viewsRaw.replace(/[^0-9]/g, '')) || 100000 : Math.floor(Math.random() * 5000000),
        timestamp: 'Recently added',
        author: {
          name: 'YouPorn Upload',
          avatar: 'https://ui-avatars.com/api/?name=YP&background=random',
          isVerified: false
        }
      };
    }).get();

    searchResults = searchResults.filter((el: any) => el.originalHref && el.thumbnail);

    return {
      videos: searchResults,
      nextPageToken: (page + 1).toString()
    };
  } catch (error) {
    console.error('YouPorn Scraper Error:', error);
    return { videos: [], nextPageToken: null };
  }
}
