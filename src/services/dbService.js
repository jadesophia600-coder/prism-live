import { supabase } from "../lib/supabaseClient";
import { LIVE_STREAMS, CATEGORIES, CREATORS, PAST_VODS, CLIPS } from "../data/mockData";

export class DBService {
  // Fetch live streams from Supabase with fallback to local mock data
  static async getLiveStreamsAsync(filters = {}) {
    try {
      let query = supabase.from('streams').select('*, creators(*), categories(*)');
      if (filters.categorySlug) {
        query = query.eq('categories.slug', filters.categorySlug);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn("Supabase fetch fallback to mockData:", e);
    }
    return this.getLiveStreams(filters);
  }

  // Synchronous getter with mockData fallback
  static getLiveStreams(filters = {}) {
    let streams = [...LIVE_STREAMS];

    if (filters.categorySlug) {
      streams = streams.filter(s => s.category && s.category.slug === filters.categorySlug);
    }
    if (filters.subcategory) {
      streams = streams.filter(s => s.subcategory === filters.subcategory);
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      streams = streams.filter(s =>
        (s.title && s.title.toLowerCase().includes(q)) ||
        (s.creator && s.creator.displayName && s.creator.displayName.toLowerCase().includes(q)) ||
        (s.category && s.category.name && s.category.name.toLowerCase().includes(q)) ||
        (s.subcategory && s.subcategory.toLowerCase().includes(q)) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    if (filters.sortBy === "most_viewers") {
      streams.sort((a, b) => b.viewerCount - a.viewerCount);
    } else if (filters.sortBy === "recently_started") {
      streams.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
    }

    return streams;
  }

  static getStreamById(id) {
    if (!id) return LIVE_STREAMS[0];
    return LIVE_STREAMS.find(s => s.id === id) || LIVE_STREAMS[0];
  }

  static getCategories() {
    return CATEGORIES;
  }

  static getCategoryBySlug(slug) {
    if (!slug) return CATEGORIES[0];
    const target = slug.toString().toLowerCase();
    return CATEGORIES.find(c => c.slug && c.slug.toLowerCase() === target) || CATEGORIES[0];
  }

  static getCreatorByUsername(username) {
    if (!username) return CREATORS[0];
    const target = username.toString().toLowerCase();
    return CREATORS.find(c => c.username && c.username.toLowerCase() === target) || CREATORS[0];
  }

  static searchAll(query) {
    if (!query) return { streams: [], creators: [], categories: [], clips: [] };

    const q = query.toString().toLowerCase();
    const streams = LIVE_STREAMS.filter(s =>
      (s.title && s.title.toLowerCase().includes(q)) ||
      (s.category && s.category.name && s.category.name.toLowerCase().includes(q)) ||
      (s.subcategory && s.subcategory.toLowerCase().includes(q)) ||
      (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
    );
    const creators = CREATORS.filter(c =>
      (c.displayName && c.displayName.toLowerCase().includes(q)) ||
      (c.username && c.username.toLowerCase().includes(q)) ||
      (c.bio && c.bio.toLowerCase().includes(q))
    );
    const categories = CATEGORIES.filter(cat =>
      (cat.name && cat.name.toLowerCase().includes(q)) ||
      (cat.description && cat.description.toLowerCase().includes(q)) ||
      (cat.subcategories && cat.subcategories.some(sub => sub.toLowerCase().includes(q)))
    );
    const clips = CLIPS.filter(cl => cl.title && cl.title.toLowerCase().includes(q));

    return { streams, creators, categories, clips };
  }
}
