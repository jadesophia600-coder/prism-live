import React, { useState } from 'react';
import { CATEGORIES, LIVE_STREAMS } from '../data/mockData';
import { CategoryCard } from '../components/cards/CategoryCard';
import { StreamCard } from '../components/cards/StreamCard';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { Grid, Filter, ArrowUpDown, Search, Radio, Compass } from 'lucide-react';

export function BrowsePage({ onNavigate, onSelectStream, categorySlug }) {
  const [activeTab, setActiveTab] = useState(categorySlug ? 'streams' : 'categories');
  const [sortBy, setSortBy] = useState('most_viewers');
  const [filterTag, setFilterTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCategory = categorySlug ? CATEGORIES.find(c => c.slug === categorySlug) : null;

  let filteredStreams = LIVE_STREAMS;
  if (categorySlug) {
    filteredStreams = filteredStreams.filter(s => s.category.slug === categorySlug);
  }
  if (filterTag !== 'All') {
    filteredStreams = filteredStreams.filter(s => s.tags.includes(filterTag));
  }
  if (searchQuery) {
    filteredStreams = filteredStreams.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  if (sortBy === 'most_viewers') {
    filteredStreams.sort((a, b) => b.viewerCount - a.viewerCount);
  } else if (sortBy === 'recently_started') {
    filteredStreams.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <div className="flex flex-1">
        <Sidebar onNavigate={onNavigate} onSelectStream={onSelectStream} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1920px] mx-auto space-y-8 min-w-0">
          
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Grid className="w-8 h-8 text-cyan-400" />
                {selectedCategory ? selectedCategory.name : 'Browse Categories & Streams'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">Discover live broadcasts across all categories and gaming genres</p>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  activeTab === 'categories' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Categories ({CATEGORIES.length})
              </button>
              <button
                onClick={() => setActiveTab('streams')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  activeTab === 'streams' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Live Streams ({filteredStreams.length})
              </button>
            </div>
          </div>

          {/* Filter & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="most_viewers">Most Viewers</option>
                <option value="recently_started">Recently Started</option>
                <option value="trending">Trending</option>
              </select>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter streams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Content Views */}
          {activeTab === 'categories' && !selectedCategory ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {CATEGORIES.map(cat => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onSelectCategory={(c) => onNavigate('browse', { categorySlug: c.slug })}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStreams.map(stream => (
                <StreamCard
                  key={stream.id}
                  stream={stream}
                  onSelectStream={onSelectStream}
                  onSelectCategory={(cat) => onNavigate('browse', { categorySlug: cat.slug })}
                  onSelectCreator={(cr) => onNavigate('channel', { username: cr.username })}
                />
              ))}
            </div>
          )}

        </main>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
