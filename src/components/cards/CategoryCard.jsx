import React from 'react';
import { Eye, Radio } from 'lucide-react';

export function CategoryCard({ category, onSelectCategory }) {
  return (
    <div
      onClick={() => onSelectCategory && onSelectCategory(category)}
      className="group relative flex flex-col rounded-2xl glass-panel bg-slate-900/60 border border-slate-800/80 overflow-hidden cursor-pointer hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative aspect-[3/4] w-full bg-slate-950 overflow-hidden">
        <img
          src={category.cover}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-90" />

        {/* Live Channel count pill */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/85 text-cyan-400 font-mono font-bold text-xs backdrop-blur-md border border-cyan-500/30">
          <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          {category.channels} Live
        </div>

        {/* Content */}
        <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
          <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {category.name}
          </h3>
          
          <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1 font-mono text-indigo-300">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              {(category.viewers / 1000).toFixed(1)}k Viewers
            </span>
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            {category.tags.map((t, idx) => (
              <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700/60">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
