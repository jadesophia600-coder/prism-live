import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStream } from '../../context/StreamContext';
import { useToast } from '../../context/ToastContext';
import { chatService } from '../../services/chatService';
import {
  Send, Smile, ShieldAlert, Trash2, Clock, Ban,
  Sparkles, Lock, MessageSquare, ChevronDown, Share2, Users, Radio, Link, Check
} from 'lucide-react';

export function LiveChat({ stream }) {
  const { user } = useAuth();
  const { triggerReaction } = useStream();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'viewers'
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeModMenuMsgId, setActiveModMenuMsgId] = useState(null);

  const streamId = stream?.id || 'live-broadcaster';
  const chatBottomRef = useRef(null);

  // Active Viewers List
  const activeViewers = [
    {
      id: user?.id || 'viewer-1',
      displayName: user?.displayName || 'Live Broadcaster',
      username: user?.username || 'broadcaster',
      avatar: user?.avatar,
      badge: 'Broadcaster',
      isOnline: true
    }
  ];

  // Subscribe to real-time pub-sub chat events
  useEffect(() => {
    const unsubscribe = chatService.subscribe(streamId, (event) => {
      if (event.type === 'NEW_MESSAGE') {
        setMessages(prev => [...prev, event.payload]);
      } else if (event.type === 'DELETE_MESSAGE') {
        setMessages(prev => prev.map(m => m.id === event.payload ? { ...m, isDeleted: true, message: '<Message deleted by moderator>' } : m));
      } else if (event.type === 'SYSTEM_NOTICE') {
        setMessages(prev => [...prev, {
          id: 'sys-' + Date.now(),
          user: 'SYSTEM',
          badge: 'Mod',
          message: event.payload,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          color: '#ef4444'
        }]);
      } else if (event.type === 'FLOATING_REACTION') {
        if (triggerReaction) triggerReaction(event.payload);
      }
    });

    return () => unsubscribe();
  }, [streamId, triggerReaction]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    chatService.sendMessage(streamId, {
      user: user?.displayName || 'User',
      badge: user?.role === 'creator' ? 'Broadcaster' : (user?.role === 'admin' ? 'Admin' : 'Viewer'),
      message: inputText.trim(),
      color: '#6366f1',
      avatar: user?.avatar
    });

    setInputText('');
  };

  const handleShareStreamLink = () => {
    const streamUrl = `${window.location.origin}/watch?streamId=${streamId}`;
    navigator.clipboard.writeText(streamUrl);
    setCopiedLink(true);

    // Share link directly to live chat comment section
    chatService.sendMessage(streamId, {
      user: user?.displayName || 'Broadcaster',
      badge: 'Broadcaster',
      message: `🔗 Live Broadcast Link: ${streamUrl}`,
      color: '#f59e0b'
    });

    addToast('Stream link copied to clipboard & posted to live chat comments!', 'success');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleEmojiClick = (emoji) => {
    setInputText(prev => prev + ' ' + emoji);
    chatService.sendReaction(streamId, emoji);
  };

  const EMOJI_LIST = ['🔥', '🚀', '💜', '⚡', '💯', '🎉', '🤯', '👑', '😎', '👏'];

  return (
    <div className="flex flex-col h-full glass-panel bg-slate-950/95 border border-slate-800 rounded-2xl overflow-hidden select-none shadow-2xl">
      
      {/* Top Header with Tabs & Share Link Button */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Chat
          </button>
          <button
            onClick={() => setActiveTab('viewers')}
            className={`px-3 py-1.5 rounded-lg font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'viewers' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" /> Viewers ({activeViewers.length})
          </button>
        </div>

        {/* Share Stream Link Button */}
        <button
          onClick={handleShareStreamLink}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
          title="Share live stream link to comments"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
          <span>{copiedLink ? 'Link Shared!' : 'Share Link'}</span>
        </button>
      </div>

      {/* CHAT TAB CONTENT */}
      {activeTab === 'chat' && (
        <>
          {/* Message Log List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-500">
                <MessageSquare className="w-8 h-8 text-slate-600 animate-pulse" />
                <p className="font-bold text-slate-400">Welcome to Live Chat!</p>
                <p className="text-[11px]">Type a comment below to start the conversation.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onMouseEnter={() => (user?.role === 'moderator' || user?.role === 'creator' || user?.role === 'admin') && setActiveModMenuMsgId(msg.id)}
                  onMouseLeave={() => setActiveModMenuMsgId(null)}
                  className="group relative flex items-start gap-2.5 hover:bg-slate-900/60 p-1.5 rounded-lg transition-colors"
                >
                  {/* User Badge */}
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold font-mono shrink-0 uppercase ${
                    msg.badge === 'Broadcaster' ? 'bg-amber-500 text-slate-950' :
                    msg.badge === 'Mod' ? 'bg-emerald-500 text-slate-950' :
                    msg.badge === 'VIP' ? 'bg-pink-500 text-white' :
                    'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {msg.badge}
                  </span>

                  {/* Username & Message */}
                  <div className="flex-1 min-w-0 leading-relaxed">
                    <span className="font-bold text-white mr-1.5" style={{ color: msg.color }}>
                      {msg.user}:
                    </span>
                    <span className={msg.isDeleted ? 'italic text-slate-500' : 'text-slate-200 font-normal break-words'}>
                      {msg.message}
                    </span>
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{msg.time}</span>

                  {/* Moderator Action Quick Menu */}
                  {activeModMenuMsgId === msg.id && (
                    <div className="absolute right-2 top-1 flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg p-1 shadow-lg z-20">
                      <button
                        onClick={() => chatService.deleteMessage(streamId, msg.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Emoji Reaction Shortcuts */}
          <div className="px-3 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between gap-1 overflow-x-auto">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> React:
            </span>
            <div className="flex items-center gap-1">
              {EMOJI_LIST.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-base hover:scale-125 transition-transform p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Comment Section Typing Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a comment to live stream..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold transition-all shadow-md shadow-indigo-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}

      {/* VIEWERS TAB CONTENT */}
      {activeTab === 'viewers' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" /> Live Viewers Currently Watching
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ● {activeViewers.length} Active
            </span>
          </div>

          <div className="space-y-2">
            {activeViewers.map(viewer => (
              <div key={viewer.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {viewer.avatar ? (
                      <img src={viewer.avatar} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500 flex items-center justify-center font-bold text-xs text-indigo-300">
                        {viewer.displayName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-white">{viewer.displayName}</p>
                    <p className="text-[10px] text-cyan-400 font-mono">@{viewer.username}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {viewer.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
