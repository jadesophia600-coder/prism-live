import React, { useState } from 'react';
import { LIVE_STREAMS, CATEGORIES, CREATORS } from '../data/mockData';
import { StreamCard } from '../components/cards/StreamCard';
import { CategoryCard } from '../components/cards/CategoryCard';
import { CreatorCard } from '../components/cards/CreatorCard';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { Compass, Flame, Radio, Sparkles, Trophy, Users, Eye } from 'lucide-react';

export function DiscoverPage({ onNavigate, onSelectStream }) {
  const [activeHeroStream, setActiveHeroStream] = useState(LIVE_STREAMS[0]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <div className="flex flex-1">
        <Sidebar onNavigate={onNavigate} onSelectStream={onSelectStream} activeStreamId={activeHeroStream.id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1920px] mx-auto space-y-10 min-w-0">
          
          {/* Hero Live Carousel Banner */}
          <div className="relative rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 p-4 lg:p-6 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-8 relative aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-xl group">
                <img src={activeHeroStream.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-600/90 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md shadow-lg badge-live-pulse">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  LIVE NOW
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-white line-clamp-1">{activeHeroStream.title}</h2>
                    <p className="text-xs text-indigo-300 font-semibold">{activeHeroStream.creator.displayName}</p>
                  </div>
                  <button
                    onClick={() => onSelectStream(activeHeroStream)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
                  >
                    Watch Broadcast
                  </button>
                </div>
              </div>

              {/* Live Stream Selector List */}
              <div className="lg:col-span-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" /> Trending Streamers
                </h3>
                <div className="space-y-2">
                  {LIVE_STREAMS.map(stream => (
                    <button
                      key={stream.id}
                      onClick={() => setActiveHeroStream(stream)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                        activeHeroStream.id === stream.id
                          ? 'bg-indigo-600/20 border border-indigo-500/40 text-white shadow-lg'
                          : 'bg-slate-950/60 border border-slate-800/80 hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <img src={stream.creator.avatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate text-white">{stream.creator.displayName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{stream.category.name}</p>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">
                        {(stream.viewerCount / 1000).toFixed(1)}k
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Recommended Streams Grid */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Recommended Live Streams
              </h2>
              <span className="text-xs text-slate-400">Based on your watch history</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {LIVE_STREAMS.map(stream => (
                <StreamCard
                  key={stream.id}
                  stream={stream}
                  onSelectStream={onSelectStream}
                  onSelectCategory={(cat) => onNavigate('browse', { categorySlug: cat.slug })}
                  onSelectCreator={(cr) => onNavigate('channel', { username: cr.username })}
                />
              ))}
            </div>
          </section>

          {/* Top Categories Slider */}
          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              Categories You Might Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {CATEGORIES.slice(0, 4).map(cat => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onSelectCategory={(c) => onNavigate('browse', { categorySlug: c.slug })}
                />
              ))}
            </div>
          </section>

          {/* Rising Creators */}
          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Rising Creators To Follow
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CREATORS.slice(0, 3).map(cr => (
                <CreatorCard
                  key={cr.id}
                  creator={cr}
                  onSelectCreator={(c) => onNavigate('channel', { username: c.username })}
                />
              ))}
            </div>
          </section>

        </main>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
