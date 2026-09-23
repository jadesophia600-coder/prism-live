import React, { useState, useEffect, useRef } from 'react';
import { useStream } from '../../context/StreamContext';
import { StreamingService } from '../../services/streamingService';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings,
  Radio, Sparkles, Activity, Tv, Eye, Zap, Shield, Heart
} from 'lucide-react';

export function VideoPlayer({ stream }) {
  const { theaterMode, setTheaterMode, reactions } = useStream();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [quality, setQuality] = useState('1080p60');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [telemetry, setTelemetry] = useState(StreamingService.getStreamTelemetry());

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Update stream telemetry periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(StreamingService.getStreamTelemetry());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Canvas WebGL / Synth Stream Animation Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let tick = 0;

    const render = () => {
      tick += 0.03;
      const width = canvas.width = canvas.offsetWidth;
      const height = canvas.height = canvas.offsetHeight;

      // Dark background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, '#070a14');
      bgGradient.addColorStop(0.5, '#0e1526');
      bgGradient.addColorStop(1, '#05070d');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      if (isPlaying) {
        if (stream.streamType === 'synth-cyber') {
          // Cyberpunk Grid & Glowing Waves
          ctx.lineWidth = 2;
          for (let i = 0; i < 12; i++) {
            ctx.beginPath();
            ctx.strokeStyle = i % 2 === 0 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(6, 182, 212, 0.4)';
            for (let x = 0; x < width; x += 15) {
              const y = (height / 2) + Math.sin(x * 0.01 + tick + i) * (30 + i * 8);
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          }

          // Cyberpunk City Silhouette
          ctx.fillStyle = '#060a12';
          for (let b = 0; b < width; b += 40) {
            const bHeight = 80 + Math.sin(b + 1) * 50;
            ctx.fillRect(b, height - bHeight, 35, bHeight);
            // Window lights
            ctx.fillStyle = (b + Math.floor(tick * 5)) % 3 === 0 ? '#06b6d4' : '#6366f1';
            ctx.fillRect(b + 10, height - bHeight + 15, 6, 6);
          }

        } else if (stream.streamType === 'code-matrix') {
          // Live Code Rain Matrix
          ctx.font = '14px monospace';
          ctx.fillStyle = 'rgba(16, 185, 129, 0.85)';
          const columns = Math.floor(width / 20);
          for (let col = 0; col < columns; col++) {
            const char = String.fromCharCode(0x30A0 + Math.floor(Math.sin(col + tick) * 50));
            const y = ((tick * 40 + col * 30) % height);
            ctx.fillText(char, col * 20, y);
          }

          // Code overlay snippet box
          ctx.fillStyle = 'rgba(14, 21, 38, 0.85)';
          ctx.fillRect(width * 0.15, height * 0.2, width * 0.7, height * 0.6);
          ctx.strokeStyle = '#6366f1';
          ctx.strokeRect(width * 0.15, height * 0.2, width * 0.7, height * 0.6);

          ctx.fillStyle = '#38bdf8';
          ctx.font = '16px monospace';
          ctx.fillText(`import { PrismEngine } from '@prism/core';`, width * 0.18, height * 0.32);
          ctx.fillStyle = '#a7f3d0';
          ctx.fillText(`const stream = await PrismEngine.connectLive('${stream.creator.username}');`, width * 0.18, height * 0.42);
          ctx.fillStyle = '#f472b6';
          ctx.fillText(`console.log("Status: 1080p60 Live Broadcast");`, width * 0.18, height * 0.52);

        } else if (stream.streamType === 'music-equalizer') {
          // Audio Visualizer Equalizer Bars
          const barCount = 32;
          const barWidth = width / barCount - 4;
          for (let i = 0; i < barCount; i++) {
            const barHeight = Math.abs(Math.sin(tick * 2 + i * 0.3)) * (height * 0.55);
            const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
            grad.addColorStop(0, '#6366f1');
            grad.addColorStop(0.5, '#ec4899');
            grad.addColorStop(1, '#06b6d4');
            ctx.fillStyle = grad;
            ctx.fillRect(i * (barWidth + 4), height - barHeight, barWidth, barHeight);
          }

        } else {
          // Generic High Tech Particle Field
          ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
          for (let p = 0; p < 45; p++) {
            const px = (p * 40 + tick * 20) % width;
            const py = (height / 2) + Math.sin(p + tick) * 100;
            ctx.beginPath();
            ctx.arc(px, py, (p % 4) + 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, stream]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 group ${
        theaterMode ? 'rounded-none border-none' : ''
      }`}
    >
      {/* Interactive WebGL/Canvas Stream Background */}
      <canvas ref={canvasRef} className="w-full h-full object-cover block" />

      {/* Stream Paused Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
          <Play className="w-16 h-16 text-indigo-400 fill-indigo-400/20 mb-3 animate-pulse cursor-pointer" onClick={() => setIsPlaying(true)} />
          <p className="text-lg font-bold">Stream Broadcast Paused</p>
          <p className="text-xs text-slate-400">Click to resume live stream playback</p>
        </div>
      )}

      {/* Floating Reactions Canvas Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {reactions.map(r => (
          <div
            key={r.id}
            className="absolute bottom-12 text-3xl floating-emoji filter drop-shadow-lg"
            style={{ left: `${r.xPos}%` }}
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Stream Top Stats HUD */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600/90 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md shadow-lg badge-live-pulse">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            LIVE
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950/80 text-slate-100 font-mono text-xs font-bold border border-slate-800 backdrop-blur-md">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            {stream.viewerCount.toLocaleString()} Viewers
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-300 hover:text-cyan-300 font-mono text-xs font-semibold border border-slate-800 backdrop-blur-md transition-colors flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Stats
          </button>
        </div>
      </div>

      {/* Stream Technical Stats Panel Overlay */}
      {showStats && (
        <div className="absolute top-14 right-4 z-30 p-4 w-64 glass-panel bg-slate-950/90 border border-slate-800 rounded-2xl text-xs space-y-2 text-slate-300 font-mono shadow-2xl animate-in fade-in">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-indigo-400">Stream Health</span>
            <span className="text-emerald-400">EXCELLENT</span>
          </div>
          <div className="flex justify-between"><span>Resolution:</span><span className="text-white">{telemetry.resolution}</span></div>
          <div className="flex justify-between"><span>Frame Rate:</span><span className="text-white">{telemetry.fps} FPS</span></div>
          <div className="flex justify-between"><span>Bitrate:</span><span className="text-white">{telemetry.bitrateKbps} kbps</span></div>
          <div className="flex justify-between"><span>Audio Codec:</span><span className="text-white">{telemetry.codec}</span></div>
          <div className="flex justify-between"><span>Ingest Node:</span><span className="text-white">{telemetry.ingestNode}</span></div>
        </div>
      )}

      {/* HUD Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-4">
        
        {/* Left Controls: Play/Pause, Volume */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl text-white hover:bg-slate-800/80 transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
          </button>

          <div className="flex items-center gap-2 group/vol">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl text-white hover:bg-slate-800/80 transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        {/* Right Controls: Quality, Theater, Fullscreen */}
        <div className="flex items-center gap-2 relative">
          
          {/* Quality Selector */}
          <div className="relative">
            <button
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5 border border-slate-800"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              {quality}
            </button>

            {showQualityMenu && (
              <div className="absolute bottom-10 right-0 w-32 glass-panel bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-2xl z-40">
                {['1080p60', '720p60', '480p', 'Auto'].map(q => (
                  <button
                    key={q}
                    onClick={() => { setQuality(q); setShowQualityMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono ${
                      quality === q ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theater Mode Toggle */}
          <button
            onClick={() => setTheaterMode(!theaterMode)}
            className={`p-2 rounded-xl text-slate-300 hover:text-white transition-colors ${
              theaterMode ? 'bg-indigo-600/30 text-indigo-300' : 'hover:bg-slate-800/80'
            }`}
            title="Theater Mode"
          >
            <Tv className="w-5 h-5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
