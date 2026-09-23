import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { Modal } from '../components/common/Modal';
import { CREATORS, LIVE_STREAMS, CATEGORIES } from '../data/mockData';
import {
  User, Heart, Star, Sparkles, Shield, Radio, Settings,
  CheckCircle, ArrowRight, Bell, Zap, Play, Clock, Gift,
  Coins, Layers, ShieldCheck, Key, RefreshCw, Eye, Check,
  Tv, Compass, Award, ExternalLink, Activity
} from 'lucide-react';

export function UserDashboard({ onNavigate, initialTab = 'overview' }) {
  const { user, setUser, followCreator, subscribeToCreator, upgradeToCreator } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab); // 'overview', 'followed', 'subscriptions', 'history', 'settings', 'creator'
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [claimedBonus, setClaimedBonus] = useState(false);

  // Edit profile local state
  const [editDisplayName, setEditDisplayName] = useState(user?.displayName || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editQuality, setEditQuality] = useState(user?.defaultQuality || '1080p60');
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled || false);

  const followedCreatorIds = user?.followedCreatorIds || [];
  const followedCreators = CREATORS.filter(c => followedCreatorIds.includes(c.id));
  const recommendedStreams = LIVE_STREAMS.slice(0, 3);
  const watchHistory = user?.watchHistory || [];
  const transactionHistory = user?.transactionHistory || [];

  // Onboarding checklist tasks
  const onboardingSteps = [
    { id: 1, label: 'Create PRISM LIVE Account', completed: true },
    { id: 2, label: 'Select Favorite Categories', completed: (user?.favoriteCategories || []).length > 0 },
    { id: 3, label: 'Follow 3 Live Creators', completed: followedCreatorIds.length >= 3 },
    { id: 4, label: 'Claim New Member 100 Token Welcome Bonus', completed: claimedBonus }
  ];

  const completedCount = onboardingSteps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / onboardingSteps.length) * 100);

  const handleClaimBonus = () => {
    setClaimedBonus(true);
    addToast('🎉 100 PRISM Welcome Tokens claimed & added to your balance!', 'success');
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      displayName: editDisplayName,
      bio: editBio,
      defaultQuality: editQuality,
      twoFactorEnabled: twoFactor
    }));
    addToast('Account profile & preferences updated successfully!', 'success');
  };

  const handleConfirmUpgrade = () => {
    upgradeToCreator();
    addToast('🚀 Congratulations! Your channel has been upgraded to CREATOR status!', 'success');
    setShowUpgradeModal(false);
    onNavigate('dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Creator Channel Upgrade Modal */}
      <Modal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} title="Upgrade to Creator Channel">
        <div className="space-y-5 text-center p-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>

          <h3 className="text-2xl font-black text-white">Broadcast Your Live Stream</h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            Unlock your instant RTMP ingest server key, OBS / Streamlabs studio integration, live chat moderation tools, and 85% revenue monetization split!
          </p>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-400 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Dedicated Low-Latency RTMP Ingest Server
            </div>
            <div className="flex items-center gap-2.5 text-emerald-400 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> 85 / 15 Revenue Share Split on Subs & Tips
            </div>
            <div className="flex items-center gap-2.5 text-emerald-400 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Real-time Analytics & Viewer Metrics
            </div>
          </div>

          <button
            onClick={handleConfirmUpgrade}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-400 text-white font-black text-sm shadow-xl shadow-indigo-600/40 hover:scale-102 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Activate Creator Studio Now
          </button>
        </div>
      </Modal>

      <div className="flex flex-1">
        <Sidebar onNavigate={onNavigate} />

        <main className="flex-1 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8 min-w-0">
          
          {/* Header Banner & User Profile Hero */}
          <div className="glass-panel bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
              <div className="relative">
                <img
                  src={user?.avatar}
                  alt={user?.displayName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-indigo-500/40 shadow-2xl"
                />
                <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase border border-slate-900">
                  Online
                </span>
              </div>

              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{user?.displayName}</h1>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-xs font-bold capitalize flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    {user?.role === 'creator' ? 'Verified Creator' : 'Registered Member'}
                  </span>
                </div>
                <p className="text-xs font-mono text-cyan-400 font-bold">@{user?.username} • {user?.email}</p>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">{user?.bio}</p>

                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> Member since {user?.memberSince || '2026'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" /> Following {followedCreators.length} Channels
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
                {user?.role === 'viewer' ? (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-400 text-white font-black text-xs shadow-xl shadow-emerald-600/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Radio className="w-4 h-4 animate-pulse" /> Become a Creator
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-400 text-white font-black text-xs shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Radio className="w-4 h-4 text-rose-300" /> Open Creator Studio
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-6 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4 text-slate-400" /> Edit Preferences
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Followed Creators</p>
                <p className="text-xl font-black text-white">{followedCreators.length}</p>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                <Coins className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Prism Token Balance</p>
                <p className="text-xl font-black text-white">{claimedBonus ? '1,350' : '1,250'} <span className="text-xs text-amber-400 font-normal font-mono">PTS</span></p>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Active Subscriptions</p>
                <p className="text-xl font-black text-white">{(user?.subscriptions || []).length} Channel</p>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                <Tv className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Watch Time This Month</p>
                <p className="text-xl font-black text-white">24.5 hrs</p>
              </div>
            </div>
          </div>

          {/* User Dashboard Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-extrabold scrollbar-none">
            {[
              { id: 'overview', label: '📌 Overview & Onboarding', icon: Compass },
              { id: 'followed', label: `🔔 Followed Creators (${followedCreators.length})`, icon: Heart },
              { id: 'subscriptions', label: '💎 Subscriptions & Tips', icon: Star },
              { id: 'history', label: '📺 Watch History', icon: Clock },
              { id: 'settings', label: '⚙️ Account Preferences', icon: Settings },
              { id: 'creator', label: '🚀 Creator Studio Setup', icon: Radio }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-black'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW & ONBOARDING */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Onboarding Checklist Card */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/30 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">Welcome Onboarding</span>
                    <h2 className="text-xl font-black text-white mt-1">Get Started on PRISM LIVE</h2>
                    <p className="text-xs text-slate-400 mt-1">Complete your quick setup tasks to unlock your 100 free welcome tokens</p>
                  </div>
                  <div className="w-full sm:w-48 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-cyan-400">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {onboardingSteps.map(step => (
                    <div
                      key={step.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                        step.completed
                          ? 'bg-slate-950/80 border-emerald-500/30 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          step.completed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {step.completed ? <Check className="w-4 h-4" /> : step.id}
                        </div>
                        <span className={`text-xs font-extrabold ${step.completed ? 'text-white' : 'text-slate-300'}`}>
                          {step.label}
                        </span>
                      </div>

                      {step.id === 4 && !claimedBonus && (
                        <button
                          onClick={handleClaimBonus}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all animate-bounce"
                        >
                          Claim 100 PTS
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Live Streams */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-400" /> Recommended Live Streams For You
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedStreams.map(stream => (
                    <div
                      key={stream.id}
                      onClick={() => onNavigate('watch', { streamId: stream.id })}
                      className="glass-panel group p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-3"
                    >
                      <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950">
                        <img src={stream.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600 text-white font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE
                        </span>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-200 font-mono text-[10px] font-bold">
                          {(stream.viewerCount / 1000).toFixed(1)}k viewers
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <img src={stream.creatorAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-extrabold text-white truncate group-hover:text-indigo-400 transition-colors">
                            {stream.title}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium truncate">{stream.creatorName}</p>
                          <span className="inline-block px-2 py-0.5 mt-1 rounded-md bg-slate-800 text-[10px] text-cyan-400 font-bold">
                            {stream.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FOLLOWED CREATORS */}
          {activeTab === 'followed' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" /> Followed Channels
                  </h2>
                  <p className="text-xs text-slate-400">Manage your notifications and quick jump to broadcasts</p>
                </div>
                <button
                  onClick={() => onNavigate('browse')}
                  className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-600/30 transition-colors flex items-center gap-1.5"
                >
                  Discover More Creators <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {followedCreators.map(cr => (
                  <div
                    key={cr.id}
                    className="glass-panel p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-center gap-4">
                      <img src={cr.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-black text-white truncate">{cr.displayName}</p>
                          {cr.isVerified && <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-indigo-400 font-mono">@{cr.username}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{(cr.followersCount / 1000).toFixed(1)}k Followers</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{cr.bio}</p>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onNavigate('channel', { username: cr.username })}
                        className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors flex items-center justify-center gap-1"
                      >
                        Visit Channel
                      </button>
                      <button
                        onClick={() => {
                          followCreator(cr.id);
                          addToast(`Unfollowed @${cr.username}`, 'info');
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-rose-400 hover:bg-rose-500/10 font-bold text-xs transition-colors"
                        title="Unfollow"
                      >
                        Unfollow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SUBSCRIPTIONS & TIPS */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400/20" /> Active Creator Subscriptions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {CREATORS.slice(0, 1).map(cr => (
                    <div key={cr.id} className="glass-panel p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={cr.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                          <div>
                            <p className="text-sm font-black text-white">{cr.displayName}</p>
                            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                              Tier 1 Subscriber ($4.99/mo)
                            </span>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                          Active
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <p className="font-bold text-white mb-1">Subscriber Perks Unlocked:</p>
                        <p>✓ Ad-Free Viewing on @{cr.username} Stream</p>
                        <p>✓ 12 Exclusive Channel Chat Emotes</p>
                        <p>✓ Custom Sub Badge next to your username in Chat</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tipping & Bit History Table */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-400" /> Transaction & Tipping Log
                </h3>

                <div className="glass-panel rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Creator Target</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {transactionHistory.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 font-mono text-cyan-400 font-bold">{tx.id}</td>
                          <td className="p-4 font-semibold text-white">{tx.type}</td>
                          <td className="p-4 font-medium text-slate-300">@{tx.creator}</td>
                          <td className="p-4 font-black text-emerald-400">{tx.amount}</td>
                          <td className="p-4 text-slate-400">{tx.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WATCH HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" /> Recently Watched Broadcasts
              </h2>

              <div className="space-y-3">
                {watchHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="glass-panel p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                        <Play className="w-5 h-5 fill-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{item.title}</p>
                        <p className="text-xs text-slate-400">Creator: <span className="text-cyan-400 font-semibold">@{item.creator}</span> • Watched {item.date}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('discover')}
                      className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition-colors"
                    >
                      Rewatch
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ACCOUNT PREFERENCES & SECURITY */}
          {activeTab === 'settings' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 max-w-3xl space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" /> Account Preferences & Security
              </h2>

              <form onSubmit={handleSavePreferences} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Display Name</label>
                  <input
                    type="text"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Bio / Profile Description</label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Default Video Quality</label>
                  <select
                    value={editQuality}
                    onChange={(e) => setEditQuality(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="1080p60">1080p 60fps (Full HD)</option>
                    <option value="720p60">720p 60fps (HD)</option>
                    <option value="480p">480p (Medium Bandwidth)</option>
                    <option value="auto">Auto Adaptive Latency</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</p>
                    <p className="text-[11px] text-slate-400">Secure your PRISM LIVE account with authenticator apps</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      twoFactor ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {twoFactor ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-400 text-white font-black text-xs shadow-xl shadow-indigo-600/30 hover:scale-102 transition-all"
                >
                  Save Account Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: CREATOR SETUP HUB */}
          {activeTab === 'creator' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/30 space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white flex items-center justify-center">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Broadcaster Stream Ingest Credentials</h2>
                  <p className="text-xs text-slate-400">Use these settings in OBS Studio, Streamlabs, or Prism Mobile Broadcaster</p>
                </div>
              </div>

              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">RTMP Ingest Server URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={user?.rtmpUrl || 'rtmp://ingest.prismlive.io/live'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs text-cyan-400 font-bold"
                    />
                    <button
                      onClick={() => addToast('RTMP URL copied to clipboard!', 'success')}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">Primary Stream Key (Keep Secret!)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      readOnly
                      value={user?.streamKey || 'live_sk_prism_demo_key_998877'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs text-indigo-300 font-bold"
                    />
                    <button
                      onClick={() => addToast('Stream key copied to clipboard!', 'success')}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/20"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-400 text-white font-black text-xs shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" /> Open Full Creator Control Center
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
