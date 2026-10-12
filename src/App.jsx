import React, { useState, useEffect, useRef } from 'react';

// --- SVGS & ICONEN ---
const IconNews = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
);
const IconTrophy = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
);
const IconServer = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
);
const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
);
const IconTag = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5a1 1 0 01.707.293l7 7a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A1 1 0 013 12V7a4 4 0 014-4z"/></svg>
);
const IconSettings = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
);
const IconMic = ({ muted }) => (
  <svg className={`w-5 h-5 ${muted ? 'text-red-500' : 'text-emerald-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {muted ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3zM3 3l18 18"/>
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
    )}
  </svg>
);
const IconPhoneOff = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"/></svg>
);
const IconPhoneCall = () => (
  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
);

// --- MOCK DATA ---
const INITIAL_SERVERS = [
  {
    id: 's1',
    name: 'Chunkz Official SMP',
    icon: '⛏️',
    banner: 'bg-gradient-to-r from-amber-600 to-orange-600',
    channels: [
      { id: 'c1', name: 'algemeen-chat', type: 'text' },
      { id: 'c2', name: 'mc-builds-showcase', type: 'text' },
      { id: 'v1', name: '🔊 Spraak Kanaal 1', type: 'voice' }
    ]
  },
  {
    id: 's2',
    name: 'Palworld Guild NL',
    icon: '🐾',
    banner: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    channels: [
      { id: 'c3', name: 'general-pals', type: 'text' },
      { id: 'c4', name: 'pals-ruilen-trade', type: 'text' },
      { id: 'v2', name: '🔊 Raids & Bosses', type: 'voice' }
    ]
  }
];

const GAME_DEALS = [
  { id: 'd1', title: 'Cyberpunk 2077: Ultimate Edition', platform: 'Steam / PC', oldPrice: '€59.99', newPrice: '€19.79', discount: '-67%', isFree: false, expires: 'Nog 2 dagen', store: 'Steam Store' },
  { id: 'd2', title: 'Grand Theft Auto V: Premium', platform: 'Epic Games', oldPrice: '€29.99', newPrice: 'GRATIS', discount: '-100%', isFree: true, expires: 'Epic Game of the Week', store: 'Epic Games Store' },
  { id: 'd3', title: 'The Witcher 3: Wild Hunt Complete', platform: 'PlayStation 5', oldPrice: '€49.99', newPrice: '€12.49', discount: '-75%', isFree: false, expires: 'PSN Spring Sale', store: 'PlayStation Store' },
  { id: 'd4', title: 'EA SPORTS FC 25', platform: 'Xbox Series X/S', oldPrice: '€69.99', newPrice: '€27.99', discount: '-60%', isFree: false, expires: 'Xbox Deals with Gold', store: 'Microsoft Store' }
];

const MOCK_ACHIEVEMENTS = [
  { id: '1', game: 'Elden Ring', title: 'Elden Lord', platform: 'PLAYSTATION', rarity: 'Zeldzaam 8.4%', unlocked: true, icon: '🏆', color: 'from-amber-400 to-yellow-600' },
  { id: '2', game: 'Palworld', title: 'Pal Master Extraordinaire', platform: 'STEAM', rarity: '14.2%', unlocked: true, icon: '🐾', color: 'from-purple-400 to-indigo-600' },
  { id: '3', game: 'Halo Infinite', title: 'Legendary Campaigner', platform: 'XBOX', rarity: '3.1%', unlocked: false, icon: '🎯', color: 'from-emerald-400 to-teal-600' },
  { id: '4', game: 'Minecraft', title: 'Diamonds Everywhere!', platform: 'STEAM', rarity: '65.0%', unlocked: true, icon: '💎', color: 'from-cyan-400 to-blue-600' }
];

const DEFAULT_FRIENDS = [
  { id: 'f1', name: 'MaffiaGamer#1337', status: 'online', game: 'Palworld (PC)', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Maffia' },
  { id: 'f2', name: 'VermeerCraats#2026', status: 'online', game: 'Elden Ring (PS5)', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Vermeer' },
  { id: 'f3', name: 'ChunkzAdmin#9999', status: 'offline', game: 'Niet Actief', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin' }
];

export default function App() {
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('gh_registered_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeUser, setActiveUser] = useState(() => {
    const saved = localStorage.getItem('gh_active_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [pendingUser, setPendingUser] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');

  const [activeTab, setActiveTab] = useState('news');
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editBio, setEditBio] = useState('');
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [friendSearchInput, setFriendSearchInput] = useState('');
  const [addFriendMsg, setAddFriendMsg] = useState('');
  const [inviteCopied, setInviteCopied] = useState(false);

  const [userFriends, setUserFriends] = useState(() => {
    if (activeUser?.friends) return activeUser.friends;
    return DEFAULT_FRIENDS;
  });

  const [servers] = useState(INITIAL_SERVERS);
  const [selectedServer] = useState(INITIAL_SERVERS[0]);
  const [selectedChannel, setSelectedChannel] = useState(INITIAL_SERVERS[0].channels[0]);
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'Alex#1337', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex', text: 'Welkom op GamerHub Ultra! Wie is er in voor Palworld vanavond?', time: '14:20' },
    { id: 'm2', sender: 'VermeerCraats#2026', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Vermeer', text: 'Ik ben al online op de Chunkz SMP server! Wie komt meebouwen?', time: '14:22' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const [activeVoiceChannel, setActiveVoiceChannel] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [activeDmFriend, setActiveDmFriend] = useState(null);
  const [dmMessages, setDmMessages] = useState({});
  const [dmInput, setDmInput] = useState('');
  const [active1on1Call, setActive1on1Call] = useState(null);

  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, dmMessages]);

  useEffect(() => {
    if (activeUser) {
      setEditUsername(activeUser.username || '');
      setEditPassword(activeUser.password || '');
      setEditAvatarUrl(activeUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeUser.username}`);
      setEditBio(activeUser.bio || 'GamerHub Ultra lid 🎮');
    }
  }, [activeUser]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    const found = registeredUsers.find(
      (u) =>
        (u.email.toLowerCase() === loginIdentifier.toLowerCase() ||
          u.username.toLowerCase() === loginIdentifier.toLowerCase()) &&
        u.password === loginPassword
    );

    if (!found) {
      setAuthError('Geen geldig account gevonden. Registreer eerst een nieuw account!');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setPendingUser(found);
    setAuthMode('2fa');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    const exists = registeredUsers.some(
      (u) =>
        u.email.toLowerCase() === regEmail.toLowerCase() ||
        u.username.toLowerCase() === regUsername.toLowerCase()
    );

    if (exists) {
      setAuthError('Er bestaat al een account met dit e-mailadres of deze gebruikersnaam!');
      return;
    }

    const newUser = {
      username: regUsername,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${regUsername}`,
      bio: 'Ready to game!',
      friends: DEFAULT_FRIENDS
    };

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setPendingUser(newUser);
    setAuthMode('2fa');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (inputOtp !== generatedOtp) {
      setAuthError('Onjuiste SMS-code! Vul de code in die hierboven staat.');
      return;
    }

    let updatedUsers = [...registeredUsers];
    const existingIndex = updatedUsers.findIndex((u) => u.email === pendingUser.email);
    if (existingIndex === -1) {
      updatedUsers.push(pendingUser);
    } else {
      updatedUsers[existingIndex] = pendingUser;
    }

    setRegisteredUsers(updatedUsers);
    localStorage.setItem('gh_registered_users', JSON.stringify(updatedUsers));

    setActiveUser(pendingUser);
    localStorage.setItem('gh_active_session', JSON.stringify(pendingUser));
    setUserFriends(pendingUser.friends || DEFAULT_FRIENDS);

    setPendingUser(null);
    setInputOtp('');
    setAuthError('');
  };

  const handleLogout = () => {
    setActiveUser(null);
    localStorage.removeItem('gh_active_session');
    setAuthMode('login');
    setAuthError('');
    setShowSettingsModal(false);
  };

  const handleSaveProfileSettings = (e) => {
    e.preventDefault();
    if (!editUsername.trim()) return;

    const updatedUser = {
      ...activeUser,
      username: editUsername,
      password: editPassword,
      avatar: editAvatarUrl,
      bio: editBio
    };

    setActiveUser(updatedUser);
    localStorage.setItem('gh_active_session', JSON.stringify(updatedUser));

    const updatedUsers = registeredUsers.map((u) =>
      u.email === activeUser.email ? updatedUser : u
    );
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('gh_registered_users', JSON.stringify(updatedUsers));

    setSettingsSavedMsg('✅ Profiel succesvol bijgewerkt!');
    setTimeout(() => setSettingsSavedMsg(''), 3000);
  };

  const handleAddFriendSubmit = (e) => {
    e.preventDefault();
    if (!friendSearchInput.trim()) return;

    const alreadyFriends = userFriends.some(
      (f) => f.name.toLowerCase() === friendSearchInput.toLowerCase()
    );

    if (alreadyFriends) {
      setAddFriendMsg('⚠️ Deze speler staat al in je vriendenlijst!');
      return;
    }

    const newFriendObj = {
      id: 'f_' + Date.now(),
      name: friendSearchInput.includes('#') ? friendSearchInput : `${friendSearchInput}#${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'online',
      game: 'GamerHub Ultra Member',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${friendSearchInput}`
    };

    const updatedList = [...userFriends, newFriendObj];
    setUserFriends(updatedList);

    const updatedUser = { ...activeUser, friends: updatedList };
    setActiveUser(updatedUser);
    localStorage.setItem('gh_active_session', JSON.stringify(updatedUser));

    setFriendSearchInput('');
    setAddFriendMsg(`🎉 ${newFriendObj.name} is toegevoegd aan je vrienden!`);
    setTimeout(() => setAddFriendMsg(''), 4000);
  };

  const handleCopyInviteLink = () => {
    const inviteUrl = `https://gamerhub.app/invite/${activeUser?.username?.replace('#', '_') || 'player'}`;
    navigator.clipboard?.writeText(inviteUrl);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 3000);
  };

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: activeUser ? activeUser.username : 'Jij#0001',
      avatar: activeUser?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeUser?.username || 'You'}`,
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setInputMsg('');
  };

  const handleSendDm = () => {
    if (!dmInput.trim() || !activeDmFriend) return;
    const friendId = activeDmFriend.id;
    const existing = dmMessages[friendId] || [];
    const newMsg = {
      id: Date.now().toString(),
      sender: activeUser ? activeUser.username : 'Jij#0001',
      avatar: activeUser?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeUser?.username || 'You'}`,
      text: dmInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setDmMessages({ ...dmMessages, [friendId]: [...existing, newMsg] });
    setDmInput('');
  };

  const handleChannelClick = (channel) => {
    if (channel.type === 'voice') {
      if (activeVoiceChannel?.id === channel.id) {
        setActiveVoiceChannel(null);
      } else {
        setActiveVoiceChannel(channel);
      }
    } else {
      setSelectedChannel(channel);
      setShowMobileSidebar(false);
    }
  };

  if (!activeUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-2xl mb-3 shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-500/20">
              GH
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">GamerHub Ultra</h1>
            <p className="text-slate-400 text-xs mt-1">
              {authMode === 'login' && 'Meld je aan om verder te gaan'}
              {authMode === 'register' && 'Maak jouw GamerHub account aan'}
              {authMode === '2fa' && 'Tweestapsverificatie (SMS)'}
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs text-center font-semibold">
              ⚠️ {authError}
            </div>
          )}

          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">E-mail of Gebruikersnaam</label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="GamerTag of e-mail"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Wachtwoord</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-lg shadow-indigo-600/30"
              >
                Inloggen
              </button>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(''); }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Nog geen account? <span className="underline">Registreer hier</span>
                </button>
              </div>
            </form>
          )}

          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gebruikersnaam</label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="bijv. MaffiaGamer#1337"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">E-mailadres</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="naam@voorbeeld.nl"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">GSM Nummer (SMS 2FA)</label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+31 6 12345678"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Wachtwoord</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Kies een sterk wachtwoord"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl transition text-sm shadow-lg shadow-indigo-600/30 mt-2"
              >
                {"Account Aanmaken & Verifiëren"}
              </button>
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Al een account? <span className="underline">Inloggen</span>
                </button>
              </div>
            </form>
          )}

          {authMode === '2fa' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-gradient-to-b from-indigo-950/80 to-purple-950/80 border border-indigo-500/40 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-widest block mb-1">💬 Inkomend SMS Bericht</span>
                <p className="text-xs text-slate-300">Verzonden naar <span className="font-bold text-white">{pendingUser?.phone}</span>:</p>
                <div className="my-2 bg-slate-950/80 border border-indigo-500/30 rounded-xl py-2 px-4 inline-block">
                  <span className="text-2xl font-mono font-black text-emerald-400 tracking-widest">{generatedOtp}</span>
                </div>
                <p className="text-[10px] text-slate-400">Neem deze 6 cijfers hieronder over.</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">SMS Code Invoeren</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-center text-2xl tracking-widest font-mono text-indigo-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-lg shadow-emerald-600/30"
              >
                {"Verifiëren & Starten"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      <div className="md:hidden h-14 bg-slate-900 border-b border-slate-800/80 px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white text-sm shadow-md">
            GH
          </div>
          <span className="font-bold text-sm tracking-wide text-white">GamerHub Ultra</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setShowSettingsModal(true)} className="relative group">
            <img
              src={activeUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeUser.username}`}
              alt="Avatar"
              className="w-8 h-8 rounded-full bg-slate-800 border border-indigo-500/50 object-cover"
            />
          </button>
          <button onClick={() => setShowSettingsModal(true)} className="text-slate-400 p-1.5 bg-slate-800 rounded-lg">
            <IconSettings />
          </button>
        </div>
      </div>

      <div className="order-last md:order-first w-full md:w-20 h-16 md:h-full bg-slate-900/90 border-t md:border-t-0 md:border-r border-slate-800/80 flex flex-row md:flex-col items-center justify-around md:justify-start py-0 md:py-6 space-x-1 md:space-x-0 md:space-y-6 z-30 shrink-0">
        <div className="hidden md:flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-600/30">
          GH
        </div>
        <hr className="hidden md:block w-10 border-slate-800" />

        <button
          onClick={() => { setActiveTab('news'); setShowMobileSidebar(true); }}
          className={`p-2.5 md:p-3.5 rounded-2xl transition flex flex-col md:flex-row items-center ${activeTab === 'news' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Gamenieuws"
        >
          <IconNews />
          <span className="text-[9px] md:hidden mt-0.5 font-bold">Nieuws</span>
        </button>

        <button
          onClick={() => { setActiveTab('deals'); setShowMobileSidebar(true); }}
          className={`p-2.5 md:p-3.5 rounded-2xl transition flex flex-col md:flex-row items-center relative ${activeTab === 'deals' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Game Deals & Kortingen"
        >
          <IconTag />
          <span className="text-[9px] md:hidden mt-0.5 font-bold">Deals</span>
          <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1 rounded-full">%-</span>
        </button>

        <button
          onClick={() => { setActiveTab('trophies'); setShowMobileSidebar(true); }}
          className={`p-2.5 md:p-3.5 rounded-2xl transition flex flex-col md:flex-row items-center ${activeTab === 'trophies' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Pyroblast Trophies"
        >
          <IconTrophy />
          <span className="text-[9px] md:hidden mt-0.5 font-bold">Trophies</span>
        </button>

        <button
          onClick={() => { setActiveTab('servers'); setShowMobileSidebar(true); }}
          className={`p-2.5 md:p-3.5 rounded-2xl transition flex flex-col md:flex-row items-center ${activeTab === 'servers' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Discord Servers"
        >
          <IconServer />
          <span className="text-[9px] md:hidden mt-0.5 font-bold">Servers</span>
        </button>

        <button
          onClick={() => { setActiveTab('friends'); setShowMobileSidebar(true); }}
          className={`p-2.5 md:p-3.5 rounded-2xl transition flex flex-col md:flex-row items-center ${activeTab === 'friends' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Vrienden & DM's"
        >
          <IconUsers />
          <span className="text-[9px] md:hidden mt-0.5 font-bold">Vrienden</span>
        </button>

        <div className="hidden md:flex md:mt-auto md:pt-4 md:border-t border-slate-800 flex-col items-center space-y-3">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center border border-slate-700/60"
            title="Account Instellingen"
          >
            <IconSettings />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {activeTab === 'news' && (
          <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-3xl font-black text-white">{"Gamenieuws & Trending"}</h1>
                <p className="text-xs md:text-sm text-slate-400">Laatste updates uit de gamingwereld</p>
              </div>
              <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs px-3 py-1.5 rounded-full font-bold">
                LIVE FEED
              </span>
            </div>

            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md">BREAKING</span>
                <span className="text-xs text-indigo-200 font-semibold">Gamer.nl • 10m geleden</span>
              </div>
              <h2 className="text-lg md:text-2xl font-black text-white max-w-xl">
                {"Palworld Update 0.3.0 Brengt Officieel Crossplay Tussen PlayStation 5 & PC Dedicated Servers!"}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-lg">
                Ontwikkelaar Pocketpair bevestigt dat spelers wereldwijd nu samen kunnen bouwen, ruilen en vechten op universele Dedicated Servers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400">IGN • 1u geleden</span>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md">TROPHIES</span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-base">Elden Ring DLC Shadow of the Erdtree Platina Trophies Bekend</h3>
                  <p className="text-xs text-slate-400 mt-2">Bekijk alle 18 nieuwe geheime achievements en baas-trophies voor de grote uitbreiding.</p>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-400">Tweakers • 3u geleden</span>
                    <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-md">HARDWARE</span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-base">PlayStation 5 Pro Specificaties Gelekt: 45% Snellere GPU</h3>
                  <p className="text-xs text-slate-400 mt-2">Nieuwe AI-upscaling technologie PSSR belooft 4K gaming met stabiele 60fps in zware titels.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-3xl font-black text-white">{"Game Deals & Gratis Games"}</h1>
                <p className="text-xs md:text-sm text-slate-400">{"De beste kortingen op Steam, PlayStation, Xbox & Epic Games"}</p>
              </div>
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-3 py-1.5 rounded-full font-bold">
                🔥 HOT DEALS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GAME_DEALS.map((deal) => (
                <div key={deal.id} className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
                  {deal.isFree && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl shadow-lg">
                      GRATIS GAME
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">{deal.platform}</span>
                      <span className="text-[10px] font-bold text-amber-400">{deal.store}</span>
                    </div>
                    <h3 className="font-bold text-slate-100 text-base md:text-lg">{deal.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">Geldig: <span className="text-slate-300 font-semibold">{deal.expires}</span></p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-sm line-through text-slate-500">{deal.oldPrice}</span>
                      <span className="text-xl font-black text-emerald-400">{deal.newPrice}</span>
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-md">{deal.discount}</span>
                    </div>
                    <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-md transition">
                      Claim Deal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trophies' && (
          <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950/60 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h1 className="text-xl md:text-2xl font-black text-white">Pyroblast Trophy Hub</h1>
                  <span className="bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-black px-2.5 py-0.5 rounded-full">
                    LEVEL 42
                  </span>
                </div>
                <p className="text-xs text-slate-400">Ingelogd als: <span className="text-indigo-400 font-bold">{activeUser.username}</span></p>
                
                <div className="w-full md:w-64 bg-slate-950 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-amber-400 to-indigo-500 h-full w-[78%]"></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">78% voortgang naar Level 43</p>
              </div>

              <div className="flex space-x-3">
                <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Totaal</p>
                  <p className="text-lg font-black text-amber-400">1,240</p>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Platina 🏆</p>
                  <p className="text-lg font-black text-indigo-400">14</p>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Goud 🥇</p>
                  <p className="text-lg font-black text-yellow-500">85</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Recente Achievements</h2>
              {MOCK_ACHIEVEMENTS.map((item) => (
                <div key={item.id} className="bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 transition rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm md:text-base">{item.title}</h3>
                      <p className="text-xs text-slate-400">{item.game} • <span className="text-indigo-400 font-semibold">{item.platform}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] md:text-xs px-2.5 py-1 rounded-full font-bold ${item.unlocked ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
                      {item.unlocked ? 'Ontgrendeld' : 'Vergrendeld'}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">{item.rarity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'servers' && (
          <div className="flex-1 flex overflow-hidden w-full">
            <div className={`${showMobileSidebar ? 'flex' : 'hidden md:flex'} w-full md:w-64 bg-slate-900/90 border-r border-slate-800/80 flex-col z-10`}>
              <div className={`p-4 border-b border-slate-800 ${selectedServer.banner} text-white`}>
                <h2 className="font-black text-base">{selectedServer.name}</h2>
                <p className="text-[10px] opacity-80">24 Leden Online</p>
              </div>

              <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2"># Tekstkanalen</div>
                {selectedServer.channels.filter(c => c.type === 'text').map((chan) => (
                  <button
                    key={chan.id}
                    onClick={() => handleChannelClick(chan)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs md:text-sm flex items-center space-x-2 transition ${
                      selectedChannel.id === chan.id ? 'bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-slate-500 font-bold">#</span>
                    <span>{chan.name}</span>
                  </button>
                ))}

                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 pt-3">🔊 Spraakkanalen</div>
                {selectedServer.channels.filter(c => c.type === 'voice').map((chan) => (
                  <button
                    key={chan.id}
                    onClick={() => handleChannelClick(chan)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs md:text-sm flex items-center justify-between transition ${
                      activeVoiceChannel?.id === chan.id ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>🔊</span>
                      <span>{chan.name}</span>
                    </div>
                    {activeVoiceChannel?.id === chan.id && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>}
                  </button>
                ))}
              </div>

              {activeVoiceChannel && (
                <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{activeVoiceChannel.name}</p>
                      <p className="text-[10px] text-emerald-400 font-mono">128 kbps RTC</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700">
                      <IconMic muted={isMuted} />
                    </button>
                    <button onClick={() => setActiveVoiceChannel(null)} className="p-2 rounded-xl bg-red-600 hover:bg-red-500">
                      <IconPhoneOff />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className={`${!showMobileSidebar ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-slate-950 w-full h-full`}>
              <div className="h-14 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <button onClick={() => setShowMobileSidebar(true)} className="md:hidden text-xs text-indigo-400 font-bold bg-slate-800 px-3 py-1.5 rounded-xl">
                    ← Kanalen
                  </button>
                  <h3 className="font-bold text-slate-200 text-sm md:text-base">#{selectedChannel.name}</h3>
                </div>
              </div>

              <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 max-w-xl">
                    <img src={m.avatar} alt="Avatar" className="w-9 h-9 rounded-xl bg-slate-800 border border-indigo-500/30 shrink-0" />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-bold text-indigo-300">{m.sender}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{m.time}</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-200">{m.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="p-3 md:p-4 border-t border-slate-800 bg-slate-900/80">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`Bericht in #${selectedChannel.name}...`}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3 rounded-xl transition text-xs md:text-sm shadow-lg shadow-indigo-600/30"
                  >
                    Stuur
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="flex-1 flex overflow-hidden w-full">
            <div className={`${showMobileSidebar ? 'flex' : 'hidden md:flex'} w-full md:w-64 bg-slate-900/90 border-r border-slate-800/80 flex-col z-10`}>
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h2 className="font-bold text-slate-200 text-base">{"Vrienden & DM's"}</h2>
                <button
                  onClick={() => setShowAddFriendModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-md"
                >
                  + Vriend
                </button>
              </div>

              <div className="flex-1 p-2 space-y-1 overflow-y-auto">
                {userFriends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => { setActiveDmFriend(friend); setShowMobileSidebar(false); }}
                    className={`w-full text-left p-3 rounded-2xl transition flex items-center justify-between ${
                      activeDmFriend?.id === friend.id ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img src={friend.avatar} alt="Avatar" className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700" />
                        <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${friend.status === 'online' ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">{friend.name}</p>
                        <p className="text-[10px] text-slate-400">{friend.game}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className={`${!showMobileSidebar ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-slate-950 w-full h-full`}>
              {activeDmFriend ? (
                <>
                  <div className="h-14 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => setShowMobileSidebar(true)} className="md:hidden text-xs text-indigo-400 font-bold bg-slate-800 px-3 py-1.5 rounded-xl">
                        ← Vrienden
                      </button>
                      <div>
                        <h3 className="font-bold text-slate-200 text-sm md:text-base">{activeDmFriend.name}</h3>
                        <p className="text-[10px] text-emerald-400 font-medium">{activeDmFriend.game}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActive1on1Call(active1on1Call ? null : activeDmFriend)}
                      className={`p-2.5 rounded-xl border transition ${
                        active1on1Call ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-emerald-400'
                      }`}
                    >
                      <IconPhoneCall />
                    </button>
                  </div>

                  {active1on1Call && (
                    <div className="bg-emerald-950/60 border-b border-emerald-500/40 p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500 flex items-center justify-center animate-pulse text-lg">
                          📞
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-200">Spraakoproep met {active1on1Call.name}</p>
                          <p className="text-[10px] text-emerald-400 font-mono">Verbonden • 00:42</p>
                        </div>
                      </div>
                      <button onClick={() => setActive1on1Call(null)} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow-lg">
                        Ophangen
                      </button>
                    </div>
                  )}

                  <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
                    {(dmMessages[activeDmFriend.id] || []).map((m) => (
                      <div key={m.id} className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 max-w-xl">
                        <img src={m.avatar} alt="Avatar" className="w-8 h-8 rounded-xl bg-slate-800 shrink-0" />
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-bold text-indigo-300">{m.sender}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{m.time}</span>
                          </div>
                          <p className="text-xs md:text-sm text-slate-200">{m.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 md:p-4 border-t border-slate-800 bg-slate-900/80">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={dmInput}
                        onChange={(e) => setDmInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendDm()}
                        placeholder={`Privébericht naar ${activeDmFriend.name}...`}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                      <button onClick={handleSendDm} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3 rounded-xl text-xs md:text-sm shadow-lg shadow-indigo-600/30">
                        Stuur
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs md:text-sm p-4 text-center">
                  <p>Selecteer een vriend uit de lijst om te chatten of te bellen.</p>
                  <button
                    onClick={() => setShowAddFriendModal(true)}
                    className="mt-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg"
                  >
                    + Vriend Toevoegen op Gebruikersnaam
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <IconSettings />
                <h2 className="text-lg font-black text-white">Account Instellingen</h2>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {settingsSavedMsg && (
              <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs text-center font-bold">
                {settingsSavedMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfileSettings} className="space-y-4">
              <div className="flex items-center space-x-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <img
                  src={editAvatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeUser.username}`}
                  alt="Avatar Preview"
                  className="w-16 h-16 rounded-2xl bg-slate-800 border border-indigo-500/50 object-cover"
                />
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Profielfoto URL</label>
                  <input
                    type="url"
                    value={editAvatarUrl}
                    onChange={(e) => setEditAvatarUrl(e.target.value)}
                    placeholder="https://voorbeeld.nl/foto.jpg"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gebruikersnaam</label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Wachtwoord Wijzigen</label>
                <input
                  type="password"
                  required
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status / Bio</label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Wat ben je aan het gamen?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-bold px-4 py-2.5 rounded-xl transition"
                >
                  Uitloggen
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/30"
                >
                  Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddFriendModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-white">+ Vriend Toevoegen</h2>
              <button
                onClick={() => setShowAddFriendModal(false)}
                className="text-slate-400 hover:text-white bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {addFriendMsg && (
              <div className="mb-4 p-3 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-300 text-xs text-center font-bold">
                {addFriendMsg}
              </div>
            )}

            <form onSubmit={handleAddFriendSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gebruikersnaam van vriend</label>
                <input
                  type="text"
                  required
                  value={friendSearchInput}
                  onChange={(e) => setFriendSearchInput(e.target.value)}
                  placeholder="bijv. VermeerCraats#2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition text-xs md:text-sm shadow-lg shadow-indigo-600/30"
              >
                Vriendverzoek Versturen
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400 mb-2">Of deel jouw unieke invite link:</p>
              <button
                onClick={handleCopyInviteLink}
                className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-400 text-xs font-mono font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-2"
              >
                <span>{inviteCopied ? '✅ Link Gekopieerd!' : '📋 Kopieer Persoonlijke Invite Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
