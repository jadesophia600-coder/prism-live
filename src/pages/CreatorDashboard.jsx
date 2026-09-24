import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LiveChat } from '../components/stream/LiveChat';
import {
  Radio, Video, VideoOff, Mic, MicOff, Camera, PhoneOff,
  AlertCircle, Users, Sparkles, MessageSquare, Share2
} from 'lucide-react';

export function CreatorDashboard({ onNavigate, autoStartCamera = false }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const videoRef = useRef(null);

  // Streaming & Camera State
  const [isLive, setIsLive] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [streamDuration, setStreamDuration] = useState(0);

  // Auto-start camera if triggered from navbar "Go Live" button
  useEffect(() => {
    if (autoStartCamera && !isLive && !mediaStream) {
      startCameraFeed();
    }
  }, [autoStartCamera]);

  // Broadcast timer effect
  useEffect(() => {
    let interval = null;
    if (isLive) {
      interval = setInterval(() => {
        setStreamDuration(prev => prev + 1);
      }, 1000);
    } else {
      setStreamDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  // Format seconds to HH:MM:SS
  const formatTime = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [hrs, mins, s].map(v => v < 10 ? '0' + v : v).join(':');
  };

  const startCameraFeed = async () => {
    setIsCameraLoading(true);
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser does not support WebRTC media capture.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: true
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsLive(true);
      addToast('🎥 Live WebRTC Camera Connected & Streaming Active!', 'success');
    } catch (err) {
      console.error("Camera access error:", err);
      const msg = err.name === 'NotAllowedError'
        ? 'Camera/Microphone permission was denied by browser. Please allow access in browser settings.'
        : err.message || 'Could not access live camera hardware.';
      setCameraError(msg);
      addToast(msg, 'error');
    } finally {
      setIsCameraLoading(false);
    }
  };

  const stopCameraFeed = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsLive(false);
    addToast('🛑 Live Stream Broadcast Ended.', 'info');
  };

  const toggleMic = () => {
    if (mediaStream) {
      const audioTracks = mediaStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicMuted(!isMicMuted);
      addToast(isMicMuted ? 'Microphone Unmuted' : 'Microphone Muted', 'info');
    }
  };

  const toggleVideo = () => {
    if (mediaStream) {
      const videoTracks = mediaStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoMuted(!isVideoMuted);
      addToast(isVideoMuted ? 'Camera Feed Enabled' : 'Camera Feed Muted', 'info');
    }
  };

  const currentStreamObj = {
    id: user?.username || 'live-broadcaster',
    title: `${user?.displayName || 'Creator'}'s Live Broadcast`,
    creator: {
      id: user?.id,
      displayName: user?.displayName,
      username: user?.username,
      avatar: user?.avatar
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Studio Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 text-white shadow-lg shadow-rose-600/30">
            <Radio className={`w-6 h-6 ${isLive ? 'animate-pulse text-white' : ''}`} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              Creator Live Studio
            </h1>
            <p className="text-xs text-slate-400">Broadcast live instantly with your camera, microphone, & live chat</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLive ? (
            <button
              onClick={stopCameraFeed}
              className="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/40 transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              END BROADCAST
            </button>
          ) : (
            <button
              onClick={startCameraFeed}
              disabled={isCameraLoading}
              className="px-6 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white shadow-lg shadow-rose-600/30 hover:scale-105 transition-all"
            >
              <Camera className="w-4 h-4 animate-pulse" />
              {isCameraLoading ? 'INITIALIZING CAMERA...' : 'START LIVE CAMERA'}
            </button>
          )}
        </div>
      </header>

      {/* Main Studio Workspace Grid */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Video Camera Screen Column (Left / Top) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group flex items-center justify-center">
              
              {/* WebRTC HTML5 Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isVideoMuted || !isLive ? 'hidden' : 'block'}`}
              />

              {/* Video Off Fallback State */}
              {isLive && isVideoMuted && (
                <div className="flex flex-col items-center justify-center space-y-3 p-6 text-center">
                  <div className="relative">
                    <img
                      src={user?.avatar}
                      alt={user?.displayName}
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-rose-500/50"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                      <VideoOff className="w-8 h-8 text-rose-400" />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-300">Camera Video Paused</p>
                </div>
              )}

              {/* Inactive Camera Screen (When Not Live) */}
              {!isLive && (
                <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center bg-gradient-to-b from-slate-900/80 to-slate-950">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-slate-800/80 border-2 border-indigo-500/40 flex items-center justify-center shadow-xl overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-10 h-10 text-indigo-400" />
                      )}
                    </div>
                  </div>

                  <div className="max-w-md">
                    <h3 className="text-lg font-extrabold text-white mb-1">Live Camera Ready</h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Click the button below to turn on your device camera and microphone to start broadcasting live to your viewers.
                    </p>

                    <button
                      onClick={startCameraFeed}
                      disabled={isCameraLoading}
                      className="px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-rose-600/40 hover:scale-105 transition-all flex items-center justify-center gap-2.5 mx-auto"
                    >
                      <Camera className="w-5 h-5 text-white animate-pulse" />
                      {isCameraLoading ? 'Opening Camera...' : 'Turn On Camera & Go Live'}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Alert Overlay */}
              {cameraError && (
                <div className="absolute top-4 left-4 right-4 bg-rose-950/90 border border-rose-500/50 p-4 rounded-2xl flex items-start gap-3 backdrop-blur-md text-xs text-rose-200 z-20">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white mb-0.5">Camera Access Required</p>
                    <p>{cameraError}</p>
                  </div>
                </div>
              )}

              {/* Live Status Header Overlay */}
              {isLive && (
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-lg shadow-lg badge-live-pulse">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      ● LIVE
                    </span>
                    <span className="bg-slate-950/80 text-white text-xs font-mono font-bold px-3 py-1 rounded-lg border border-slate-800 backdrop-blur-md">
                      {formatTime(streamDuration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950/80 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>1 Live Viewer</span>
                  </div>
                </div>
              )}

              {/* Bottom Camera Controls Overlay Bar */}
              {isLive && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/90 border border-slate-800 p-2.5 rounded-2xl shadow-2xl backdrop-blur-xl z-10">
                  <button
                    onClick={toggleMic}
                    className={`p-3 rounded-xl transition-all ${
                      isMicMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                    title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                  >
                    {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={toggleVideo}
                    className={`p-3 rounded-xl transition-all ${
                      isVideoMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                    title={isVideoMuted ? 'Enable Camera' : 'Turn Off Camera'}
                  >
                    {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>

                  <div className="h-6 w-[1px] bg-slate-800" />

                  <button
                    onClick={stopCameraFeed}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
                  >
                    <PhoneOff className="w-4 h-4" />
                    End Broadcast
                  </button>
                </div>
              )}
            </div>

            {/* Creator Live Room Banner */}
            <div className="glass-panel p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-500/40"
                />
                <div>
                  <h3 className="font-extrabold text-white text-base">{user?.displayName || 'Creator'} Live Broadcast</h3>
                  <p className="text-xs text-indigo-400 font-semibold">@{user?.username || 'creator'} • Live WebRTC Camera Room</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Camera Broadcaster Active</span>
              </div>
            </div>
          </div>

          {/* Real-Time Live Chat Comment Section & Viewers List Column (Right / Bottom) */}
          <div className="lg:col-span-4 h-[560px] lg:h-[620px]">
            <LiveChat stream={currentStreamObj} />
          </div>

        </div>

      </div>
    </div>
  );
}
