import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, Grid, Heart, Radio, User, Sparkles } from 'lucide-react';

export function MobileBottomNav({ onNavigate, currentPage }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const handleGoLive = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    onNavigate('dashboard', { autoStartCamera: true });
  };

  const handleProfile = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    onNavigate('user-dashboard');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 px-2 py-1.5 flex items-center justify-around shadow-2xl select-none">
      {/* Home */}
      <button
        onClick={() => onNavigate('discover')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          currentPage === 'discover' || currentPage === 'landing'
            ? 'text-indigo-400 font-extrabold'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold">Home</span>
      </button>

      {/* Browse */}
      <button
        onClick={() => onNavigate('browse')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          currentPage === 'browse' || currentPage === 'category'
            ? 'text-cyan-400 font-extrabold'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] font-bold">Browse</span>
      </button>

      {/* Go Live Center Button */}
      <button
        onClick={handleGoLive}
        className="flex flex-col items-center justify-center -mt-5"
        title="Start Camera Broadcast"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 via-indigo-600 to-cyan-400 p-0.5 shadow-xl shadow-rose-600/40 active:scale-95 transition-transform flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
            <Radio className="w-6 h-6 text-rose-500 animate-pulse" />
          </div>
        </div>
        <span className="text-[9px] font-black tracking-wider uppercase text-rose-400 mt-0.5">Go Live</span>
      </button>

      {/* Following */}
      <button
        onClick={() => onNavigate('following')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          currentPage === 'following'
            ? 'text-rose-400 font-extrabold'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Heart className="w-5 h-5" />
        <span className="text-[10px] font-bold">Following</span>
      </button>

      {/* Profile / Account */}
      <button
        onClick={handleProfile}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          currentPage === 'user-dashboard' || currentPage === 'profile' || currentPage === 'dashboard'
            ? 'text-indigo-400 font-extrabold'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        {isAuthenticated && user?.avatar ? (
          <img
            src={user.avatar}
            alt=""
            className="w-5 h-5 rounded-full object-cover ring-2 ring-indigo-500/40"
          />
        ) : (
          <User className="w-5 h-5" />
        )}
        <span className="text-[10px] font-bold">{isAuthenticated ? 'Account' : 'Sign In'}</span>
      </button>
    </div>
  );
}
