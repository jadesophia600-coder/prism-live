import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DBService, REAL_CATEGORIES } from '../services/dbService';
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
  const [streamTitle, setStreamTitle] = useState('Broadcast Live Stream');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('technology');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Live Coding');
  const [description, setDescription] = useState('Welcome to the live stream!');
  const [tags, setTags] = useState('Live, Tech, Broadcast');

  const selectedCategoryObj = REAL_CATEGORIES.find(c => c.slug === selectedCategorySlug) || REAL_CATEGORIES[0];

  const handleCategoryChange = (e) => {
    const newSlug = e.target.value;
    setSelectedCategorySlug(newSlug);
    const cat = REAL_CATEGORIES.find(c => c.slug === newSlug);
    if (cat && cat.subcategories.length > 0) {
      setSelectedSubcategory(cat.subcategories[0]);
    }
  };

  const copyStreamKey = () => {
    navigator.clipboard.writeText(user?.streamKey || 'live_sk_prism_9a8f7c6b5a4d3e2f');
    setCopiedKey(true);
    addToast('Stream Key copied to clipboard! Keep it private.', 'success');
    setTimeout(() => setCopiedKey(false), 3000);
  };

  const handleRegenerateKey = () => {
    const newKey = StreamingService.generateStreamKey(user?.username || 'broadcaster');
    setUser(prev => ({ ...prev, streamKey: newKey }));
    addToast('New Stream Key generated successfully!', 'info');
  };

  const handleSaveStreamSettings = async (e) => {
    e.preventDefault();
    setIsTestLive(true);
    await DBService.createStreamAsync({
      title: streamTitle,
      description: description,
      categorySlug: selectedCategorySlug,
      subcategory: selectedSubcategory,
      tags: tags.split(',').map(t => t.trim()),
      streamKey: user?.streamKey
    });
    addToast(`🚀 Stream Published Live to Supabase! Category: ${selectedCategoryObj.name}`, 'success');
    onNavigate('discover');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsTestLive(!isTestLive);
              addToast(isTestLive ? "Stream Ingest Disconnected" : "Stream Live!", isTestLive ? "info" : "success");
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              isTestLive
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 badge-live-pulse'
                : 'bg-emerald-600 text-white shadow-lg'
            }`}
          >
            <Radio className="w-4 h-4" />
            {isTestLive ? "LIVE BROADCAST ACTIVE" : "GO LIVE NOW"}
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] w-full mx-auto p-6 space-y-8">
        
        {/* Stream Settings Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/30 space-y-6 max-w-3xl">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-400" /> Broadcast Metadata & Stream Setup
          </h2>

          <form onSubmit={handleSaveStreamSettings} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Stream Title *</label>
              <input
                type="text"
                required
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Category *</label>
                <select
                  value={selectedCategorySlug}
                  onChange={handleCategoryChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                >
                  {REAL_CATEGORIES.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Subcategory *</label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                >
                  {(selectedCategoryObj.subcategories || []).map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Stream Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Stream Key (Keep Private)</label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value={user?.streamKey || 'live_sk_prism_9a8f7c6b5a4d3e2f'}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs text-indigo-300 font-bold"
                />
                <button
                  type="button"
                  onClick={copyStreamKey}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow"
                >
                  {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-400 text-white font-black text-sm shadow-xl shadow-indigo-600/40 hover:scale-102 transition-all flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4" /> Publish Broadcast & Go Live
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
