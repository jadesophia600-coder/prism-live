import React, { useState } from 'react';
import { DBService } from '../services/dbService';
import { StreamCard } from '../components/cards/StreamCard';
import { CreatorCard } from '../components/cards/CreatorCard';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import {
  Grid, Radio, Eye, Users, Filter, Sparkles, Flame, Clock
} from 'lucide-react';

export function CategoryDetailPage({ onNavigate, onSelectStream, categorySlug }) {
  const category = DBService.getCategoryBySlug(categorySlug || 'podcasts');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [sortBy, setSortBy] = useState('most_viewers');

  let streams = DBService.getLiveStreams({ categorySlug: category.slug });

  if (selectedSubcategory !== 'All') {
    streams = streams.filter(s => s.subcategory === selectedSubcategory);
  }

  if (sortBy === 'most_viewers') {
    streams.sort((a, b) => b.viewerCount - a.viewerCount);
  } else if (sortBy === 'recently_started') {
    streams.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  }

  const creators = DBService.searchAll(category.name).creators;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <div className="flex flex-1">
        <Sidebar onNavigate={onNavigate} onSelectStream={onSelectStream} />

        <main className="flex-1 max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8 min-w-0">
          
          {/* Category Banner Header */}
          <div className="relative rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase">
                  <Grid className="w-4 h-4 text-cyan-400" /> Category Hub
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  {category.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {category.description}
                </p>
                <div className="flex items-center gap-6 text-xs text-slate-400 font-mono pt-2">
                  <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <Radio className="w-4 h-4 text-rose-500 animate-pulse" /> {category.channels} Live Channels
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-300 font-bold">
                    <Eye className="w-4 h-4 text-indigo-400" /> {(category.viewers / 1000).toFixed(1)}k Live Viewers
                  </span>
                </div>
              </div>

              <img src={category.cover} alt="" className="w-full md:w-64 aspect-video rounded-2xl object-cover shadow-xl border border-slate-800" />
            </div>
          </div>

          {/* Subcategories Filter Pills Bar */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Explore Subcategories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSubcategory('All')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedSubcategory === 'All'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                All {category.name}
              </button>
              {category.subcategories.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedSubcategory === sub
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Bar */}
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-400">Sort Streams:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="most_viewers">Most Viewers</option>
                <option value="recently_started">Recently Started</option>
              </select>
            </div>
            <span className="text-xs text-slate-400 font-mono font-bold">{streams.length} Streams Live</span>
          </div>

          {/* Live Streams Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" /> Live Streams in {category.name}
            </h2>

            {streams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {streams.map(stream => (
                  <StreamCard
                    key={stream.id}
                    stream={stream}
                    onSelectStream={onSelectStream}
                    onSelectCategory={(cat) => onNavigate('category', { categorySlug: cat.slug })}
                    onSelectCreator={(cr) => onNavigate('channel', { username: cr.username })}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 glass-panel rounded-3xl space-y-2">
                <p className="text-base font-bold text-white">No live streams found in subcategory "{selectedSubcategory}"</p>
                <p className="text-xs">Try selecting "All {category.name}" or explore other subcategories.</p>
              </div>
            )}
          </div>

          {/* Trending Creators in Category */}
          {creators.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" /> Top {category.name} Broadcasters
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {creators.map(cr => (
                  <CreatorCard key={cr.id} creator={cr} onSelectCreator={(c) => onNavigate('channel', { username: c.username })} />
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
