import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Zap, Search, Bell, Video, User, Shield, Radio,
  Compass, Grid, LogOut, ChevronDown, Check, Menu, X, Sparkles,
  Home, Heart, Layers
} from 'lucide-react';

export function Navbar({ onNavigate, currentPage, onOpenAuth }) {
  const { user, switchRole, notifications, markNotificationAsRead } = useAuth();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('search', { q: searchQuery });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Primary Navigation */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('discover')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            title="PRISM LIVE Homepage"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
                PRISM<span className="text-cyan-400 font-black">.LIVE</span>
              </span>
            </div>
          </button>

          {/* Desktop Nav Links (Home, Following, Browse, Categories) */}
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

        {/* Center: Global Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search streams, creators, podcasts, music, sports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </form>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          
          {/* Quick Role Switcher Pill */}
          <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-slate-500 px-2 font-medium">Role:</span>
            {['viewer', 'creator', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => {
                  switchRole(role);
                  addToast(`Switched user role to ${role.toUpperCase()}`, 'info');
                }}
                className={`px-2.5 py-1 rounded-md font-semibold capitalize transition-all ${
                  user.role === role
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Go Live / Creator Studio Button */}
          {user.role === 'creator' || user.role === 'admin' ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Radio className="w-4 h-4 text-rose-300 animate-pulse" />
              Creator Studio
            </button>
          ) : (
            <button
              onClick={() => onNavigate('profile', { modal: 'upgrade' })}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              Start Streaming
            </button>
          )}

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

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800/60 transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
              />
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-64 glass-panel bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-slate-800 flex items-center gap-3">
                  <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold text-white">{user.displayName}</p>
                    <p className="text-xs text-indigo-400 font-mono">@{user.username}</p>
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

                  {user.role === 'creator' && (
                    <button
                      onClick={() => { setShowUserMenu(false); onNavigate('dashboard'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                    >
                      <Radio className="w-4 h-4 text-emerald-400" />
                      Creator Control Center
                    </button>
                  )}

                  {user.role === 'admin' && (
                    <button
                      onClick={() => { setShowUserMenu(false); onNavigate('admin'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      Admin Control Panel
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      addToast("Signed out of demo session", "info");
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 border-t border-slate-800 bg-slate-950 space-y-3 font-semibold text-sm text-slate-200">
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('discover'); }}
            className={`w-full flex items-center gap-3 py-2 ${currentPage === 'discover' ? 'text-indigo-400 font-bold' : ''}`}
          >
            <Home className="w-5 h-5" /> Home
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('browse'); }}
            className={`w-full flex items-center gap-3 py-2 ${currentPage === 'browse' ? 'text-cyan-400 font-bold' : ''}`}
          >
            <Grid className="w-5 h-5" /> Browse
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('following'); }}
            className={`w-full flex items-center gap-3 py-2 ${currentPage === 'following' ? 'text-rose-400 font-bold' : ''}`}
          >
            <Heart className="w-5 h-5 text-rose-400" /> Following
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('profile'); }}
            className="w-full flex items-center gap-3 py-2"
          >
            <User className="w-5 h-5 text-indigo-400" /> Profile
          </button>
        </div>
      )}
    </header>
  );
}
