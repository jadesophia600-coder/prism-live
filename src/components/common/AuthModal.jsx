import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CATEGORIES } from '../../data/mockData';
import {
  X, Zap, User, Lock, Mail, Camera, Upload, ArrowRight,
  Heart, Radio, CheckCircle, Sparkles, Layers, ShieldCheck
} from 'lucide-react';

export function AuthModal() {
  const {
    authModalOpen,
    closeAuthModal,
    pendingFollowCreator,
    registerUser,
    signInUser
  } = useAuth();
  const { addToast } = useToast();

  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState('viewer');
  const [selectedCategories, setSelectedCategories] = useState(['podcasts', 'technology', 'music']);
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80');

  if (!authModalOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('Please select a valid image file (PNG, JPG, WEBP)', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target.result);
        addToast('✅ Profile picture loaded from device!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (slug) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        addToast("Please enter your account email and password", "error");
        return;
      }
      const res = await signInUser(email, password);
      if (res?.autoFollowed) {
        addToast(`🎉 Signed in! You are now following @${res.autoFollowed.username || res.autoFollowed.displayName || 'creator'}!`, 'success');
      } else {
        addToast("Welcome back to PRISM LIVE!", "success");
      }
      return;
    }

    if (!email.trim() || !username.trim() || !displayName.trim()) {
      addToast("Please enter your display name, username, and email address", "error");
      return;
    }

    const res = await registerUser({
      email: email.trim(),
      password: password.trim(),
      username: username.trim().replace(/^@/, ''),
      displayName: displayName.trim(),
      bio: selectedRole === 'creator' ? "Broadcasting live on PRISM LIVE!" : "PRISM LIVE stream enthusiast!",
      role: selectedRole,
      avatar: avatarUrl,
      favoriteCategories: selectedCategories,
      onboardingCompleted: true
    });

    if (res?.autoFollowed) {
      addToast(`🎉 Account created! You are now following @${res.autoFollowed.username || res.autoFollowed.displayName || 'creator'}!`, 'success');
    } else {
      addToast("🎉 Account created successfully! Welcome to PRISM LIVE.", "success");
    }
  };

  const handleQuickDemoLogin = async () => {
    const res = await signInUser('demo@prismlive.io', 'demo1234');
    if (res?.autoFollowed) {
      addToast(`🎉 Signed in! You are now following @${res.autoFollowed.username || res.autoFollowed.displayName || 'creator'}!`, 'success');
    } else {
      addToast("Signed in with Demo User account!", "success");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        className="w-full max-w-xl glass-panel bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-sm text-white tracking-wider">PRISM.LIVE</span>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto space-y-6">

          {/* Targeted Creator Follow Banner (If clicked Follow on a creator) */}
          {pendingFollowCreator && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/40 flex items-center gap-4 shadow-xl">
              <div className="relative shrink-0">
                <img
                  src={pendingFollowCreator.avatar}
                  alt={pendingFollowCreator.displayName || 'Creator'}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-500 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 p-1 bg-rose-600 rounded-full text-white ring-2 ring-slate-950">
                  <Heart className="w-3.5 h-3.5 fill-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Follow Creator Account
                </p>
                <h4 className="text-base font-extrabold text-white truncate">
                  {pendingFollowCreator.displayName || pendingFollowCreator.username}
                </h4>
                <p className="text-xs text-slate-300">
                  Create an account or sign in to follow <strong className="text-cyan-400">@{pendingFollowCreator.username}</strong> and get live notifications!
                </p>
              </div>
            </div>
          )}

          {/* Mode Switch Pills */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1 text-xs font-extrabold">
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                !isLogin
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-400 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" /> Create Account
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                isLogin
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4" /> Sign In
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                {/* Profile Photo Uploader */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-cyan-400 shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-xs font-bold text-slate-200">Profile Photo</p>
                    <input
                      type="file"
                      accept="image/*"
                      id="modal-profile-file-input"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="modal-profile-file-input"
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Photo From Device
                    </label>
                  </div>
                </div>

                {/* Display Name & Handle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Display Name *</label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Alex Stream"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Username Handle *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-cyan-400 font-bold">@</span>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="AlexStreamer"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Email & Password */}
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@prismlive.io"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Account Type */}
            {!isLogin && (
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-300 block">Select Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('viewer')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedRole === 'viewer'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-400" /> Viewer Account
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Watch & follow creators</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('creator')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedRole === 'creator'
                        ? 'bg-cyan-600/20 border-cyan-500 text-white ring-1 ring-cyan-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" /> Broadcaster Channel
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Stream live to viewers</p>
                  </button>
                </div>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-400 text-white font-black text-xs shadow-xl shadow-indigo-600/30 hover:scale-102 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {pendingFollowCreator ? (
                <>
                  <Heart className="w-4 h-4 fill-white" />
                  {isLogin ? 'Sign In & Follow Creator' : 'Create Account & Follow Creator'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In to Account' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Sign In Option */}
          <div className="pt-3 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Quick 1-Click Demo Account Login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
