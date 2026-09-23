import React from 'react';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { Copy, Code, Share2 } from 'lucide-react';

export function ShareModal({ isOpen, onClose, stream }) {
  const { addToast } = useToast();
  const shareUrl = window.location.origin + `?stream=${stream?.id}`;
  const embedCode = `<iframe src="${shareUrl}&embed=true" width="800" height="450" frameborder="0" allowfullscreen></iframe>`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    addToast(`${type} copied to clipboard!`, 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Live Stream">
      <div className="space-y-5 text-xs">
        
        <div>
          <label className="text-slate-400 font-semibold mb-1.5 block">Direct Stream URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 font-mono"
            />
            <button
              onClick={() => copyToClipboard(shareUrl, 'Stream Link')}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="text-slate-400 font-semibold mb-1.5 block">HTML Embed Code</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={embedCode}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 font-mono text-[10px]"
            />
            <button
              onClick={() => copyToClipboard(embedCode, 'Embed Code')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
}
