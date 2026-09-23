import { LIVE_STREAMS, CATEGORIES, CREATORS, PAST_VODS, CLIPS } from "../data/mockData";

export class DBService {
  static getLiveStreams(filters = {}) {
    let streams = [...LIVE_STREAMS];

    if (filters.categorySlug) {
      streams = streams.filter(s => s.category.slug === filters.categorySlug);
    }
    if (filters.subcategory) {
      streams = streams.filter(s => s.subcategory === filters.subcategory);
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      streams = streams.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.creator.displayName.toLowerCase().includes(q) ||
        s.category.name.toLowerCase().includes(q) ||
        (s.subcategory && s.subcategory.toLowerCase().includes(q)) ||
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
    return CATEGORIES.find(c => c.slug.toLowerCase() === slug.toLowerCase()) || CATEGORIES[0];
  }

  static getCreatorByUsername(username) {
    return CREATORS.find(c => c.username.toLowerCase() === username.toLowerCase()) || CREATORS[0];
  }

  static searchAll(query) {
    if (!query) return { streams: [], creators: [], categories: [], clips: [] };

    const q = query.toLowerCase();
    const streams = LIVE_STREAMS.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.category.name.toLowerCase().includes(q) ||
      (s.subcategory && s.subcategory.toLowerCase().includes(q)) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
    const creators = CREATORS.filter(c =>
      c.displayName.toLowerCase().includes(q) ||
      c.username.toLowerCase().includes(q) ||
      c.bio.toLowerCase().includes(q)
    );
    const categories = CATEGORIES.filter(cat =>
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.subcategories.some(sub => sub.toLowerCase().includes(q))
    );
    const clips = CLIPS.filter(cl => cl.title.toLowerCase().includes(q));

    return { streams, creators, categories, clips };
  }
}
