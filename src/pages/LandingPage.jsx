import React, { useState } from 'react';
import { LIVE_STREAMS, CATEGORIES, CREATORS } from '../data/mockData';
import { StreamCard } from '../components/cards/StreamCard';
import { CategoryCard } from '../components/cards/CategoryCard';
import { CreatorCard } from '../components/cards/CreatorCard';
import { Footer } from '../components/common/Footer';
import {
  Zap, Radio, Sparkles, Play, ShieldCheck, Cpu, Globe,
  ArrowRight, Users, Coins, TrendingUp, Compass, Star
} from 'lucide-react';

export function LandingPage({ onNavigate, onSelectStream }) {
  const featuredStream = LIVE_STREAMS[0];
  const [estMonthlyViewers, setEstMonthlyViewers] = useState(25000);

  // Creator Revenue Calculator Formula: (Viewers * $0.45) + (Subs * $4.25)
  const estimatedCreatorRevenue = Math.floor((estMonthlyViewers * 0.45) + (estMonthlyViewers * 0.05 * 4.25));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/30 to-cyan-400/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold text-xs tracking-wide uppercase shadow-inner">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              The Next-Gen Live Streaming Ecosystem
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
              Refract Your World <br />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                Live to Millions.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              High-definition low-latency live streaming built for creators and global communities. Broadcast games, code, synthwave music, and IRL adventures with zero boundaries.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('discover')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Radio className="w-5 h-5 text-cyan-200 animate-pulse" />
                Watch Live Streams
              </button>
              <button
                onClick={() => onNavigate('profile', { modal: 'upgrade' })}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 font-extrabold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 text-indigo-400" />
                Start Streaming Now
              </button>
            </div>

            {/* Platform Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-900 text-center lg:text-left">
              <div>
                <p className="text-2xl font-black font-mono text-white">1.4M+</p>
                <p className="text-xs text-slate-400 font-semibold">Active Viewers</p>
              </div>
              <div>
                <p className="text-2xl font-black font-mono text-cyan-400">85 / 15</p>
                <p className="text-xs text-slate-400 font-semibold">Creator Revenue Split</p>
              </div>
              <div>
                <p className="text-2xl font-black font-mono text-emerald-400">&lt; 1.2s</p>
                <p className="text-xs text-slate-400 font-semibold">HLS Ultra Latency</p>
              </div>
            </div>
          </div>

          {/* Right Hero Live Stream Preview Card */}
          <div className="lg:col-span-6 z-10">
            <div className="relative rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 p-2 shadow-2xl overflow-hidden group">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950">
                <img src={featuredStream.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                
                {/* Live Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-600/90 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md shadow-lg badge-live-pulse">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  FEATURED LIVE
                </div>

                {/* Play Button Overlay */}
                <button
                  onClick={() => onSelectStream(featuredStream)}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-md hover:scale-110 transition-transform group-hover:bg-indigo-500"
                >
                  <Play className="w-8 h-8 fill-white ml-1" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-white line-clamp-1">{featuredStream.title}</h3>
                    <p className="text-xs text-cyan-300 font-semibold">{featuredStream.creator.displayName}</p>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-slate-950/80 text-white font-mono font-bold text-xs border border-slate-800">
                    {(featuredStream.viewerCount / 1000).toFixed(1)}k Viewers
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Streams Row */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Radio className="w-6 h-6 text-rose-500" />
              Featured Live Broadcasts
            </h2>
            <p className="text-xs text-slate-400 mt-1">Trending channels live right now on PRISM LIVE</p>
          </div>
          <button
            onClick={() => onNavigate('discover')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            Explore All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {LIVE_STREAMS.slice(0, 4).map(stream => (
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

      {/* Popular Categories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Compass className="w-6 h-6 text-cyan-400" />
              Explore Popular Categories
            </h2>
            <p className="text-xs text-slate-400 mt-1">Find your favorite games, music, tech, and IRL streams</p>
          </div>
          <button
            onClick={() => onNavigate('browse')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            View All Categories <ArrowRight className="w-4 h-4" />
          </button>
        </div>

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

      {/* Creator Revenue Calculator Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        <div className="rounded-3xl glass-panel bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-8 lg:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Coins className="w-4 h-4" /> Creator First Economics
              </div>
              <h2 className="text-3xl font-black text-white">Calculate Your Monthly Earnings</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                PRISM LIVE offers an industry-leading <strong className="text-white">85/15 revenue split</strong> on all channel subscriptions, paid memberships, and bits tips. Build your community and earn more.
              </p>
              
              <div className="space-y-3 pt-4">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Estimated Monthly Viewers</span>
                  <span className="font-mono text-cyan-400 text-sm">{estMonthlyViewers.toLocaleString()} CCV</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={estMonthlyViewers}
                  onChange={(e) => setEstMonthlyViewers(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-950/90 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estimated Monthly Revenue</p>
              <p className="text-5xl font-black font-mono text-emerald-400">
                ${estimatedCreatorRevenue.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ mo</span>
              </p>
              <p className="text-xs text-slate-400">Based on 85% creator payout + sub conversions + cheer tips.</p>
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all"
              >
                Launch Creator Studio
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
