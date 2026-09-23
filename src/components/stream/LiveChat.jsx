import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStream } from '../../context/StreamContext';
import { chatService } from '../../services/chatService';
import { INITIAL_CHAT_MESSAGES } from '../../data/mockData';
import {
  Send, Smile, ShieldAlert, Trash2, Clock, Ban,
  Sparkles, Lock, MessageSquare, ChevronDown
} from 'lucide-react';

export function LiveChat({ stream }) {
  const { user } = useAuth();
  const { triggerReaction } = useStream();
  const [messages, setMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [activeModMenuMsgId, setActiveModMenuMsgId] = useState(null);

  // Chat settings states
  const [slowMode, setSlowMode] = useState(false);
  const [subOnly, setSubOnly] = useState(false);
  const chatBottomRef = useRef(null);

  // Subscribe to real-time pub-sub chat events
  useEffect(() => {
    const unsubscribe = chatService.subscribe(stream.id, (event) => {
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
        triggerReaction(event.payload);
      }
    });

    return () => unsubscribe();
  }, [stream.id, triggerReaction]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    chatService.sendMessage(stream.id, {
      user: user.displayName,
      badge: user.role === 'creator' ? 'Broadcaster' : (user.role === 'moderator' ? 'Mod' : 'Sub 12 Mo'),
      message: inputText.trim(),
      color: '#6366f1'
    });

    setInputText('');
  };

  const handleEmojiClick = (emoji) => {
    setInputText(prev => prev + ' ' + emoji);
    chatService.sendReaction(stream.id, emoji);
  };

  const EMOJI_LIST = ['🔥', '🚀', '💜', '⚡', '💯', '🎉', '🤯', '👑', '😎', '👏'];

  return (
    <div className="flex flex-col h-full glass-panel bg-slate-950/95 border border-slate-800 rounded-2xl overflow-hidden select-none">
      
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-extrabold text-white tracking-wider uppercase">Live Stream Chat</h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          {slowMode && <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">Slow (5s)</span>}
          {subOnly && <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">Sub-Only</span>}
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            onMouseEnter={() => (user.role === 'moderator' || user.role === 'creator' || user.role === 'admin') && setActiveModMenuMsgId(msg.id)}
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
              <span className={msg.isDeleted ? 'italic text-slate-500' : 'text-slate-200 font-normal'}>
                {msg.message}
              </span>
            </div>

            {/* Timestamp */}
            <span className="text-[10px] text-slate-400 font-mono shrink-0">{msg.time}</span>

            {/* Moderator Action Quick Menu */}
            {activeModMenuMsgId === msg.id && (
              <div className="absolute right-2 top-1 flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg p-1 shadow-lg z-20">
                <button
                  onClick={() => chatService.deleteMessage(stream.id, msg.id)}
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => chatService.timeoutUser(stream.id, msg.user, 5)}
                  className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                  title="Timeout user 5m"
                >
                  <Clock className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => chatService.banUser(stream.id, msg.user)}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Ban user"
                >
                  <Ban className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      {/* Floating Emoji Bar */}
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

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
        <input
          type="text"
          placeholder="Send a live message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md shadow-indigo-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
