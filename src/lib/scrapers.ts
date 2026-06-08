import { searchEporner } from './eporner';
import { searchRedtube } from './redtube';
import { searchXhamster } from './xhamster';
import { searchYouporn } from './youporn';
import { searchPornhub } from './pornhub';

export type ScraperType = 'eporner' | 'redtube' | 'xhamster' | 'youporn' | 'pornhub';

// Used to maintain the same source when paginating through infinite scroll
export async function getFeedBySource(source: ScraperType, query: string, pageToken: string) {
  const page = Math.max(1, parseInt(pageToken) || 1);
  switch (source) {
    case 'redtube':
      return await searchRedtube(query, pageToken);
    case 'xhamster':
      return await searchXhamster(query, pageToken);
    case 'youporn':
      return await searchYouporn(query, pageToken);
    case 'pornhub':
      return await searchPornhub(query, pageToken);
    case 'eporner':
    default:
      return { videos: await searchEporner(query, page), nextPageToken: (page + 1).toString() };
  }
}

// Randomly selects one of the scrapers
export async function getRandomFeed(query: string) {
  const sources: ScraperType[] = ['eporner', 'redtube', 'xhamster', 'youporn', 'pornhub'];
  const randomSource = sources[Math.floor(Math.random() * sources.length)];
  
  const result = await getFeedBySource(randomSource, query, '1');

  return {
    ...result,
    source: randomSource
  };
}

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Fetches from ALL sources in parallel and mixes the results together.
 * If a source fails, it is silently skipped so the feed still works.
 */
export async function getMixedFeed(query: string, pageToken = '1') {
  const sources: ScraperType[] = ['eporner', 'redtube', 'xhamster', 'youporn', 'pornhub'];

  const results = await Promise.allSettled(
    sources.map(source => getFeedBySource(source, query, pageToken))
  );

  let allVideos: any[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.videos.length > 0) {
      allVideos = allVideos.concat(result.value.videos);
    }
  }

  // Shuffle everything together so all sites are interleaved
  allVideos = shuffle(allVideos);

  const nextTokenNum = parseInt(pageToken) || 1;
  return {
    videos: allVideos,
    nextPageToken: (nextTokenNum + 1).toString(),
    source: 'mixed' as string
  };
}
