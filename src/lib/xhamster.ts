import { load } from 'cheerio';

const BASE_URL = 'https://xhamster.com';

export async function searchXhamster(query: string, pageToken = '1') {
  try {
    const page = parseInt(pageToken) || 1;
    const url = `${BASE_URL}/search/${encodeURIComponent(query)}?page=${page}`;
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    
    const html = await res.text();
    const $ = load(html);

    const viewsList = $("div.video-thumb-views").map((i, el) => $(el).text()).get();
    const durationList = $("span[data-role='video-duration']").map((i, el) => $(el).text()).get();

    let searchResults = $("a.video-thumb__image-container")
      .map((i, el) => {
        const link = $(el).attr("href") || "";
        const rawId = link.split("-").pop() || ""; // Extract ID from end of URL

        return {
          id: `xhamster-${rawId}`,
          originalHref: link,
          thumbnail: $(el).find("img").attr("src") || "",
          title: $(el).find("img").attr("alt") || "Unknown Title",
          duration: durationList[i] || "",
          isShort: false,
          views: viewsList[i] ? parseInt(viewsList[i].replace(/[^0-9]/g, '')) || 100000 : Math.floor(Math.random() * 5000000),
          timestamp: 'Recently added',
          author: {
            name: 'xHamster Upload',
            avatar: 'https://ui-avatars.com/api/?name=XH&background=random',
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
    console.error('xHamster Scraper Error:', error);
    return { videos: [], nextPageToken: null };
  }
}
