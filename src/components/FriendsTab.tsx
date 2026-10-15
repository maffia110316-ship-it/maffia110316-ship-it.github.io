import React, { useState, useRef, useEffect } from 'react';
import { UserPlus, Ban, Trash2, Send, MessageSquare, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { Friend, ChannelMessage, User } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface FriendsTabProps {
  friends: Friend[];
  activeFriend: Friend | null;
  setActiveFriend: (friend: Friend | null) => void;
  dmHistory: Record<string, ChannelMessage[]>;
  onSendDm: (friendId: string, text: string) => void;
  onAddFriend: (name: string) => void;
  onToggleBlockFriend: (friendId: string) => void;
  onDeleteFriend: (friendId: string) => void;
  onLoadStarterFriends?: () => void;
  currentUser: User;
}

export const FriendsTab: React.FC<FriendsTabProps> = ({
  friends,
  activeFriend,
  setActiveFriend,
  dmHistory,
  onSendDm,
  onAddFriend,
  onToggleBlockFriend,
  onDeleteFriend,
  onLoadStarterFriends,
  currentUser,
}) => {
  const [filter, setFilter] = useState<'all' | 'online' | 'blocked'>('all');
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [dmText, setDmText] = useState('');
  const [friendToDelete, setFriendToDelete] = useState<Friend | null>(null);

  const dmScrollRef = useRef<HTMLDivElement>(null);

  const filteredFriends = friends.filter((f) => {
    if (filter === 'online') return f.status === 'online' && !f.isBlocked;
    if (filter === 'blocked') return f.isBlocked;
    return true;
  });

  const activeFriendMessages = activeFriend ? dmHistory[activeFriend.id] || [] : [];

  useEffect(() => {
    dmScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeFriendMessages, activeFriend?.id]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!dmText.trim() || !activeFriend) return;
    onSendDm(activeFriend.id, dmText.trim());
    setDmText('');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;
    onAddFriend(newFriendName.trim());
    setNewFriendName('');
    setShowAddFriendModal(false);
  };

  return (
    <div className="flex-1 flex overflow-hidden w-full h-full">
      {/* 1. FRIENDS LIST PANEL */}
      <div className="w-64 md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="font-bold text-white text-sm">Vrienden & DM's</h2>
            <span className="text-[10px] bg-slate-800 text-indigo-400 font-bold px-2 py-0.5 rounded-full">
              {friends.length}
            </span>
          </div>
          <button
            onClick={() => setShowAddFriendModal(true)}
            className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Toevoegen</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex px-3 pt-3 pb-1 space-x-1 border-b border-slate-800/60">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition ${
              filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Alle ({friends.length})
          </button>
          <button
            onClick={() => setFilter('online')}
            className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition ${
              filter === 'online' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Online ({friends.filter((f) => f.status === 'online' && !f.isBlocked).length})
          </button>
          <button
            onClick={() => setFilter('blocked')}
            className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition ${
              filter === 'blocked' ? 'bg-slate-800 text-red-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Geblokkeerd
          </button>
        </div>

        {/* Friends scrollable container */}
        <div className="flex-1 p-2 space-y-1 overflow-y-auto">
          {filteredFriends.length === 0 ? (
            <div className="p-6 text-center text-slate-500 space-y-3">
              <p className="text-xs">
                {filter === 'blocked'
                  ? 'Geen geblokkeerde gebruikers.'
                  : filter === 'online'
                  ? 'Er zijn momenteel geen vrienden online.'
                  : 'Nog geen vrienden in je lijst.'}
              </p>
              {filter === 'all' && onLoadStarterFriends && (
                <button
                  onClick={onLoadStarterFriends}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Voorbeeldvrienden Inladen</span>
                </button>
              )}
            </div>
          ) : (
            filteredFriends.map((fr) => {
              const isSelected = activeFriend?.id === fr.id;
              const hasUnread = (dmHistory[fr.id]?.length || 0) > 0;
              return (
                <div
                  key={fr.id}
                  className={`w-full p-2.5 rounded-2xl transition flex items-center justify-between group ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/40 shadow-sm'
                      : 'hover:bg-slate-800/80'
                  } ${fr.isBlocked ? 'opacity-50' : ''}`}
                >
                  <button
                    onClick={() => setActiveFriend(fr)}
                    className="flex items-center space-x-3 flex-1 min-w-0 text-left"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={fr.avatar}
                        alt={fr.name}
                        className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 object-cover"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                          fr.isBlocked
                            ? 'bg-red-500'
                            : fr.status === 'online'
                            ? 'bg-emerald-500'
                            : 'bg-slate-500'
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1 truncate">
                      <div className="flex items-center space-x-1.5">
                        <p className="text-xs font-bold text-slate-200 truncate">{fr.name}</p>
                        {fr.isBlocked && (
                          <span className="text-[9px] text-red-400 bg-red-950/60 px-1.5 py-0.2 rounded border border-red-500/30">
                            Blok
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {fr.isBlocked ? 'Geblokkeerd' : fr.game}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => onToggleBlockFriend(fr.id)}
                      className={`p-1.5 rounded-lg transition ${
                        fr.isBlocked
                          ? 'text-red-400 hover:bg-red-500/20'
                          : 'text-slate-500 hover:text-amber-400 hover:bg-slate-700'
                      }`}
                      title={fr.isBlocked ? 'Deblokkeren' : 'Blokkeren'}
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setFriendToDelete(fr)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                      title="Vriend verwijderen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. DIRECT MESSAGES PANEL */}
      <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
        {activeFriend ? (
          <>
            {/* DM Header */}
            <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 bg-slate-950/60 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={activeFriend.avatar}
                    alt={activeFriend.name}
                    className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 object-cover"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                      activeFriend.isBlocked
                        ? 'bg-red-500'
                        : activeFriend.status === 'online'
                        ? 'bg-emerald-500'
                        : 'bg-slate-500'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm flex items-center space-x-1.5">
                    <span>{activeFriend.name}</span>
                    {activeFriend.isBlocked && (
                      <span className="text-[10px] text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded border border-red-500/20">
                        Geblokkeerd
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-emerald-400 flex items-center space-x-1">
                    <span>🎮</span>
                    <span>{activeFriend.game}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggleBlockFriend(activeFriend.id)}
                  className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 hover:bg-slate-800 transition"
                >
                  {activeFriend.isBlocked ? 'Deblokkeren' : 'Blokkeren'}
                </button>
              </div>
            </div>

            {/* Blocked banner if activeFriend is blocked */}
            {activeFriend.isBlocked && (
              <div className="bg-red-950/40 border-b border-red-500/20 px-6 py-2.5 flex items-center space-x-2 text-xs text-red-300">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                <span>Deze gebruiker is geblokkeerd. Berichten zijn gedempt.</span>
              </div>
            )}

            {/* Messages Thread */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-3.5">
              {activeFriendMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-8 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Start een gesprek met {activeFriend.name}</h4>
                  <p className="text-xs max-w-sm">
                    Stuur een privébericht om samen te gamen, strategieën te bespreken of tips uit te wisselen.
                  </p>
                </div>
              ) : (
                activeFriendMessages.map((m) => {
                  const isMe = m.sender === currentUser.username;
                  return (
                    <div
                      key={m.id}
                      className={`flex items-start space-x-3 p-3.5 rounded-2xl border transition ${
                        isMe
                          ? 'bg-indigo-950/30 border-indigo-500/20 ml-auto max-w-xl'
                          : 'bg-slate-900/60 border-slate-800 max-w-xl'
                      }`}
                    >
                      <img
                        src={m.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.sender}`}
                        alt={m.sender}
                        className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 shrink-0 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-xs font-bold ${isMe ? 'text-indigo-400' : 'text-slate-300'}`}>
                            {m.sender}
                          </span>
                          <span className="text-[10px] text-slate-500">{m.time}</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
                          {m.text}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={dmScrollRef} />
            </div>

            {/* DM Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
              <div className="flex space-x-2">
                <input
                  type="text"
                  disabled={activeFriend.isBlocked}
                  value={dmText}
                  onChange={(e) => setDmText(e.target.value)}
                  placeholder={
                    activeFriend.isBlocked
                      ? 'Deblokkeer gebruiker om berichten te sturen...'
                      : `Privébericht naar ${activeFriend.name}...`
                  }
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition"
                />
                <button
                  type="submit"
                  disabled={!dmText.trim() || activeFriend.isBlocked}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold px-5 py-3 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Stuur</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl text-indigo-400">
              💬
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Selecteer een Vriend</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Kies iemand uit je vriendenlijst aan de linkerkant om een privégesprek te openen.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL ADD FRIEND */}
      {showAddFriendModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div>
              <h2 className="text-lg font-black text-white">+ Vriend Toevoegen</h2>
              <p className="text-xs text-slate-400 mt-1">
                Vul de GamerTag of gebruikersnaam in (bijv. PopeyeSpeirs#1111 of PixelPro).
              </p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Gebruikersnaam of Tag
                </label>
                <input
                  type="text"
                  required
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  placeholder="GamerTag#0000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFriendModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-indigo-600/30"
                >
                  Toevoegen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE FRIEND MODAL */}
      <ConfirmModal
        isOpen={Boolean(friendToDelete)}
        title="Vriend Verwijderen"
        message={`Weet je zeker dat je ${friendToDelete?.name} wilt verwijderen uit je vriendenlijst?`}
        confirmLabel="Verwijderen"
        cancelLabel="Annuleren"
        onConfirm={() => {
          if (friendToDelete) {
            onDeleteFriend(friendToDelete.id);
            setFriendToDelete(null);
          }
        }}
        onCancel={() => setFriendToDelete(null)}
      />
    </div>
  );
};
