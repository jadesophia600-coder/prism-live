import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CREATOR_ANALYTICS, CATEGORIES } from '../data/mockData';
import { StreamingService } from '../services/streamingService';
import {
  Radio, Copy, Check, Eye, Users, Heart, Coins, TrendingUp,
  Settings, ShieldAlert, Cpu, Video, Calendar, Sparkles, AlertCircle, RefreshCw
} from 'lucide-react';

export function CreatorDashboard({ onNavigate }) {
  const { user, setUser } = useAuth();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('stream_setup');
  const [copiedKey, setCopiedKey] = useState(false);
  const [isTestLive, setIsTestLive] = useState(false);

  // Form states for Go Live
  const [streamTitle, setStreamTitle] = useState('The Future of AI Agents & LLMs: Live Founder Panel & Q&A Session');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('podcasts');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Technology');
  const [description, setDescription] = useState('Join us for a live panel featuring top AI founders discussing autonomous agents and LLM inference.');
  const [tags, setTags] = useState('AI, Podcast, Technology, Interview');
  const [visibility, setVisibility] = useState('public');

  const selectedCategoryObj = CATEGORIES.find(c => c.slug === selectedCategorySlug) || CATEGORIES[0];

  const handleCategoryChange = (e) => {
    const newSlug = e.target.value;
    setSelectedCategorySlug(newSlug);
    const cat = CATEGORIES.find(c => c.slug === newSlug);
    if (cat && cat.subcategories.length > 0) {
      setSelectedSubcategory(cat.subcategories[0]);
    }
  };

  const copyStreamKey = () => {
    navigator.clipboard.writeText(user.streamKey || 'live_sk_prism_demo_9a8f7c6b5a4d3e2f');
    setCopiedKey(true);
    addToast('Stream Key copied to clipboard! Keep it private.', 'success');
    setTimeout(() => setCopiedKey(false), 3000);
  };

  const handleRegenerateKey = () => {
    const newKey = StreamingService.generateStreamKey(user.username);
    setUser(prev => ({ ...prev, streamKey: newKey }));
    addToast('New Stream Key generated successfully!', 'info');
  };

  const handleSaveStreamSettings = (e) => {
    e.preventDefault();
    addToast(`Saved stream metadata! Category: ${selectedCategoryObj.name} (${selectedSubcategory})`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Dashboard Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Creator Studio Control Center</h1>
            <p className="text-xs text-slate-400">Configure broadcast metadata, categories, subcategories & OBS ingest</p>
          </div>
        </div>

        {/* Live Test Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsTestLive(!isTestLive);
              addToast(isTestLive ? "Stream Ingest Disconnected" : "Stream Test Mode Active!", isTestLive ? "info" : "success");
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              isTestLive
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 badge-live-pulse'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Radio className="w-4 h-4" />
            {isTestLive ? 'LIVE INGEST ACTIVE' : 'Start Test Stream'}
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex flex-1">
        
        {/* Left Studio Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-800 bg-slate-950 p-4 space-y-2">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
            { id: 'stream_setup', label: 'Go Live & Stream Setup', icon: Radio },
            { id: 'analytics', label: 'Analytics & Revenue', icon: Coins },
            { id: 'moderation', label: 'Chat & Moderation', icon: ShieldAlert },
            { id: 'settings', label: 'Channel Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Right Main Studio Content Area */}
        <main className="flex-1 p-6 space-y-8 overflow-y-auto max-w-[1600px]">
          
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800 space-y-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Current Live Viewers</p>
                  <p className="text-3xl font-black font-mono text-cyan-400">{CREATOR_ANALYTICS.currentViewers.toLocaleString()}</p>
                  <p className="text-[11px] text-emerald-400 font-semibold">↑ 12% vs last broadcast</p>
                </div>

                <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800 space-y-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Total Subscribers</p>
                  <p className="text-3xl font-black font-mono text-indigo-400">{CREATOR_ANALYTICS.subscribers.toLocaleString()}</p>
                  <p className="text-[11px] text-indigo-300 font-semibold">Tier 1: 8,420 • Tier 2: 4,030</p>
                </div>

                <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800 space-y-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Total Watch Hours</p>
                  <p className="text-3xl font-black font-mono text-amber-400">{CREATOR_ANALYTICS.totalWatchHours.toLocaleString()}</p>
                  <p className="text-[11px] text-slate-400">Monthly total across broadcasts</p>
                </div>

                <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800 space-y-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Estimated Revenue</p>
                  <p className="text-3xl font-black font-mono text-emerald-400">${CREATOR_ANALYTICS.estimatedRevenueUsd.toLocaleString()}</p>
                  <p className="text-[11px] text-emerald-400 font-semibold">85% Creator Net Payout</p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: GO LIVE / STREAM SETUP */}
          {activeTab === 'stream_setup' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Metadata & Category/Subcategory Settings Form */}
              <div className="lg:col-span-7 space-y-6">
                <form onSubmit={handleSaveStreamSettings} className="glass-panel bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-5">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-indigo-400" /> Broadcast Metadata Configuration
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Stream Title</label>
                    <input
                      type="text"
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>

                  {/* Category & Subcategory Pickers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Main Category</label>
                      <select
                        value={selectedCategorySlug}
                        onChange={handleCategoryChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                      >
                        {CATEGORIES.map(c => (
                          <option key={c.id} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Subcategory</label>
                      <select
                        value={selectedSubcategory}
                        onChange={(e) => setSelectedSubcategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
                      >
                        {selectedCategoryObj.subcategories.map((sub, idx) => (
                          <option key={idx} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Visibility</label>
                      <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="public">Public (Listed)</option>
                        <option value="unlisted">Unlisted (Link Only)</option>
                        <option value="subscribers">Subscribers Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Broadcast Description</label>
                    <textarea
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    Save Broadcast Information
                  </button>
                </form>
              </div>

              {/* Right Column: OBS / Encoder Credentials */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-5">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-cyan-400" /> Encoder Ingest Credentials
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1 block">RTMP Ingest Server URL</label>
                    <input
                      type="text"
                      readOnly
                      value={user.rtmpUrl || "rtmp://ingest.prismlive.io/live"}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-cyan-300 font-mono"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-400">Stream Key (Keep Secret)</label>
                      <button
                        onClick={handleRegenerateKey}
                        className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Regenerate Key
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        readOnly
                        value={user.streamKey || 'live_sk_prism_demo_9a8f7c6b5a4d3e2f'}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-indigo-300 font-mono"
                      />
                      <button
                        onClick={copyStreamKey}
                        className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                      >
                        {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 text-xs text-slate-300">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" /> OBS / Streamlabs Connection Guide:
                    </p>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-400 leading-relaxed">
                      <li>Open <strong className="text-white">OBS Studio</strong> or <strong className="text-white">Streamlabs Desktop</strong>.</li>
                      <li>Go to <strong className="text-white">Settings → Stream</strong>.</li>
                      <li>Select Service: <strong className="text-white">Custom...</strong></li>
                      <li>Paste RTMP URL into <strong className="text-white">Server</strong>.</li>
                      <li>Paste your Stream Key into <strong className="text-white">Stream Key</strong>.</li>
                      <li>Click <strong className="text-white">Start Streaming</strong>!</li>
                    </ol>
                  </div>

                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
