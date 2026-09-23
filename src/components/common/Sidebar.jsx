import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LIVE_STREAMS, CATEGORIES } from '../../data/mockData';
import { ChevronLeft, ChevronRight, Radio, Heart, Compass, Flame, ShieldAlert } from 'lucide-react';

export function Sidebar({ onNavigate, onSelectStream, activeStreamId }) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

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
            Live Ecosystem
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

      <div className="flex-1 overflow-y-auto p-2 space-y-6">
        
        {/* Followed Channels */}
        <div>
          {!collapsed && (
            <div className="flex items-center justify-between px-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                Followed Channels
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-full font-mono">
                {followedStreams.length}
              </span>
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
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
                  </div>

                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{stream.creator.displayName}</span>
                        <span className="text-[10px] font-mono font-bold text-rose-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          {(stream.viewerCount / 1000).toFixed(1)}k
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{stream.category.name}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recommended Channels */}
        <div>
          {!collapsed && (
            <div className="px-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Recommended Live
            </div>
          )}

          <div className="space-y-1">
            {recommendedStreams.map(stream => {
              const isActive = activeStreamId === stream.id;
              return (
                <button
                  key={stream.id}
                  onClick={() => onSelectStream(stream)}
                  className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                      : 'hover:bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                  title={stream.title}
                >
                  <div className="relative shrink-0">
                    <img
                      src={stream.creator.avatar}
                      alt={stream.creator.displayName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950" />
                  </div>

                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 truncate">{stream.creator.displayName}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {(stream.viewerCount / 1000).toFixed(1)}k
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{stream.category.name}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Top Categories */}
        {!collapsed && (
          <div className="pt-4 border-t border-slate-900">
            <div className="px-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Top Categories
            </div>
            <div className="space-y-1">
              {CATEGORIES.slice(0, 5).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => onNavigate('browse', { categorySlug: cat.slug })}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-900 hover:text-cyan-300 transition-colors"
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{(cat.viewers / 1000).toFixed(0)}k</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
