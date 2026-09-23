import React from 'react';
import { Radio, CheckCircle, Eye, Globe } from 'lucide-react';

export function StreamCard({ stream, onSelectStream, onSelectCategory, onSelectCreator }) {
  if (!stream) return null;

  const creatorName = stream.creator?.displayName || "Unknown Broadcaster";
  const categoryName = stream.category?.name || "General";
  const tagsList = stream.tags || [];

  return (
    <div
      onClick={() => onSelectStream && onSelectStream(stream)}
      className="group relative flex flex-col rounded-2xl glass-panel bg-slate-900/60 border border-slate-800/80 overflow-hidden cursor-pointer hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
        <img
          src={stream.thumbnail || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"}
          alt={stream.title || "Live Stream"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Live Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600/90 text-white font-bold text-[11px] tracking-wider uppercase backdrop-blur-md shadow-lg badge-live-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          LIVE
        </div>

        {/* Viewer Count Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950/80 text-slate-100 font-mono font-bold text-xs backdrop-blur-md border border-slate-800">
          <Eye className="w-3.5 h-3.5 text-indigo-400" />
          {stream.viewerCount >= 1000 ? `${(stream.viewerCount / 1000).toFixed(1)}k` : (stream.viewerCount || 0)}
        </div>

        {/* Category & Subcategory Overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onSelectCategory && onSelectCategory(stream.category);
            }}
            className="px-2 py-0.5 rounded-lg bg-slate-950/85 text-cyan-300 hover:text-white hover:bg-cyan-600/60 text-[10px] font-semibold backdrop-blur-md border border-cyan-500/30 transition-colors"
          >
            {categoryName}
          </span>
          {stream.subcategory && (
            <span className="px-2 py-0.5 rounded-lg bg-indigo-950/85 text-indigo-300 text-[10px] font-semibold backdrop-blur-md border border-indigo-500/30">
              {stream.subcategory}
            </span>
          )}
        </div>
      </div>

      {/* Stream Info Content */}
      <div className="p-4 flex items-start gap-3">
        {/* Creator Avatar */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectCreator && onSelectCreator(stream.creator);
          }}
          className="relative shrink-0 group/avatar"
        >
          <img
            src={stream.creator?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"}
            alt={creatorName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40 group-hover/avatar:ring-indigo-400 transition-all"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1 leading-snug">
            {stream.title || "Live Stream"}
          </h3>
          
          <div className="flex items-center gap-1.5 mt-1">
            <span
              onClick={(e) => {
                e.stopPropagation();
                onSelectCreator && onSelectCreator(stream.creator);
              }}
              className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors truncate"
            >
              {creatorName}
            </span>
            {stream.creator?.verified && (
              <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            )}
          </div>

          {/* Tags & Language */}
          <div className="flex flex-wrap gap-1 mt-2">
            {stream.language && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                {stream.language}
              </span>
            )}
            {tagsList.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
