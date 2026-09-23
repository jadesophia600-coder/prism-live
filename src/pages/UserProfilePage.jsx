import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { Modal } from '../components/common/Modal';
import { CREATORS, LIVE_STREAMS } from '../data/mockData';
import {
  User, Heart, Star, Sparkles, Shield, Radio,
  Settings, CheckCircle, ArrowRight
} from 'lucide-react';

export function UserProfilePage({ onNavigate, initialModal }) {
  const { user, upgradeToCreator } = useAuth();
  const { addToast } = useToast();
  const [showUpgradeModal, setShowUpgradeModal] = useState(initialModal === 'upgrade');

  const followedCreators = CREATORS.filter(c => user.followedCreatorIds.includes(c.id));

  const handleConfirmUpgrade = () => {
    upgradeToCreator();
    addToast('Congratulations! Your channel has been upgraded to CREATOR status!', 'success');
    setShowUpgradeModal(false);
    onNavigate('dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      
      {/* Upgrade to Creator Modal */}
      <Modal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} title="Upgrade to Creator Channel">
        <div className="space-y-5 text-center">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>

          <h3 className="text-xl font-black text-white">Start Your Broadcasting Journey</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Upgrading your account grants you immediate access to your Stream Key, RTMP ingest servers, Creator Studio Analytics, and 85% revenue monetization split!
          </p>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle className="w-4 h-4" /> Dedicated RTMP Ingest Endpoint
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle className="w-4 h-4" /> 85 / 15 Revenue Split on Subscriptions & Bits
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle className="w-4 h-4" /> OBS & Streamlabs Direct Integration
            </div>
          </div>

          <button
            onClick={handleConfirmUpgrade}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-400 text-white font-black text-sm shadow-xl shadow-indigo-600/30 hover:scale-102 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Activate Creator Account Now
          </button>
        </div>
      </Modal>

      <div className="flex flex-1">
        <Sidebar onNavigate={onNavigate} />

        <main className="flex-1 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8 min-w-0">
          
          {/* User Profile Card */}
          <div className="glass-panel bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={user.avatar}
                alt=""
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-indigo-500/40 shadow-2xl"
              />
              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{user.displayName}</h1>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-xs font-bold capitalize">
                    {user.role} Role
                  </span>
                </div>
                <p className="text-xs font-mono text-cyan-400 font-bold">@{user.username}</p>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">{user.bio}</p>
              </div>

              {user.role === 'viewer' && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all"
                >
                  Become a Creator
                </button>
              )}
            </div>
          </div>

          {/* Followed Creators Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
              Followed Creators ({followedCreators.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {followedCreators.map(cr => (
                <div
                  key={cr.id}
                  onClick={() => onNavigate('channel', { username: cr.username })}
                  className="glass-panel p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-indigo-500/40 transition-all"
                >
                  <img src={cr.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{cr.displayName}</p>
                    <p className="text-xs text-slate-400 truncate">{(cr.followersCount / 1000).toFixed(1)}k Followers</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
