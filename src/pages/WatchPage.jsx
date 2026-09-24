import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/StreamContext';
import { useToast } from '../context/ToastContext';
import { VideoPlayer } from '../components/stream/VideoPlayer';
import { LiveChat } from '../components/stream/LiveChat';
import { SubscribeModal } from '../components/stream/SubscribeModal';
import { TipModal } from '../components/stream/TipModal';
import { ShareModal } from '../components/stream/ShareModal';
import { Sidebar } from '../components/common/Sidebar';
import { ClipCard } from '../components/cards/ClipCard';
import { CLIPS } from '../data/mockData';
import {
  Heart, Star, Coins, Share2, CheckCircle, Eye, Users,
  Sparkles, Radio, MessageSquare, ChevronDown, Flag, Scissors
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export function WatchPage({ onNavigate, stream }) {
  const { user, followCreator } = useAuth();
  const { theaterMode } = useStream();
  const { addToast } = useToast();

  const [showSubModal, setShowSubModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showClipModal, setShowClipModal] = useState(false);
  const [clipTitle, setClipTitle] = useState(`${stream?.title || 'Live Stream'} - Highlight Clip`);
  const [showDetails, setShowDetails] = useState(true);

  const isFollowing = (user?.followedCreatorIds || []).includes(stream?.creator?.id);
  const isSubscribed = (user?.subscriptions || []).includes(stream?.creator?.id);

  const handleFollowToggle = () => {
    followCreator(stream.creator.id);
    addToast(isFollowing ? `Unfollowed @${stream.creator.username}` : `Following @${stream.creator.username}!`, isFollowing ? 'info' : 'success');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      
      {/* Modals */}
      <SubscribeModal isOpen={showSubModal} onClose={() => setShowSubModal(false)} creator={stream.creator} />
      <TipModal isOpen={showTipModal} onClose={() => setShowTipModal(false)} stream={stream} />
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} stream={stream} />

      <div className="flex flex-1">
        {!theaterMode && <Sidebar onNavigate={onNavigate} onSelectStream={(s) => onNavigate('watch', { streamId: s.id })} activeStreamId={stream.id} />}

        <main className={`flex-1 p-3 sm:p-5 lg:p-6 min-w-0 ${theaterMode ? 'max-w-none p-0' : 'max-w-[1920px] mx-auto'}`}>
          
          {/* Main Dual Pane Layout: Player Left | Chat Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full items-start">
            
            {/* Video Player Column */}
            <div className={`${theaterMode ? 'lg:col-span-9' : 'lg:col-span-8 xl:col-span-9'} space-y-5`}>
              <VideoPlayer stream={stream} />

              {/* Stream Details Header Bar */}
              <div className="glass-panel bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-5 shadow-2xl">
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  
                  {/* Creator Avatar & Title */}
                  <div className="flex items-start gap-4">
                    <img
                      src={stream.creator.avatar}
                      alt={stream.creator.displayName}
                      onClick={() => onNavigate('channel', { username: stream.creator.username })}
                      className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-500/30 cursor-pointer hover:ring-indigo-400 transition-all shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <h1 className="text-lg sm:text-xl font-extrabold text-white leading-snug line-clamp-2">
                        {stream.title}
                      </h1>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                        <span
                          onClick={() => onNavigate('channel', { username: stream.creator.username })}
                          className="font-extrabold text-white hover:text-indigo-300 cursor-pointer flex items-center gap-1"
                        >
                          {stream.creator.displayName}
                          {stream.creator.verified && <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span
                          onClick={() => onNavigate('browse', { categorySlug: stream.category.slug })}
                          className="font-semibold text-cyan-400 hover:underline cursor-pointer"
                        >
                          {stream.category.name}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="font-mono text-slate-400">{(stream.creator.followersCount / 1000).toFixed(1)}k Followers</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Follow, Subscribe, Tip, Share */}
                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
                    <button
                      onClick={handleFollowToggle}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                        isFollowing
                          ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-rose-500/20 hover:text-rose-300'
                          : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-105'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFollowing ? 'fill-rose-500 text-rose-500' : ''}`} />
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>

                    <button
                      onClick={() => setShowSubModal(true)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                        isSubscribed
                          ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
                          : 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-lg shadow-cyan-600/30 hover:scale-105'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                      {isSubscribed ? 'Subscribed ★' : 'Subscribe'}
                    </button>

                    <button
                      onClick={() => setShowClipModal(true)}
                      className="px-3.5 py-2.5 rounded-xl bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 border border-pink-500/40 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Scissors className="w-4 h-4" /> Clip 30s
                    </button>

                    <button
                      onClick={() => setShowTipModal(true)}
                      className="px-3.5 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Coins className="w-4 h-4" /> Tip Bits
                    </button>

                    <button
                      onClick={() => setShowShareModal(true)}
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      title="Share stream"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Clip Stream Modal */}
                <Modal isOpen={showClipModal} onClose={() => setShowClipModal(false)} title="Create Highlight Clip (30s)">
                  <div className="space-y-4 p-1">
                    <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative group">
                      <img src={stream?.thumbnail} alt="" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-pink-600 font-mono font-bold text-[10px] text-white">
                        0:00 - 0:30
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-1 block">Clip Title</label>
                      <input
                        type="text"
                        value={clipTitle}
                        onChange={(e) => setClipTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-pink-500 font-bold"
                      />
                    </div>

                    <button
                      onClick={() => {
                        addToast(`🎉 Highlight Clip created & copied to clipboard!`, 'success');
                        setShowClipModal(false);
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 text-white font-black text-xs shadow-lg shadow-pink-600/30 hover:scale-102 transition-all flex items-center justify-center gap-2"
                    >
                      <Scissors className="w-4 h-4" /> Publish Highlight Clip
                    </button>
                  </div>
                </Modal>

                {/* Tags & Collapsible Description */}
                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {stream.tags.map((t, idx) => (
                      <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-950 text-indigo-300 border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {stream.description}
                  </p>
                </div>

              </div>

              {/* Stream Highlights & Clips Section */}
              <div className="space-y-4 pt-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" /> Recent Clips from this Stream
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CLIPS.map(clip => (
                    <ClipCard key={clip.id} clip={clip} />
                  ))}
                </div>
              </div>

            </div>

            {/* Live Chat Column */}
            <div className={`${theaterMode ? 'lg:col-span-3' : 'lg:col-span-4 xl:col-span-3'} h-[calc(100vh-6rem)] sticky top-20`}>
              <LiveChat stream={stream} />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
