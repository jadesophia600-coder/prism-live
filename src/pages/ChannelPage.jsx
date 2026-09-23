import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DBService } from '../services/dbService';
import { Sidebar } from '../components/common/Sidebar';
import { StreamCard } from '../components/cards/StreamCard';
import { ClipCard } from '../components/cards/ClipCard';
import { Footer } from '../components/common/Footer';
import { PAST_VODS, CLIPS } from '../data/mockData';
import {
  CheckCircle, Heart, Star, Users, Calendar, Video,
  MessageSquare, Globe, Twitter, Youtube, Disc as Discord
} from 'lucide-react';

export function ChannelPage({ onNavigate, onSelectStream, username }) {
  const { user, followCreator } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('live');

  const creator = DBService.getCreatorByUsername(username);
  const liveStream = DBService.getLiveStreams().find(s => s.creator.username.toLowerCase() === creator.username.toLowerCase());
  const isFollowing = user.followedCreatorIds.includes(creator.id);

  const handleFollow = () => {
    followCreator(creator.id);
    addToast(isFollowing ? `Unfollowed @${creator.username}` : `Following @${creator.username}!`, isFollowing ? 'info' : 'success');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <div className="flex flex-1">
        <Sidebar onNavigate={onNavigate} onSelectStream={onSelectStream} />

        <main className="flex-1 max-w-[1920px] mx-auto min-w-0 pb-12">
          
          {/* Channel Cover Banner */}
          <div className="relative h-48 sm:h-72 w-full bg-slate-900 overflow-hidden">
            <img src={creator.banner} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          </div>

          {/* Profile Header Info */}
          <div className="px-4 sm:px-8 -mt-16 relative z-10 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              
              {/* Avatar & Badges */}
              <div className="flex items-end gap-5">
                <img
                  src={creator.avatar}
                  alt={creator.displayName}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-slate-950 shadow-2xl bg-slate-900"
                />
                <div className="mb-2">
                  <h1 className="text-2xl sm:text-4xl font-black text-white flex items-center gap-2">
                    {creator.displayName}
                    {creator.verified && <CheckCircle className="w-6 h-6 text-indigo-400" />}
                  </h1>
                  <p className="text-sm font-mono text-cyan-400 font-bold">@{creator.username}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleFollow}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isFollowing
                      ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-rose-500/20 hover:text-rose-300'
                      : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-105'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFollowing ? 'fill-rose-500 text-rose-500' : ''}`} />
                  {isFollowing ? 'Following' : 'Follow Channel'}
                </button>
                <button
                  onClick={() => addToast("Subscribed to channel!", "success")}
                  className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-extrabold text-xs shadow-xl shadow-cyan-600/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4 fill-white" /> Subscribe ($4.99)
                </button>
              </div>

            </div>

            {/* Bio & Social Links */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              <div className="lg:col-span-8 space-y-3">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {creator.bio}
                </p>
                <div className="flex items-center gap-6 text-xs text-slate-400 font-mono">
                  <span><strong className="text-white">{(creator.followersCount / 1000).toFixed(1)}k</strong> Followers</span>
                  <span><strong className="text-white">{creator.subscribersCount.toLocaleString()}</strong> Subscribers</span>
                  <span className="text-indigo-400 font-bold uppercase">{creator.partnerTier} Partner</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pt-4 overflow-x-auto">
              {[
                { id: 'live', label: 'Live Stream' },
                { id: 'vods', label: 'Past Broadcasts (VODs)' },
                { id: 'clips', label: 'Clips & Highlights' },
                { id: 'schedule', label: 'Schedule' },
                { id: 'about', label: 'About Creator' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="pt-4">
              {activeTab === 'live' && (
                liveStream ? (
                  <div className="max-w-4xl">
                    <StreamCard stream={liveStream} onSelectStream={onSelectStream} />
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400 glass-panel rounded-3xl">
                    <p className="text-sm font-bold text-white">Creator is currently offline</p>
                    <p className="text-xs">Check out past broadcasts or clips below.</p>
                  </div>
                )
              )}

              {activeTab === 'vods' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {PAST_VODS.map(vod => (
                    <div key={vod.id} className="glass-panel p-3 rounded-2xl space-y-2">
                      <img src={vod.thumbnail} alt="" className="w-full aspect-video rounded-xl object-cover" />
                      <h4 className="text-xs font-bold text-white">{vod.title}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{vod.duration} • {vod.views} views</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'clips' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CLIPS.map(clip => (
                    <ClipCard key={clip.id} clip={clip} />
                  ))}
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="glass-panel p-6 rounded-3xl space-y-4 max-w-2xl">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" /> Weekly Broadcast Schedule
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-3 rounded-xl bg-slate-900"><span>Monday</span><span className="text-indigo-400 font-mono">19:00 UTC - Cyberpunk Marathon</span></div>
                    <div className="flex justify-between p-3 rounded-xl bg-slate-900"><span>Wednesday</span><span className="text-indigo-400 font-mono">19:00 UTC - AI Live Coding</span></div>
                    <div className="flex justify-between p-3 rounded-xl bg-slate-900"><span>Friday</span><span className="text-indigo-400 font-mono">21:00 UTC - Synthwave DJ Night</span></div>
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="glass-panel p-6 rounded-3xl space-y-4 max-w-2xl">
                  <h3 className="text-sm font-extrabold text-white">About {creator.displayName}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{creator.bio}</p>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
