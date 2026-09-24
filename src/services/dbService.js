import { supabase } from "../lib/supabaseClient";
import { CATEGORIES } from "../data/mockData";

// Active user published live streams held in runtime memory if offline from Supabase
let runtimeActiveStreams = [];

export const REAL_CATEGORIES = CATEGORIES;

export class DBService {
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
        followersCount: 0
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
    if (!query) return { streams: [], creators: [], categories: [], clips: [] };

    const q = query.toString().toLowerCase();
    const streams = runtimeActiveStreams.filter(s =>
      (s.title && s.title.toLowerCase().includes(q)) ||
      (s.category && s.category.name && s.category.name.toLowerCase().includes(q))
    );
    const categories = CATEGORIES.filter(cat =>
      (cat.name && cat.name.toLowerCase().includes(q))
    );

    return { streams, creators: [], categories, clips: [] };
  }
}
