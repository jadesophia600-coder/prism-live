import React from 'react';
import { Zap, Github, Twitter, Disc as Discord, Shield, Globe } from 'lucide-react';

export function Footer({ onNavigate }) {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-20 text-slate-400 text-sm">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
        
        {/* Brand info */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="font-extrabold text-lg tracking-wider text-white">
              PRISM<span className="text-cyan-400 font-black">.LIVE</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            The next-generation live streaming ecosystem built for global creators, gamers, artists, and live broadcasters. Powered by high-speed low-latency HLS & WebRTC infrastructure.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
              <Discord className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Platform links */}
        <div>
          <h4 className="font-semibold text-white text-xs tracking-wider uppercase mb-4">Platform</h4>
          <ul className="space-y-2.5 text-xs">
            <li><button onClick={() => onNavigate('discover')} className="hover:text-cyan-400 transition-colors">Live Discover</button></li>
            <li><button onClick={() => onNavigate('browse')} className="hover:text-cyan-400 transition-colors">Browse Categories</button></li>
            <li><button onClick={() => onNavigate('search')} className="hover:text-cyan-400 transition-colors">Search Channels</button></li>
            <li><button onClick={() => onNavigate('dashboard')} className="hover:text-cyan-400 transition-colors">Creator Studio</button></li>
          </ul>
        </div>

        {/* Creators & Monetization */}
        <div>
          <h4 className="font-semibold text-white text-xs tracking-wider uppercase mb-4">Creators</h4>
          <ul className="space-y-2.5 text-xs">
            <li><button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-400 transition-colors">Go Live & OBS Setup</button></li>
            <li><button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-400 transition-colors">Monetization Tiers</button></li>
            <li><button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-400 transition-colors">Stream Key & Ingest</button></li>
            <li><button onClick={() => onNavigate('profile', { modal: 'upgrade' })} className="hover:text-indigo-400 transition-colors">Partner Program</button></li>
          </ul>
        </div>

        {/* Legal & Governance */}
        <div>
          <h4 className="font-semibold text-white text-xs tracking-wider uppercase mb-4">Governance</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="hover:text-slate-200 cursor-pointer">Terms of Service</li>
            <li className="hover:text-slate-200 cursor-pointer">Privacy & Data Policy</li>
            <li className="hover:text-slate-200 cursor-pointer">DMCA Copyright Policy</li>
            <li><button onClick={() => onNavigate('admin')} className="text-amber-400 hover:underline">Admin Control Panel</button></li>
          </ul>
        </div>

      </div>

      <div className="max-w-[1920px] mx-auto pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>© 2026 PRISM LIVE Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All Systems Operational
          </span>
          <span className="flex items-center gap-1 hover:text-white cursor-pointer">
            <Globe className="w-3.5 h-3.5" /> English (US)
          </span>
        </div>
      </div>
    </footer>
  );
}
