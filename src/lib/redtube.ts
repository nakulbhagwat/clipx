import { load } from 'cheerio';

const BASE_URL = 'https://www.redtube.com';

export async function searchRedtube(query: string, pageToken = '1') {
  try {
    const page = parseInt(pageToken) || 1;
    const url = `${BASE_URL}/?search=${encodeURIComponent(query)}&page=${page}`;
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    
    const html = await res.text();
    const $ = load(html);

    const viewsList = $("span.video_count").map((i, el) => $(el).text()).get();

    let searchResults = $("a.video_link")
      .map((i, el) => {
        const link = $(el).attr("href") || "";
        const rawId = link.split("/")[1] || ""; // e.g., "123456" from "/123456"
        const title = $(el).find("img").attr("alt") || "Unknown Title";
        const image = $(el).find("img").attr("data-src") || "";
        const durationText = $(el).find("span.duration").text().split(" ").map(el => el.replace(/[^0-9:]/g, "")).filter(el => el.includes(":")).join(" ");

        return {
          id: `redtube-${rawId}`,
          originalHref: link,
          thumbnail: image,
          title: title,
          duration: durationText || "",
          isShort: false,
          views: viewsList[i] ? parseInt(viewsList[i].replace(/[^0-9]/g, '')) || 100000 : Math.floor(Math.random() * 5000000),
          timestamp: 'Recently added',
          author: {
            name: 'Redtube Upload',
            avatar: 'https://ui-avatars.com/api/?name=RT&background=random',
            isVerified: false
          }
        };
      }).get();

    // Filter invalid
    searchResults = searchResults.filter((el: any) => !el.originalHref.includes("javascript:void(0)") && el.thumbnail && !el.thumbnail.startsWith("data:image"));

    return {
      videos: searchResults,
      nextPageToken: (page + 1).toString()
    };
  } catch (error) {
    console.error('Redtube Scraper Error:', error);
    return { videos: [], nextPageToken: null };
  }
}
