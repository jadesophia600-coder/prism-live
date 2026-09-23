import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CheckCircle, Heart, Users, Sparkles } from 'lucide-react';

export function CreatorCard({ creator, onSelectCreator }) {
  const { user, followCreator } = useAuth();
  const { addToast } = useToast();

  if (!creator) return null;

  const isFollowing = (user?.followedCreatorIds || []).includes(creator.id);

  const handleFollowToggle = (e) => {
    e.stopPropagation();
    followCreator(creator.id);
    addToast(isFollowing ? `Unfollowed @${creator.username}` : `Following @${creator.username}!`, isFollowing ? 'info' : 'success');
  };

  return (
    <div
      onClick={() => onSelectCreator && onSelectCreator(creator)}
      className="group relative flex flex-col items-center text-center p-6 rounded-3xl glass-panel bg-slate-900/60 border border-slate-800/80 cursor-pointer hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Banner Backdrop */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-slate-950 rounded-t-3xl overflow-hidden opacity-60">
        <img src={creator.banner} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>

      {/* Avatar */}
      <div className="relative mt-6 mb-3">
        <img
          src={creator.avatar}
          alt={creator.displayName}
          className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-900 group-hover:ring-indigo-500 transition-all shadow-xl"
        />
        {creator.verified && (
          <div className="absolute bottom-0 right-0 p-1 bg-indigo-600 rounded-full text-white ring-2 ring-slate-900">
            <CheckCircle className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Details */}
      <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors">
        {creator.displayName}
      </h3>
      <p className="text-xs font-mono text-cyan-400 mb-2">@{creator.username}</p>

      <p className="text-xs text-slate-400 line-clamp-2 mb-4 px-2 leading-relaxed">
        {creator.bio}
      </p>

      {/* Followers stats */}
      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-4">
        <Users className="w-3.5 h-3.5 text-indigo-400" />
        <span className="font-bold text-white font-mono">{creator.followersCount ? (creator.followersCount / 1000).toFixed(1) : 0}k</span> Followers
      </div>

      {/* Follow CTA */}
      <button
        onClick={handleFollowToggle}
        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
          isFollowing
            ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40'
            : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-102'
        }`}
      >
        <Heart className={`w-3.5 h-3.5 ${isFollowing ? 'fill-rose-500 text-rose-500' : ''}`} />
        {isFollowing ? 'Following' : 'Follow Channel'}
      </button>
    </div>
  );
}
