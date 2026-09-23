import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LIVE_STREAMS, CREATORS } from '../data/mockData';
import { StreamCard } from '../components/cards/StreamCard';
import { CreatorCard } from '../components/cards/CreatorCard';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { Heart, Radio, Users } from 'lucide-react';

export function FollowingPage({ onNavigate, onSelectStream }) {
  const { user } = useAuth();

  const followedCreatorIds = user?.followedCreatorIds || [];
  const followedStreams = LIVE_STREAMS.filter(s => s.creator && followedCreatorIds.includes(s.creator.id));
  const followedCreators = CREATORS.filter(c => followedCreatorIds.includes(c.id));

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <div className="flex flex-1">
        <Sidebar onNavigate={onNavigate} onSelectStream={onSelectStream} currentPage="following" />

        <main className="flex-1 max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8 min-w-0">
          
          {/* Header */}
          <div className="space-y-2 border-b border-slate-800 pb-6">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500/20" />
              Following Channels
            </h1>
            <p className="text-xs text-slate-400">Live streams and updates from creators you follow</p>
          </div>

          {/* Followed Streams Live Now */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
              Followed Creators Live Now ({followedStreams.length})
            </h2>

            {followedStreams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {followedStreams.map(stream => (
                  <StreamCard
                    key={stream.id}
                    stream={stream}
                    onSelectStream={onSelectStream}
                    onSelectCategory={(cat) => onNavigate('category', { categorySlug: cat.slug })}
                    onSelectCreator={(cr) => onNavigate('channel', { username: cr.username })}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 glass-panel rounded-3xl space-y-2">
                <p className="text-base font-bold text-white">None of your followed creators are live right now.</p>
                <p className="text-xs">Explore recommended channels on the Home page to follow more creators!</p>
              </div>
            )}
          </div>

          {/* Followed Creators List */}
          <div className="space-y-4 pt-4 border-t border-slate-900">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> All Followed Broadcasters ({followedCreators.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {followedCreators.map(cr => (
                <CreatorCard key={cr.id} creator={cr} onSelectCreator={(c) => onNavigate('channel', { username: c.username })} />
              ))}
            </div>
          </div>

        </main>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
