import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Hash, Send, Sparkles, MessageCircle } from 'lucide-react';
import { Server, User } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface ServersTabProps {
  servers: Server[];
  activeServerId: string;
  activeChannelId: string;
  setActiveServerId: (id: string) => void;
  setActiveChannelId: (id: string) => void;
  onCreateServer: (name: string, icon: string) => void;
  onDeleteServer: (id: string) => void;
  onAddChannel: (channelName: string) => void;
  onSendMessage: (text: string) => void;
  onLoadStarterServers?: () => void;
  currentUser: User;
}

export const ServersTab: React.FC<ServersTabProps> = ({
  servers,
  activeServerId,
  activeChannelId,
  setActiveServerId,
  setActiveChannelId,
  onCreateServer,
  onDeleteServer,
  onAddChannel,
  onSendMessage,
  onLoadStarterServers,
  currentUser,
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [showAddServerModal, setShowAddServerModal] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerIcon, setNewServerIcon] = useState('🎮');

  const [serverToDelete, setServerToDelete] = useState<Server | null>(null);

  const chatScrollRef = useRef<HTMLDivElement>(null);

  const currentServer = servers.find((s) => s.id === activeServerId) || servers[0];
  const activeChannel = currentServer?.channels?.find((c) => c.id === activeChannelId) || currentServer?.channels?.[0];

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentServer?.messages, activeChannelId]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim() || !currentServer || !activeChannel) return;
    onSendMessage(chatMessage);
    setChatMessage('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServerName.trim()) return;
    onCreateServer(newServerName.trim(), newServerIcon.trim() || '🎮');
    setNewServerName('');
    setShowAddServerModal(false);
  };

  const handleChannelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!newChannelName.trim()) return;
      onAddChannel(newChannelName.trim());
      setNewChannelName('');
    }
  };

  const messages = (currentServer && activeChannel && currentServer.messages?.[activeChannel.id]) || [];

  return (
    <div className="flex-1 flex overflow-hidden w-full h-full">
      {/* 1. SERVER ICONS VERTICAL STRIP */}
      <div className="w-16 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 space-y-3 shrink-0">
        {servers.map((s) => {
          const isActive = activeServerId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                setActiveServerId(s.id);
                setActiveChannelId(s.channels[0]?.id || '');
              }}
              className={`relative group w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 ring-2 ring-indigo-400 text-white rounded-xl shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 hover:rounded-xl text-slate-200'
              }`}
              title={s.name}
            >
              {isActive && (
                <span className="absolute -left-1 w-1.5 h-6 bg-white rounded-r-full" />
              )}
              <span>{s.icon}</span>
            </button>
          );
        })}

        <button
          onClick={() => setShowAddServerModal(true)}
          className="w-11 h-11 rounded-2xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 flex items-center justify-center transition shadow-md"
          title="Nieuwe Server Aanmaken"
        >
          <Plus className="w-5 h-5 font-bold" />
        </button>
      </div>

      {/* 2. CHANNELS LIST SIDEBAR */}
      <div className="w-52 md:w-60 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        {currentServer ? (
          <>
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate">
                <span className="text-base">{currentServer.icon}</span>
                <h2 className="font-bold text-sm text-white truncate">{currentServer.name}</h2>
              </div>
              <button
                onClick={() => setServerToDelete(currentServer)}
                className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition"
                title="Server verwijderen"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 space-y-1 flex-1 overflow-y-auto">
              <p className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 tracking-wider">
                Tekstkanalen ({currentServer.channels?.length || 0})
              </p>

              {currentServer.channels?.map((chan) => {
                const isChanActive = activeChannelId === chan.id;
                return (
                  <button
                    key={chan.id}
                    onClick={() => setActiveChannelId(chan.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center space-x-2 transition ${
                      isChanActive
                        ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{chan.name}</span>
                  </button>
                );
              })}

              <div className="pt-3">
                <div className="relative">
                  <Hash className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    onKeyDown={handleChannelKeyDown}
                    placeholder="Nieuw kanaal + enter..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-600"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Geen Servers</h3>
              <p className="text-xs text-slate-400 mt-1">
                Maak je eigen gaming server aan of laad de officiële community servers in.
              </p>
            </div>
            {onLoadStarterServers && (
              <button
                onClick={onLoadStarterServers}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Community Servers Inladen</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. CHAT MESSAGES AREA */}
      <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
        {currentServer && activeChannel ? (
          <>
            <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 bg-slate-950/60 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 text-slate-400" />
                <h3 className="font-bold text-slate-200 text-sm">{activeChannel.name}</h3>
                <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                  {currentServer.name}
                </span>
              </div>
              <span className="text-xs text-slate-500">{messages.length} berichten</span>
            </div>

            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-3.5">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-8 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
                    <Hash className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Welkom in #{activeChannel.name}!</h4>
                  <p className="text-xs max-w-sm">
                    Dit is het begin van het #{activeChannel.name} kanaal. Wees de eerste die een bericht achterlaat!
                  </p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = m.sender === currentUser.username;
                  return (
                    <div
                      key={m.id}
                      className={`flex items-start space-x-3 p-3 rounded-2xl border transition ${
                        isMe
                          ? 'bg-indigo-950/30 border-indigo-500/20 max-w-xl'
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
              <div ref={chatScrollRef} />
            </div>

            {/* Message input */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={`Bericht sturen naar #${activeChannel.name}...`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <button
                  type="submit"
                  disabled={!chatMessage.trim()}
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
            <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl">
              🎮
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Selecteer of Maak een Server</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Sluit je aan bij discussies, deel builds en speel samen met andere gamers.
              </p>
            </div>
            <button
              onClick={() => setShowAddServerModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition"
            >
              + Nieuwe Server Aanmaken
            </button>
          </div>
        )}
      </div>

      {/* MODAL CREATE SERVER */}
      {showAddServerModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div>
              <h2 className="text-lg font-black text-white">+ Server Aanmaken</h2>
              <p className="text-xs text-slate-400 mt-1">
                Kies een herkenbare naam en emoji voor je community server.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Servernaam</label>
                <input
                  type="text"
                  required
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  placeholder="bijv. Apex Legends NL / Minecraft Realm"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Emoji Icoon</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newServerIcon}
                    onChange={(e) => setNewServerIcon(e.target.value)}
                    placeholder="bijv. 🎮"
                    maxLength={3}
                    className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex space-x-1.5 overflow-x-auto">
                    {['🎮', '⛏️', '🐾', '🏆', '🔥', '⚔️', '👾', '🚀'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewServerIcon(emoji)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition ${
                          newServerIcon === emoji
                            ? 'bg-indigo-600 ring-2 ring-indigo-400'
                            : 'bg-slate-800 hover:bg-slate-700'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddServerModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-indigo-600/30"
                >
                  Server Aanmaken
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE SERVER MODAL */}
      <ConfirmModal
        isOpen={Boolean(serverToDelete)}
        title="Server Verwijderen"
        message={`Weet je zeker dat je de server "${serverToDelete?.name}" en alle kanalen en berichten wilt verwijderen?`}
        confirmLabel="Verwijderen"
        cancelLabel="Annuleren"
        onConfirm={() => {
          if (serverToDelete) {
            onDeleteServer(serverToDelete.id);
            setServerToDelete(null);
          }
        }}
        onCancel={() => setServerToDelete(null)}
      />
    </div>
  );
};
