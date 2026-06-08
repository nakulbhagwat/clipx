import { load } from 'cheerio';
import { solveChallenge } from './ph-solver';

const BASE_URL = 'https://www.pornhub.com';

export async function searchPornhub(query: string, pageToken = '1') {
  try {
    const page = parseInt(pageToken) || 1;
    const url = `${BASE_URL}/video/search?search=${encodeURIComponent(query)}&page=${page}`;
    
    // PH requires the JS challenge cookie to get valid HTML
    let initialRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    let html = await initialRes.text();
    let cookie = '';

    // If we hit the challenge page
    if (html.includes('document.cookie="KEY="')) {
      cookie = await solveChallenge(html);
      
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Cookie': cookie
        }
      });
      html = await res.text();
    }
    
    const $ = load(html);

    let searchResults = $("div.wrap")
      .map((i, el) => {
        const link = $(el).find("a").attr("href") || "";
        const id = link.split("=")[1] || "";
        const title = $(el).find("a").attr("title") || "Unknown Title";
        const image = $(el).find("img").attr("src") || "";
        const duration = $(el).find("var.duration").text() || "";
        const viewsRaw = $(el).find("div.videoDetailsBlock").find("span.views").text() || "";

        return {
          id: `ph-${id}`,
          originalHref: link,
          sourceUrl: `https://www.pornhub.com${link}`,
          thumbnail: image,
          title: title,
          duration: duration,
          isShort: false,
          views: viewsRaw ? parseInt(viewsRaw.replace(/[^0-9]/g, '')) || 100000 : Math.floor(Math.random() * 5000000),
          timestamp: 'Recently added',
          author: {
            name: 'Pornhub Upload',
            avatar: 'https://ui-avatars.com/api/?name=PH&background=random',
            isVerified: true
          }
        };
      }).get();

    // Filter invalid
    searchResults = searchResults.filter((el: any) => el.originalHref && el.originalHref.includes("viewkey=") && el.thumbnail && !el.thumbnail.startsWith("data:image"));

    return {
      videos: searchResults,
      nextPageToken: (page + 1).toString()
    };
  } catch (error) {
    console.error('Pornhub Scraper Error:', error);
    return { videos: [], nextPageToken: null };
  }
}
