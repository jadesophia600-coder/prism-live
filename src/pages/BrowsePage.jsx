import React, { useState } from 'react';
import { CATEGORIES, LIVE_STREAMS, CREATORS, PAST_VODS, CLIPS } from '../data/mockData';
import { CategoryCard } from '../components/cards/CategoryCard';
import { StreamCard } from '../components/cards/StreamCard';
import { CreatorCard } from '../components/cards/CreatorCard';
import { ClipCard } from '../components/cards/ClipCard';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { Grid, Filter, Search, Radio, Compass, Users, Video, Scissors } from 'lucide-react';

export function BrowsePage({ onNavigate, onSelectStream, categorySlug }) {
  const [activeTab, setActiveTab] = useState(categorySlug ? 'streams' : 'all'); // 'all' | 'streams' | 'categories' | 'creators' | 'videos' | 'clips'
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(categorySlug || 'all');
  const [sortBy, setSortBy] = useState('most_viewers');
  const [searchQuery, setSearchQuery] = useState('');

  let filteredStreams = LIVE_STREAMS;
  if (selectedCategorySlug !== 'all') {
    filteredStreams = filteredStreams.filter(s => s.category.slug === selectedCategorySlug);
  }
  if (searchQuery) {
    filteredStreams = filteredStreams.filter(s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (sortBy === 'most_viewers') {
    filteredStreams.sort((a, b) => b.viewerCount - a.viewerCount);
  } else if (sortBy === 'recently_started') {
    filteredStreams.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <div className="flex flex-1">
        <Sidebar onNavigate={onNavigate} onSelectStream={onSelectStream} currentPage="browse" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1920px] mx-auto space-y-8 min-w-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Grid className="w-8 h-8 text-cyan-400" />
                Browse Directory
              </h1>
              <p className="text-xs text-slate-400 mt-1">Discover live broadcasts across Podcasts, Music, Tech, Gaming, IRL & Sports</p>
            </div>

            {/* View Mode Tabs (All, Live, Categories, Creators, Videos, Clips) */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs overflow-x-auto">
              {[
                { id: 'all', label: 'All Content' },
                { id: 'streams', label: `Live (${filteredStreams.length})` },
                { id: 'categories', label: `Categories (${CATEGORIES.length})` },
                { id: 'creators', label: `Creators (${CREATORS.length})` },
                { id: 'videos', label: `Videos (${PAST_VODS.length})` },
                { id: 'clips', label: `Clips (${CLIPS.length})` }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                    activeTab === t.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-400">Category:</span>
                <select
                  value={selectedCategorySlug}
                  onChange={(e) => setSelectedCategorySlug(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="most_viewers">Most Viewers</option>
                  <option value="recently_started">Recently Started</option>
                </select>
              </div>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search browse directory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Content Rendering based on Tab */}
          {(activeTab === 'all' || activeTab === 'streams') && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-rose-500 animate-pulse" /> Live Broadcasts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStreams.map(stream => (
                  <StreamCard
                    key={stream.id}
                    stream={stream}
                    onSelectStream={onSelectStream}
                    onSelectCategory={(cat) => onNavigate('category', { categorySlug: cat.slug })}
                    onSelectCreator={(cr) => onNavigate('channel', { username: cr.username })}
                  />
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'categories') && (
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Grid className="w-5 h-5 text-cyan-400" /> Categories
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {CATEGORIES.map(cat => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    onSelectCategory={(c) => onNavigate('category', { categorySlug: c.slug })}
                  />
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'creators') && (
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" /> Popular Broadcasters
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {CREATORS.map(cr => (
                  <CreatorCard key={cr.id} creator={cr} onSelectCreator={(c) => onNavigate('channel', { username: c.username })} />
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'clips') && (
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-pink-400" /> Trending Clips
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {CLIPS.map(clip => (
                  <ClipCard key={clip.id} clip={clip} />
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
