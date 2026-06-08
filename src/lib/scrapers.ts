import { searchXvideos } from './xvideos';
import { searchXnxx } from './xnxx';
import { searchRedtube } from './redtube';
import { searchXhamster } from './xhamster';
import { searchYouporn } from './youporn';
import { searchPornhub } from './pornhub';

export type ScraperType = 'xvideos' | 'xnxx' | 'redtube' | 'xhamster' | 'youporn' | 'pornhub';

// Used to maintain the same source when paginating through infinite scroll
export async function getFeedBySource(source: ScraperType, query: string, pageToken: string) {
  switch (source) {
    case 'xnxx':
      return await searchXnxx(query, pageToken);
    case 'redtube':
      return await searchRedtube(query, pageToken);
    case 'xhamster':
      return await searchXhamster(query, pageToken);
    case 'youporn':
      return await searchYouporn(query, pageToken);
    case 'pornhub':
      return await searchPornhub(query, pageToken);
    case 'xvideos':
    default:
      return await searchXvideos(query, pageToken);
  }
}

// Randomly selects one of the scrapers
export async function getRandomFeed(query: string) {
  const sources: ScraperType[] = ['xvideos', 'xnxx', 'redtube', 'xhamster', 'youporn', 'pornhub'];
  const randomSource = sources[Math.floor(Math.random() * sources.length)];
  
  const result = await getFeedBySource(randomSource, query, '0'); // start at page 0 or 1 depending on scraper, pass 0 let scraper handle it

  return {
    ...result,
    source: randomSource
  };
}
