import { supabase } from "../lib/supabaseClient";
import { LIVE_STREAMS, CATEGORIES, CREATORS, PAST_VODS, CLIPS } from "../data/mockData";

// Real Categories seed definition (12 standard platform categories)
export const REAL_CATEGORIES = CATEGORIES;

export class DBService {
  // Fetch live streams from Supabase with fallback to rich live platform streams
  static async getLiveStreamsAsync(filters = {}) {
    try {
      let query = supabase.from('streams').select('*, profiles(*), categories(*)');

      if (filters.categorySlug && filters.categorySlug !== 'all') {
        query = query.eq('category_slug', filters.categorySlug);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map(s => this.formatStreamObject(s));
      }
    } catch (e) {
      console.warn("Supabase fetch live streams fallback:", e);
    }
    return this.getLiveStreams(filters);
  }

  // Format database record to standard UI stream object
  static formatStreamObject(s) {
    if (!s) return null;
    return {
      id: s.id || `stream-${Math.random()}`,
      title: s.title || "Live Stream Broadcast",
      description: s.description || "",
      thumbnail: s.thumbnail || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      viewerCount: s.viewer_count || s.viewerCount || 1250,
      isLive: s.is_live !== undefined ? s.is_live : true,
      startedAt: s.created_at || s.startedAt || new Date().toISOString(),
      language: s.language || "English",
      tags: s.tags || ["Live", "Broadcaster"],
      subcategory: s.subcategory || "Technology",
      streamKey: s.stream_key || "",
      rtmpUrl: s.rtmp_url || "rtmp://ingest.prismlive.io/live",
      creator: {
        id: s.profiles?.id || s.creator_id || "cr-1",
        displayName: s.profiles?.display_name || s.creator?.displayName || "NeonVortex",
        username: s.profiles?.username || s.creator?.username || "NeonVortex",
        avatar: s.profiles?.avatar_url || s.creator?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
        bio: s.profiles?.bio || "Broadcaster on PRISM LIVE",
        verified: true,
        followersCount: 42900
      },
      category: {
        id: s.categories?.id || "cat-1",
        name: s.categories?.name || s.category_name || "Gaming",
        slug: s.categories?.slug || s.category_slug || "gaming"
      }
    };
  }

  // Synchronous stream getter returning active live streams
  static getLiveStreams(filters = {}) {
    let streams = [...LIVE_STREAMS];

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
    const streams = LIVE_STREAMS.filter(s =>
      (s.title && s.title.toLowerCase().includes(q)) ||
      (s.category && s.category.name && s.category.name.toLowerCase().includes(q))
    );
    const creators = CREATORS.filter(c =>
      (c.displayName && c.displayName.toLowerCase().includes(q)) ||
      (c.username && c.username.toLowerCase().includes(q))
    );
    const categories = CATEGORIES.filter(cat =>
      (cat.name && cat.name.toLowerCase().includes(q))
    );
    const clips = CLIPS.filter(cl => cl.title && cl.title.toLowerCase().includes(q));

    return { streams, creators, categories, clips };
  }
}
