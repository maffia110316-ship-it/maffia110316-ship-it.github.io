import React, { useState, useRef, useEffect } from 'react';
import {
  UserPlus,
  Ban,
  Trash2,
  Send,
  MessageSquare,
  ShieldAlert,
  Copy,
  Check,
  Share2,
  Link,
  Users,
  Phone,
  Video,
  Gamepad2,
  Clock,
  Circle,
  Eye,
  Smile,
  Plus,
  Reply,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { Friend, ChannelMessage, User, MessageAttachment } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { discordAudio } from '../utils/discordAudio';

interface FriendsTabProps {
  friends: Friend[];
  activeFriend: Friend | null;
  setActiveFriend: (friend: Friend | null) => void;
  dmHistory: Record<string, ChannelMessage[]>;
  onSendDm: (
    friendId: string,
    text: string,
    replyTo?: { id: string; sender: string; text: string },
    attachment?: MessageAttachment
  ) => void;
  onAddFriend: (nameOrLink: string) => void;
  onToggleBlockFriend: (friendId: string) => void;
  onDeleteFriend: (friendId: string) => void;
  onStartVoiceCall?: (friend: Friend) => void;
  onStartVideoCall?: (friend: Friend) => void;
  onViewFriendProfile?: (friend: Friend) => void;
  currentUser: User;
}

// Real-time helper calculating exact last seen and detailed status
function getDetailedStatus(friend: Friend, now: number) {
  if (friend.isBlocked) {
    return {
      statusLabel: 'Geblokkeerd',
      detailText: 'Geen interactie mogelijk',
      colorClass: 'text-red-400',
      badgeClass: 'bg-red-950/60 text-red-400 border-red-500/30',
      dotClass: 'bg-red-500',
      isOnline: false,
    };
  }

  if (friend.status === 'online') {
    return {
      statusLabel: 'Online',
      detailText: friend.game ? `Speelt ${friend.game}` : 'Nu actief in Discord lobby',
      colorClass: 'text-[#23a55a]',
      badgeClass: 'bg-[#23a55a]/10 text-[#23a55a] border-[#23a55a]/20',
      dotClass: 'bg-[#23a55a] ring-2 ring-[#23a55a]/40 animate-pulse',
      isOnline: true,
    };
  }

  if (friend.status === 'afk') {
    return {
      statusLabel: 'Afwezig',
      detailText: 'AFK • Even weg',
      colorClass: 'text-amber-400',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      dotClass: 'bg-amber-400',
      isOnline: false,
    };
  }

  if (friend.status === 'dnd') {
    return {
      statusLabel: 'Niet storen',
      detailText: 'In een competitieve match',
      colorClass: 'text-rose-500',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      dotClass: 'bg-rose-500',
      isOnline: false,
    };
  }

  // Calculate offline relative time
  const ts = friend.lastActiveTimestamp || (friend.lastSeen ? new Date(friend.lastSeen).getTime() : 0);
  if (!ts) {
    return {
      statusLabel: 'Offline',
      detailText: 'Laatst gezien: onlangs',
      colorClass: 'text-[#949ba4]',
      badgeClass: 'bg-[#2b2d31] text-[#949ba4] border-[#3f4147]',
      dotClass: 'bg-[#80848e]',
      isOnline: false,
    };
  }

  const diffSec = Math.max(0, Math.floor((now - ts) / 1000));
  if (diffSec < 60) {
    return {
      statusLabel: 'Offline',
      detailText: 'Laatst gezien: zojuist',
      colorClass: 'text-[#949ba4]',
      badgeClass: 'bg-[#2b2d31] text-[#949ba4] border-[#3f4147]',
      dotClass: 'bg-[#80848e]',
      isOnline: false,
    };
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return {
      statusLabel: 'Offline',
      detailText: `Laatst gezien: ${diffMin}m geleden`,
      colorClass: 'text-[#949ba4]',
      badgeClass: 'bg-[#2b2d31] text-[#949ba4] border-[#3f4147]',
      dotClass: 'bg-[#80848e]',
      isOnline: false,
    };
  }

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return {
      statusLabel: 'Offline',
      detailText: `Laatst gezien: ${diffHours}u geleden`,
      colorClass: 'text-[#949ba4]',
      badgeClass: 'bg-[#2b2d31] text-[#949ba4] border-[#3f4147]',
      dotClass: 'bg-[#80848e]',
      isOnline: false,
    };
  }

  const diffDays = Math.floor(diffHours / 24);
  return {
    statusLabel: 'Offline',
    detailText: `Laatst gezien: ${diffDays}d geleden`,
    colorClass: 'text-[#80848e]',
    badgeClass: 'bg-[#2b2d31] text-[#80848e] border-[#3f4147]',
    dotClass: 'bg-[#80848e]',
    isOnline: false,
  };
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
  onStartVoiceCall,
  onStartVideoCall,
  onViewFriendProfile,
  currentUser,
}) => {
  const [filter, setFilter] = useState<'all' | 'online' | 'blocked'>('all');
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [newFriendInput, setNewFriendInput] = useState('');
  const [dmText, setDmText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState<Friend | null>(null);

  // Discord DM extras: reactions, replies, attachments, emoji
  const [replyingTo, setReplyingTo] = useState<ChannelMessage | null>(null);
  const [pendingAttachment, setPendingAttachment] = useState<MessageAttachment | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({});

  // Real-time ticking state to update "last seen X minutes ago" every 15 seconds
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  const dmScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const inviteUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?invite=${encodeURIComponent(
          currentUser.username
        )}`
      : `https://gamerhub.app/?invite=${encodeURIComponent(currentUser.username)}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!dmText.trim() && !pendingAttachment) || !activeFriend || activeFriend.isBlocked) return;

    let finalMsg = dmText.trim();
    if (finalMsg === '/shrug') finalMsg = '¯\\_(ツ)_/¯';
    else if (finalMsg === '/tableflip') finalMsg = '(╯°□°)╯︵ ┻━┻';
    else if (finalMsg === '/gg') finalMsg = 'GG! Goed gespeeld! 🎮🏆';

    const replyData = replyingTo
      ? {
          id: replyingTo.id,
          sender: replyingTo.sender,
          text: replyingTo.text.slice(0, 70),
        }
      : undefined;

    discordAudio.playMessagePing();
    onSendDm(activeFriend.id, finalMsg, replyData, pendingAttachment || undefined);
    setDmText('');
    setReplyingTo(null);
    setPendingAttachment(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendInput.trim()) return;
    onAddFriend(newFriendInput.trim());
    setNewFriendInput('');
    setShowAddFriendModal(false);
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setReactions((prev) => {
      const msgReactions = { ...(prev[messageId] || {}) };
      msgReactions[emoji] = (msgReactions[emoji] || 0) + 1;
      return { ...prev, [messageId]: msgReactions };
    });
  };

  useEffect(() => {
    dmScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dmHistory, activeFriend?.id]);

  const filteredFriends = friends.filter((f) => {
    if (filter === 'blocked') return f.isBlocked;
    if (filter === 'online') return f.status === 'online' && !f.isBlocked;
    return !f.isBlocked;
  });

  const activeFriendMessages = activeFriend ? dmHistory[activeFriend.id] || [] : [];
  const activeFriendStatus = activeFriend ? getDetailedStatus(activeFriend, currentTime) : null;

  const PRESET_GAMING_ATTACHMENTS: MessageAttachment[] = [
    {
      id: 'dm_att_1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      name: 'Victory Royale Screenshot.png',
    },
    {
      id: 'dm_att_2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      name: 'Platinum Trophy Pop.png',
    },
  ];

  return (
    <div className="flex-1 flex overflow-hidden w-full h-full bg-[#1e1f22] text-[#dbdee1] font-sans select-none">
      
      {/* 1. FRIENDS LIST SIDEBAR */}
      <div className="w-80 md:w-88 bg-[#2b2d31] border-r border-[#232428] flex flex-col shrink-0">
        
        {/* Top Header: Title & Add Friend Button */}
        <div className="p-4 border-b border-[#232428] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#5865f2]" />
            <h2 className="font-black text-sm text-white">Vrienden & DMs</h2>
            <span className="text-xs bg-[#1e1f22] text-[#949ba4] font-bold px-2 py-0.5 rounded-full">
              {friends.length}
            </span>
          </div>

          <button
            onClick={() => setShowAddFriendModal(true)}
            className="flex items-center space-x-1.5 bg-[#23a55a] hover:bg-[#1f9350] text-white font-bold px-3 py-1.5 rounded-md text-xs transition shadow-sm"
            title="Vriend toevoegen"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Toevoegen</span>
          </button>
        </div>

        {/* Invite link banner */}
        <div className="p-3 bg-[#1e1f22] border-b border-[#232428]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-[#949ba4] uppercase tracking-wider flex items-center space-x-1">
              <Share2 className="w-3 h-3 text-[#5865f2]" />
              <span>Jouw Uitnodigingslink</span>
            </span>
            {copiedLink && (
              <span className="text-[10px] font-bold text-[#23a55a] flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>Gekopieerd!</span>
              </span>
            )}
          </div>
          <div className="flex space-x-1.5">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="flex-1 bg-[#111214] border border-[#232428] rounded-md px-2.5 py-1.5 text-[11px] text-[#dbdee1] focus:outline-none truncate select-all font-mono"
            />
            <button
              onClick={handleCopyInviteLink}
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white p-1.5 rounded-md text-xs font-bold transition shrink-0"
              title="Kopieer uitnodigingslink"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filters: Online / Alle / Geblokkeerd */}
        <div className="flex p-2 gap-1 border-b border-[#232428] text-xs font-bold text-[#949ba4]">
          <button
            onClick={() => setFilter('online')}
            className={`flex-1 py-1.5 rounded-md transition ${
              filter === 'online' ? 'bg-[#35373c] text-white' : 'hover:bg-[#35373c] hover:text-[#dbdee1]'
            }`}
          >
            Online ({friends.filter((f) => f.status === 'online' && !f.isBlocked).length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 rounded-md transition ${
              filter === 'all' ? 'bg-[#35373c] text-white' : 'hover:bg-[#35373c] hover:text-[#dbdee1]'
            }`}
          >
            Alle ({friends.filter((f) => !f.isBlocked).length})
          </button>
          <button
            onClick={() => setFilter('blocked')}
            className={`flex-1 py-1.5 rounded-md transition ${
              filter === 'blocked' ? 'bg-[#35373c] text-white' : 'hover:bg-[#35373c] hover:text-[#dbdee1]'
            }`}
          >
            Blok ({friends.filter((f) => f.isBlocked).length})
          </button>
        </div>

        {/* Friends list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {friends.length === 0 ? (
            <div className="p-6 text-center text-[#949ba4] space-y-3 my-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#1e1f22] flex items-center justify-center mx-auto text-xl text-[#5865f2]">
                👥
              </div>
              <h3 className="font-bold text-white text-sm">0 Vrienden</h3>
              <p className="text-xs">
                Je account start met 0 vrienden. Deel je persoonlijke link of voeg een gamer toe om samen te chatten en te bellen!
              </p>
              <button
                onClick={() => setShowAddFriendModal(true)}
                className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold py-2.5 px-3 rounded-xl text-xs transition"
              >
                + Vriend Toevoegen
              </button>
            </div>
          ) : filteredFriends.length === 0 ? (
            <p className="text-xs text-center text-[#949ba4] py-8">
              Geen vrienden in dit overzicht.
            </p>
          ) : (
            filteredFriends.map((fr) => {
              const isSelected = activeFriend?.id === fr.id;
              const statusInfo = getDetailedStatus(fr, currentTime);

              return (
                <div
                  key={fr.id}
                  className={`group flex items-center justify-between p-2 rounded-lg transition ${
                    isSelected
                      ? 'bg-[#35373c] text-white font-semibold'
                      : 'hover:bg-[#35373c]/70 text-[#dbdee1]'
                  }`}
                >
                  <button
                    onClick={() => setActiveFriend(fr)}
                    className="flex items-center space-x-2.5 min-w-0 flex-1 text-left"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={fr.avatar}
                        alt={fr.name}
                        className="w-9 h-9 rounded-full bg-[#111214] object-cover"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#2b2d31] ${statusInfo.dotClass}`}
                      />
                    </div>

                    <div className="min-w-0 flex-1 truncate pr-1">
                      <div className="flex items-center space-x-1.5">
                        <p className="text-xs font-bold text-white truncate">{fr.name}</p>
                        {fr.isBlocked && (
                          <span className="text-[9px] text-red-400 bg-red-950/60 px-1 py-0.2 rounded border border-red-500/30">
                            Blok
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1 mt-0.5 truncate">
                        <span className={`text-[10px] font-semibold truncate ${statusInfo.colorClass}`}>
                          {statusInfo.detailText}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Actions: inspect profile, block, remove */}
                  <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition">
                    {onViewFriendProfile && (
                      <button
                        onClick={() => onViewFriendProfile(fr)}
                        className="p-1.5 text-slate-400 hover:text-[#5865f2] hover:bg-[#1e1f22] rounded-md transition"
                        title="Profiel & Games bekijken"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onToggleBlockFriend(fr.id)}
                      className={`p-1.5 rounded-md transition ${
                        fr.isBlocked
                          ? 'text-red-400 hover:bg-red-500/20'
                          : 'text-slate-400 hover:text-amber-400 hover:bg-[#1e1f22]'
                      }`}
                      title={fr.isBlocked ? 'Deblokkeren' : 'Blokkeren'}
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setFriendToDelete(fr)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-[#1e1f22] rounded-md transition"
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

      {/* 2. DIRECT MESSAGES PANEL (DISCORD STYLE) */}
      <div className="flex-1 flex flex-col bg-[#313338] overflow-hidden">
        {activeFriend && activeFriendStatus ? (
          <>
            {/* DM Header with detailed live status and Discord call buttons */}
            <div className="h-12 border-b border-[#232428] px-4 flex items-center justify-between shrink-0 bg-[#313338] shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={activeFriend.avatar}
                    alt={activeFriend.name}
                    className="w-8 h-8 rounded-full bg-[#111214] object-cover"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#313338] ${activeFriendStatus.dotClass}`}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs flex items-center space-x-1.5">
                    <span>{activeFriend.name}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${activeFriendStatus.badgeClass}`}
                    >
                      {activeFriendStatus.statusLabel}
                    </span>
                  </h3>
                  <p className="text-[10px] text-[#949ba4] flex items-center space-x-1.5">
                    {activeFriendStatus.isOnline ? (
                      <span className="text-[#23a55a] font-medium">🎮 {activeFriendStatus.detailText}</span>
                    ) : (
                      <span className="flex items-center space-x-1 text-[#949ba4]">
                        <Clock className="w-3 h-3 text-[#80848e]" />
                        <span>{activeFriendStatus.detailText}</span>
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Discord Top DM Action Buttons */}
              <div className="flex items-center space-x-1.5 text-[#b5bac1]">
                {onViewFriendProfile && (
                  <button
                    onClick={() => onViewFriendProfile(activeFriend)}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-[#35373c] rounded-md transition flex items-center space-x-1 text-xs"
                    title="Games en achievements bekijken"
                  >
                    <Gamepad2 className="w-4 h-4 text-purple-400" />
                    <span className="hidden sm:inline font-bold">Games</span>
                  </button>
                )}

                {/* Voice Call Button (Discord) */}
                {onStartVoiceCall && (
                  <button
                    onClick={() => {
                      onStartVoiceCall(activeFriend);
                    }}
                    className="p-1.5 text-[#23a55a] hover:bg-[#23a55a]/15 rounded-md transition"
                    title="Spraakoproep starten (Discord Voice)"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                )}

                {/* Video Call Button (Discord) */}
                {onStartVideoCall && (
                  <button
                    onClick={() => {
                      onStartVideoCall(activeFriend);
                    }}
                    className="p-1.5 text-[#5865f2] hover:bg-[#5865f2]/15 rounded-md transition"
                    title="Videogesprek starten"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => onToggleBlockFriend(activeFriend.id)}
                  className="text-xs text-[#949ba4] hover:text-white px-2 py-1 rounded-md border border-[#3f4147] hover:bg-[#35373c] transition"
                >
                  {activeFriend.isBlocked ? 'Deblokkeren' : 'Blokkeren'}
                </button>
              </div>
            </div>

            {/* Blocked banner if activeFriend is blocked */}
            {activeFriend.isBlocked && (
              <div className="bg-red-950/40 border-b border-red-500/20 px-6 py-2 flex items-center space-x-2 text-xs text-red-300">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                <span>Deze gebruiker is geblokkeerd. Berichten zijn gedempt.</span>
              </div>
            )}

            {/* Messages Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {activeFriendMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#949ba4] p-8 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#2b2d31] flex items-center justify-center text-[#5865f2]">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Start een gesprek met {activeFriend.name}</h4>
                  <p className="text-xs max-w-sm">
                    Stuur een privébericht om samen te gamen, voice calls te starten of gaming stats uit te wisselen.
                  </p>
                </div>
              ) : (
                activeFriendMessages.map((m) => {
                  const isMe = m.sender === currentUser.username;
                  const msgReactions = reactions[m.id] || {};

                  return (
                    <div
                      key={m.id}
                      className="group flex items-start space-x-3 px-3 py-1.5 rounded-lg hover:bg-[#2e3035] transition relative"
                    >
                      <img
                        src={m.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.sender}`}
                        alt={m.sender}
                        className="w-10 h-10 rounded-full bg-[#111214] object-cover shrink-0 mt-0.5"
                      />

                      <div className="flex-1 min-w-0">
                        {/* Reply reference */}
                        {m.replyTo && (
                          <div className="flex items-center space-x-1.5 text-[11px] text-[#949ba4] mb-0.5">
                            <span className="text-[#80848e]">↩</span>
                            <span className="font-bold text-[#5865f2]">@{m.replyTo.sender}</span>
                            <span className="truncate italic">"{m.replyTo.text}"</span>
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
                          <span className="text-[10px] text-[#949ba4]">{m.time}</span>
                        </div>

                        <p className="text-xs text-[#dbdee1] leading-relaxed break-words whitespace-pre-wrap">
                          {m.text}
                        </p>

                        {/* Attachments preview */}
                        {m.attachments && m.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {m.attachments.map((att) => (
                              <div
                                key={att.id}
                                className="max-w-md rounded-xl overflow-hidden border border-[#232428] bg-black/40 shadow-md"
                              >
                                <img
                                  src={att.url}
                                  alt={att.name || 'Screenshot'}
                                  className="w-full max-h-60 object-cover hover:scale-105 transition duration-300"
                                />
                                {att.name && (
                                  <div className="p-2 bg-[#2b2d31] text-[10px] text-[#949ba4]">
                                    {att.name}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reactions badges */}
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
                      <div className="absolute right-3 top-1 hidden group-hover:flex items-center space-x-1 bg-[#313338] border border-[#232428] rounded-md p-1 shadow-xl">
                        {['🔥', '👍', '❤️', '🎮', '😂'].map((emoji) => (
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
              <div ref={dmScrollRef} />
            </div>

            {/* Replying Banner */}
            {replyingTo && (
              <div className="bg-[#2b2d31] border-t border-[#232428] px-4 py-1.5 flex items-center justify-between text-xs text-[#b5bac1]">
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-[#80848e]">↩ Beantwoorden aan</span>
                  <span className="font-bold text-white">@{replyingTo.sender}</span>
                  <span className="truncate italic text-[11px] text-[#949ba4]">"{replyingTo.text.slice(0, 45)}"</span>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-[#949ba4] hover:text-white p-1 rounded"
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

            {/* Discord DM Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#232428] bg-[#313338] shrink-0">
              <div className="flex items-center bg-[#383a40] rounded-lg px-3 py-2 space-x-2">
                <button
                  type="button"
                  disabled={activeFriend.isBlocked}
                  onClick={() => setShowAttachmentModal(true)}
                  className="p-1 rounded-full text-[#b5bac1] hover:text-white hover:bg-[#404249] transition disabled:opacity-50"
                  title="Gaming Screenshot of Mediabestand toevoegen"
                >
                  <Plus className="w-4 h-4 bg-[#4e5058] text-white rounded-full p-0.5" />
                </button>

                <input
                  type="text"
                  disabled={activeFriend.isBlocked}
                  value={dmText}
                  onChange={(e) => setDmText(e.target.value)}
                  placeholder={
                    activeFriend.isBlocked
                      ? 'Deblokkeer gebruiker om berichten te sturen...'
                      : `Privébericht sturen naar @${activeFriend.name}... (/shrug, /gg)`
                  }
                  className="flex-1 bg-transparent text-xs text-white placeholder-[#80848e] focus:outline-none disabled:opacity-50"
                />

                {/* Emoji button */}
                <div className="relative">
                  <button
                    type="button"
                    disabled={activeFriend.isBlocked}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1 text-[#b5bac1] hover:text-amber-400 transition disabled:opacity-50"
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
                              setDmText((prev) => prev + emoji);
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

                <button
                  type="submit"
                  disabled={(!dmText.trim() && !pendingAttachment) || activeFriend.isBlocked}
                  className="bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-30 text-white font-bold p-1.5 rounded-md text-xs transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#949ba4] space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#2b2d31] flex items-center justify-center text-2xl text-[#5865f2]">
              💬
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Selecteer een Vriend</h3>
              <p className="text-xs mt-1 max-w-sm">
                Kies iemand uit je vriendenlijst aan de linkerkant om een privégesprek te openen, of deel je uitnodigingslink.
              </p>
            </div>
            <button
              onClick={handleCopyInviteLink}
              className="bg-[#2b2d31] hover:bg-[#35373c] text-[#5865f2] font-bold px-4 py-2 rounded-xl text-xs transition flex items-center space-x-2"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Gekopieerd!' : 'Kopieer Mijn Uitnodigingslink'}</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL ATTACHMENT PICKER */}
      {showAttachmentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#2b2d31] border border-[#232428] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#35373c]">
              <h3 className="text-base font-black text-white">
                Screenshot / Media Delen
              </h3>
              <button
                onClick={() => setShowAttachmentModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#949ba4]">
              Kies een gaming clip om direct in het privégesprek te delen:
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
                    <p className="text-[10px] text-[#23a55a]">1920x1080 Screenshot</p>
                  </div>
                  <span className="text-xs text-[#5865f2] font-bold">Kiezen</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADD FRIEND */}
      {showAddFriendModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#2b2d31] border border-[#232428] rounded-3xl p-6 shadow-2xl space-y-4">
            <div>
              <h2 className="text-lg font-black text-white">+ Vriend Toevoegen</h2>
              <p className="text-xs text-[#949ba4] mt-1">
                Plak een <strong>uitnodigingslink</strong> van een vriend, of vul direct hun GamerTag in.
              </p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#949ba4] uppercase mb-1">
                  Uitnodigingslink of GamerTag
                </label>
                <div className="relative">
                  <Link className="w-4 h-4 text-[#80848e] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newFriendInput}
                    onChange={(e) => setNewFriendInput(e.target.value)}
                    placeholder="https://.../?invite=... of GamerTag#1234"
                    className="w-full bg-[#1e1f22] border border-[#232428] rounded-xl pl-9 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#5865f2]"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFriendModal(false)}
                  className="flex-1 bg-[#1e1f22] hover:bg-[#35373c] text-white font-bold py-3 rounded-xl text-xs transition"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-[#5865f2]/30"
                >
                  Vriend Toevoegen
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
        isDestructive={true}
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
