import { supabase } from "../lib/supabaseClient";

// Real Categories seed definition (12 standard platform categories)
export const REAL_CATEGORIES = [
  {
    id: "cat-1",
    name: "Gaming",
    slug: "gaming",
    description: "Esports tournaments, competitive AAA gaming, speedruns, and indie releases.",
    cover: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80",
    viewers: 0,
    channels: 0,
    subcategories: ["Esports", "FPS", "RPG", "Speedruns", "Battle Royale", "Indie"]
  },
  {
    id: "cat-2",
    name: "Entertainment",
    slug: "entertainment",
    description: "Pop culture discussions, reaction streams, comedy, and live variety shows.",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    viewers: 0,
    channels: 0,
    subcategories: ["Reactions", "Comedy", "Variety", "Movies & TV", "Improv"]
  },
  {
    id: "cat-3",
    name: "Podcasts",
    slug: "podcasts",
    description: "Deep dive interviews, live talk shows, panel discussions, and tech debates.",
    cover: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
    viewers: 0,
    channels: 0,
    subcategories: ["Tech Talk", "Interviews", "Business", "True Crime", "Philosophy"]
  },
  {
    id: "cat-4",
    name: "Music",
    slug: "music",
    description: "Live DJ sets, acoustic sessions, electronic music production, and song writing.",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    viewers: 0,
    channels: 0,
    subcategories: ["DJ Sets", "Live Instruments", "Beatmaking", "Vocal Performance", "Chillhop"]
  },
  {
    id: "cat-5",
    name: "Sports",
    slug: "sports",
    description: "Live match watch-alongs, sports analytics, commentary, and fitness workouts.",
    cover: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    viewers: 0,
    channels: 0,
    subcategories: ["Football", "Basketball", "Fitness", "MMA & Boxing", "Motorsport"]
  },
  {
    id: "cat-6",
    name: "Technology",
    slug: "technology",
    description: "Software engineering, AI development, gadget reviews, and cybersecurity.",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    viewers: 0,
    channels: 0,
    subcategories: ["Live Coding", "AI & Machine Learning", "Hardware", "Web Dev", "Cybersecurity"]
  },
  {
    id: "cat-7",
    name: "Education",
    slug: "education",
    description: "Interactive lectures, science experiments, language learning, and tutorials.",
    cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
    viewers: 0,
    channels: 0,
    subcategories: ["Science", "History", "Coding Tutorials", "Languages", "Mathematics"]
  },
  {
    id: "cat-8",
    name: "Creative",
    slug: "creative",
    description: "Digital art, 3D modeling, UI/UX design, game development, and animation.",
    cover: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
    viewers: 0,
    channels: 0,
    subcategories: ["Digital Illustration", "3D Blender", "Game Dev", "Photoshop", "Crafting"]
  },
  {
    id: "cat-9",
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Culinary cooking streams, travel vlogs, fashion, and everyday life.",
    cover: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
    viewers: 0,
    channels: 0,
    subcategories: ["Cooking & Culinary", "Travel", "Fashion", "Wellness", "Home Decor"]
  },
  {
    id: "cat-10",
    name: "Talk",
    slug: "talk",
    description: "Just chatting, audience Q&As, community hangouts, and open discussions.",
    cover: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    viewers: 0,
    channels: 0,
    subcategories: ["Just Chatting", "AMA Q&A", "Debates", "Storytelling"]
  },
  {
    id: "cat-11",
    name: "News",
    slug: "news",
    description: "Breaking news coverage, global politics, market trends, and journalism.",
    cover: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80",
    viewers: 0,
    channels: 0,
    subcategories: ["Breaking News", "Finance & Crypto", "Tech News", "World Events"]
  },
  {
    id: "cat-12",
    name: "IRL",
    slug: "irl",
    description: "Outdoor outdoor exploration, city walks, events, and real-life adventures.",
    cover: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80",
    viewers: 0,
    channels: 0,
    subcategories: ["City Walks", "Outdoor Adventures", "Events & Expos", "Travel IRL"]
  }
];

export class DBService {
  // Fetch live streams directly from Supabase
  static async getLiveStreamsAsync(filters = {}) {
    try {
      let query = supabase.from('streams').select('*, profiles(*), categories(*)');

      if (filters.categorySlug) {
        query = query.eq('category_slug', filters.categorySlug);
      }
      if (filters.isLive !== undefined) {
        query = query.eq('is_live', filters.isLive);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map(s => this.formatStreamObject(s));
      }
    } catch (e) {
      console.warn("Supabase fetch live streams error:", e);
    }
    return [];
  }

  // Format database record to standard UI stream object
  static formatStreamObject(s) {
    if (!s) return null;
    return {
      id: s.id || `stream-${Math.random()}`,
      title: s.title || "Untitled Stream",
      description: s.description || "",
      thumbnail: s.thumbnail || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      viewerCount: s.viewer_count || s.viewerCount || 0,
      isLive: s.is_live !== undefined ? s.is_live : true,
      startedAt: s.created_at || s.startedAt || new Date().toISOString(),
      language: s.language || "English",
      tags: s.tags || ["Live"],
      subcategory: s.subcategory || "",
      streamKey: s.stream_key || "",
      rtmpUrl: s.rtmp_url || "rtmp://ingest.prismlive.io/live",
      creator: {
        id: s.profiles?.id || s.creator_id || "creator-1",
        displayName: s.profiles?.display_name || s.creator?.displayName || "Broadcaster",
        username: s.profiles?.username || s.creator?.username || "creator",
        avatar: s.profiles?.avatar_url || s.creator?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
        bio: s.profiles?.bio || "Streamer on PRISM LIVE",
        verified: s.profiles?.is_verified || false,
        followersCount: s.profiles?.followers_count || 0
      },
      category: {
        id: s.categories?.id || "cat-1",
        name: s.categories?.name || s.category_name || "Gaming",
        slug: s.categories?.slug || s.category_slug || "gaming"
      }
    };
  }

  // Synchronous fallback returning empty list when no live stream exists in database
  static getLiveStreams(filters = {}) {
    return [];
  }

  static async getCategoriesAsync() {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn("Supabase fetch categories error:", e);
    }
    return REAL_CATEGORIES;
  }

  static getCategories() {
    return REAL_CATEGORIES;
  }

  static getCategoryBySlug(slug) {
    if (!slug) return REAL_CATEGORIES[0];
    const target = slug.toString().toLowerCase();
    return REAL_CATEGORIES.find(c => c.slug && c.slug.toLowerCase() === target) || REAL_CATEGORIES[0];
  }

  static async createStreamAsync(streamData) {
    try {
      const { data, error } = await supabase
        .from('streams')
        .insert([{
          title: streamData.title,
          description: streamData.description,
          category_slug: streamData.categorySlug || 'gaming',
          subcategory: streamData.subcategory || '',
          language: streamData.language || 'English',
          tags: streamData.tags || [],
          is_live: true,
          viewer_count: 1,
          stream_key: streamData.streamKey,
          thumbnail: streamData.thumbnail || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"
        }])
        .select();

      if (!error && data) {
        return data[0];
      }
    } catch (e) {
      console.warn("Error publishing stream to Supabase:", e);
    }
    return null;
  }

  static searchAll(query) {
    if (!query) return { streams: [], creators: [], categories: [], clips: [] };

    const q = query.toString().toLowerCase();
    const categories = REAL_CATEGORIES.filter(cat =>
      (cat.name && cat.name.toLowerCase().includes(q)) ||
      (cat.description && cat.description.toLowerCase().includes(q)) ||
      (cat.subcategories && cat.subcategories.some(sub => sub.toLowerCase().includes(q)))
    );

    return { streams: [], creators: [], categories, clips: [] };
  }
}
