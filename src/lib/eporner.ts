import { formatNumber, calculateTimestamp } from './utils';

export async function searchEporner(query: string, page: number = 1): Promise<any[]> {
  const url = `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(query)}&per_page=20&page=${page}&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data || !data.videos) return [];

    return data.videos.map((v: any) => {
      // Eporner views are just integer numbers, format them if needed, or use them directly
      const views = parseInt(v.views || 0, 10);
      
      return {
        id: `ep-${v.id}`,
        title: v.title,
        thumbnail: v.default_thumb?.src || '',
        duration: v.length_min || '',
        url: v.url,
        views: views,
        timestamp: calculateTimestamp(v.added) || 'Recently',
        author: {
          name: 'Eporner',
          url: 'https://www.eporner.com/',
          avatar: 'https://ui-avatars.com/api/?name=EP&background=random'
        }
      };
    });
  } catch (error) {
    console.error('Error fetching Eporner:', error);
    return [];
  }
}
