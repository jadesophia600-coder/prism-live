export const CATEGORIES = [
  {
    id: "cat-gaming",
    name: "Gaming",
    slug: "gaming",
    description: "Live gameplay, speedruns, esports tournaments, and interactive gaming communities.",
    cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
    icon: "Gamepad2",
    subcategories: ["Action Games", "Sports Games", "RPG", "FPS", "Strategy", "Simulation", "Esports"]
  },
  {
    id: "cat-entertainment",
    name: "Entertainment",
    slug: "entertainment",
    description: "Live comedy, reality shows, variety acts, celebrity broadcasts, and interactive challenges.",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    icon: "Tv",
    subcategories: ["Live Entertainment", "Comedy", "Reality", "Celebrity", "Variety", "Challenges", "Shows"]
  },
  {
    id: "cat-podcasts",
    name: "Podcasts",
    slug: "podcasts",
    description: "Live video podcasts, expert interviews, technology discussions, and personal growth talks.",
    cover: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80",
    icon: "Mic",
    subcategories: ["Interviews", "Business Podcasts", "Technology", "Relationships", "News & Discussion", "Personal Development", "Comedy Podcasts"]
  },
  {
    id: "cat-music",
    name: "Music",
    slug: "music",
    description: "Live DJ sets, synthwave concerts, freestyle sessions, music production, and live vocals.",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    icon: "Music",
    subcategories: ["Live Music", "DJ", "Concerts", "Freestyle", "Music Production", "Instrumental", "Singing"]
  },
  {
    id: "cat-sports",
    name: "Sports",
    slug: "sports",
    description: "Live sports analysis, watch parties, boxing, MMA scrims, football banter, and commentary.",
    cover: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
    icon: "Trophy",
    subcategories: ["Football", "Basketball", "Boxing", "MMA", "Tennis", "Athletics", "Sports Talk"]
  },
  {
    id: "cat-technology",
    name: "Technology",
    slug: "technology",
    description: "Software engineering, live coding, AI model building, gadgets, cybersecurity, and startups.",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    icon: "Code2",
    subcategories: ["Programming", "AI", "Software", "Gadgets", "Startups", "Cybersecurity", "Tech News"]
  },
  {
    id: "cat-education",
    name: "Education",
    slug: "education",
    description: "Interactive tutorials, math & science masterclasses, language learning, and career development.",
    cover: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
    icon: "BookOpen",
    subcategories: ["Tutorials", "Courses", "Mathematics", "Science", "Languages", "Business", "Career Development"]
  },
  {
    id: "cat-creative",
    name: "Creative",
    slug: "creative",
    description: "Digital art, 3D modeling, Blender jams, photography editing, design systems, and animation.",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    icon: "Palette",
    subcategories: ["Digital Art", "Drawing", "Photography", "Design", "Animation", "3D", "DIY"]
  },
  {
    id: "cat-lifestyle",
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Travel vlogs, live cooking shows, fitness workouts, fashion, beauty, and daily vlogs.",
    cover: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80",
    icon: "Smile",
    subcategories: ["Travel", "Fitness", "Food", "Cooking", "Fashion", "Beauty", "Personal Lifestyle"]
  },
  {
    id: "cat-talk",
    name: "Talk & Discussion",
    slug: "talk",
    description: "Live Q&A, current event debates, community roundtables, advice panels, and philosophy.",
    cover: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80",
    icon: "MessageSquare",
    subcategories: ["Interviews", "Debates", "Current Events", "Community Discussions", "Q&A", "Advice"]
  },
  {
    id: "cat-news",
    name: "News",
    slug: "news",
    description: "Breaking global news broadcasts, political analysis, market trends, and world events.",
    cover: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80",
    icon: "Newspaper",
    subcategories: ["Breaking News", "Politics", "Business News", "Technology News", "World News", "Local News"]
  },
  {
    id: "cat-irl",
    name: "IRL",
    slug: "irl",
    description: "In real life outdoor adventures, Tokyo nightwalks, event coverage, and city exploration.",
    cover: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    icon: "MapPin",
    subcategories: ["Travel", "Events", "City Tours", "Daily Life", "Outdoor", "Behind the Scenes"]
  }
];

export const CREATORS = [];

export const LIVE_STREAMS = [];

export const INITIAL_CHAT_MESSAGES = [];

export const PAST_VODS = [];

export const CLIPS = [];

export const CREATOR_ANALYTICS = {
  currentViewers: 0,
  peakViewers: 0,
  avgViewers: 0,
  followersGained: 0,
  subscribers: 0,
  totalWatchHours: 0,
  estimatedRevenueUsd: 0.00,
  revenueBreakdown: {
    subs: 0.00,
    tips: 0.00,
    adShare: 0.00
  },
  viewerHistory: []
};

export const ADMIN_STATS = {
  totalUsers: 1,
  activeCreators: 1,
  liveStreams: 0,
  totalViewersNow: 0,
  totalWatchHoursMonthly: 0,
  monthlyRevenueUsd: 0.00,
  serverStatus: "Optimal (100% Uptime)",
  activeIngests: "Global Ingest Active"
};
