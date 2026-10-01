import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LIVE_STREAMS, CATEGORIES } from '../../data/mockData';
import {
  ChevronLeft, ChevronRight, Radio, Heart, Compass, Flame,
  Home, Grid, Layers, ChevronDown, Sparkles, Users, Scissors,
  Trophy, Video, User, Shield, Star
} from 'lucide-react';

export function Sidebar({ onNavigate, onSelectStream, activeStreamId, currentPage }) {
  const { user, openAuthModal, isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  // Filter streams by followed creators
  const followedCreatorIds = user?.followedCreatorIds || [];
  const followedStreams = LIVE_STREAMS.filter(s => s.creator && followedCreatorIds.includes(s.creator.id));
  const recommendedStreams = LIVE_STREAMS.filter(s => s.creator && !followedCreatorIds.includes(s.creator.id)).slice(0, 5);

  const handleProtectedNavigate = (page, params = {}) => {
    if (!isAuthenticated && (page === 'user-dashboard' || page === 'dashboard' || page === 'profile')) {
      openAuthModal();
      return;
    }
    onNavigate(page, params);
  };

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-800/80 bg-slate-950/90 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } shrink-0 min-h-[calc(100vh-4rem)] sticky top-16 select-none`}
    >
      {/* Header & Toggle */}
      <div className="p-3 flex items-center justify-between border-b border-slate-900">
        {!collapsed && (
          <span className="text-xs font-black text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            Navigation Hub
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors mx-auto"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        
        {/* Main Navigation Links */}
        <div className="space-y-1">
          {/* Home */}
          <button
            onClick={() => onNavigate('discover')}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-extrabold transition-all text-left ${
              currentPage === 'discover' || currentPage === 'landing'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Home"
          >
            <Home className={`w-4 h-4 shrink-0 ${currentPage === 'discover' || currentPage === 'landing' ? 'text-indigo-400' : 'text-slate-400'}`} />
            {!collapsed && <span>Home</span>}
          </button>

          {/* Trending Live Streams */}
          <button
            onClick={() => onNavigate('browse')}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-extrabold transition-all text-left ${
              currentPage === 'browse'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Trending Streams"
          >
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            {!collapsed && <span>Trending Streams</span>}
          </button>

          {/* Following Channels */}
          <button
            onClick={() => onNavigate('following')}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-extrabold transition-all text-left ${
              currentPage === 'following'
                ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-lg'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Following"
          >
            <Heart className="w-4 h-4 text-rose-500 shrink-0 fill-rose-500/20" />
            {!collapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>Following</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-full font-mono font-bold">
                  {followedStreams.length}
                </span>
              </div>
            )}
          </button>

          {/* Browse Categories */}
          <button
            onClick={() => onNavigate('browse')}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-extrabold transition-all text-left ${
              currentPage === 'browse'
                ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-lg'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Browse Categories"
          >
            <Grid className="w-4 h-4 text-cyan-400 shrink-0" />
            {!collapsed && <span>Browse Categories</span>}
          </button>

          {/* Top Broadcasters */}
          <button
            onClick={() => onNavigate('search', { q: 'creators' })}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-extrabold transition-all text-left ${
              currentPage === 'search'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-lg'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Top Broadcasters"
          >
            <Trophy className="w-4 h-4 text-purple-400 shrink-0" />
            {!collapsed && <span>Top Broadcasters</span>}
          </button>

          {/* Clips & Highlights */}
          <button
            onClick={() => onNavigate('browse')}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-extrabold transition-all text-left text-slate-300 hover:bg-slate-900 hover:text-white`}
            title="Clips & Highlights"
          >
            <Scissors className="w-4 h-4 text-pink-400 shrink-0" />
            {!collapsed && <span>Clips & Highlights</span>}
          </button>
        </div>

        {/* User Account & Creator Studio Quick Shortcuts */}
        <div className="pt-2 border-t border-slate-900 space-y-1">
          {!collapsed && (
            <div className="px-2 mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Account & Studio
            </div>
          )}

          <button
            onClick={() => handleProtectedNavigate('user-dashboard')}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              currentPage === 'user-dashboard' || currentPage === 'profile'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="User Dashboard"
          >
            <User className="w-4 h-4 text-indigo-400 shrink-0" />
            {!collapsed && <span>User Dashboard</span>}
          </button>

          <button
            onClick={() => handleProtectedNavigate('dashboard', { autoStartCamera: true })}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              currentPage === 'dashboard'
                ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-lg'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Creator Broadcast Studio"
          >
            <Video className="w-4 h-4 text-rose-400 shrink-0" />
            {!collapsed && <span>Creator Studio (Go Live)</span>}
          </button>
        </div>

        {/* Collapsible Categories Tree */}
        {!collapsed && (
          <div className="pt-2 border-t border-slate-900">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-white"
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Categories ({CATEGORIES.length})
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
            </button>

            {categoriesOpen && (
              <div className="space-y-0.5 mt-1.5 max-h-48 overflow-y-auto pr-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => onNavigate('category', { categorySlug: cat.slug })}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 hover:bg-slate-900 hover:text-cyan-300 transition-colors text-left"
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">{(cat.viewers / 1000).toFixed(0)}k</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Followed Channels */}
        <div>
          {!collapsed && (
            <div className="px-2 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between pt-2 border-t border-slate-900">
              <span>Followed Channels</span>
            </div>
          )}

          <div className="space-y-1">
            {followedStreams.length > 0 ? (
              followedStreams.map(stream => {
                const isActive = activeStreamId === stream.id;
                return (
                  <button
                    key={stream.id}
                    onClick={() => onSelectStream(stream)}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 border border-indigo-500/40 text-white shadow-lg'
                        : 'hover:bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                    title={stream.title}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={stream.creator.avatar}
                        alt={stream.creator.displayName}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
                    </div>

                    {!collapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">{stream.creator.displayName}</span>
                          <span className="text-[10px] font-mono font-bold text-rose-400">
                            {(stream.viewerCount / 1000).toFixed(1)}k
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{stream.category.name}</p>
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              !collapsed && (
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-center space-y-1">
                  <p className="text-[11px] font-medium text-slate-400">No followed creators yet</p>
                  <button
                    onClick={() => onNavigate('browse')}
                    className="text-[10px] font-bold text-cyan-400 hover:underline"
                  >
                    Explore Broadcasters
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* Recommended Live Streams */}
        <div>
          {!collapsed && (
            <div className="px-2 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between pt-2 border-t border-slate-900">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Recommended
              </span>
            </div>
          )}

          <div className="space-y-1">
            {recommendedStreams.map(stream => (
              <button
                key={stream.id}
                onClick={() => onSelectStream(stream)}
                className="w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-slate-900 text-slate-300 hover:text-white transition-all"
                title={stream.title}
              >
                <div className="relative shrink-0">
                  <img
                    src={stream.creator.avatar}
                    alt={stream.creator.displayName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-800"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
                </div>

                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white truncate">{stream.creator.displayName}</span>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">
                        {(stream.viewerCount / 1000).toFixed(1)}k
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{stream.category.name}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}
