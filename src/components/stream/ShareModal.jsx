import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import {
  Copy, Code, Share2, Smartphone, QrCode, Mail, Check, ExternalLink,
  Globe, Sparkles
} from 'lucide-react';

// Brand SVG Icons
function WhatsAppIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.178-2.926-7.065A9.927 9.927 0 0012.012 2zm.003 17.064h-.003a8.28 8.28 0 01-4.225-1.154l-.303-.18-3.137.741.815-3.047-.197-.314a8.272 8.272 0 01-1.268-4.326c0-4.568 3.718-8.286 8.288-8.286 2.214 0 4.295.863 5.86 2.428a8.24 8.24 0 012.427 5.859c0 4.569-3.717 8.285-8.284 8.285zm4.542-6.208c-.249-.124-1.472-.726-1.7-.809-.228-.083-.394-.124-.56.124-.166.249-.643.809-.788.975-.145.166-.29.186-.539.062-.249-.124-1.053-.388-2.006-1.238-.742-.662-1.243-1.48-1.388-1.729-.145-.249-.015-.384.109-.507.112-.111.249-.29.373-.435.124-.145.166-.249.249-.415.083-.166.042-.311-.021-.435-.062-.124-.56-1.35-.767-1.848-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.85-.871 2.074 0 1.224.892 2.406 1.016 2.572.124.166 1.756 2.681 4.254 3.759.594.257 1.058.41 1.42.525.597.19 1.14.163 1.57.099.48-.072 1.472-.602 1.679-1.183.207-.581.207-1.079.145-1.183-.062-.104-.228-.166-.477-.29z"/>
    </svg>
  );
}

function TwitterXIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function FacebookIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function LinkedInIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
    </svg>
  );
}

function TelegramIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

function RedditIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.192-.491.95 0 1.72.771 1.72 1.72 0 .668-.382 1.247-.94 1.53.024.184.037.37.037.558 0 2.822-3.328 5.111-7.433 5.111-4.105 0-7.433-2.289-7.433-5.111 0-.188.013-.374.037-.558a1.714 1.714 0 0 1-.94-1.53c0-.949.77-1.72 1.72-1.72.462 0 .884.182 1.192.491 1.194-.856 2.85-1.418 4.674-1.488l.947-4.437a.256.256 0 0 1 .305-.197l3.056.643c.123-.338.448-.58.831-.58z"/>
    </svg>
  );
}

export function ShareModal({ isOpen, onClose, stream = null, customUrl = null, title = null }) {
  const { addToast } = useToast();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Compute share details dynamically
  const shareTitle = title || (stream ? `Watch "${stream.title}" on PRISM LIVE!` : 'PRISM LIVE - Next-Gen Creator & Streaming Platform');
  const shareText = stream
    ? `Catch ${stream.creator?.displayName || 'creator'} live streaming right now on PRISM LIVE!`
    : 'Join PRISM LIVE for ultra HD live streaming, interactive chats, and creator content!';
  
  const shareUrl = customUrl || (stream ? `${window.location.origin}?stream=${stream.id}` : window.location.href);
  const embedCode = `<iframe src="${shareUrl}${shareUrl.includes('?') ? '&' : '?'}embed=true" width="800" height="450" frameborder="0" allowfullscreen></iframe>`;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${shareTitle}\n${shareText}`);

  // Social Sharing Actions
  const shareTargets = [
    {
      name: 'WhatsApp',
      icon: WhatsAppIcon,
      bgColor: 'bg-[#25D366]/15 hover:bg-[#25D366]/25 border-[#25D366]/40 text-[#25D366]',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`
    },
    {
      name: 'X / Twitter',
      icon: TwitterXIcon,
      bgColor: 'bg-white/10 hover:bg-white/20 border-white/30 text-white',
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      bgColor: 'bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border-[#1877F2]/40 text-[#1877F2]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      name: 'Telegram',
      icon: TelegramIcon,
      bgColor: 'bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border-[#229ED9]/40 text-[#229ED9]',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
    },
    {
      name: 'LinkedIn',
      icon: LinkedInIcon,
      bgColor: 'bg-[#0A66C2]/15 hover:bg-[#0A66C2]/25 border-[#0A66C2]/40 text-[#0A66C2]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    {
      name: 'Reddit',
      icon: RedditIcon,
      bgColor: 'bg-[#FF4500]/15 hover:bg-[#FF4500]/25 border-[#FF4500]/40 text-[#FF4500]',
      url: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(shareTitle)}`
    },
    {
      name: 'Email',
      icon: Mail,
      bgColor: 'bg-rose-500/15 hover:bg-rose-500/25 border-rose-500/40 text-rose-400',
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
    }
  ];

  // Native Device Share (Web Share API)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        addToast('Shared successfully!', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl, 'Share link');
        }
      }
    } else {
      copyToClipboard(shareUrl, 'Share link');
    }
  };

  const copyToClipboard = (text, type) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    if (type.includes('Embed')) {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2500);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
    addToast(`${type} copied to clipboard!`, 'success');
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}&color=38bdf8&bgcolor=020617`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share PRISM LIVE">
      <div className="space-y-6 text-xs">
        
        {/* Banner Preview */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/20 flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Share2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white line-clamp-1">{shareTitle}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-1">{shareUrl}</p>
            </div>
          </div>
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all shrink-0 active:scale-95"
            title="Share via device app picker"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Device Share</span>
          </button>
        </div>

        {/* Social Platforms Grid */}
        <div>
          <label className="text-slate-300 font-bold mb-2.5 flex items-center gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Share directly to Social Media
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {shareTargets.map((platform) => {
              const IconComp = platform.icon;
              return (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all font-semibold ${platform.bgColor} active:scale-95`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span className="truncate text-xs">{platform.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Direct Link Input */}
        <div>
          <label className="text-slate-400 font-semibold mb-1.5 flex items-center justify-between">
            <span>Direct Website / Stream Link</span>
            <button
              onClick={() => setShowQR(!showQR)}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold text-[11px] transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              {showQR ? 'Hide QR Code' : 'Scan QR Code'}
            </button>
          </label>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500 selection:bg-indigo-600"
            />
            <button
              onClick={() => copyToClipboard(shareUrl, 'Link')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-extrabold text-xs text-white transition-all shadow-md ${
                copiedLink ? 'bg-emerald-600' : 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400'
              }`}
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* QR Code Card Display */}
          {showQR && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2 animate-in fade-in zoom-in-95">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
                <img
                  src={qrImageUrl}
                  alt="QR Code for Sharing"
                  className="w-40 h-40 object-contain rounded-lg"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Scan with mobile camera to open link on phone
              </p>
            </div>
          )}
        </div>

        {/* HTML Embed Code (for streams) */}
        <div>
          <label className="text-slate-400 font-semibold mb-1.5 block">HTML Embed Code (for Websites & Blogs)</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={embedCode}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-400 font-mono text-[11px]"
            />
            <button
              onClick={() => copyToClipboard(embedCode, 'Embed Code')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                copiedEmbed
                  ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              {copiedEmbed ? <Check className="w-4 h-4" /> : <Code className="w-4 h-4" />}
              <span>{copiedEmbed ? 'Copied' : 'Embed'}</span>
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
}

