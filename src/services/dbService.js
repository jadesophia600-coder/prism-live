import { supabase } from "../lib/supabaseClient";
import { CATEGORIES } from "../data/mockData";

const CREATORS_STORAGE_KEY = 'prismlive_registered_creators_v3';

const DEFAULT_CREATORS = [
  {
    id: 'cr-neonvortex',
    username: 'NeonVortex',
    displayName: 'Neon Vortex',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    bio: 'Pro Esports Gamer & Speedrunner. Streaming Apex, Valorant and Cyberpunk 2077 daily!',
    verified: true,
    followersCount: 14200,
    subscribersCount: 1250,
    partnerTier: 'partner',
    role: 'creator'
  },
  {
    id: 'cr-cyberalex',
    username: 'CyberAlex',
    displayName: 'Cyber Alex',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    bio: 'AI & Web Developer broadcasting live full-stack React coding sessions, Rust, and LLM hacking.',
    verified: true,
    followersCount: 28500,
    subscribersCount: 2890,
    partnerTier: 'partner',
    role: 'creator'
  },
  {
    id: 'cr-djaether',
    username: 'DJ_Aether',
    displayName: 'DJ Aether',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    bio: 'Live Electronic Synthwave & Deep House DJ sets. Interactive chat song requests!',
    verified: true,
    followersCount: 19800,
    subscribersCount: 1740,
    partnerTier: 'ambassador',
    role: 'creator'
  },
  {
    id: 'cr-pixelqueen',
    username: 'PixelQueen',
    displayName: 'Pixel Queen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    bio: 'Digital 3D Artist & Concept Art Illustrator. Live Blender & Photoshop streaming!',
    verified: false,
    followersCount: 8900,
    subscribersCount: 620,
    partnerTier: 'affiliate',
    role: 'creator'
  }
];

// Initialize creator registry from localStorage or default seed
let runtimeCreators = (() => {
  try {
    const saved = localStorage.getItem(CREATORS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not load stored creators:", e);
  }
  return DEFAULT_CREATORS;
})();

// Active user published live streams held in runtime memory if offline from Supabase
let runtimeActiveStreams = [];

export const REAL_CATEGORIES = CATEGORIES;

export class DBService {
  // Save or update a creator profile in runtime memory and localStorage
  static registerOrUpdateCreator(profile) {
    if (!profile || (!profile.username && !profile.displayName && !profile.email)) return null;

    const username = (profile.username || profile.email?.split('@')[0] || 'creator').replace(/^@/, '');
    const displayName = profile.displayName || username;
    const id = profile.id || `cr-${username.toLowerCase()}`;

    const creatorObj = {
      id: id,
      username: username,
      displayName: displayName,
      avatar: profile.avatar || profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      banner: profile.banner || profile.banner_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      bio: profile.bio || (profile.role === 'creator' ? "Broadcasting live on PRISM LIVE!" : "PRISM LIVE member & stream enthusiast!"),
      verified: profile.isVerified || profile.verified || false,
      followersCount: profile.followersCount || 150,
      subscribersCount: profile.subscribersCount || 12,
      partnerTier: profile.partnerTier || 'affiliate',
      role: profile.role || 'creator'
    };

    const existingIdx = runtimeCreators.findIndex(
      c => (c.id && c.id === creatorObj.id) || (c.username && c.username.toLowerCase() === creatorObj.username.toLowerCase())
    );

    if (existingIdx >= 0) {
      runtimeCreators[existingIdx] = { ...runtimeCreators[existingIdx], ...creatorObj };
    } else {
      runtimeCreators = [creatorObj, ...runtimeCreators];
    }

    try {
      localStorage.setItem(CREATORS_STORAGE_KEY, JSON.stringify(runtimeCreators));
    } catch (e) {
      console.warn("Could not persist creator registry:", e);
    }

    try {
      const supabasePayload = {
        display_name: displayName,
        username: username,
        avatar_url: creatorObj.avatar,
        bio: creatorObj.bio
      };
      if (profile.id && profile.id.length >= 30) {
        supabasePayload.id = profile.id;
      }
      supabase.from('profiles').upsert(supabasePayload)
        .then(() => {})
        .catch(e => console.warn("Supabase profile upsert warning:", e));
    } catch (e) {
      // Ignore offline errors
    }

    return creatorObj;
  }

  static getCreators(filters = {}) {
    let creators = [...runtimeCreators];
    if (filters.query) {
      const q = filters.query.toString().toLowerCase().trim().replace(/^@/, '');
      if (q && q !== 'creators' && q !== 'creator') {
        creators = creators.filter(c =>
          (c.username && c.username.toLowerCase().includes(q)) ||
          (c.displayName && c.displayName.toLowerCase().includes(q)) ||
          (c.bio && c.bio.toLowerCase().includes(q))
        );
      }
    }
    return creators;
  }

  static async getCreatorsAsync(filters = {}) {
    try {
      let query = supabase.from('profiles').select('*');
      if (filters.query) {
        const q = filters.query.toString().toLowerCase().trim().replace(/^@/, '');
        if (q && q !== 'creators' && q !== 'creator') {
          query = query.or(`username.ilike.%${q}%,display_name.ilike.%${q}%`);
        }
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        data.forEach(p => {
          this.registerOrUpdateCreator({
            id: p.id,
            username: p.username || p.display_name,
            displayName: p.display_name || p.username,
            avatar: p.avatar_url,
            bio: p.bio,
            role: 'creator'
          });
        });
      }
    } catch (e) {
      console.warn("Supabase fetch creators fallback:", e);
    }
    return this.getCreators(filters);
  }

  static async searchAllAsync(query) {
    await this.getCreatorsAsync({ query });
    await this.getLiveStreamsAsync({ query });
    return this.searchAll(query);
  }

  static getCreatorByUsername(username) {
    if (!username) return runtimeCreators[0] || DEFAULT_CREATORS[0];
    const target = username.toString().toLowerCase().replace(/^@/, '');
    const found = runtimeCreators.find(c => c.username && c.username.toLowerCase() === target);
    if (found) return found;

    return {
      id: `cr-${target}`,
      username: target,
      displayName: target.charAt(0).toUpperCase() + target.slice(1),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      bio: 'Creator on PRISM LIVE broadcasting live content.',
      verified: false,
      followersCount: 150,
      subscribersCount: 15,
      partnerTier: 'affiliate',
      role: 'creator'
    };
  }

  // Fetch live streams from Supabase
  static async getLiveStreamsAsync(filters = {}) {
    try {
      let query = supabase.from('streams').select('*, profiles(*), categories(*)');

      if (filters.categorySlug && filters.categorySlug !== 'all') {
        query = query.eq('category_slug', filters.categorySlug);
      }

      const { data, error } = await query;
      if (!error && data) {
        const formatted = data.map(s => this.formatStreamObject(s));
        return formatted;
      }
    } catch (e) {
      console.warn("Supabase fetch live streams:", e);
    }
    return this.getLiveStreams(filters);
  }

  // Format database record to standard UI stream object
  static formatStreamObject(s) {
    if (!s) return null;
    return {
      id: s.id || `stream-${Math.random()}`,
      title: s.title || "Live Broadcast",
      description: s.description || "",
      thumbnail: s.thumbnail || "",
      viewerCount: s.viewer_count || s.viewerCount || 1,
      isLive: s.is_live !== undefined ? s.is_live : true,
      startedAt: s.created_at || s.startedAt || new Date().toISOString(),
      language: s.language || "English",
      tags: s.tags || ["Live"],
      subcategory: s.subcategory || "",
      streamKey: s.stream_key || "",
      rtmpUrl: s.rtmp_url || "rtmp://live.prism.tv/live",
      creator: {
        id: s.profiles?.id || s.creator_id || "creator-1",
        displayName: s.profiles?.display_name || s.creator?.displayName || "Broadcaster",
        username: s.profiles?.username || s.creator?.username || "creator",
        avatar: s.profiles?.avatar_url || s.creator?.avatar || "",
        bio: s.profiles?.bio || "Creator on PRISM LIVE",
        verified: false,
        followersCount: 150
      },
      category: {
        id: s.categories?.id || "cat-1",
        name: s.categories?.name || s.category_name || "General",
        slug: s.categories?.slug || s.category_slug || "general"
      }
    };
  }

  // Synchronous stream getter returning active live streams
  static getLiveStreams(filters = {}) {
    let streams = [...runtimeActiveStreams];

    if (filters.categorySlug && filters.categorySlug !== 'all') {
      streams = streams.filter(s => s.category && s.category.slug === filters.categorySlug);
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      streams = streams.filter(s =>
        (s.title && s.title.toLowerCase().includes(q)) ||
        (s.creator && s.creator.displayName && s.creator.displayName.toLowerCase().includes(q)) ||
        (s.category && s.category.name && s.category.name.toLowerCase().includes(q))
      );
    }

    return streams;
  }

  static async getCategoriesAsync() {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn("Supabase fetch categories fallback:", e);
    }
    return CATEGORIES;
  }

  static getCategories() {
    return CATEGORIES;
  }

  static getCategoryBySlug(slug) {
    if (!slug) return CATEGORIES[0];
    const target = slug.toString().toLowerCase();
    return CATEGORIES.find(c => c.slug && c.slug.toLowerCase() === target) || CATEGORIES[0];
  }

  static async createStreamAsync(streamData) {
    const newStream = {
      id: `stream-${Date.now()}`,
      title: streamData.title || "Live Stream Broadcast",
      description: streamData.description || "",
      category_slug: streamData.categorySlug || 'gaming',
      category_name: CATEGORIES.find(c => c.slug === streamData.categorySlug)?.name || 'Gaming',
      subcategory: streamData.subcategory || '',
      language: streamData.language || 'English',
      tags: streamData.tags || ['Live'],
      is_live: true,
      viewer_count: 1,
      stream_key: streamData.streamKey || 'live_sk_prism',
      created_at: new Date().toISOString()
    };

    // Add to runtime memory
    const formatted = this.formatStreamObject(newStream);
    runtimeActiveStreams = [formatted, ...runtimeActiveStreams];

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
          stream_key: streamData.streamKey
        }])
        .select();

      if (!error && data) {
        return data[0];
      }
    } catch (e) {
      console.warn("Error publishing stream to Supabase:", e);
    }
    return newStream;
  }

  static searchAll(query) {
    if (!query) return { streams: runtimeActiveStreams, creators: runtimeCreators, categories: CATEGORIES, clips: [] };

    const q = query.toString().toLowerCase().trim().replace(/^@/, '');
    const isCreatorsKeyword = q === 'creators' || q === 'creator' || q === 'broadcaster' || q === 'broadcasters';

    const streams = runtimeActiveStreams.filter(s =>
      (s.title && s.title.toLowerCase().includes(q)) ||
      (s.category && s.category.name && s.category.name.toLowerCase().includes(q)) ||
      (s.creator && (s.creator.displayName?.toLowerCase().includes(q) || s.creator.username?.toLowerCase().includes(q)))
    );

    const creators = isCreatorsKeyword
      ? runtimeCreators
      : runtimeCreators.filter(c =>
          (c.username && c.username.toLowerCase().includes(q)) ||
          (c.displayName && c.displayName.toLowerCase().includes(q)) ||
          (c.bio && c.bio.toLowerCase().includes(q))
        );

    const categories = CATEGORIES.filter(cat =>
      (cat.name && cat.name.toLowerCase().includes(q)) ||
      (cat.slug && cat.slug.toLowerCase().includes(q)) ||
      (cat.description && cat.description.toLowerCase().includes(q))
    );

    return { streams, creators, categories, clips: [] };
  }
}

