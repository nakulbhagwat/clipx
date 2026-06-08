const BASE_API_URL = 'https://api.redtube.com/';

export async function searchRedtube(query: string, pageToken = '1') {
  try {
    const page = parseInt(pageToken) || 1;
    // Redtube API docs: https://api.redtube.com/
    const url = `${BASE_API_URL}?data=redtube.Videos.searchVideos&search=${encodeURIComponent(query)}&page=${page}&output=json`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    
    const data = await res.json();
    if (!data || !data.videos) return { videos: [], nextPageToken: null };

    const searchResults = data.videos.map((vData: any) => {
      const v = vData.video;
      return {
        id: `redtube-${v.video_id}`,
        originalHref: v.url,
        sourceUrl: v.url,
        thumbnail: v.default_thumb || '',
        title: v.title || 'Redtube Video',
        duration: v.duration || '',
        isShort: false,
        views: v.views || Math.floor(Math.random() * 5000000),
        timestamp: v.publish_date || 'Recently added',
        author: {
          name: 'Redtube',
          avatar: 'https://ui-avatars.com/api/?name=RT&background=random',
          isVerified: false
        }
      };
    });

    return {
      videos: searchResults,
      nextPageToken: (page + 1).toString()
    };
  } catch (error) {
    console.error('Redtube API Error:', error);
    return { videos: [], nextPageToken: null };
  }
}
