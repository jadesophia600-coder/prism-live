import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DBService, REAL_CATEGORIES } from '../services/dbService';
import { StreamCard } from '../components/cards/StreamCard';
import { CategoryCard } from '../components/cards/CategoryCard';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import {
  Compass, Flame, Radio, Sparkles, Trophy, Users, Eye,
  Clock, Play, Heart, Star, Layers, ArrowRight, Video
} from 'lucide-react';

export function DiscoverPage({ onNavigate, onSelectStream }) {
  const { user } = useAuth();
  const [liveStreams, setLiveStreams] = useState([]);
  const [categories, setCategories] = useState(REAL_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const streamsData = await DBService.getLiveStreamsAsync();
      const catsData = await DBService.getCategoriesAsync();
      setLiveStreams(streamsData);
      setCategories(catsData && catsData.length > 0 ? catsData : REAL_CATEGORIES);
      setLoading(false);
    }
    loadData();
  }, []);

  const featuredHeroStream = liveStreams[0] || null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="flex flex-1">
        <Sidebar onNavigate={onNavigate} onSelectStream={onSelectStream} activeStreamId={featuredHeroStream?.id} currentPage="discover" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1920px] mx-auto space-y-10 min-w-0">
          
          {/* Hero Featured Live Banner or Real Empty State */}
          {featuredHeroStream ? (
            <div className="relative rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 p-4 lg:p-6 shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                <div className="lg:col-span-8 relative aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-xl group">
                  <img src={featuredHeroStream.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-600/90 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md shadow-lg badge-live-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    LIVE NOW
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold text-white line-clamp-1">{featuredHeroStream.title}</h2>
                      <p className="text-xs text-indigo-300 font-semibold">{featuredHeroStream.creator?.displayName} • {featuredHeroStream.category?.name}</p>
                    </div>
                    <button
                      onClick={() => onSelectStream(featuredHeroStream)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white" /> Watch Broadcast
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500" /> Live Streams
                  </h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {liveStreams.map(stream => (
                      <button
                        key={stream.id}
                        onClick={() => onSelectStream(stream)}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl text-left bg-slate-950/60 border border-slate-800/80 hover:bg-slate-900 text-slate-300 transition-all"
                      >
                        <img src={stream.creator?.avatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate text-white">{stream.creator?.displayName}</p>
                          <p className="text-[11px] text-slate-400 truncate">{stream.title}</p>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">
                          {stream.viewerCount || 1} live
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="relative rounded-3xl glass-panel bg-slate-900/90 border border-indigo-500/30 p-8 lg:p-12 text-center space-y-6 overflow-hidden shadow-2xl">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/30">
                <Radio className="w-10 h-10 animate-pulse" />
              </div>
              
              <div className="max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">No Live Broadcasts Active Right Now</h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  PRISM LIVE is live and waiting for its first broadcaster! Go live directly from your OBS Studio or Creator Control Center.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => onNavigate(user?.role === 'creator' ? 'dashboard' : 'profile')}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-400 text-white font-black text-xs shadow-xl shadow-indigo-600/40 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Video className="w-4 h-4" /> Start Broadcaster Live Stream
                </button>
                <button
                  onClick={() => onNavigate('browse')}
                  className="px-8 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-extrabold text-xs transition-colors"
                >
                  Browse Content Categories
                </button>
              </div>
            </div>
          )}

          {/* Active Live Streams Grid */}
          {liveStreams.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
                  Live Channels Broadcasting Now ({liveStreams.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {liveStreams.map(stream => (
                  <StreamCard
                    key={stream.id}
                    stream={stream}
                    onSelectStream={onSelectStream}
                    onSelectCategory={(cat) => onNavigate('category', { categorySlug: cat.slug })}
                    onSelectCreator={(cr) => onNavigate('channel', { username: cr.username })}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Real Categories Grid */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                Explore Content Categories ({categories.length})
              </h2>
              <button
                onClick={() => onNavigate('browse')}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View All Categories →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.slice(0, 8).map(cat => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onSelectCategory={(c) => onNavigate('category', { categorySlug: c.slug })}
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
