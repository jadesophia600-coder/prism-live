import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Check, Star, ShieldCheck, Sparkles } from 'lucide-react';

export function SubscribeModal({ isOpen, onClose, creator }) {
  const { subscribeToCreator } = useAuth();
  const { addToast } = useToast();
  const [selectedTier, setSelectedTier] = useState('tier1');

  const TIERS = [
    { id: 'tier1', name: 'Tier 1 Sub', price: '$4.99 / mo', perks: ['Custom Channel Badge', 'Ad-Free Viewing', 'Subscriber-Only Chat Access'] },
    { id: 'tier2', name: 'Tier 2 Sub', price: '$9.99 / mo', perks: ['All Tier 1 Perks', '+5 Animated Emotes', 'Multiplier Channel Points (1.2x)'] },
    { id: 'tier3', name: 'Tier 3 Sub', price: '$24.99 / mo', perks: ['All Tier 2 Perks', 'Exclusive VIP Role', 'Multiplier Channel Points (2.0x)'] }
  ];

  const handleSubscribe = () => {
    subscribeToCreator(creator.id);
    addToast(`Subscribed to ${creator.displayName} (${selectedTier.toUpperCase()})!`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Subscribe to ${creator?.displayName}`}>
      <div className="space-y-6">
        
        {/* Creator Info Header */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <img src={creator?.avatar} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500" />
          <div>
            <p className="text-sm font-bold text-white">{creator?.displayName}</p>
            <p className="text-xs text-indigo-400">Support your favorite creator & unlock perks</p>
          </div>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 gap-3">
          {TIERS.map(tier => (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedTier === tier.id
                  ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Star className={`w-4 h-4 ${selectedTier === tier.id ? 'text-indigo-400 fill-indigo-400' : 'text-slate-500'}`} />
                  {tier.name}
                </span>
                <span className="font-mono font-bold text-indigo-300 text-sm">{tier.price}</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                {tier.perks.map((p, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Subscribe Action Button */}
        <button
          onClick={handleSubscribe}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:scale-102 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Complete Subscription
        </button>
      </div>
    </Modal>
  );
}
