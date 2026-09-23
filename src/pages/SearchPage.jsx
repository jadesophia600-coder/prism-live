import React, { useState } from 'react';
import { DBService } from '../services/dbService';
import { StreamCard } from '../components/cards/StreamCard';
import { CreatorCard } from '../components/cards/CreatorCard';
import { CategoryCard } from '../components/cards/CategoryCard';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { Search as SearchIcon, Radio, Users, Grid, Scissors } from 'lucide-react';

export function SearchPage({ onNavigate, onSelectStream, query: initialQuery }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [activeTab, setActiveTab] = useState('all');

  const results = DBService.searchAll(searchQuery);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <div className="flex flex-1">
        <Sidebar onNavigate={onNavigate} onSelectStream={onSelectStream} />

        <main className="flex-1 max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8 min-w-0">
          
          {/* Search Header */}
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Search Results</h1>
            <div className="relative">
              <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search streams, creators, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium shadow-xl"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
            {[
              { id: 'all', label: `All Results` },
              { id: 'streams', label: `Live Streams (${results.streams.length})` },
              { id: 'creators', label: `Creators (${results.creators.length})` },
              { id: 'categories', label: `Categories (${results.categories.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Results Display */}
          <div className="space-y-8">
            {(activeTab === 'all' || activeTab === 'streams') && results.streams.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-rose-500" /> Live Streams
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.streams.map(stream => (
                    <StreamCard key={stream.id} stream={stream} onSelectStream={onSelectStream} />
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'creators') && results.creators.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" /> Creators
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.creators.map(cr => (
                    <CreatorCard key={cr.id} creator={cr} onSelectCreator={(c) => onNavigate('channel', { username: c.username })} />
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'categories') && results.categories.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Grid className="w-4 h-4 text-cyan-400" /> Categories
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {results.categories.map(cat => (
                    <CategoryCard key={cat.id} category={cat} onSelectCategory={(c) => onNavigate('browse', { categorySlug: c.slug })} />
                  ))}
                </div>
              </div>
            )}
          </div>

        </main>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
