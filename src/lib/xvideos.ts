import { load } from 'cheerio';

const BASE_URL = 'https://www.xvideos.com';

export async function searchXvideos(query: string, pageToken = '0') {
  try {
    const page = parseInt(pageToken) || 0;
    const url = `${BASE_URL}/?k=${encodeURIComponent(query)}&p=${page}`;
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    
    const html = await res.text();
    const $ = load(html);

    const data = $("div.thumb-under").map((i, el) => {
      return {
        title: $(el).find("a").attr("title"),
        duration: $(el).find("span.duration").text(),
      };
    }).get();

    let searchResults = $("div.mozaique.cust-nb-cols")
      .find("div.thumb")
      .map((i, el) => {
        const href = $(el).find("a").attr("href") || "";
        const videoId = $(el).find("img").attr("data-videoid");
        const image = $(el).find("img").attr("data-src") || "";
        
        const rawId = videoId || href.replace('/video', '');
        return {
          id: `xv-${rawId}`, // Added xv- prefix
          originalHref: href,
          sourceUrl: `https://www.xvideos.com${href}`,
          thumbnail: image.replace('THUMBNUM', '1'), // Fallback if THUMBNUM isn't replaced
          title: data[i]?.title || "Unknown Title",
          duration: data[i]?.duration || "",
          isShort: false,
          views: Math.floor(Math.random() * 5000000) + 10000, // Mock views
          timestamp: 'Recently added',
          author: {
            name: 'Xvideos Upload',
            avatar: 'https://ui-avatars.com/api/?name=XV&background=random',
            isVerified: false
          }
        };
      }).get();

    // Filter out ads or invalid entries
    searchResults = searchResults.filter((el: any) => el.originalHref && el.originalHref.includes("/video"));

    return {
      videos: searchResults,
      nextPageToken: (page + 1).toString()
    };
  } catch (error) {
    console.error('Xvideos Scraper Error:', error);
    return { videos: [], nextPageToken: null };
  }
}
