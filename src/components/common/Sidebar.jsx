import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LIVE_STREAMS, CATEGORIES } from '../../data/mockData';
import {
  ChevronLeft, ChevronRight, Radio, Heart, Compass, Flame,
  Home, Grid, Layers, ChevronDown, Sparkles
} from 'lucide-react';

export function Sidebar({ onNavigate, onSelectStream, activeStreamId, currentPage }) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  // Filter streams by followed creators
  const followedStreams = LIVE_STREAMS.filter(s => user.followedCreatorIds.includes(s.creator.id));
  const recommendedStreams = LIVE_STREAMS.filter(s => !user.followedCreatorIds.includes(s.creator.id));

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-800/80 bg-slate-950/90 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } shrink-0 min-h-[calc(100vh-4rem)] sticky top-16 select-none`}
    >
      {/* Header & Toggle */}
      <div className="p-3 flex items-center justify-between border-b border-slate-900">
        {!collapsed && (
          <span className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-indigo-400" />
            Navigation Hub
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors mx-auto"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-5">
        
        {/* Main Navigation Links (Home, Following, Browse) */}
        <div className="space-y-1">
          <button
            onClick={() => onNavigate('discover')}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-extrabold transition-all text-left ${
              currentPage === 'discover' || currentPage === 'landing'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Home"
          >
            <Home className={`w-4 h-4 shrink-0 ${currentPage === 'discover' || currentPage === 'landing' ? 'text-indigo-400' : 'text-slate-400'}`} />
            {!collapsed && <span>Home</span>}
          </button>

          <button
            onClick={() => onNavigate('following')}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-extrabold transition-all text-left ${
              currentPage === 'following'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Following"
          >
            <Heart className="w-4 h-4 text-rose-500 shrink-0 fill-rose-500/20" />
            {!collapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>Following</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-full font-mono">
                  {followedStreams.length}
                </span>
              </div>
            )}
          </button>

          <button
            onClick={() => onNavigate('browse')}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-extrabold transition-all text-left ${
              currentPage === 'browse'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Browse"
          >
            <Grid className="w-4 h-4 text-cyan-400 shrink-0" />
            {!collapsed && <span>Browse Categories</span>}
          </button>
        </div>

        {/* Collapsible Categories Tree */}
        {!collapsed && (
          <div className="pt-2 border-t border-slate-900">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-white"
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
            <div className="px-2 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between pt-2 border-t border-slate-900">
              <span>Followed Channels</span>
            </div>
          )}

          <div className="space-y-1">
            {followedStreams.map(stream => {
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
            })}
          </div>
        </div>

      </div>
    </aside>
  );
}
