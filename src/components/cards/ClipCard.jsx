import React from 'react';
import { Play, Eye, Scissors } from 'lucide-react';

export function ClipCard({ clip, onSelectClip }) {
  return (
    <div
      onClick={() => onSelectClip && onSelectClip(clip)}
      className="group relative flex flex-col rounded-2xl glass-panel bg-slate-900/60 border border-slate-800/80 overflow-hidden cursor-pointer hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
        <img
          src={clip.thumbnail}
          alt={clip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>

        {/* Clip badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-pink-600/90 text-white font-bold text-[10px] uppercase backdrop-blur-md">
          <Scissors className="w-3 h-3" /> CLIP
        </div>

        {/* Duration */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-950/80 text-white font-mono text-[11px] backdrop-blur-md">
          {clip.duration}
        </div>
      </div>

      <div className="p-3.5 space-y-1">
        <h4 className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1">
          {clip.title}
        </h4>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Clipped by <strong className="text-slate-200">{clip.clipper}</strong></span>
          <span className="flex items-center gap-1 font-mono text-indigo-300">
            <Eye className="w-3 h-3" /> {clip.views}
          </span>
        </div>
      </div>
    </div>
  );
}
