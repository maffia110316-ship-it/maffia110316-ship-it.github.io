import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Hash,
  Volume2,
  Send,
  MessageCircle,
  Mic,
  MicOff,
  Headphones,
  PhoneOff,
  Video,
  VideoOff,
  Monitor,
  Smile,
  Shield,
  Settings,
  Flame,
  ThumbsUp,
  Heart,
  Radio,
  Wifi,
  Users,
  Image as ImageIcon,
  Reply,
  X,
  Music,
  SlidersHorizontal,
  Bell,
  Search,
  Check,
  Share2,
  ChevronLeft,
  Edit3,
  MoreVertical,
  MessageSquare,
} from 'lucide-react';
import { Server, User, ChannelMessage, MessageAttachment, Channel } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { discordAudio } from '../utils/discordAudio';

interface ServersTabProps {
  servers: Server[];
  activeServerId: string;
  activeChannelId: string;
  setActiveServerId: (id: string) => void;
  setActiveChannelId: (id: string) => void;
  onCreateServer: (name: string, icon: string) => void;
  onUpdateServer?: (server: Server) => void;
  onDeleteServer: (id: string) => void;
  onAddChannel: (channelName: string) => void;
  onDeleteChannel?: (serverId: string, channelId: string) => void;
  onUpdateChannel?: (serverId: string, channelId: string, newName: string) => void;
  onAddVoiceChannel?: (serverId: string, channelName: string) => void;
  onDeleteVoiceChannel?: (serverId: string, channelId: string) => void;
  onUpdateVoiceChannel?: (serverId: string, channelId: string, newName: string) => void;
  onSendMessage: (
    text: string,
    replyTo?: { id: string; sender: string; text: string },
    attachment?: MessageAttachment
  ) => void;
  currentUser: User;
}

export const ServersTab: React.FC<ServersTabProps> = ({
  servers,
  activeServerId,
  activeChannelId,
  setActiveServerId,
  setActiveChannelId,
  onCreateServer,
  onUpdateServer,
  onDeleteServer,
  onAddChannel,
  onDeleteChannel,
  onUpdateChannel,
  onAddVoiceChannel,
  onDeleteVoiceChannel,
  onUpdateVoiceChannel,
  onSendMessage,
  currentUser,
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [showAddServerModal, setShowAddServerModal] = useState(false);
  const [showEditServerModal, setShowEditServerModal] = useState(false);
  const [showAddVoiceModal, setShowAddVoiceModal] = useState(false);
  const [newVoiceChannelName, setNewVoiceChannelName] = useState('');
  const [editingVoiceChannelId, setEditingVoiceChannelId] = useState<string | null>(null);
  const [editVoiceChannelVal, setEditVoiceChannelVal] = useState('');
  const [showServerMenu, setShowServerMenu] = useState(false);

  // Edit Server Form State
  const [editServerName, setEditServerName] = useState('');
  const [editServerIcon, setEditServerIcon] = useState('🎮');
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  const [editChannelNameVal, setEditChannelNameVal] = useState('');

  // Add Server Form State
  const [newServerName, setNewServerName] = useState('');
  const [newServerIcon, setNewServerIcon] = useState('🎮');
  const [serverToDelete, setServerToDelete] = useState<Server | null>(null);

  // Mobile navigation view: 'channels' | 'chat' | 'voice'
  const [mobileView, setMobileView] = useState<'channels' | 'chat' | 'voice'>('channels');

  // Discord Voice Channel state
  const [activeVoiceChannel, setActiveVoiceChannel] = useState<{
    id: string;
    name: string;
    serverId: string;
  } | null>(null);

  // In Voice Room: Toggle between voice tiles and text chat
  const [voiceTab, setVoiceTab] = useState<'stage' | 'chat'>('stage');

  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [speakingUser, setSpeakingUser] = useState<string | null>(null);
  const [krispActive, setKrispActive] = useState(true);
  const [showVoiceSoundboard, setShowVoiceSoundboard] = useState(false);

  // Chat features: Replies & Attachments & Emojis
  const [replyingTo, setReplyingTo] = useState<ChannelMessage | null>(null);
  const [pendingAttachment, setPendingAttachment] = useState<MessageAttachment | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showMembersList, setShowMembersList] = useState(false);

  // Message Reactions state: messageId -> { emoji: count, users: [] }
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({});

  const chatScrollRef = useRef<HTMLDivElement>(null);

  const currentServer = servers.find((s) => s.id === activeServerId) || servers[0];
  const activeChannel =
    currentServer?.channels?.find((c) => c.id === activeChannelId) ||
    currentServer?.channels?.[0];

  // Auto-scroll on new message
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentServer?.messages, activeChannelId]);

  // When edit modal opens, sync values
  useEffect(() => {
    if (currentServer && showEditServerModal) {
      setEditServerName(currentServer.name);
      setEditServerIcon(currentServer.icon);
    }
  }, [currentServer, showEditServerModal]);

  // Simulated Discord speaking wave in active voice channel
  useEffect(() => {
    if (!activeVoiceChannel) {
      setSpeakingUser(null);
      return;
    }

    const interval = setInterval(() => {
      if (!isMicMuted && !isDeafened && Math.random() > 0.4) {
        setSpeakingUser(currentUser.username);
      } else {
        setSpeakingUser(null);
      }
    }, 2200);

    return () => clearInterval(interval);
  }, [activeVoiceChannel, isMicMuted, isDeafened, currentUser.username]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!chatMessage.trim() && !pendingAttachment) || !currentServer || !activeChannel) return;

    let finalMsg = chatMessage.trim();

    // Discord Slash commands support
    if (finalMsg === '/shrug') finalMsg = '¯\\_(ツ)_/¯';
    else if (finalMsg === '/tableflip') finalMsg = '(╯°□°)╯︵ ┻━┻';
    else if (finalMsg === '/gg') finalMsg = 'GG! Goed gespeeld allemaal! 🎮🏆';
    else if (finalMsg === '/unflip') finalMsg = '┬─┬ノ( º _ ºノ)';

    const replyData = replyingTo
      ? {
          id: replyingTo.id,
          sender: replyingTo.sender,
          text: replyingTo.text.slice(0, 70),
        }
      : undefined;

    discordAudio.playMessagePing();
    onSendMessage(finalMsg, replyData, pendingAttachment || undefined);
    setChatMessage('');
    setReplyingTo(null);
    setPendingAttachment(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServerName.trim()) return;
    onCreateServer(newServerName.trim(), newServerIcon.trim() || '🎮');
    setNewServerName('');
    setShowAddServerModal(false);
    setMobileView('chat');
  };

  const handleSaveEditServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentServer || !editServerName.trim() || !onUpdateServer) return;
    onUpdateServer({
      ...currentServer,
      name: editServerName.trim(),
      icon: editServerIcon.trim() || '🎮',
    });
    setShowEditServerModal(false);
  };

  const handleRenameChannelSubmit = (chanId: string) => {
    if (!currentServer || !editChannelNameVal.trim() || !onUpdateChannel) return;
    onUpdateChannel(currentServer.id, chanId, editChannelNameVal.trim());
    setEditingChannelId(null);
    setEditChannelNameVal('');
  };

  const handleChannelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!newChannelName.trim()) return;
      onAddChannel(newChannelName.trim());
      setNewChannelName('');
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setReactions((prev) => {
      const msgReactions = { ...(prev[messageId] || {}) };
      msgReactions[emoji] = (msgReactions[emoji] || 0) + 1;
      return { ...prev, [messageId]: msgReactions };
    });
  };

  const handleJoinVoiceChannel = (chanId: string, chanName: string) => {
    discordAudio.playJoinVoice();
    setActiveVoiceChannel({
      id: chanId,
      name: chanName,
      serverId: currentServer.id,
    });
    setVoiceTab('stage');
    setMobileView('voice');
  };

  const handleDisconnectVoice = () => {
    discordAudio.playLeaveVoice();
    setActiveVoiceChannel(null);
    setIsCameraOn(false);
    setIsScreenSharing(false);
    setSpeakingUser(null);
    if (mobileView === 'voice') {
      setMobileView('chat');
    }
  };

  const toggleMic = () => {
    if (isMicMuted) {
      discordAudio.playUnmute();
      setIsMicMuted(false);
    } else {
      discordAudio.playMute();
      setIsMicMuted(true);
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

  const messages =
    (currentServer && activeChannel && currentServer.messages?.[activeChannel.id]) || [];

  // Discord dynamic voice channels for active server
  const currentVoiceChannels =
    currentServer?.voiceChannels && currentServer.voiceChannels.length > 0
      ? currentServer.voiceChannels
      : [
          { id: 'vc_1', name: '🔊 Algemeen Spraak', type: 'voice' as const },
          { id: 'vc_2', name: '🔊 Gaming Squad Duo/Trio', type: 'voice' as const },
          { id: 'vc_3', name: '🔊 Pro Scrims & Toernooien', type: 'voice' as const },
        ];

  const handleCreateVoiceChannelSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newVoiceChannelName.trim() || !currentServer) return;
    const clean = newVoiceChannelName.trim();
    if (onAddVoiceChannel) {
      onAddVoiceChannel(currentServer.id, clean);
    } else if (onUpdateServer) {
      const updatedVc = [
        ...currentVoiceChannels,
        {
          id: 'vc_' + Date.now(),
          name: clean.startsWith('🔊') ? clean : `🔊 ${clean}`,
          type: 'voice' as const,
        },
      ];
      onUpdateServer({ ...currentServer, voiceChannels: updatedVc });
    }
    setNewVoiceChannelName('');
    setShowAddVoiceModal(false);
  };

  const handleDeleteVoiceChannel = (vcId: string) => {
    if (!currentServer) return;
    if (onDeleteVoiceChannel) {
      onDeleteVoiceChannel(currentServer.id, vcId);
    } else if (onUpdateServer) {
      const remaining = currentVoiceChannels.filter((v) => v.id !== vcId);
      onUpdateServer({
        ...currentServer,
        voiceChannels:
          remaining.length > 0
            ? remaining
            : [{ id: 'vc_' + Date.now(), name: '🔊 Algemeen Spraak', type: 'voice' as const }],
      });
    }
  };

  const handleRenameVoiceChannelSubmit = (vcId: string) => {
    if (!currentServer || !editVoiceChannelVal.trim()) return;
    const clean = editVoiceChannelVal.trim();
    const formatted = clean.startsWith('🔊') ? clean : `🔊 ${clean}`;
    if (onUpdateVoiceChannel) {
      onUpdateVoiceChannel(currentServer.id, vcId, formatted);
    } else if (onUpdateServer) {
      const updated = currentVoiceChannels.map((v) =>
        v.id === vcId ? { ...v, name: formatted } : v
      );
      onUpdateServer({ ...currentServer, voiceChannels: updated });
    }
    setEditingVoiceChannelId(null);
    setEditVoiceChannelVal('');
  };

  // Preset gaming attachments for Discord media sharing
  const PRESET_GAMING_ATTACHMENTS: MessageAttachment[] = [
    {
      id: 'att_1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      name: 'Cyberpunk Victory Screenshot.png',
    },
    {
      id: 'att_2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
      name: 'Warzone Clutch 1v3.png',
    },
    {
      id: 'att_3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      name: 'PlayStation Trophy Unlock.png',
    },
  ];

  // Determine whether channels panel should show on mobile
  const showChannelsPanelOnMobile = mobileView === 'channels';

  return (
    <div className="flex-1 flex overflow-hidden w-full h-full bg-[#1e1f22] text-[#dbdee1] font-sans select-none relative">
      
      {/* 1. DISCORD SERVER ICONS STRIP */}
      {/* On desktop: always visible. On mobile: visible when in 'channels' view */}
      <div
        className={`${
          showChannelsPanelOnMobile ? 'flex' : 'hidden md:flex'
        } w-[68px] md:w-[72px] bg-[#111214] border-r border-[#232428] flex-col items-center py-3 space-y-2.5 shrink-0 z-20 overflow-y-auto`}
      >
        {/* Discord Home Icon */}
        <div className="relative group w-full flex items-center justify-center">
          <span className="absolute left-0 w-1 bg-white rounded-r-full h-0 group-hover:h-5 transition-all duration-200" />
          <button
            onClick={() => {
              if (servers.length > 0) {
                setActiveServerId(servers[0].id);
                setActiveChannelId(servers[0].channels[0]?.id || '');
              }
            }}
            className="w-12 h-12 rounded-3xl hover:rounded-2xl bg-[#313338] hover:bg-[#5865f2] text-white flex items-center justify-center transition-all duration-200 shadow-md group"
            title="GamerHub Discord Home"
          >
            <MessageCircle className="w-6 h-6 text-[#5865f2] group-hover:text-white transition-colors" />
          </button>
        </div>

        <div className="w-8 h-[2px] bg-[#35363c] rounded-full mx-auto my-1" />

        {/* Server Icons List */}
        {servers.map((s) => {
          const isActive = currentServer?.id === s.id;
          return (
            <div key={s.id} className="relative group w-full flex items-center justify-center">
              {/* Discord active indicator pill */}
              <span
                className={`absolute left-0 w-1 bg-white rounded-r-full transition-all duration-200 ${
                  isActive ? 'h-10' : 'h-0 group-hover:h-5'
                }`}
              />

              <button
                onClick={() => {
                  setActiveServerId(s.id);
                  setActiveChannelId(s.channels[0]?.id || '');
                }}
                className={`w-12 h-12 flex items-center justify-center text-xl transition-all duration-200 shadow-md ${
                  isActive
                    ? 'rounded-2xl bg-[#5865f2] text-white ring-2 ring-[#5865f2]/50'
                    : 'rounded-3xl hover:rounded-2xl bg-[#313338] hover:bg-[#5865f2] text-slate-300 hover:text-white'
                }`}
                title={s.name}
              >
                <span>{s.icon}</span>
              </button>
            </div>
          );
        })}

        {/* Discord Add Server Button */}
        <button
          onClick={() => setShowAddServerModal(true)}
          className="w-12 h-12 rounded-3xl hover:rounded-2xl bg-[#313338] hover:bg-[#23a55a] text-[#23a55a] hover:text-white flex items-center justify-center transition-all duration-200 shadow-md"
          title="Server Toevoegen (+)"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* 2. DISCORD SERVER CHANNELS & USER BAR SIDEBAR */}
      {/* On desktop: always w-60. On mobile: flex-1 when in 'channels' view, hidden in 'chat'/'voice' */}
      <div
        className={`${
          showChannelsPanelOnMobile ? 'flex flex-1 md:flex-initial' : 'hidden md:flex'
        } md:w-60 bg-[#2b2d31] border-r border-[#232428] flex-col shrink-0 justify-between h-full overflow-hidden`}
      >
        {currentServer ? (
          <>
            {/* Server Header with Settings / Dropdown */}
            <div className="relative">
              <div
                onClick={() => setShowServerMenu(!showServerMenu)}
                className="h-12 px-4 border-b border-[#232428] flex items-center justify-between shrink-0 shadow-sm hover:bg-[#35373c] transition cursor-pointer select-none"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-base">{currentServer.icon}</span>
                  <h2 className="font-bold text-sm text-white truncate">
                    {currentServer.name}
                  </h2>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEditServerModal(true);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1e1f22] transition"
                    title="Server bewerken"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Server Menu Dropdown */}
              {showServerMenu && (
                <div className="absolute top-13 left-2 right-2 bg-[#111214] border border-[#232428] rounded-xl p-2 shadow-2xl z-40 space-y-1 animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      setShowServerMenu(false);
                      setShowEditServerModal(true);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#5865f2] rounded-lg transition text-left"
                  >
                    <Edit3 className="w-4 h-4 text-[#5865f2] group-hover:text-white" />
                    <span>Server Bewerken (Naam / Icoon)</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowServerMenu(false);
                      setShowAddServerModal(true);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#23a55a] rounded-lg transition text-left"
                  >
                    <Plus className="w-4 h-4 text-[#23a55a]" />
                    <span>Nieuwe Server Aanmaken</span>
                  </button>
                  <div className="h-[1px] bg-[#232428] my-1" />
                  <button
                    onClick={() => {
                      setShowServerMenu(false);
                      setServerToDelete(currentServer);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition text-left"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Server Verwijderen</span>
                  </button>
                </div>
              )}
            </div>

            {/* Channels Scroll Area */}
            <div className="p-2 space-y-4 flex-1 overflow-y-auto">
              {/* TEXT CHANNELS */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between px-2 mb-1">
                  <span className="text-[11px] font-black tracking-wider text-[#949ba4] uppercase">
                    TEKSTKANALEN
                  </span>
                  <span className="text-[10px] text-[#949ba4]">
                    {currentServer.channels?.length || 0}
                  </span>
                </div>

                {currentServer.channels?.map((chan) => {
                  const isChanActive = activeChannelId === chan.id && !activeVoiceChannel;
                  return (
                    <div key={chan.id} className="group relative flex items-center">
                      <button
                        onClick={() => {
                          setActiveChannelId(chan.id);
                          setMobileView('chat');
                        }}
                        className={`w-full text-left px-2.5 py-2 md:py-1.5 rounded-md text-xs flex items-center justify-between transition ${
                          isChanActive
                            ? 'bg-[#404249] text-white font-bold'
                            : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <Hash className="w-4 h-4 text-[#80848e] shrink-0" />
                          <span className="truncate">{chan.name}</span>
                        </div>
                      </button>

                      {/* Quick delete channel icon (if more than 1 channel) */}
                      {currentServer.channels.length > 1 && onDeleteChannel && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChannel(currentServer.id, chan.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-slate-500 rounded mr-1 transition"
                          title="Kanaal verwijderen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}

                <div className="pt-2">
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    onKeyDown={handleChannelKeyDown}
                    placeholder="+ nieuw-kanaal... (Druk Enter)"
                    className="w-full bg-[#1e1f22] border border-[#232428] rounded-md px-2.5 py-2 md:py-1.5 text-xs text-[#dbdee1] focus:outline-none focus:border-[#5865f2] placeholder-[#80848e]"
                  />
                </div>
              </div>

              {/* VOICE CHANNELS (DISCORD STYLE) */}
              <div className="space-y-1 pt-3 border-t border-[#35373c]">
                <div className="flex items-center justify-between px-2 mb-1">
                  <span className="text-[11px] font-black tracking-wider text-[#949ba4] uppercase flex items-center space-x-1">
                    <Volume2 className="w-3.5 h-3.5 text-[#5865f2]" />
                    <span>SPRAAKKANALEN ({currentVoiceChannels.length})</span>
                  </span>
                  <button
                    onClick={() => setShowAddVoiceModal(true)}
                    className="p-1 rounded text-[#949ba4] hover:text-white hover:bg-[#35373c] transition flex items-center space-x-1"
                    title="Nieuwe Voice Call Ruimte Toevoegen (+)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {currentVoiceChannels.map((vc) => {
                  const isInThisVc = activeVoiceChannel?.id === vc.id;
                  const isEditingThisVc = editingVoiceChannelId === vc.id;

                  if (isEditingThisVc) {
                    return (
                      <div key={vc.id} className="p-1 bg-[#1e1f22] rounded-md border border-[#5865f2] flex items-center space-x-1">
                        <input
                          type="text"
                          autoFocus
                          value={editVoiceChannelVal}
                          onChange={(e) => setEditVoiceChannelVal(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameVoiceChannelSubmit(vc.id);
                            if (e.key === 'Escape') setEditingVoiceChannelId(null);
                          }}
                          className="flex-1 bg-transparent px-1.5 py-0.5 text-xs text-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleRenameVoiceChannelSubmit(vc.id)}
                          className="text-[10px] bg-[#5865f2] text-white px-2 py-0.5 rounded font-bold"
                        >
                          Opslaan
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div key={vc.id} className="group relative space-y-1">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleJoinVoiceChannel(vc.id, vc.name)}
                          className={`w-full text-left px-2.5 py-2 md:py-1.5 rounded-md text-xs flex items-center justify-between transition ${
                            isInThisVc
                              ? 'bg-[#23a55a]/15 text-[#23a55a] font-bold border border-[#23a55a]/30'
                              : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <Volume2 className="w-4 h-4 shrink-0 text-[#80848e]" />
                            <span className="truncate">{vc.name.replace('🔊 ', '')}</span>
                          </div>
                          {isInThisVc && (
                            <span className="w-2 h-2 rounded-full bg-[#23a55a] animate-pulse" />
                          )}
                        </button>

                        {/* Edit & Delete Voice Channel buttons on hover */}
                        <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-0.5 pr-1 transition shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingVoiceChannelId(vc.id);
                              setEditVoiceChannelVal(vc.name.replace('🔊 ', ''));
                            }}
                            className="p-1 hover:text-white text-slate-500 rounded transition"
                            title="Voice call hernoemen"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {currentVoiceChannels.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteVoiceChannel(vc.id);
                              }}
                              className="p-1 hover:text-red-400 text-slate-500 rounded transition"
                              title="Voice call verwijderen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* If connected, show active participants nested under channel */}
                      {isInThisVc && (
                        <div className="pl-6 space-y-1 py-1">
                          <div className="flex items-center space-x-2 text-[11px] text-white">
                            <img
                              src={currentUser.avatar}
                              alt={currentUser.username}
                              className={`w-5 h-5 rounded-full object-cover ${
                                speakingUser === currentUser.username
                                  ? 'ring-2 ring-[#23a55a]'
                                  : ''
                              }`}
                            />
                            <span className="truncate font-semibold">
                              {currentUser.username}
                            </span>
                            {isMicMuted && (
                              <MicOff className="w-3 h-3 text-red-400 ml-auto" />
                            )}
                          </div>

                          <div className="flex items-center space-x-2 text-[11px] text-slate-300">
                            <img
                              src="https://api.dicebear.com/7.x/bottts/svg?seed=ProGamer"
                              alt="SquadMate"
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="truncate font-medium">SquadMate#4201</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 text-center space-y-3 my-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#1e1f22] flex items-center justify-center mx-auto text-xl text-[#5865f2]">
              🎮
            </div>
            <h3 className="font-bold text-white text-sm">0 Servers</h3>
            <p className="text-xs text-[#949ba4]">
              Start je eigen community of gaming lobby. Maak een server aan!
            </p>
            <button
              onClick={() => setShowAddServerModal(true)}
              className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold py-2.5 px-3 rounded-xl text-xs transition shadow-md shadow-[#5865f2]/30"
            >
              + Server Aanmaken
            </button>
          </div>
        )}

        {/* 3. DISCORD BOTTOM VOICE CONNECTION BANNER & USER BAR */}
        <div className="bg-[#232428] border-t border-[#1e1f22] shrink-0">
          {/* Active Voice Connection Strip */}
          {activeVoiceChannel && (
            <div className="p-2.5 bg-[#23a55a]/10 border-b border-[#23a55a]/20 flex items-center justify-between">
              <button
                onClick={() => setMobileView('voice')}
                className="flex items-center space-x-2 truncate text-left"
              >
                <Wifi className="w-4 h-4 text-[#23a55a] animate-pulse shrink-0" />
                <div className="truncate">
                  <p className="text-[11px] font-black text-[#23a55a] leading-tight">
                    Spraak Verbonden
                  </p>
                  <p className="text-[9px] text-[#949ba4] truncate max-w-[120px]">
                    {activeVoiceChannel.name} • 18ms
                  </p>
                </div>
              </button>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setMobileView('voice')}
                  className="px-2 py-1 rounded bg-[#35373c] text-white text-[10px] font-bold md:hidden"
                >
                  Open
                </button>
                <button
                  onClick={handleDisconnectVoice}
                  className="p-1.5 rounded-md bg-[#da373c] hover:bg-[#be2f34] text-white transition shadow-sm"
                  title="Verbinding verbreken"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* User Profile Bar (Discord Style) */}
          <div className="p-1.5 flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate p-1 rounded-md hover:bg-[#35373c] transition cursor-pointer">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-8 h-8 rounded-full bg-[#111214] object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#23a55a] rounded-full border-2 border-[#232428]" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {currentUser.username}
                </p>
                <p className="text-[10px] text-[#949ba4] leading-tight">Online</p>
              </div>
            </div>

            <div className="flex items-center space-x-0.5">
              <button
                onClick={toggleMic}
                className={`p-1.5 rounded-md transition ${
                  isMicMuted
                    ? 'text-[#da373c] bg-[#da373c]/15'
                    : 'text-[#b5bac1] hover:text-white hover:bg-[#35373c]'
                }`}
                title={isMicMuted ? 'Microfoon dempen opheffen' : 'Microfoon dempen'}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleDeafen}
                className={`p-1.5 rounded-md transition ${
                  isDeafened
                    ? 'text-[#da373c] bg-[#da373c]/15'
                    : 'text-[#b5bac1] hover:text-white hover:bg-[#35373c]'
                }`}
                title={isDeafened ? 'Audio weer aanzetten' : 'Koptelefoon uitschakelen'}
              >
                <Headphones className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DISCORD MAIN STAGE: VOICE ROOM OR TEXT CHAT */}
      {/* On mobile: visible when NOT in 'channels' view */}
      <div
        className={`${
          !showChannelsPanelOnMobile ? 'flex' : 'hidden md:flex'
        } flex-1 flex-col bg-[#313338] overflow-hidden h-full`}
      >
        {/* If Active Voice Channel is open AND mobileView is voice OR user is on voice stage */}
        {activeVoiceChannel && (mobileView === 'voice' || voiceTab === 'stage') ? (
          <div className="flex-1 flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-[#2b2d31] via-[#1e1f22] to-[#111214] overflow-y-auto">
            {/* Top Bar with Mobile Back & In-Voice Chat Switcher */}
            <div className="flex items-center justify-between pb-4 border-b border-[#232428]">
              <div className="flex items-center space-x-2">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setMobileView('channels')}
                  className="md:hidden p-1.5 rounded-lg bg-[#2b2d31] text-white hover:bg-[#35373c] transition mr-1"
                  title="Terug naar kanalen"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <Volume2 className="w-5 h-5 text-[#23a55a]" />
                <h3 className="font-extrabold text-white text-sm md:text-base truncate">
                  {activeVoiceChannel.name}
                </h3>
                <span className="bg-[#23a55a]/15 text-[#23a55a] border border-[#23a55a]/30 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  Live Voice
                </span>
              </div>

              {/* Chat in Voice Toggle Button */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setVoiceTab('chat');
                    setMobileView('chat');
                  }}
                  className="bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-sm"
                  title="Chat openen in dit kanaal"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Tekst Chat</span>
                </button>
              </div>
            </div>

            {/* Voice Stage: Screen Share or Connected Grid */}
            {isScreenSharing ? (
              <div className="flex-1 max-h-[460px] bg-black rounded-2xl border border-[#5865f2]/40 overflow-hidden relative shadow-2xl flex flex-col my-3">
                <div className="bg-[#111214]/90 px-4 py-2 flex items-center justify-between border-b border-[#232428]">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-bold text-white">
                      🔴 LIVE • {currentUser.username} Streamt
                    </span>
                    <span className="bg-[#5865f2] text-[10px] font-black px-2 py-0.5 rounded-md text-white">
                      1080P 60FPS
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                    Opus Audio 64kbps
                  </span>
                </div>

                <div className="flex-1 relative bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 flex items-center justify-center p-6 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
                    alt="Stream"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 filter contrast-125"
                  />
                  <div className="relative z-10 bg-[#111214]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center max-w-sm">
                    <p className="text-xs font-bold text-[#23a55a]">Schermdeling Actief</p>
                    <p className="text-[11px] text-[#dbdee1] mt-1">
                      Iedereen in #{activeVoiceChannel.name} kijkt mee.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-xl w-full">
                  {/* Current User Tile */}
                  <div
                    className={`bg-[#2b2d31] border rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center space-y-3 relative shadow-2xl transition-all duration-200 ${
                      speakingUser === currentUser.username
                        ? 'border-[#23a55a] ring-4 ring-[#23a55a]/40 shadow-[0_0_25px_rgba(35,165,90,0.35)]'
                        : 'border-[#232428]'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.username}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#111214] object-cover shadow-lg border-2 border-[#1e1f22]"
                      />
                      {speakingUser === currentUser.username && (
                        <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#23a55a] rounded-full border-2 border-[#111214] flex items-center justify-center animate-bounce">
                          <Radio className="w-3.5 h-3.5 text-white" />
                        </span>
                      )}
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-white text-sm">
                        {currentUser.username}
                      </h4>
                      <p className="text-[10px] text-[#949ba4]">
                        {speakingUser === currentUser.username
                          ? '🟢 Aan het praten...'
                          : isMicMuted
                          ? '🔴 Gedempt'
                          : isDeafened
                          ? 'Koptelefoon uit'
                          : 'Verbonden'}
                      </p>
                    </div>
                  </div>

                  {/* Squad Mate Tile */}
                  <div className="bg-[#2b2d31] border border-[#232428] rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center space-y-3 relative shadow-2xl">
                    <div className="relative">
                      <img
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=ProGamer"
                        alt="Squad Mate"
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#111214] object-cover shadow-lg border-2 border-[#1e1f22]"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-white text-sm">
                        SquadMember#4201
                      </h4>
                      <p className="text-[10px] text-[#949ba4]">Verbonden</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Soundboard Popover */}
            {showVoiceSoundboard && (
              <div className="w-full max-w-lg mx-auto bg-[#111214] border border-[#2b2d31] rounded-2xl p-3 mb-3 shadow-2xl animate-in slide-in-from-bottom">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#232428]">
                  <span className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
                    <Music className="w-3.5 h-3.5 text-[#5865f2]" />
                    <span>Discord Soundboard</span>
                  </span>
                  <button
                    onClick={() => setShowVoiceSoundboard(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: 'Airhorn', icon: '🎺' },
                    { name: 'Victory', icon: '🏆' },
                    { name: 'Quack', icon: '🦆' },
                    { name: 'Ba-Dum', icon: '🥁' },
                  ].map((s) => (
                    <button
                      key={s.name}
                      onClick={() => {
                        discordAudio.playMessagePing();
                      }}
                      className="bg-[#2b2d31] hover:bg-[#5865f2] p-2 rounded-xl text-center text-xs text-white font-bold transition flex flex-col items-center"
                    >
                      <span className="text-base">{s.icon}</span>
                      <span className="text-[10px] mt-0.5">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Discord Bottom Voice Action Bar */}
            <div className="flex items-center justify-center space-x-2 md:space-x-3 pt-4 border-t border-[#232428]">
              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`p-3 md:p-3.5 rounded-2xl transition shadow-md ${
                  isCameraOn
                    ? 'bg-[#5865f2] text-white'
                    : 'bg-[#2b2d31] hover:bg-[#35373c] text-[#dbdee1]'
                }`}
                title="Camera inschakelen"
              >
                {isCameraOn ? <Video className="w-4 h-4 md:w-5 md:h-5" /> : <VideoOff className="w-4 h-4 md:w-5 md:h-5" />}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 md:p-3.5 rounded-2xl transition shadow-md ${
                  isScreenSharing
                    ? 'bg-[#23a55a] text-white'
                    : 'bg-[#2b2d31] hover:bg-[#35373c] text-[#dbdee1]'
                }`}
                title="Scherm delen"
              >
                <Monitor className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button
                onClick={toggleMic}
                className={`p-3 md:p-3.5 rounded-2xl transition shadow-md ${
                  isMicMuted
                    ? 'bg-[#da373c] text-white'
                    : 'bg-[#2b2d31] hover:bg-[#35373c] text-[#dbdee1]'
                }`}
                title="Microfoon dempen"
              >
                {isMicMuted ? <MicOff className="w-4 h-4 md:w-5 md:h-5" /> : <Mic className="w-4 h-4 md:w-5 md:h-5" />}
              </button>

              <button
                onClick={() => setShowVoiceSoundboard(!showVoiceSoundboard)}
                className={`p-3 md:p-3.5 rounded-2xl transition shadow-md ${
                  showVoiceSoundboard
                    ? 'bg-[#5865f2] text-white'
                    : 'bg-[#2b2d31] hover:bg-[#35373c] text-[#dbdee1]'
                }`}
                title="Soundboard"
              >
                <Music className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button
                onClick={() => setKrispActive(!krispActive)}
                className={`px-3 py-3 rounded-2xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  krispActive
                    ? 'bg-[#23a55a]/20 text-[#23a55a] border border-[#23a55a]/40'
                    : 'bg-[#2b2d31] text-slate-400'
                }`}
                title="Krisp Ruisonderdrukking"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Krisp</span>
              </button>

              <button
                onClick={handleDisconnectVoice}
                className="p-3 md:p-3.5 rounded-2xl bg-[#da373c] hover:bg-[#be2f34] text-white transition shadow-lg shadow-[#da373c]/30"
                title="Spraakkanaal verlaten"
              >
                <PhoneOff className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        ) : currentServer && activeChannel ? (
          /* DISCORD TEXT CHAT CHANNEL */
          <div className="flex-1 flex overflow-hidden h-full">
            <div className="flex-1 flex flex-col overflow-hidden h-full">
              {/* Channel Top Header */}
              <div className="h-12 border-b border-[#232428] px-3 md:px-4 flex items-center justify-between shrink-0 bg-[#313338] shadow-sm">
                <div className="flex items-center space-x-2 truncate">
                  {/* Mobile Back Button to Channels */}
                  <button
                    onClick={() => setMobileView('channels')}
                    className="md:hidden p-1.5 rounded-lg bg-[#2b2d31] text-white hover:bg-[#35373c] transition mr-0.5"
                    title="Terug naar kanalen"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <Hash className="w-5 h-5 text-[#80848e] shrink-0" />
                  <h3 className="font-extrabold text-white text-sm truncate">
                    {activeChannel.name}
                  </h3>

                  {activeVoiceChannel && (
                    <button
                      onClick={() => {
                        setVoiceTab('stage');
                        setMobileView('voice');
                      }}
                      className="ml-2 bg-[#23a55a]/20 text-[#23a55a] border border-[#23a55a]/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1"
                    >
                      <Volume2 className="w-3 h-3 animate-pulse" />
                      <span>Naar Spraak</span>
                    </button>
                  )}

                  <span className="text-[#3f4147] hidden sm:inline">|</span>
                  <span className="text-xs text-[#949ba4] truncate hidden sm:inline">
                    {currentServer.name} • Gaming discussies & clips
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 text-[#b5bac1]">
                  <button
                    onClick={() => setShowMembersList(!showMembersList)}
                    className={`p-1.5 rounded-md hover:bg-[#35373c] hover:text-white transition ${
                      showMembersList ? 'text-white bg-[#35373c]' : ''
                    }`}
                    title="Ledenlijst weergeven"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Feed */}
              <div className="flex-1 p-3 md:p-4 overflow-y-auto space-y-3.5">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-[#949ba4] p-6 space-y-2">
                    <div className="w-14 h-14 rounded-full bg-[#2b2d31] flex items-center justify-center text-[#5865f2]">
                      <Hash className="w-7 h-7" />
                    </div>
                    <h4 className="font-black text-white text-base">
                      Welkom in #{activeChannel.name}!
                    </h4>
                    <p className="text-xs max-w-sm">
                      Dit is het begin van het #{activeChannel.name} kanaal. Drop een bericht, deel een screenshot of start een voice call!
                    </p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender === currentUser.username;
                    const msgReactions = reactions[m.id] || {};

                    return (
                      <div
                        key={m.id}
                        className="group flex items-start space-x-3 px-2 md:px-3 py-1.5 rounded-lg hover:bg-[#2e3035] transition relative"
                      >
                        <img
                          src={
                            m.avatar ||
                            `https://api.dicebear.com/7.x/bottts/svg?seed=${m.sender}`
                          }
                          alt={m.sender}
                          className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#111214] object-cover shrink-0 mt-0.5 shadow-sm"
                        />

                        <div className="flex-1 min-w-0">
                          {/* Discord Reply Header if message was a reply */}
                          {m.replyTo && (
                            <div className="flex items-center space-x-1.5 text-[11px] text-[#949ba4] mb-1">
                              <span className="text-[#80848e]">↩</span>
                              <span className="font-bold text-[#5865f2]">@{m.replyTo.sender}</span>
                              <span className="truncate max-w-[280px] italic">"{m.replyTo.text}"</span>
                            </div>
                          )}

                          <div className="flex items-center space-x-2 mb-0.5">
                            <span
                              className={`text-xs font-bold ${
                                isMe ? 'text-[#5865f2]' : 'text-white'
                              }`}
                            >
                              {m.sender}
                            </span>
                            <span className="text-[10px] text-[#949ba4]">
                              {m.time}
                            </span>
                          </div>

                          {/* Message Text with markdown feel */}
                          <p className="text-xs text-[#dbdee1] leading-relaxed break-words whitespace-pre-wrap">
                            {m.text}
                          </p>

                          {/* Message Attachment (Gaming Screenshot / Media) */}
                          {m.attachments && m.attachments.length > 0 && (
                            <div className="mt-2 space-y-1.5">
                              {m.attachments.map((att) => (
                                <div
                                  key={att.id}
                                  className="max-w-md rounded-xl overflow-hidden border border-[#232428] bg-black/40 shadow-lg"
                                >
                                  <img
                                    src={att.url}
                                    alt={att.name || 'Screenshot'}
                                    className="w-full max-h-64 object-cover hover:scale-105 transition duration-300"
                                  />
                                  {att.name && (
                                    <div className="p-2 bg-[#2b2d31] text-[10px] text-[#949ba4] flex items-center justify-between">
                                      <span>{att.name}</span>
                                      <span className="text-[#5865f2] font-bold">1080p Screenshot</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reaction badges */}
                          {Object.keys(msgReactions).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {Object.entries(msgReactions).map(([emoji, count]) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleAddReaction(m.id, emoji)}
                                  className="bg-[#2b2d31] hover:bg-[#35373c] border border-[#3f4147] rounded-md px-2 py-0.5 text-xs flex items-center space-x-1"
                                >
                                  <span>{emoji}</span>
                                  <span className="text-[10px] font-bold text-white">
                                    {count}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Discord Quick Action Toolbar on Hover */}
                        <div className="absolute right-2 top-1 hidden group-hover:flex items-center space-x-1 bg-[#313338] border border-[#232428] rounded-md p-1 shadow-xl z-10">
                          {['🔥', '👍', '❤️', '🎮'].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleAddReaction(m.id, emoji)}
                              className="p-1 hover:bg-[#35373c] rounded text-xs transition"
                              title={`Reageer met ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                          <div className="w-[1px] h-3 bg-[#3f4147] mx-0.5" />
                          <button
                            onClick={() => setReplyingTo(m)}
                            className="p-1 hover:bg-[#35373c] rounded text-slate-300 hover:text-white transition"
                            title="Beantwoorden"
                          >
                            <Reply className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatScrollRef} />
              </div>

              {/* Replying Banner */}
              {replyingTo && (
                <div className="bg-[#2b2d31] border-t border-[#232428] px-4 py-1.5 flex items-center justify-between text-xs text-[#b5bac1]">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-[#80848e]">↩ Beantwoorden aan</span>
                    <span className="font-bold text-white">@{replyingTo.sender}</span>
                    <span className="truncate italic text-[11px] text-[#949ba4]">
                      "{replyingTo.text.slice(0, 45)}"
                    </span>
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-[#949ba4] hover:text-white p-1 rounded"
                    title="Antwoord annuleren"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Pending Attachment preview */}
              {pendingAttachment && (
                <div className="bg-[#2b2d31] border-t border-[#232428] px-4 py-2 flex items-center space-x-3">
                  <img
                    src={pendingAttachment.url}
                    alt="Pending"
                    className="w-12 h-12 rounded-lg object-cover border border-[#3f4147]"
                  />
                  <div className="flex-1 text-xs truncate">
                    <p className="font-bold text-white truncate">{pendingAttachment.name}</p>
                    <p className="text-[10px] text-[#23a55a]">Klaar om te versturen</p>
                  </div>
                  <button
                    onClick={() => setPendingAttachment(null)}
                    className="text-[#949ba4] hover:text-red-400 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Message Input (Discord Style) */}
              <form
                onSubmit={handleSend}
                className="p-2 md:p-3 border-t border-[#232428] bg-[#313338] shrink-0"
              >
                <div className="flex items-center bg-[#383a40] rounded-xl px-3 py-2 space-x-2">
                  {/* Add Media / Screenshot Button */}
                  <button
                    type="button"
                    onClick={() => setShowAttachmentModal(true)}
                    className="p-1 rounded-full text-[#b5bac1] hover:text-white hover:bg-[#404249] transition shrink-0"
                    title="Gaming Screenshot of Mediabestand toevoegen"
                  >
                    <Plus className="w-4 h-4 bg-[#4e5058] text-white rounded-full p-0.5" />
                  </button>

                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder={`Bericht naar #${activeChannel.name}...`}
                    className="flex-1 bg-transparent text-xs text-white placeholder-[#80848e] focus:outline-none min-w-0"
                  />

                  {/* Emoji Picker toggle */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-1 text-[#b5bac1] hover:text-amber-400 transition"
                      title="Emoji toevoegen"
                    >
                      <Smile className="w-4 h-4" />
                    </button>

                    {showEmojiPicker && (
                      <div className="absolute right-0 bottom-10 bg-[#2b2d31] border border-[#232428] rounded-xl p-3 shadow-2xl z-30 grid grid-cols-5 gap-2 w-52">
                        {['🎮', '🔥', '🏆', '✨', '⚡', '👍', '❤️', '😂', '🚀', '🎉', '🕹️', '👾', '🥇', '👑', '💯'].map(
                          (emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setChatMessage((prev) => prev + emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="text-lg hover:scale-125 transition p-1 hover:bg-[#35373c] rounded"
                            >
                              {emoji}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!chatMessage.trim() && !pendingAttachment}
                    className="bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-30 text-white font-bold p-1.5 rounded-lg text-xs transition shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Discord Right Members List */}
            {showMembersList && (
              <div className="w-56 bg-[#2b2d31] border-l border-[#232428] p-3 hidden lg:flex flex-col space-y-4 shrink-0 overflow-y-auto">
                <div>
                  <span className="text-[10px] font-black tracking-wider text-[#949ba4] uppercase block mb-2">
                    ONLINE — 2
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5 p-1.5 rounded-md hover:bg-[#35373c] transition">
                      <div className="relative">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.username}
                          className="w-8 h-8 rounded-full bg-[#111214] object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#23a55a] rounded-full border-2 border-[#2b2d31]" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-white truncate">
                          {currentUser.username}
                        </p>
                        <p className="text-[10px] text-[#23a55a] truncate">Server Eigenaar</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5 p-1.5 rounded-md hover:bg-[#35373c] transition">
                      <div className="relative">
                        <img
                          src="https://api.dicebear.com/7.x/bottts/svg?seed=ProGamer"
                          alt="Squad"
                          className="w-8 h-8 rounded-full bg-[#111214] object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#23a55a] rounded-full border-2 border-[#2b2d31]" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-[#dbdee1] truncate">
                          SquadMember#4201
                        </p>
                        <p className="text-[10px] text-[#949ba4] truncate">Speelt Call of Duty</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black tracking-wider text-[#949ba4] uppercase block mb-2">
                    OFFLINE — 1
                  </span>
                  <div className="flex items-center space-x-2.5 p-1.5 rounded-md opacity-60">
                    <div className="relative">
                      <img
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=OfflineGamer"
                        alt="Offline"
                        className="w-8 h-8 rounded-full bg-[#111214] object-cover"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#80848e] rounded-full border-2 border-[#2b2d31]" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-[#949ba4] truncate">
                        GhostRider#9912
                      </p>
                      <p className="text-[10px] text-[#80848e]">Offline</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty state when no server is selected */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[#949ba4] space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#2b2d31] flex items-center justify-center text-3xl">
              🎮
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Geen Server Geselecteerd
              </h3>
              <p className="text-xs text-[#949ba4] mt-1 max-w-sm">
                Kies een server in de lijst of maak een nieuwe Discord server aan.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setMobileView('channels')}
                className="md:hidden bg-[#2b2d31] hover:bg-[#35373c] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition"
              >
                ← Toon Kanalen
              </button>
              <button
                onClick={() => setShowAddServerModal(true)}
                className="bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md shadow-[#5865f2]/30"
              >
                + Nieuwe Server Aanmaken
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL ATTACHMENT PICKER */}
      {showAttachmentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#2b2d31] border border-[#232428] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#35373c]">
              <h3 className="text-base font-black text-white">
                Gaming Screenshot / Clip Delen
              </h3>
              <button
                onClick={() => setShowAttachmentModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#949ba4]">
              Kies een screenshot om direct in #{activeChannel?.name || 'chat'} te delen:
            </p>

            <div className="space-y-2">
              {PRESET_GAMING_ATTACHMENTS.map((att) => (
                <button
                  key={att.id}
                  onClick={() => {
                    setPendingAttachment(att);
                    setShowAttachmentModal(false);
                  }}
                  className="w-full flex items-center space-x-3 p-2 rounded-xl bg-[#1e1f22] hover:bg-[#35373c] border border-[#3f4147] transition text-left"
                >
                  <img
                    src={att.url}
                    alt={att.name}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 truncate">
                    <p className="text-xs font-bold text-white truncate">{att.name}</p>
                    <p className="text-[10px] text-[#23a55a]">1920x1080 Ultra HD</p>
                  </div>
                  <span className="text-xs text-[#5865f2] font-bold">Kiezen</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREATE VOICE CHANNEL / VOICE CALL ROOM */}
      {showAddVoiceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#2b2d31] border border-[#232428] rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white flex items-center space-x-2">
                  <Volume2 className="w-5 h-5 text-[#23a55a]" />
                  <span>Nieuw Spraakkanaal / Voice Call</span>
                </h2>
                <p className="text-xs text-[#949ba4] mt-1">
                  Maak een spraakruimte aan voor {currentServer?.name || 'deze server'}.
                </p>
              </div>
              <button
                onClick={() => setShowAddVoiceModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-[#1e1f22]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVoiceChannelSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#949ba4] uppercase mb-1.5">
                  Populaire Suggesties (Klik om te kiezen)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Gaming Squad Room',
                    'Duo / Trio Rankeds',
                    'Pro Scrims & Toernooi',
                    'Chill, Muziek & Kletsen',
                    'Valorant & Warzone',
                    'Minecraft Voice',
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setNewVoiceChannelName(preset)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition ${
                        newVoiceChannelName === preset
                          ? 'bg-[#23a55a]/20 border-[#23a55a] text-white font-bold'
                          : 'bg-[#1e1f22] border-[#232428] text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      🔊 {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#949ba4] uppercase mb-1">
                  Naam van het Spraakkanaal
                </label>
                <div className="relative">
                  <Volume2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newVoiceChannelName}
                    onChange={(e) => setNewVoiceChannelName(e.target.value)}
                    placeholder="bijv. Squad Room 1 of Pro Scrims"
                    className="w-full bg-[#1e1f22] border border-[#232428] rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#23a55a] transition"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVoiceModal(false)}
                  className="flex-1 bg-[#1e1f22] hover:bg-[#35373c] text-white font-bold py-3 rounded-xl text-xs transition"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#23a55a] hover:bg-[#1f924e] text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-[#23a55a]/30"
                >
                  Spraakkanaal Aanmaken
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREATE SERVER */}
      {showAddServerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#2b2d31] border border-[#232428] rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h2 className="text-lg font-black text-white">
                + Discord Server Aanmaken
              </h2>
              <p className="text-xs text-[#949ba4] mt-1">
                Kies een herkenbare naam en emoji voor je community server.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#949ba4] uppercase mb-1">
                  Server Emoji Icoon
                </label>
                <div className="flex flex-wrap gap-2">
                  {['🎮', '⚔️', '👾', '🚀', '🔥', '🏆', '💎', '🛡️', '🎧', '👑'].map((em) => (
                    <button
                      type="button"
                      key={em}
                      onClick={() => setNewServerIcon(em)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition ${
                        newServerIcon === em
                          ? 'bg-[#5865f2] ring-2 ring-white/50'
                          : 'bg-[#1e1f22] hover:bg-[#35373c]'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#949ba4] uppercase mb-1">
                  Server Naam
                </label>
                <input
                  type="text"
                  required
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  placeholder="Bijv. Apex Legends Squad NL"
                  className="w-full bg-[#1e1f22] border border-[#232428] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#5865f2]"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddServerModal(false)}
                  className="flex-1 bg-[#1e1f22] hover:bg-[#35373c] text-white font-bold py-3 rounded-xl text-xs transition"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-[#5865f2]/30"
                >
                  Server Aanmaken
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT SERVER ("SERVER VERANDEREN") */}
      {showEditServerModal && currentServer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#2b2d31] border border-[#232428] rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#35373c]">
              <div>
                <h2 className="text-lg font-black text-white">
                  Server Instellingen & Bewerken
                </h2>
                <p className="text-xs text-[#949ba4] mt-0.5">
                  Verander de servernaam, het icoon of beheer kanalen.
                </p>
              </div>
              <button
                onClick={() => setShowEditServerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditServer} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#949ba4] uppercase mb-1">
                  Server Emoji Icoon
                </label>
                <div className="flex flex-wrap gap-2">
                  {['🎮', '⚔️', '👾', '🚀', '🔥', '🏆', '💎', '🛡️', '🎧', '👑'].map((em) => (
                    <button
                      type="button"
                      key={em}
                      onClick={() => setEditServerIcon(em)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition ${
                        editServerIcon === em
                          ? 'bg-[#5865f2] ring-2 ring-white/50'
                          : 'bg-[#1e1f22] hover:bg-[#35373c]'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#949ba4] uppercase mb-1">
                  Server Naam
                </label>
                <input
                  type="text"
                  required
                  value={editServerName}
                  onChange={(e) => setEditServerName(e.target.value)}
                  className="w-full bg-[#1e1f22] border border-[#232428] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#5865f2]"
                />
              </div>

              {/* Manage Channels inside Server */}
              <div className="pt-2 border-t border-[#35373c]">
                <label className="block text-[10px] font-bold text-[#949ba4] uppercase mb-2">
                  Kanalen Beheren ({currentServer.channels.length})
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {currentServer.channels.map((chan) => (
                    <div
                      key={chan.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#1e1f22] border border-[#232428]"
                    >
                      {editingChannelId === chan.id ? (
                        <div className="flex items-center space-x-1.5 flex-1 mr-2">
                          <input
                            type="text"
                            value={editChannelNameVal}
                            onChange={(e) => setEditChannelNameVal(e.target.value)}
                            className="flex-1 bg-[#2b2d31] border border-[#5865f2] rounded px-2 py-1 text-xs text-white focus:outline-none"
                            placeholder="Nieuwe kanaalnaam..."
                          />
                          <button
                            type="button"
                            onClick={() => handleRenameChannelSubmit(chan.id)}
                            className="bg-[#23a55a] text-white p-1 rounded text-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingChannelId(null)}
                            className="bg-[#35373c] text-white p-1 rounded text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 truncate">
                          <Hash className="w-3.5 h-3.5 text-[#80848e]" />
                          <span className="text-xs text-white truncate font-medium">
                            {chan.name}
                          </span>
                        </div>
                      )}

                      {editingChannelId !== chan.id && (
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingChannelId(chan.id);
                              setEditChannelNameVal(chan.name);
                            }}
                            className="p-1 text-slate-400 hover:text-white rounded transition"
                            title="Kanaal hernoemen"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {currentServer.channels.length > 1 && onDeleteChannel && (
                            <button
                              type="button"
                              onClick={() => onDeleteChannel(currentServer.id, chan.id)}
                              className="p-1 text-slate-400 hover:text-red-400 rounded transition"
                              title="Kanaal verwijderen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditServerModal(false);
                    setServerToDelete(currentServer);
                  }}
                  className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-bold px-3 py-2.5 rounded-xl text-xs transition"
                >
                  Server Verwijderen
                </button>
                <div className="flex-1 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEditServerModal(false)}
                    className="flex-1 bg-[#1e1f22] hover:bg-[#35373c] text-white font-bold py-2.5 rounded-xl text-xs transition"
                  >
                    Sluiten
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-[#5865f2]/30"
                  >
                    Opslaan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE SERVER MODAL */}
      <ConfirmModal
        isOpen={Boolean(serverToDelete)}
        title="Server Verwijderen"
        message={`Weet je zeker dat je de server '${serverToDelete?.name}' wilt verwijderen? Alle kanalen en berichten worden gewist.`}
        confirmLabel="Verwijderen"
        cancelLabel="Annuleren"
        isDestructive={true}
        onConfirm={() => {
          if (serverToDelete) {
            onDeleteServer(serverToDelete.id);
            setServerToDelete(null);
            setMobileView('channels');
          }
        }}
        onCancel={() => setServerToDelete(null)}
      />
    </div>
  );
};
