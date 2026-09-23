import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES } from '../data/mockData';
import {
  Zap, Mail, Lock, User, ArrowRight, ShieldCheck, Check,
  Radio, Sparkles, Compass, Heart, Globe, Disc as Discord, Github
} from 'lucide-react';

export function AuthPages({ onNavigate }) {
  const { setUser } = useAuth();
  const { addToast } = useToast();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState('viewer'); // 'viewer' | 'creator'
  const [selectedCategories, setSelectedCategories] = useState(['podcasts', 'technology', 'music']);
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80');

  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80'
  ];

  const toggleCategory = (slug) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      email: email || prev?.email || "user@prismlive.io",
      username: username || prev?.username || "PioneerUser",
      displayName: displayName || username || prev?.displayName || "Pioneer User",
      role: selectedRole,
      avatar: avatarUrl,
      favoriteCategories: selectedCategories,
      onboardingCompleted: true
    }));

    addToast(isLogin ? "Welcome back! Signed into PRISM LIVE." : "Account created! Welcome to PRISM LIVE.", "success");
    onNavigate(selectedRole === 'creator' ? 'dashboard' : 'user-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl glass-panel bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-cyan-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
            <Zap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {isLogin ? 'Sign In to PRISM LIVE' : 'Create Your Account'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {isLogin ? 'Enter your credentials to access your user dashboard' : 'Join the live streaming ecosystem for creators and viewers'}
          </p>
        </div>

        {/* Dual Mode Switcher */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1 text-xs">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
              isLogin ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
              !isLogin ? 'bg-gradient-to-r from-indigo-600 to-cyan-400 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register New Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Registration Role Picker */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 block">Select Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('viewer')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedRole === 'viewer'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> Viewer Account
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Watch, chat, follow creators & send tips</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('creator')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedRole === 'creator'
                      ? 'bg-cyan-600/20 border-cyan-500 text-white ring-2 ring-cyan-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" /> Creator Channel
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Go live, get RTMP stream key & monetize</p>
                </button>
              </div>
            </div>
          )}

          {/* Form Inputs */}
          {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. PrismExplorer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Prism Explorer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Registration Extra Onboarding Options */}
          {!isLogin && (
            <>
              {/* Avatar Preset Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 block">Choose Profile Avatar</label>
                <div className="flex items-center gap-3">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt=""
                      onClick={() => setAvatarUrl(url)}
                      className={`w-10 h-10 rounded-full object-cover cursor-pointer transition-all ${
                        avatarUrl === url ? 'ring-4 ring-cyan-400 scale-110 shadow-lg' : 'opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Favorite Categories Pills */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 block">Pick Favorite Categories (For Recommendations)</label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map(cat => {
                    const selected = selectedCategories.includes(cat.slug);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.slug)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                          selected
                            ? 'bg-indigo-600 text-white shadow'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {selected ? '✓ ' : ''}{cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-400 text-white font-black text-xs shadow-xl shadow-indigo-600/30 hover:scale-102 transition-all flex items-center justify-center gap-2"
          >
            {isLogin ? 'Sign In to Dashboard' : 'Complete Registration & Open Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Social Auth Placeholders */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <p className="text-[11px] text-slate-500 text-center uppercase tracking-wider font-semibold">Or Sign In With</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => addToast("Google Auth simulator ready", "info")}
              className="py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Globe className="w-4 h-4 text-cyan-400" /> Google
            </button>
            <button
              onClick={() => addToast("Discord Auth simulator ready", "info")}
              className="py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Discord className="w-4 h-4 text-indigo-400" /> Discord
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
