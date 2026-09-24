import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES } from '../data/mockData';
import {
  Zap, Mail, Lock, User, ArrowRight, ShieldCheck, Check,
  Radio, Sparkles, Compass, Heart, Globe, Disc as Discord, Github,
  Upload, Camera, Image, Layers, Star, CheckCircle, Video
} from 'lucide-react';

export function AuthPages({ onNavigate }) {
  const { registerUser, signInUser } = useAuth();
  const { addToast } = useToast();
  
  const [isLogin, setIsLogin] = useState(false); // Default to registration / onboarding
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedRole, setSelectedRole] = useState('creator'); // Default to Creator so new creators can join easily!
  const [selectedCategories, setSelectedCategories] = useState(['podcasts', 'technology', 'music']);
  const [avatarUrl, setAvatarUrl] = useState(null); // User must upload their own photo!

  const toggleCategory = (slug) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

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
        addToast('✅ Profile picture uploaded from your device!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        addToast("Please enter your email and password", "error");
        return;
      }
      signInUser(email, password);
      addToast("Welcome back to PRISM LIVE!", "success");
      onNavigate(selectedRole === 'creator' ? 'dashboard' : 'user-dashboard');
      return;
    }

    // Validation for new user registration
    if (!email.trim() || !username.trim() || !displayName.trim()) {
      addToast("Please fill out your Email, Username, and Display Name", "error");
      return;
    }

    if (!avatarUrl) {
      addToast("Please upload your profile picture from your device files", "error");
      return;
    }

    registerUser({
      email: email.trim(),
      username: username.trim().replace(/^@/, ''),
      displayName: displayName.trim(),
      bio: bio.trim() || (selectedRole === 'creator' ? "Broadcasting live on PRISM LIVE!" : "PRISM LIVE stream enthusiast!"),
      role: selectedRole,
      avatar: avatarUrl,
      favoriteCategories: selectedCategories,
      onboardingCompleted: true
    });

    if (selectedRole === 'creator') {
      addToast("🚀 Creator Account Activated! Welcome to your Broadcasting Studio.", "success");
      onNavigate('dashboard');
    } else {
      addToast("🎉 Account created! Welcome to your User Dashboard.", "success");
      onNavigate('user-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans select-none">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-600/30 via-cyan-500/20 to-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="w-full max-w-2xl glass-panel bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/30 flex items-center justify-center mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Zap className="w-7 h-7 text-cyan-400 animate-pulse" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isLogin ? 'Sign In to PRISM LIVE' : 'Start Your Live Streaming Journey'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {isLogin
              ? 'Enter your account email and password to access your streaming control panel'
              : 'Join as a Creator or Viewer. Upload your profile photo and begin broadcasting!'}
          </p>
        </div>

        {/* Mode Switcher Pills */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1.5 text-xs font-extrabold max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              !isLogin
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-400 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> Create Account / Join Platform
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              isLogin
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" /> Existing User Sign In
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* PROFILE PICTURE FILE UPLOADER (Required on Registration) */}
          {!isLogin && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-4 text-center sm:text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Step 1: Upload Your Profile Picture *
                </label>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full font-bold">
                  Required
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Uploaded Profile Photo"
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-cyan-400 shadow-2xl shadow-cyan-500/30"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-dashed border-indigo-500/50 flex flex-col items-center justify-center text-indigo-400 space-y-1">
                      <Upload className="w-7 h-7 animate-bounce" />
                      <span className="text-[10px] font-extrabold uppercase">Select File</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <p className="text-xs font-bold text-slate-200">
                    {avatarUrl ? '✅ Profile photo loaded!' : 'Choose an image file from your computer or phone:'}
                  </p>
                  
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="profile-photo-upload-input"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="profile-photo-upload-input"
                      className="px-5 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-400 hover:from-indigo-500 hover:to-cyan-300 text-xs font-black text-white rounded-xl cursor-pointer transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto inline-flex"
                    >
                      <Upload className="w-4 h-4" />
                      {avatarUrl ? 'Change Profile Picture' : 'Choose Photo File From Device'}
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-400">Supports PNG, JPG, JPEG, or WEBP image formats</p>
                </div>
              </div>
            </div>
          )}

          {/* USER DETAILS INPUTS */}
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <User className="w-4 h-4" /> {isLogin ? 'Account Credentials' : 'Step 2: Fill Out Account Details'}
            </label>

            {!isLogin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Full Name / Display Name *</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Username Handle *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-cyan-400 font-bold">@</span>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="AlexStreamer"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@prismlive.io"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Channel Bio / Description (Optional)</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell your viewers what you stream or love to watch..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            )}
          </div>

          {/* ACCOUNT TYPE SELECTION */}
          {!isLogin && (
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <Radio className="w-4 h-4" /> Step 3: Choose Account Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('creator')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedRole === 'creator'
                      ? 'bg-cyan-600/20 border-cyan-500 text-white ring-2 ring-cyan-500/40 shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-extrabold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400" /> Broadcaster Channel
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Start your streaming journey! Get instant RTMP Stream Key, OBS Studio ingest & monetization.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('viewer')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedRole === 'viewer'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-500/40 shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-extrabold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-400" /> Viewer Account
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Watch HD live streams, participate in chat, follow favorite channels & send tip bits.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* FAVORITE CATEGORIES */}
          {!isLogin && (
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Step 4: Pick Favorite Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => {
                  const selected = selectedCategories.includes(cat.slug);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.slug)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                        selected
                          ? 'bg-gradient-to-r from-indigo-600 to-cyan-400 text-white shadow-md'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {selected ? '✓ ' : ''}{cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-400 text-white font-black text-sm shadow-xl shadow-indigo-600/40 hover:scale-102 transition-all flex items-center justify-center gap-2"
          >
            {isLogin ? 'Sign In & Access Control Panel' : (selectedRole === 'creator' ? '🚀 Launch Broadcaster Channel' : 'Complete Setup & Open User Dashboard')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

      </div>
    </div>
  );
}
