import React, { useState, useEffect } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Headphones,
  Radio,
  Wifi,
  Sparkles,
  Volume2,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  Music,
} from 'lucide-react';
import { Friend, User } from '../types';
import { discordAudio } from '../utils/discordAudio';

interface CallModalProps {
  isOpen: boolean;
  type: 'voice' | 'video';
  isIncoming: boolean;
  friend: Friend;
  currentUser: User;
  onAccept?: () => void;
  onDecline?: () => void;
  onEndCall: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  type,
  isIncoming,
  friend,
  currentUser,
  onAccept,
  onDecline,
  onEndCall,
}) => {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected'>('ringing');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(type === 'voice');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [krispNoiseSuppression, setKrispNoiseSuppression] = useState(true);
  const [showSoundboard, setShowSoundboard] = useState(false);
  const [recentSoundPlayed, setRecentSoundPlayed] = useState<string | null>(null);

  // Ringtone and call setup
  useEffect(() => {
    if (!isOpen) {
      discordAudio.stopCallRingtone();
      setCallStatus('ringing');
      setCallDuration(0);
      setIsSpeaking(false);
      return;
    }

    if (isIncoming) {
      discordAudio.startCallRingtone();
    } else {
      discordAudio.startCallRingtone();
      const timer = setTimeout(() => {
        discordAudio.playCallConnected();
        setCallStatus('connected');
      }, 2400);
      return () => {
        clearTimeout(timer);
        discordAudio.stopCallRingtone();
      };
    }
  }, [isOpen, isIncoming]);

  // Speaking indicator animation cycle
  useEffect(() => {
    if (callStatus !== 'connected' || isMuted || isDeafened) {
      setIsSpeaking(false);
      return;
    }

    const interval = setInterval(() => {
      setIsSpeaking(Math.random() > 0.4);
    }, 1900);

    return () => clearInterval(interval);
  }, [callStatus, isMuted, isDeafened]);

  // Call timer
  useEffect(() => {
    let interval: number;
    if (callStatus === 'connected') {
      interval = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  if (!isOpen) return null;

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAcceptCall = () => {
    discordAudio.playCallConnected();
    setCallStatus('connected');
    onAccept?.();
  };

  const handleDeclineCall = () => {
    discordAudio.playLeaveVoice();
    onDecline?.();
    onEndCall();
  };

  const handleEndCall = () => {
    discordAudio.playLeaveVoice();
    onEndCall();
  };

  const toggleMute = () => {
    if (isMuted) {
      discordAudio.playUnmute();
      setIsMuted(false);
    } else {
      discordAudio.playMute();
      setIsMuted(true);
    }
  };

  const toggleDeafen = () => {
    if (isDeafened) {
      discordAudio.playUnmute();
      setIsDeafened(false);
    } else {
      discordAudio.playMute();
      setIsDeafened(true);
    }
  };

  const handlePlaySoundboard = (soundName: string) => {
    setRecentSoundPlayed(soundName);
    discordAudio.playMessagePing();
    setTimeout(() => setRecentSoundPlayed(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111214]/95 backdrop-blur-xl flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-4xl bg-[#1e1f22] border border-[#2b2d31] rounded-3xl p-5 md:p-7 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Top Discord Bar */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-[#2b2d31] mb-5">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-left">
              <span className="text-xs font-black text-emerald-400 block tracking-wide">
                {callStatus === 'connected' ? 'RTC Verbonden • 16ms' : 'Oproep tot stand brengen...'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Opus 64kbps • Server Regio: Amsterdam
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {recentSoundPlayed && (
              <span className="bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full animate-bounce">
                🔊 Soundboard: {recentSoundPlayed}
              </span>
            )}
            
            <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-mono bg-[#111214] px-3 py-1.5 rounded-xl border border-[#2b2d31]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>{callStatus === 'connected' ? formatDuration(callDuration) : 'Overgaan...'}</span>
            </div>
          </div>
        </div>

        {/* Discord Screen Share Mode Active */}
        {isScreenSharing && callStatus === 'connected' ? (
          <div className="w-full flex-1 max-h-[380px] bg-slate-950 rounded-2xl border border-indigo-500/40 overflow-hidden relative shadow-2xl flex flex-col mb-4">
            <div className="bg-[#111214]/90 px-4 py-2 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-white">
                  🔴 LIVE • {currentUser.username} Deelt Scherm
                </span>
                <span className="bg-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-md text-white">
                  1080P 60FPS
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Game: Grand Theft Auto VI (Ultra RTX)</span>
            </div>
            
            {/* Simulated Live Game Stream */}
            <div className="flex-1 relative bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 flex items-center justify-center p-6 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
                alt="Stream Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-60 filter contrast-125"
              />
              <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center max-w-sm">
                <p className="text-xs font-bold text-emerald-400">Stream Kwaliteit: Uitstekend (0% packet loss)</p>
                <p className="text-[11px] text-slate-300 mt-1">{friend.name} kijkt mee naar je stream.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Discord 2 Participant Grid Tiles */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full my-auto py-3">
            {/* Friend Tile */}
            <div
              className={`bg-[#111214] border rounded-3xl p-6 flex flex-col items-center justify-center space-y-3 relative shadow-xl transition-all duration-300 min-h-[220px] ${
                callStatus === 'connected' && !isSpeaking
                  ? 'border-emerald-500 ring-4 ring-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
                  : 'border-[#2b2d31]'
              }`}
            >
              <div className="relative">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 object-cover shadow-2xl"
                />
                {callStatus === 'ringing' && (
                  <span className="absolute -inset-2 rounded-full bg-indigo-500/30 animate-ping" />
                )}
                {callStatus === 'connected' && !isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-[#111214] flex items-center justify-center shadow-lg animate-bounce">
                    <Radio className="w-3.5 h-3.5 text-white" />
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-black text-white">{friend.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {callStatus === 'ringing'
                    ? isIncoming
                      ? 'Inkomend spraakgesprek...'
                      : 'Bellen...'
                    : !isSpeaking
                    ? '🟢 Aan het praten...'
                    : 'Verbonden in oproep'}
                </p>
              </div>

              {/* Live Waveform meter */}
              {callStatus === 'connected' && !isSpeaking && (
                <div className="flex items-center space-x-1 pt-1">
                  <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="w-1 h-5 bg-emerald-400 rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-6 bg-emerald-400 rounded-full animate-pulse delay-150" />
                  <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse delay-100" />
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
                </div>
              )}
            </div>

            {/* Current User Tile */}
            <div
              className={`bg-[#111214] border rounded-3xl p-6 flex flex-col items-center justify-center space-y-3 relative shadow-xl transition-all duration-300 min-h-[220px] ${
                isSpeaking
                  ? 'border-emerald-500 ring-4 ring-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
                  : 'border-[#2b2d31]'
              }`}
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 object-cover shadow-2xl"
                />
                {isMuted && (
                  <span className="absolute bottom-0 right-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white border-2 border-[#111214] shadow-md">
                    <MicOff className="w-3.5 h-3.5" />
                  </span>
                )}
                {isSpeaking && !isMuted && (
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-[#111214] flex items-center justify-center shadow-lg animate-bounce">
                    <Radio className="w-3.5 h-3.5 text-white" />
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-black text-white">{currentUser.username}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isMuted
                    ? '🔴 Microfoon gedempt'
                    : isDeafened
                    ? 'Koptelefoon uit'
                    : isSpeaking
                    ? '🟢 Aan het praten...'
                    : 'Verbonden in oproep'}
                </p>
              </div>

              {/* Live Waveform meter */}
              {isSpeaking && !isMuted && (
                <div className="flex items-center space-x-1 pt-1">
                  <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="w-1 h-6 bg-emerald-400 rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse delay-150" />
                  <span className="w-1 h-5 bg-emerald-400 rounded-full animate-pulse delay-100" />
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Discord Soundboard Panel Popover */}
        {showSoundboard && callStatus === 'connected' && (
          <div className="w-full bg-[#111214] border border-[#2b2d31] rounded-2xl p-3 mb-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Music className="w-3.5 h-3.5 text-indigo-400" />
                <span>Discord Soundboard</span>
              </span>
              <button
                onClick={() => setShowSoundboard(false)}
                className="text-slate-500 hover:text-white text-xs font-bold"
              >
                Sluiten ✕
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: 'Luchthoorn', icon: '🎺' },
                { name: 'Victory GG', icon: '🏆' },
                { name: 'Quack', icon: '🦆' },
                { name: 'Ba-Dum Tss', icon: '🥁' },
              ].map((sound) => (
                <button
                  key={sound.name}
                  onClick={() => handlePlaySoundboard(sound.name)}
                  className="bg-[#1e1f22] hover:bg-indigo-600 border border-[#2b2d31] hover:border-indigo-400 p-2.5 rounded-xl text-xs text-white font-bold flex items-center space-x-2 transition"
                >
                  <span className="text-base">{sound.icon}</span>
                  <span className="truncate">{sound.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Discord Floating Bottom Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3.5 mt-4 bg-[#111214] border border-[#2b2d31] px-5 py-3 rounded-2xl shadow-2xl">
          {callStatus === 'ringing' && isIncoming ? (
            <>
              <button
                onClick={handleDeclineCall}
                className="w-14 h-14 rounded-2xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/30 transition active:scale-95"
                title="Weigeren"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
              <button
                onClick={handleAcceptCall}
                className="w-16 h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 transition active:scale-95 animate-pulse"
                title="Opnemen"
              >
                <Phone className="w-7 h-7" />
              </button>
            </>
          ) : (
            <>
              {/* Camera toggle */}
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-3.5 rounded-xl transition ${
                  !isVideoOff
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#2b2d31] hover:bg-[#313338] text-slate-300'
                }`}
                title={isVideoOff ? 'Camera inschakelen' : 'Camera uitschakelen'}
              >
                {!isVideoOff ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              {/* Screen Share toggle */}
              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3.5 rounded-xl transition ${
                  isScreenSharing
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#2b2d31] hover:bg-[#313338] text-slate-300'
                }`}
                title={isScreenSharing ? 'Stop Scherm Delen' : 'Deel je Scherm (1080p)'}
              >
                <Monitor className="w-5 h-5" />
              </button>

              {/* Microphone mute toggle */}
              <button
                onClick={toggleMute}
                className={`p-3.5 rounded-xl transition ${
                  isMuted
                    ? 'bg-red-600 text-white'
                    : 'bg-[#2b2d31] hover:bg-[#313338] text-slate-300'
                }`}
                title={isMuted ? 'Microfoon dempen opheffen' : 'Microfoon dempen'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Headphones deafen toggle */}
              <button
                onClick={toggleDeafen}
                className={`p-3.5 rounded-xl transition ${
                  isDeafened
                    ? 'bg-red-600 text-white'
                    : 'bg-[#2b2d31] hover:bg-[#313338] text-slate-300'
                }`}
                title={isDeafened ? 'Audio weer aanzetten' : 'Koptelefoon uitschakelen'}
              >
                <Headphones className="w-5 h-5" />
              </button>

              {/* Soundboard Button */}
              <button
                onClick={() => setShowSoundboard(!showSoundboard)}
                className={`p-3.5 rounded-xl transition ${
                  showSoundboard
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#2b2d31] hover:bg-[#313338] text-slate-300'
                }`}
                title="Discord Soundboard openen"
              >
                <Music className="w-5 h-5" />
              </button>

              {/* Krisp Noise Suppression */}
              <button
                onClick={() => setKrispNoiseSuppression(!krispNoiseSuppression)}
                className={`px-3 py-3 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  krispNoiseSuppression
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-[#2b2d31] text-slate-400'
                }`}
                title="Krisp Ruisonderdrukking"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Krisp</span>
              </button>

              {/* End Call / Disconnect */}
              <button
                onClick={handleEndCall}
                className="p-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition shadow-lg shadow-red-600/30 active:scale-95"
                title="Ophangen / Verbreken"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
