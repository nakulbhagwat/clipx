const YOUTUBE_API_KEY = import.meta.env.PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Utility to parse ISO 8601 duration string to format MM:SS
function formatDuration(isoDuration: string) {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';
  
  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);

  let result = '';
  if (hours > 0) result += `${hours}:`;
  result += `${hours > 0 ? minutes.toString().padStart(2, '0') : minutes}:${seconds.toString().padStart(2, '0')}`;
  return result;
}

// Utility to format publishedAt date to "X time ago"
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return Math.floor(seconds) + ' seconds ago';
}

function mapVideoDetails(item: any) {
  const durationStr = item.contentDetails?.duration || '';
  const isShort = durationStr.includes('M') ? false : (parseInt(durationStr.replace(/\D/g,'')) <= 60);

  return {
    id: item.id,
    title: item.snippet?.title || 'Untitled',
    description: item.snippet?.description || '',
    views: parseInt(item.statistics?.viewCount || '0'),
    likes: parseInt(item.statistics?.likeCount || '0'),
    duration: formatDuration(durationStr),
    timestamp: timeAgo(item.snippet?.publishedAt || new Date().toISOString()),
    thumbnail: item.snippet?.thumbnails?.maxres?.url || item.snippet?.thumbnails?.high?.url || '',
    author: {
      name: item.snippet?.channelTitle || 'Unknown Channel',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.snippet?.channelTitle || 'U')}`,
      isVerified: true, // Assuming YouTube trending are mostly verified
      handle: '',
      subscribers: '1M+' // We don't have this without channel API call
    },
    videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
    isShort: isShort
  };
}

export async function getTrendingVideos(regionCode = 'IN', maxResults = 24, pageToken = '') {
  if (!YOUTUBE_API_KEY) throw new Error('YouTube API Key is missing');

  const pageTokenParam = pageToken ? `&pageToken=${pageToken}` : '';
  const url = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}${pageTokenParam}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    console.error('YouTube API Error:', await response.text());
    return { videos: [], nextPageToken: null };
  }

  const data = await response.json();
  const nextPageToken = data.nextPageToken || null;
  return {
    videos: data.items.map(mapVideoDetails),
    nextPageToken
  };
}

export async function getVideoDetails(videoId: string) {
  if (!YOUTUBE_API_KEY) throw new Error('YouTube API Key is missing');

  const url = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    console.error('YouTube API Error:', await response.text());
    return null;
  }

  const data = await response.json();
  if (data.items && data.items.length > 0) {
    return mapVideoDetails(data.items[0]);
  }
  return null;
}

export async function getRelatedVideos(videoId: string, maxResults = 12, pageToken = '') {
  if (!YOUTUBE_API_KEY) throw new Error('YouTube API Key is missing');

  const pageTokenParam = pageToken ? `&pageToken=${pageToken}` : '';
  const url = `${BASE_URL}/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}${pageTokenParam}`;
  
  const response = await fetch(url);
  if (!response.ok) {
     const fallback = await getTrendingVideos('IN', maxResults);
     return { videos: fallback.videos, nextPageToken: null };
  }

  const data = await response.json();
  const nextPageToken = data.nextPageToken || null;
  
  const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
  if (!videoIds) return { videos: [], nextPageToken };

  const detailsUrl = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
  const detailsResponse = await fetch(detailsUrl);
  if (!detailsResponse.ok) return { videos: [], nextPageToken };

  const detailsData = await detailsResponse.json();
  return {
    videos: detailsData.items.map(mapVideoDetails),
    nextPageToken
  };
}

export async function searchVideos(query: string, maxResults = 24) {
  if (!YOUTUBE_API_KEY) throw new Error('YouTube API Key is missing');

  const url = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    console.error('YouTube API Error:', await response.text());
    return [];
  }

  const data = await response.json();
  
  const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
  if (!videoIds) return [];

  const detailsUrl = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
  const detailsResponse = await fetch(detailsUrl);
  if (!detailsResponse.ok) return [];

  const detailsData = await detailsResponse.json();
  return detailsData.items.map(mapVideoDetails);
}

export async function getTrendingShorts(regionCode = 'IN', maxResults = 15) {
  if (!YOUTUBE_API_KEY) throw new Error('YouTube API Key is missing');

  const url = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent('#shorts')}&type=video&videoDuration=short&regionCode=${regionCode}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;
  
  const response = await fetch(url);
  if (!response.ok) return [];

  const data = await response.json();
  const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
  if (!videoIds) return [];

  const detailsUrl = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
  const detailsResponse = await fetch(detailsUrl);
  if (!detailsResponse.ok) return [];

  const detailsData = await detailsResponse.json();
  return detailsData.items.map(mapVideoDetails).map((v: any) => ({ ...v, isShort: true }));
}

export async function getTrendingShortsPage(regionCode = 'IN', maxResults = 15, pageToken = '') {
  if (!YOUTUBE_API_KEY) throw new Error('YouTube API Key is missing');

  const pageTokenParam = pageToken ? `&pageToken=${pageToken}` : '';
  const url = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent('#shorts')}&type=video&videoDuration=short&regionCode=${regionCode}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}${pageTokenParam}`;
  
  const response = await fetch(url);
  if (!response.ok) return { videos: [], nextPageToken: null };

  const data = await response.json();
  const nextPageToken = data.nextPageToken || null;
  const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
  if (!videoIds) return { videos: [], nextPageToken };

  const detailsUrl = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
  const detailsResponse = await fetch(detailsUrl);
  if (!detailsResponse.ok) return { videos: [], nextPageToken };

  const detailsData = await detailsResponse.json();
  return {
    videos: detailsData.items.map(mapVideoDetails).map((v: any) => ({ ...v, isShort: true })),
    nextPageToken
  };
}

export async function searchVideosPage(query: string, maxResults = 24, pageToken = '') {
  if (!YOUTUBE_API_KEY) throw new Error('YouTube API Key is missing');

  const pageTokenParam = pageToken ? `&pageToken=${pageToken}` : '';
  const url = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}${pageTokenParam}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    console.error('YouTube API Error:', await response.text());
    return { videos: [], nextPageToken: null };
  }

  const data = await response.json();
  const nextPageToken = data.nextPageToken || null;
  
  const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
  if (!videoIds) return { videos: [], nextPageToken };

  const detailsUrl = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
  const detailsResponse = await fetch(detailsUrl);
  if (!detailsResponse.ok) return { videos: [], nextPageToken };

  const detailsData = await detailsResponse.json();
  return {
    videos: detailsData.items.map(mapVideoDetails),
    nextPageToken
  };
}
