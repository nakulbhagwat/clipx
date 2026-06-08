export interface VideoItem {
  id: string;
  title: string;
  views: number;
  duration: string;
  timestamp: string;
  author: {
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  thumbnail: string;
  videoUrl?: string;
}

export interface ShortItem {
  id: string;
  title: string;
  views: number;
  thumbnail: string;
}

export interface SidebarItem {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export const siteConfig = {
  branding: {
    siteName: 'ClipX',
    logoClip: 'Clip',
    logoX: 'X',
    searchPlaceholder: 'Search',
    signInLabel: 'Sign in',
    signInPrompt: 'Sign in to like videos, comment, and subscribe.',
    createLabel: 'Create',
    copyright: '© 2025 ClipX',
    seo: {
      title: 'ClipX - Video Sharing Platform',
      description: 'The best place to watch and share videos.',
    },
    theme: {
      primaryFrom: '#e50914',
      primaryTo: '#b91c1c',
    },
    localization: {
      views: 'views',
      ago: 'ago',
      subscribers: 'subscribers',
    }
  },
  sidebar: [
    {
      items: [
        { icon: 'home', label: 'Home', href: '/', active: true },
        { icon: 'subscriptions', label: 'Subscriptions', href: '/subscriptions' },
      ],
    },
    {
      title: 'You',
      items: [
        { icon: 'user', label: 'Your channel', href: '/channel' },
        { icon: 'history', label: 'History', href: '/history' },
        { icon: 'playlist', label: 'Playlists', href: '/playlists' },
        { icon: 'clock', label: 'Watch later', href: '/watch-later' },
        { icon: 'thumbsUp', label: 'Liked videos', href: '/liked' },
      ],
    },
    {
      title: 'Explore',
      items: [
        { icon: 'flame', label: 'Trending', href: '/trending' },
        { icon: 'shopping', label: 'Shopping', href: '/shopping' },
        { icon: 'music', label: 'Music', href: '/music' },
        { icon: 'film', label: 'Movies', href: '/movies' },
        { icon: 'radio', label: 'Live', href: '/live' },
        { icon: 'gamepad', label: 'Gaming', href: '/gaming' },
        { icon: 'newspaper', label: 'News', href: '/news' },
        { icon: 'trophy', label: 'Sports', href: '/sports' },
        { icon: 'graduation', label: 'Courses', href: '/courses' },
        { icon: 'podcast', label: 'Podcasts', href: '/podcasts' },
      ],
    },
    {
      title: 'More from ClipX',
      items: [
        { icon: 'premium', label: 'ClipX Premium', href: '/premium' },
        { icon: 'musicNote', label: 'ClipX Music', href: '/clipx-music' },
      ],
    },
  ] as SidebarSection[],
  sidebarFooter: [
    'About', 'Press', 'Copyright', 'Contact us', 'Creators',
    'Advertise', 'Developers', 'Terms', 'Privacy', 'Policy & Safety',
  ],
  categories: [
    { label: 'All', active: true },
    { label: 'Gaming', active: false },
    { label: 'Music', active: false },
    { label: 'Mixes', active: false },
    { label: 'Live', active: false },
    { label: 'Podcasts', active: false },
    { label: 'Coding', active: false },
    { label: 'AI', active: false },
    { label: 'Cooking', active: false },
    { label: 'Sports', active: false },
    { label: 'Nature', active: false },
    { label: 'Film & Animation', active: false },
    { label: 'Fashion', active: false },
    { label: 'Recently uploaded', active: false },
    { label: 'Watched', active: false },
    { label: 'New to you', active: false },
  ],
  sectionHeadings: {
    recommended: 'Recommended',
    trending: 'Trending',
  },
  emptyState: {
    title: 'No videos available',
    description: 'Check back later for new content from your favorite creators.',
  },
  placeholderData: {
    videos: [
      {
        id: '1',
        title: 'Building a Mass-Production Robot Factory in 10 Minutes',
        views: 2400000,
        duration: '10:23',
        timestamp: '3 days ago',
        author: { name: 'MegaBuilds', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=88&h=88&fit=crop&q=80', isVerified: true },
        thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=640&h=360&fit=crop&q=80',
      },
      {
        id: '2',
        title: 'I Survived 100 Days in Hardcore Mode – Here\'s What Happened',
        views: 45000000,
        duration: '1:23:45',
        timestamp: '2 months ago',
        author: { name: 'GameMaster Pro', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=88&h=88&fit=crop&q=80', isVerified: true },
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop&q=80',
      },
      {
        id: '3',
        title: 'The Most Beautiful Places on Earth | 4K Drone Footage',
        views: 12000000,
        duration: '18:42',
        timestamp: '1 year ago',
        author: { name: 'Nature Wonder', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=88&h=88&fit=crop&q=80', isVerified: true },
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=360&fit=crop&q=80',
      },
      {
        id: '4',
        title: 'Why Nobody Can Beat This Sorting Algorithm',
        views: 8200000,
        duration: '22:15',
        timestamp: '5 days ago',
        author: { name: 'CodeVault', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=88&h=88&fit=crop&q=80', isVerified: true },
        thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=640&h=360&fit=crop&q=80',
      },
      {
        id: '5',
        title: 'Making the Perfect Croissant From Scratch – Full Recipe',
        views: 3100000,
        duration: '15:33',
        timestamp: '2 weeks ago',
        author: { name: 'Chef\'s Table', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=88&h=88&fit=crop&q=80' },
        thumbnail: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=640&h=360&fit=crop&q=80',
      },
      {
        id: '6',
        title: 'Best Plays Compilation 2025 – Unbelievable Moments',
        views: 6700000,
        duration: '12:08',
        timestamp: '1 week ago',
        author: { name: 'Sports Central', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=88&h=88&fit=crop&q=80', isVerified: true },
        thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=640&h=360&fit=crop&q=80',
      },
      {
        id: '7',
        title: 'This AI Can Read Your Mind – Here\'s How It Works',
        views: 18000000,
        duration: '14:22',
        timestamp: '4 days ago',
        author: { name: 'Tech Today', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=88&h=88&fit=crop&q=80', isVerified: true },
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=360&fit=crop&q=80',
      },
      {
        id: '8',
        title: 'Lo-fi Hip Hop Radio – Beats to Study and Relax To',
        views: 892000000,
        duration: 'LIVE',
        timestamp: 'Streaming now',
        author: { name: 'ChillBeats', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=88&h=88&fit=crop&q=80' },
        thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=640&h=360&fit=crop&q=80',
      },
      {
        id: '9',
        title: 'How I Built a Side Project Into a Real Business at 22',
        views: 4500000,
        duration: '24:18',
        timestamp: '3 weeks ago',
        author: { name: 'Hustle Hub', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=88&h=88&fit=crop&q=80' },
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=360&fit=crop&q=80',
      },
      {
        id: '10',
        title: 'Japan Cherry Blossom Season | Cinematic Travel Vlog',
        views: 5800000,
        duration: '20:11',
        timestamp: '6 months ago',
        author: { name: 'Travel Tales', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=88&h=88&fit=crop&q=80', isVerified: true },
        thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=640&h=360&fit=crop&q=80',
      },
      {
        id: '11',
        title: 'The Science of Black Holes – What Happens Inside?',
        views: 15000000,
        duration: '19:45',
        timestamp: '8 months ago',
        author: { name: 'Space Lab', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=88&h=88&fit=crop&q=80', isVerified: true },
        thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=640&h=360&fit=crop&q=80',
      },
      {
        id: '12',
        title: 'Street Food Tour: Hidden Gems You Must Try',
        views: 2800000,
        duration: '16:55',
        timestamp: '2 days ago',
        author: { name: 'Foodie Explorer', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=88&h=88&fit=crop&q=80' },
        thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=640&h=360&fit=crop&q=80',
      },
    ] as VideoItem[],
    shorts: [
      {
        id: 's1',
        title: 'Cat vs Cucumber – Wait For It 😂',
        views: 42000000,
        thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=260&h=460&fit=crop&q=80',
      },
      {
        id: 's2',
        title: 'Insane Basketball Trick Shot',
        views: 18000000,
        thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=260&h=460&fit=crop&q=80',
      },
      {
        id: 's3',
        title: '5 Second Cooking Hack You Need',
        views: 31000000,
        thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=260&h=460&fit=crop&q=80',
      },
      {
        id: 's4',
        title: 'Best Sunset I Have Ever Seen 🌅',
        views: 12000000,
        thumbnail: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=260&h=460&fit=crop&q=80',
      },
      {
        id: 's5',
        title: 'Dog Tries to Catch Its Own Tail 🐕',
        views: 55000000,
        thumbnail: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=260&h=460&fit=crop&q=80',
      },
      {
        id: 's6',
        title: 'This Dance Move Broke the Internet',
        views: 25000000,
        thumbnail: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=260&h=460&fit=crop&q=80',
      },
    ] as ShortItem[],
  },
  watchData: {
    video: {
      id: '1',
      title: 'Building a Mass-Production Robot Factory in 10 Minutes',
      views: 2400000,
      timestamp: '3 days ago',
      likes: '124K',
      description: 'I built a fully functional robot factory using only basic components. In this video, I walk you through the entire process from start to finish.\n\nSubscribe for more builds!\n\n#engineering #robots #diy',
      author: {
        name: 'MegaBuilds',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=88&h=88&fit=crop&q=80',
        subscribers: '1.2M',
        isVerified: true,
      },
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    comments: [
      {
        id: 'c1',
        author: '@TechEnthusiast',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=88&h=88&fit=crop&q=80',
        timestamp: '2 days ago',
        text: 'The fact that you built this in 10 minutes is absolutely mind-blowing. The conveyor belt system is so smooth!',
        likes: '4.2K',
      },
      {
        id: 'c2',
        author: '@BuilderBob',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=88&h=88&fit=crop&q=80',
        timestamp: '1 day ago',
        text: 'Can we get a detailed tutorial on how you wired the sensors? That part went by a bit too fast.',
        likes: '892',
      },
      {
        id: 'c3',
        author: '@SarahCreates',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=88&h=88&fit=crop&q=80',
        timestamp: '5 hours ago',
        text: 'This deserves way more views. The production quality is insane.',
        likes: '156',
      }
    ],
  },
};

/**
 * Load site configuration from Supabase, falling back to hardcoded defaults.
 * Call this in page frontmatter to get dynamic config.
 */
export async function loadSiteConfig() {
  try {
    const { supabase } = await import('../lib/supabase');
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error || !data) return siteConfig;

    return {
      ...siteConfig,
      branding: data.branding && Object.keys(data.branding).length > 0
        ? { ...siteConfig.branding, ...data.branding }
        : siteConfig.branding,
      sidebar: data.sidebar && Array.isArray(data.sidebar) && data.sidebar.length > 0
        ? data.sidebar
        : siteConfig.sidebar,
      sidebarFooter: data.sidebar_footer && Array.isArray(data.sidebar_footer) && data.sidebar_footer.length > 0
        ? data.sidebar_footer
        : siteConfig.sidebarFooter,
      categories: data.categories && Array.isArray(data.categories) && data.categories.length > 0
        ? data.categories
        : siteConfig.categories,
      sectionHeadings: data.section_headings && Object.keys(data.section_headings).length > 0
        ? { ...siteConfig.sectionHeadings, ...data.section_headings }
        : siteConfig.sectionHeadings,
      emptyState: data.empty_state && Object.keys(data.empty_state).length > 0
        ? { ...siteConfig.emptyState, ...data.empty_state }
        : siteConfig.emptyState,
    };
  } catch {
    return siteConfig;
  }
}
