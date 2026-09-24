import React from 'react';
import { Tag, Radio } from 'lucide-react';

export function CategoryCard({ category, onSelectCategory }) {
  if (!category) return null;
  const tagsList = category.subcategories || category.tags || [];
  const liveCount = category.liveCount !== undefined ? category.liveCount : 0;

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
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />

        {/* Live Status indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 text-cyan-400 font-mono font-bold text-xs backdrop-blur-md border border-cyan-500/30">
          <Radio className={`w-3.5 h-3.5 ${liveCount > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
          {liveCount > 0 ? `${liveCount} Live` : 'Category'}
        </div>

        {/* Content */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {category.name}
          </h3>

          <div className="flex flex-wrap gap-1">
            {tagsList.slice(0, 3).map((t, idx) => (
              <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-slate-700/60">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
