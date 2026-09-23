import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ADMIN_STATS, CREATORS, LIVE_STREAMS } from '../data/mockData';
import {
  Shield, Users, Radio, Coins, Activity, CheckCircle,
  Ban, Sparkles, AlertTriangle, RefreshCw
} from 'lucide-react';

export function AdminDashboard({ onNavigate }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [creatorsList, setCreatorsList] = useState(CREATORS);
  const [streamsList, setStreamsList] = useState(LIVE_STREAMS);

  const toggleVerifyCreator = (creatorId) => {
    setCreatorsList(prev => prev.map(c => c.id === creatorId ? { ...c, verified: !c.verified } : c));
    addToast('Creator verification status updated', 'info');
  };

  const toggleFeatureStream = (streamId) => {
    setStreamsList(prev => prev.map(s => s.id === streamId ? { ...s, isFeatured: !s.isFeatured } : s));
    addToast('Stream featured status updated', 'success');
  };

  const terminateStream = (streamId) => {
    setStreamsList(prev => prev.filter(s => s.id !== streamId));
    addToast('Stream terminated for guidelines violation.', 'error');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-[1920px] mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Platform Administrator Control Center</h1>
            <p className="text-xs text-slate-400">Global system metrics, creator verification, and live content moderation</p>
          </div>
        </div>
      </div>

      {/* Platform Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Registered Users</p>
          <p className="text-3xl font-black font-mono text-white">{ADMIN_STATS.totalUsers.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">↑ 4,200 new today</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Active Live Streams</p>
          <p className="text-3xl font-black font-mono text-cyan-400">{ADMIN_STATS.liveStreams}</p>
          <p className="text-[11px] text-cyan-300 font-semibold">{ADMIN_STATS.totalViewersNow.toLocaleString()} Concurrent Viewers</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Monthly Platform Volume</p>
          <p className="text-3xl font-black font-mono text-emerald-400">${ADMIN_STATS.monthlyRevenueUsd.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-300 font-semibold">15% Platform Take Rate</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Infrastructure Status</p>
          <p className="text-sm font-bold text-emerald-400">{ADMIN_STATS.serverStatus}</p>
          <p className="text-[11px] text-slate-400">{ADMIN_STATS.activeIngests}</p>
        </div>
      </div>

      {/* Creator Management Table */}
      <div className="glass-panel bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" /> Creator Verification & Roles Management
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                <th className="py-3 px-4">Creator</th>
                <th className="py-3 px-4">Followers</th>
                <th className="py-3 px-4">Partner Tier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {creatorsList.map(cr => (
                <tr key={cr.id} className="hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-bold flex items-center gap-3">
                    <img src={cr.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-white">{cr.displayName}</p>
                      <p className="text-[10px] text-cyan-400 font-mono">@{cr.username}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold">{(cr.followersCount / 1000).toFixed(1)}k</td>
                  <td className="py-3 px-4 uppercase font-bold text-indigo-300">{cr.partnerTier}</td>
                  <td className="py-3 px-4">
                    {cr.verified ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Verified</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">Standard</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => toggleVerifyCreator(cr.id)}
                      className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 font-bold transition-colors"
                    >
                      {cr.verified ? 'Revoke Verification' : 'Verify Channel'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Stream Moderation Queue */}
      <div className="glass-panel bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Radio className="w-5 h-5 text-rose-500" /> Active Broadcast Moderation Queue
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {streamsList.map(stream => (
            <div key={stream.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate">{stream.creator.displayName}</span>
                <span className="text-[10px] font-mono text-cyan-400">{(stream.viewerCount / 1000).toFixed(1)}k Viewers</span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-1">{stream.title}</p>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  onClick={() => toggleFeatureStream(stream.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    stream.isFeatured ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {stream.isFeatured ? 'Featured ★' : 'Feature on Hero'}
                </button>
                <button
                  onClick={() => terminateStream(stream.id)}
                  className="px-3 py-1 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white font-bold transition-colors"
                >
                  Terminate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
