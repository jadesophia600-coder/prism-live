import { LIVE_STREAMS, CATEGORIES, CREATORS, PAST_VODS, CLIPS } from "../data/mockData";

// Database Service abstraction representing PostgreSQL / Supabase operations
export class DBService {
  static getLiveStreams(filters = {}) {
    let streams = [...LIVE_STREAMS];

    if (filters.categorySlug) {
      streams = streams.filter(s => s.category.slug === filters.categorySlug);
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      streams = streams.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.creator.displayName.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
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
    return LIVE_STREAMS.find(s => s.id === id) || LIVE_STREAMS[0];
  }

  static getCategories() {
    return CATEGORIES;
  }

  static getCategoryBySlug(slug) {
    return CATEGORIES.find(c => c.slug === slug) || CATEGORIES[0];
  }

  static getCreatorByUsername(username) {
    return CREATORS.find(c => c.username.toLowerCase() === username.toLowerCase()) || CREATORS[0];
  }

  static searchAll(query) {
    if (!query) return { streams: [], creators: [], categories: [], clips: [] };

    const q = query.toLowerCase();
    const streams = LIVE_STREAMS.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
    const creators = CREATORS.filter(c =>
      c.displayName.toLowerCase().includes(q) ||
      c.username.toLowerCase().includes(q)
    );
    const categories = CATEGORIES.filter(cat =>
      cat.name.toLowerCase().includes(q) ||
      cat.tags.some(t => t.toLowerCase().includes(q))
    );
    const clips = CLIPS.filter(cl => cl.title.toLowerCase().includes(q));

    return { streams, creators, categories, clips };
  }
}
