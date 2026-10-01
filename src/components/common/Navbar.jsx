import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShareModal } from '../stream/ShareModal';
import {
  Zap, Search, Bell, Video, User, Shield, Radio,
  Compass, Grid, LogOut, ChevronDown, Check, Menu, X, Sparkles,
  Home, Heart, Layers, Share2, Trophy
} from 'lucide-react';

export function Navbar({ onNavigate, currentPage, onOpenAuth }) {
  const { user, isAuthenticated, openAuthModal, notifications, markNotificationAsRead, signOutUser } = useAuth();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('search', { q: searchQuery });
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl select-none">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand & Desktop Primary Navigation */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <button
            onClick={() => onNavigate('discover')}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            title="PRISM LIVE Homepage"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-lg sm:text-xl tracking-wider bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
                PRISM<span className="text-cyan-400 font-black">.LIVE</span>
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            <button
              onClick={() => onNavigate('discover')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'discover' || currentPage === 'landing'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold shadow-md shadow-indigo-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home className={`w-4 h-4 ${currentPage === 'discover' || currentPage === 'landing' ? 'text-indigo-400' : 'text-slate-400'}`} />
              Home
            </button>
            <button
              onClick={() => onNavigate('following')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'following'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              Following
            </button>
            <button
              onClick={() => onNavigate('browse')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'browse'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Grid className="w-4 h-4 text-cyan-400" />
              Browse
            </button>
          </nav>
        </div>

        {/* Center: Global Search Bar (Desktop) */}
        <div className="hidden sm:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search streams, creators, podcasts, music, sports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </form>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="sm:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Go Live Button for Desktop / Tablet */}
          {isAuthenticated && (
            <button
              onClick={() => onNavigate('dashboard', { autoStartCamera: true })}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-lg shadow-rose-600/30 transition-all hover:scale-105 group"
              title="Start Live Broadcast"
            >
              <Radio className="w-4 h-4 text-white animate-pulse" />
              <span className="hidden md:inline">Go Live</span>
            </button>
          )}

          {/* Share Website Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-cyan-500/40 font-semibold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            title="Share Website"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-950" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    Notifications
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {unreadCount} New
                  </span>
                </div>
                <div className="py-2 max-h-72 overflow-y-auto space-y-2">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-colors ${
                        n.read ? 'bg-slate-900/40 text-slate-400' : 'bg-slate-800/70 border border-indigo-500/20 text-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1">
                        <span className="text-indigo-400 font-semibold capitalize">{n.type.replace('_', ' ')}</span>
                        <span>{n.time}</span>
                      </div>
                      <p className="text-xs font-bold text-white mb-0.5">{n.title}</p>
                      <p className="text-xs text-slate-300">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu or Sign In Gate Button */}
          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal()}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-400 text-white font-black text-xs shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-800/60 transition-colors"
              >
                <img
                  src={user?.avatar}
                  alt={user?.displayName || 'User'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
                />
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-64 glass-panel bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-slate-800 flex items-center gap-3">
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
                      <p className="text-xs text-indigo-400 font-mono truncate">@{user.username}</p>
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    <button
                      onClick={() => { setShowUserMenu(false); onNavigate('user-dashboard'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      User Dashboard
                    </button>

                    <button
                      onClick={() => { setShowUserMenu(false); onNavigate('dashboard'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                    >
                      <Radio className="w-4 h-4 text-rose-400" />
                      Creator Studio
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOutUser();
                        addToast("Signed out of PRISM LIVE", "info");
                        onNavigate('discover');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Expandable Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="sm:hidden p-3 bg-slate-950 border-t border-slate-800 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              placeholder="Search streams, creators, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </form>
        </div>
      )}

      {/* Full Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 border-t border-slate-800 bg-slate-950 space-y-3 font-semibold text-xs text-slate-200 animate-in slide-in-from-top-2">
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('discover'); }}
            className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl ${currentPage === 'discover' ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30' : 'hover:bg-slate-900'}`}
          >
            <Home className="w-4 h-4 text-indigo-400" /> Home Discover
          </button>

          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('browse'); }}
            className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl ${currentPage === 'browse' ? 'bg-cyan-600/20 text-cyan-300 font-bold border border-cyan-500/30' : 'hover:bg-slate-900'}`}
          >
            <Grid className="w-4 h-4 text-cyan-400" /> Browse Categories
          </button>

          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('following'); }}
            className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl ${currentPage === 'following' ? 'bg-rose-600/20 text-rose-300 font-bold border border-rose-500/30' : 'hover:bg-slate-900'}`}
          >
            <Heart className="w-4 h-4 text-rose-400" /> Following Channels
          </button>

          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('search', { q: 'creators' }); }}
            className="w-full flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-slate-900 text-purple-300"
          >
            <Trophy className="w-4 h-4 text-purple-400" /> Top Broadcasters
          </button>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('user-dashboard'); }}
                className="w-full flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-slate-900 text-indigo-300"
              >
                <User className="w-4 h-4 text-indigo-400" /> User Dashboard
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('dashboard', { autoStartCamera: true }); }}
                className="w-full flex items-center gap-3 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold"
              >
                <Radio className="w-4 h-4 text-white animate-pulse" /> Go Live Now
              </button>
            </>
          ) : (
            <button
              onClick={() => { setMobileMenuOpen(false); openAuthModal(); }}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-400 text-white font-black"
            >
              <User className="w-4 h-4" /> Sign In / Create Account
            </button>
          )}

          <button
            onClick={() => { setMobileMenuOpen(false); setShowShareModal(true); }}
            className="w-full flex items-center gap-3 py-2 px-3 rounded-xl text-cyan-400 font-bold hover:bg-slate-900"
          >
            <Share2 className="w-4 h-4 text-cyan-400" /> Share PRISM LIVE Website
          </button>
        </div>
      )}

      {/* Global Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="PRISM LIVE - Next-Gen Creator & Streaming Platform"
        customUrl={window.location.origin}
      />
    </header>
  );
}
