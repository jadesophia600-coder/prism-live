import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { chatService } from '../../services/chatService';
import { Coins, Heart, Send } from 'lucide-react';

export function TipModal({ isOpen, onClose, stream }) {
  const { addToast } = useToast();
  const [amount, setAmount] = useState('100');
  const [message, setMessage] = useState('Keep up the awesome stream! 🔥');

  const handleSendTip = (e) => {
    e.preventDefault();
    chatService.sendMessage(stream.id, {
      user: 'ViewerTip',
      badge: 'VIP',
      message: `[TIP $${amount}] ${message}`,
      color: '#f59e0b'
    });
    addToast(`Sent $${amount} tip to @${stream.creator.username}!`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Send Tip / Cheer Bits to ${stream?.creator.displayName}`}>
      <form onSubmit={handleSendTip} className="space-y-5">
        
        {/* Preset Amounts */}
        <div className="grid grid-cols-4 gap-2">
          {['5', '10', '25', '100'].map(val => (
            <button
              key={val}
              type="button"
              onClick={() => setAmount(val)}
              className={`py-2.5 rounded-xl font-mono font-bold text-sm border transition-all ${
                amount === val
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              ${val}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Custom Amount ($ USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Highlight Chat Alert Message</label>
          <textarea
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:scale-102 transition-all flex items-center justify-center gap-2"
        >
          <Coins className="w-4 h-4 fill-slate-950" />
          Send ${amount} Tip Alert
        </button>
      </form>
    </Modal>
  );
}
