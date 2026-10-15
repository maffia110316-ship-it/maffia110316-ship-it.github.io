import React, { useState } from 'react';
import { X, Trophy, Gamepad2, Clock, Phone, Video, MessageSquare, Award, CheckCircle2 } from 'lucide-react';
import { Friend, User } from '../types';
import { PLATFORM_ACHIEVEMENTS } from '../data/starterData';

interface FriendProfileModalProps {
  isOpen: boolean;
  friend: Friend | null;
  onClose: () => void;
  onStartChat: (friend: Friend) => void;
  onStartVoiceCall: (friend: Friend) => void;
  onStartVideoCall: (friend: Friend) => void;
}

export const FriendProfileModal: React.FC<FriendProfileModalProps> = ({
  isOpen,
  friend,
  onClose,
  onStartChat,
  onStartVoiceCall,
  onStartVideoCall,
}) => {
  const [activeTab, setActiveTab] = useState<'games' | 'achievements'>('games');

  if (!isOpen || !friend) return null;

  // Sample realistic games library for friends
  const friendGames = [
    { title: 'Helldivers 2', platform: 'PlayStation 5', hours: '184h', completion: '82%', icon: '🚀' },
    { title: 'Elden Ring: Shadow of the Erdtree', platform: 'Steam', hours: '312h', completion: '100%', icon: '⚔️' },
    { title: 'Forza Horizon 5', platform: 'Xbox Series X', hours: '95h', completion: '74%', icon: '🏎️' },
    { title: 'Cyberpunk 2077', platform: 'Steam', hours: '140h', completion: '91%', icon: '🦾' },
    { title: 'Marvel’s Spider-Man 2', platform: 'PlayStation 5', hours: '48h', completion: '100%', icon: '🕷️' },
  ];

  // Combined platform achievements for friend showcase
  const friendAchievements = [
    ...PLATFORM_ACHIEVEMENTS.PlayStation.slice(0, 3),
    ...PLATFORM_ACHIEVEMENTS.Xbox.slice(0, 2),
    ...PLATFORM_ACHIEVEMENTS.Steam.slice(0, 2),
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-slate-950/60 hover:bg-slate-950 text-white rounded-full transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="px-6 pt-0 pb-4 relative border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-3">
            <div className="flex items-end space-x-4">
              <div className="relative">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-20 h-20 rounded-2xl bg-slate-800 border-4 border-slate-900 object-cover shadow-xl"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                    friend.status === 'online' ? 'bg-emerald-500' : 'bg-slate-500'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-black text-white">{friend.name}</h3>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      friend.status === 'online'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : friend.status === 'afk'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {friend.status === 'online' ? 'Online' : friend.status === 'afk' ? 'Afwezig' : 'Offline'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium flex items-center space-x-1.5 mt-0.5">
                  {friend.status === 'online' ? (
                    <span className="text-emerald-400">🎮 Speelt {friend.game || 'GamerHub'}</span>
                  ) : (
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{friend.lastSeen || 'Laatst gezien: onlangs'}</span>
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  onClose();
                  onStartChat(friend);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onStartVoiceCall(friend);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold p-2 rounded-xl text-xs transition"
                title="Spraakoproep starten"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onStartVideoCall(friend);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold p-2 rounded-xl text-xs transition"
                title="Videogesprek starten"
              >
                <Video className="w-4 h-4 text-indigo-400" />
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => setActiveTab('games')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'games'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Games Bibliotheek ({friendGames.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'achievements'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Trofeeën & Achievements ({friendAchievements.length})</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {activeTab === 'games' ? (
            <div className="space-y-2.5">
              {friendGames.map((game, i) => (
                <div
                  key={i}
                  className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{game.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{game.title}</h4>
                      <p className="text-[11px] text-slate-400">{game.platform}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-indigo-400">{game.completion}</span>
                    <p className="text-[10px] text-slate-500 font-medium">{game.hours} gespeeld</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {friendAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">{ach.gameTitle}</span>
                    <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {ach.pointsOrType}
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="text-2xl">{ach.icon}</span>
                    <div>
                      <h5 className="text-xs font-bold text-white">{ach.name}</h5>
                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mt-0.5">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
