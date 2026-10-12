import React, { useState, useEffect, useRef } from 'react';

// --- ICONEN ---
const IconDashboard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const IconServer = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const IconChat = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);
const IconLink = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);
const IconSettings = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconChevronRight = () => (
  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);
const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const IconBan = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

// --- STANDAARD GEGEVENS VOOR NIEUWE ACCOUNTS ---
const DEFAULT_SERVERS = [
  {
    id: 's_default_1',
    name: 'Chunkz Official SMP',
    icon: '⛏️',
    channels: [
      { id: 'c_1', name: 'algemeen-chat' },
      { id: 'c_2', name: 'mc-builds' }
    ],
    messages: {
      'c_1': [
        { id: 'm1', sender: 'ChunkzAdmin#9999', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin', text: 'Welkom op Chunkz SMP! Veel gameplezier.', time: '12:00' }
      ]
    }
  },
  {
    id: 's_default_2',
    name: 'Palworld Guild NL',
    icon: '🐾',
    channels: [
      { id: 'c_3', name: 'general-pals' }
    ],
    messages: {
      'c_3': [
        { id: 'm2', sender: 'PalMaster#1010', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Pal', text: 'Wie gaat er mee voor de volgende boss raid?', time: '14:30' }
      ]
    }
  }
];

const DEFAULT_FRIENDS = [
  { id: 'f_1', name: 'PopeyeSpeirs#1111', status: 'online', game: 'ARC Raiders', tag: '⚡ ARC', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Popeye', isBlocked: false },
  { id: 'f_2', name: 'grimmkiller#5127', status: 'offline', game: 'Niet Actief', tag: '💙 Anii', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Grimm', isBlocked: false },
  { id: 'f_3', name: 'VermeerCraats#2026', status: 'online', game: 'Elden Ring', tag: '🏆 Boss', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Vermeer', isBlocked: false }
];

const DEFAULT_CONNECTIONS = [
  { id: 'conn_fb', platform: 'Facebook', handle: 'Maffia Games', verified: true, icon: '🌐', color: 'bg-blue-600' },
  { id: 'conn_psn', platform: 'PlayStation', handle: 'Maffia_Games_', verified: true, icon: '🎮', color: 'bg-indigo-600' },
  { id: 'conn_steam', platform: 'Steam', handle: 'maffia_games', verified: true, details: '91 games', icon: '💨', color: 'bg-slate-800' },
  { id: 'conn_tiktok', platform: 'TikTok', handle: 'maffiagames', verified: true, details: '113 volgers', icon: '📱', color: 'bg-pink-600' },
  { id: 'conn_xbox', platform: 'Xbox', handle: 'maffiagames', verified: true, icon: '🟢', color: 'bg-green-600' }
];

export default function App() {
  // GEBRUIKERS BEHEREN IN LOCALSTORAGE
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('gh_reg_users_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeUser, setActiveUser] = useState(() => {
    const saved = localStorage.getItem('gh_active_user_v2');
    return saved ? JSON.parse(saved) : null;
  });

  // INLOGGEN / REGISTRATIE STATE
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

  // NAVIGATIE & INTERFACE STATE
  const [activeTab, setActiveTab] = useState('dashboard');
  const [smsBackup, setSmsBackup] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('All');

  // DISCORD & SERVERS STATE
  const [userServers, setUserServers] = useState(() => activeUser?.servers || DEFAULT_SERVERS);
  const [selectedServerId, setSelectedServerId] = useState(() => userServers[0]?.id || 's_default_1');
  const [selectedChannelId, setSelectedChannelId] = useState(() => userServers[0]?.channels[0]?.id || 'c_1');
  const [chatInput, setChatInput] = useState('');

  // VRIENDEN & DM STATE
  const [userFriends, setUserFriends] = useState(() => activeUser?.friends || DEFAULT_FRIENDS);
  const [activeDmFriend, setActiveDmFriend] = useState(null);
  const [dmMessages, setDmMessages] = useState({});
  const [dmInput, setDmInput] = useState('');

  // VERBINDINGEN STATE
  const [userConnections, setUserConnections] = useState(() => activeUser?.connections || DEFAULT_CONNECTIONS);

  // MODAL STATES
  const [showAddServerModal, setShowAddServerModal] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerIcon, setNewServerIcon] = useState('🎮');

  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [newFriendInput, setNewFriendInput] = useState('');

  const [showAddConnModal, setShowAddConnModal] = useState(false);
  const [connPlatform, setConnPlatform] = useState('Twitch');
  const [connHandle, setConnHandle] = useState('');

  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [settingsMsg, setSettingsMsg] = useState('');

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [userServers, dmMessages]);

  // HULPFUNCTIE OM DE ACTIEVE GEBRUIKER OP TE SLAAN
  const saveUserData = (updatedFields) => {
    if (!activeUser) return;
    const updatedUser = { ...activeUser, ...updatedFields };
    setActiveUser(updatedUser);
    localStorage.setItem('gh_active_user_v2', JSON.stringify(updatedUser));

    const updatedUsersList = registeredUsers.map(u => 
      u.email === activeUser.email ? updatedUser : u
    );
    setRegisteredUsers(updatedUsersList);
    localStorage.setItem('gh_reg_users_v2', JSON.stringify(updatedUsersList));
  };

  // HANDLERS VOOR AUTHENTICATIE
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    const found = registeredUsers.find(
      u => (u.email.toLowerCase() === loginIdentifier.toLowerCase() || u.username.toLowerCase() === loginIdentifier.toLowerCase()) && u.password === loginPassword
    );

    if (!found) {
      setAuthError('Geen geldig account gevonden met deze gegevens.');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setPendingUser(found);
    setAuthMode('2fa');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError('');

    const exists = registeredUsers.some(
      u => u.email.toLowerCase() === regEmail.toLowerCase() || u.username.toLowerCase() === regUsername.toLowerCase()
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
      bio: 'GamerHub Ultra lid',
      totalHours: '14.466h',
      gamesCount: '1.071',
      achievementsCount: '6.895',
      servers: DEFAULT_SERVERS,
      friends: DEFAULT_FRIENDS,
      connections: DEFAULT_CONNECTIONS
    };

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setPendingUser(newUser);
    setAuthMode('2fa');
  };

  const handleVerify2FA = (e) => {
    e.preventDefault();
    if (inputOtp !== generatedOtp) {
      setAuthError('Onjuiste SMS-code! Vul de 6 cijfers in uit het SMS-bericht.');
      return;
    }

    let updatedList = [...registeredUsers];
    const index = updatedList.findIndex(u => u.email === pendingUser.email);
    if (index === -1) {
      updatedList.push(pendingUser);
    } else {
      updatedList[index] = pendingUser;
    }

    setRegisteredUsers(updatedList);
    localStorage.setItem('gh_reg_users_v2', JSON.stringify(updatedList));

    setActiveUser(pendingUser);
    localStorage.setItem('gh_active_user_v2', JSON.stringify(pendingUser));

    setUserServers(pendingUser.servers || DEFAULT_SERVERS);
    setUserFriends(pendingUser.friends || DEFAULT_FRIENDS);
    setUserConnections(pendingUser.connections || DEFAULT_CONNECTIONS);

    setEditAvatarUrl(pendingUser.avatar);
    setEditBio(pendingUser.bio);
    setEditPassword(pendingUser.password);

    setPendingUser(null);
    setInputOtp('');
    setAuthError('');
  };

  const handleLogout = () => {
    setActiveUser(null);
    localStorage.removeItem('gh_active_user_v2');
    setAuthMode('login');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Weet je zeker dat je je account definitief wilt verwijderen?')) {
      const updatedList = registeredUsers.filter(u => u.email !== activeUser.email);
      setRegisteredUsers(updatedList);
      localStorage.setItem('gh_reg_users_v2', JSON.stringify(updatedList));
      handleLogout();
    }
  };

  // HANDLERS VOOR CHAT & SERVERS
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMsg = {
      id: 'm_' + Date.now(),
      sender: activeUser.username,
      avatar: activeUser.avatar,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedServers = userServers.map(server => {
      if (server.id === selectedServerId) {
        const channelMsgs = server.messages?.[selectedChannelId] || [];
        return {
          ...server,
          messages: {
            ...server.messages,
            [selectedChannelId]: [...channelMsgs, newMsg]
          }
        };
      }
      return server;
    });

    setUserServers(updatedServers);
    saveUserData({ servers: updatedServers });
    setChatInput('');
  };

  const handleCreateServer = (e) => {
    e.preventDefault();
    if (!newServerName.trim()) return;

    const newServer = {
      id: 's_' + Date.now(),
      name: newServerName,
      icon: newServerIcon || '🎮',
      channels: [
        { id: 'c_' + Date.now(), name: 'algemeen' }
      ],
      messages: {}
    };

    const updated = [...userServers, newServer];
    setUserServers(updated);
    setSelectedServerId(newServer.id);
    setSelectedChannelId(newServer.channels[0].id);
    saveUserData({ servers: updated });

    setNewServerName('');
    setShowAddServerModal(false);
  };

  const handleDeleteServer = (serverId) => {
    if (userServers.length <= 1) {
      alert('Je moet minimaal 1 server behouden.');
      return;
    }
    if (window.confirm('Server definitief verwijderen?')) {
      const updated = userServers.filter(s => s.id !== serverId);
      setUserServers(updated);
      setSelectedServerId(updated[0].id);
      setSelectedChannelId(updated[0].channels[0]?.id || '');
      saveUserData({ servers: updated });
    }
  };

  // HANDLERS VOOR VRIENDEN & DM'S
  const handleAddFriend = (e) => {
    e.preventDefault();
    if (!newFriendInput.trim()) return;

    const newFriend = {
      id: 'f_' + Date.now(),
      name: newFriendInput.includes('#') ? newFriendInput : `${newFriendInput}#${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'online',
      game: 'GamerHub Lid',
      tag: '🎮 New',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${newFriendInput}`,
      isBlocked: false
    };

    const updated = [...userFriends, newFriend];
    setUserFriends(updated);
    saveUserData({ friends: updated });
    setNewFriendInput('');
    setShowAddFriendModal(false);
  };

  const handleToggleBlockFriend = (friendId) => {
    const updated = userFriends.map(f => f.id === friendId ? { ...f, isBlocked: !f.isBlocked } : f);
    setUserFriends(updated);
    saveUserData({ friends: updated });
  };

  const handleDeleteFriend = (friendId) => {
    if (window.confirm('Vriend verwijderen uit je lijst?')) {
      const updated = userFriends.filter(f => f.id !== friendId);
      setUserFriends(updated);
      if (activeDmFriend?.id === friendId) setActiveDmFriend(null);
      saveUserData({ friends: updated });
    }
  };

  const handleSendDm = () => {
    if (!dmInput.trim() || !activeDmFriend) return;
    const friendId = activeDmFriend.id;
    const current = dmMessages[friendId] || [];
    const newMsg = {
      id: 'dm_' + Date.now(),
      sender: activeUser.username,
      avatar: activeUser.avatar,
      text: dmInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setDmMessages({ ...dmMessages, [friendId]: [...current, newMsg] });
    setDmInput('');
  };

  // HANDLERS VOOR VERBINDINGEN
  const handleAddConnection = (e) => {
    e.preventDefault();
    if (!connHandle.trim()) return;

    const colors = {
      Twitch: 'bg-purple-600',
      YouTube: 'bg-red-600',
      Discord: 'bg-indigo-600',
      Spotify: 'bg-emerald-600',
      TikTok: 'bg-pink-600'
    };

    const icons = {
      Twitch: '💜',
      YouTube: '▶️',
      Discord: '💬',
      Spotify: '🎵',
      TikTok: '📱'
    };

    const newConn = {
      id: 'conn_' + Date.now(),
      platform: connPlatform,
      handle: connHandle,
      verified: true,
      icon: icons[connPlatform] || '🌐',
      color: colors[connPlatform] || 'bg-slate-800'
    };

    const updated = [...userConnections, newConn];
    setUserConnections(updated);
    saveUserData({ connections: updated });
    setConnHandle('');
    setShowAddConnModal(false);
  };

  const handleDeleteConn = (connId) => {
    const updated = userConnections.filter(c => c.id !== connId);
    setUserConnections(updated);
    saveUserData({ connections: updated });
  };

  // PROFIEL INSTELINGEN OPSLAAN
  const handleSaveProfile = (e) => {
    e.preventDefault();
    saveUserData({
      avatar: editAvatarUrl || activeUser.avatar,
      bio: editBio || activeUser.bio,
      password: editPassword || activeUser.password
    });
    setSettingsMsg('✅ Profielgegevens opgeslagen!');
    setTimeout(() => setSettingsMsg(''), 3000);
  };

  // INLOGSCHERM WEERGEVEN ALS NIET INGELOGD
  if (!activeUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-2xl mb-3 shadow-lg shadow-indigo-500/30">
              GH
            </div>
            <h1 className="text-2xl font-black text-white">GamerHub Ultra</h1>
            <p className="text-slate-400 text-xs mt-1">
              {authMode === 'login' && 'Meld je aan bij jouw eigen account'}
              {authMode === 'register' && 'Maak jouw unieke GamerHub account aan'}
              {authMode === '2fa' && 'SMS Tweestapsverificatie'}
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs text-center font-semibold">
              ⚠️ {authError}
            </div>
          )}

          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">E-mail of Gebruikersnaam</label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="GamerTag of e-mailadres"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Wachtwoord</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-lg"
              >
                Inloggen
              </button>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(''); }}
                  className="text-xs text-indigo-400 font-semibold underline"
                >
                  Nog geen account? Registreer hier
                </button>
              </div>
            </form>
          )}

          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gebruikersnaam</label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="bijv. MaffiaGamer#1337"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">E-mailadres</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="naam@voorbeeld.nl"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">GSM Nummer (SMS 2FA)</label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+31 6 12345678"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Wachtwoord</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Kies een wachtwoord"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition text-sm shadow-lg mt-2"
              >
                Account Aanmaken
              </button>
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); }}
                  className="text-xs text-indigo-400 font-semibold underline"
                >
                  Al een account? Inloggen
                </button>
              </div>
            </form>
          )}

          {authMode === '2fa' && (
            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div className="bg-slate-950 border border-indigo-500/40 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-extrabold text-indigo-300 uppercase block mb-1">💬 Inkomend SMS Bericht</span>
                <p className="text-xs text-slate-300">Code voor <span className="font-bold text-white">{pendingUser?.phone}</span>:</p>
                <div className="my-2 bg-slate-900 border border-indigo-500/30 rounded-xl py-2 px-4 inline-block">
                  <span className="text-2xl font-mono font-black text-emerald-400 tracking-widest">{generatedOtp}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Code overnemen</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-2xl tracking-widest font-mono text-indigo-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-lg"
              >
                Verifiëren & Inloggen
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const currentServer = userServers.find(s => s.id === selectedServerId) || userServers[0];

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none font-sans">
      
      {/* MOBIELE HEADER */}
      <div className="md:hidden h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white text-sm">
            GH
          </div>
          <span className="font-bold text-sm text-white">GamerHub Ultra</span>
        </div>
        <div className="flex items-center space-x-2">
          <img src={activeUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full bg-slate-800 border border-indigo-500" />
        </div>
      </div>

      {/* HOOFD NAVIGATIEBAR (DISCORD STIJL LINKS) */}
      <div className="order-last md:order-first w-full md:w-20 h-16 md:h-full bg-slate-900 border-t md:border-t-0 md:border-r border-slate-800 flex flex-row md:flex-col items-center justify-around md:justify-start py-0 md:py-6 space-x-1 md:space-x-0 md:space-y-6 z-30 shrink-0">
        <div className="hidden md:flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 items-center justify-center font-black text-white text-xl shadow-lg">
          GH
        </div>
        <hr className="hidden md:block w-10 border-slate-800" />

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`p-3 rounded-2xl transition flex flex-col md:flex-row items-center ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Dashboard & Stats"
        >
          <IconDashboard />
          <span className="text-[9px] md:hidden mt-0.5 font-bold">Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('servers')}
          className={`p-3 rounded-2xl transition flex flex-col md:flex-row items-center ${activeTab === 'servers' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Discord Servers"
        >
          <IconServer />
          <span className="text-[9px] md:hidden mt-0.5 font-bold">Servers</span>
        </button>

        <button
          onClick={() => setActiveTab('friends')}
          className={`p-3 rounded-2xl transition flex flex-col md:flex-row items-center relative ${activeTab === 'friends' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Vrienden & DM's"
        >
          <IconChat />
          <span className="text-[9px] md:hidden mt-0.5 font-bold">Vrienden</span>
        </button>

        <button
          onClick={() => setActiveTab('connections')}
          className={`p-3 rounded-2xl transition flex flex-col md:flex-row items-center ${activeTab === 'connections' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Verbindingen"
        >
          <IconLink />
          <span className="text-[9px] md:hidden mt-0.5 font-bold">Links</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`p-3 rounded-2xl transition flex flex-col md:flex-row items-center ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Account Instellingen"
        >
          <IconSettings />
          <span className="text-[9px] md:hidden mt-0.5 font-bold">Account</span>
        </button>
      </div>

      {/* INHOUD PER TABBLAD */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* --- TAB 1: DASHBOARD & STATS --- */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white">Welkom terug, {activeUser.username}</h1>
                <p className="text-xs md:text-sm text-slate-400">Jouw persoonlijke gaming profiel & statistieken</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {['All Platforms', 'Steam', 'PlayStation', 'Xbox', 'Other'].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPlatform(p)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    selectedPlatform === p ? 'bg-slate-800 text-white border border-slate-700' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xl md:text-2xl font-black text-white">{activeUser.gamesCount || '1.071'}</p>
                  <p className="text-xs text-slate-400">Games Gespeeld</p>
                </div>
                <span className="text-3xl">🎮</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xl md:text-2xl font-black text-amber-400">{activeUser.achievementsCount || '6.895'}</p>
                  <p className="text-xs text-slate-400">Achievements</p>
                </div>
                <span className="text-3xl">🏆</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xl md:text-2xl font-black text-white">17h 1m</p>
                  <p className="text-xs text-slate-400">Langste Sessie</p>
                </div>
                <span className="text-3xl">📅</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xl md:text-2xl font-black text-emerald-400">31h 55m</p>
                  <p className="text-xs text-slate-400">Deze Week</p>
                </div>
                <span className="text-3xl">⚡</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                <div>
                  <h2 className="text-3xl font-black text-white">{activeUser.totalHours || '14.466h'}</h2>
                  <p className="text-xs text-slate-400">Totale speelduur geregistreerd</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">MEEST GESPEELDE GAMES</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span className="text-slate-200">Fortnite</span>
                      </span>
                      <span className="text-slate-400 font-mono">1.986h</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span className="text-slate-200">Call of Duty</span>
                      </span>
                      <span className="text-slate-400 font-mono">1.607h</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span className="text-slate-200">Palworld</span>
                      </span>
                      <span className="text-slate-400 font-mono">860h</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold text-white mb-1">Weekoverzicht</h2>
                  <p className="text-xs text-slate-400 mb-4">Geregistreerde activiteit per dag</p>

                  <div className="flex items-end justify-between h-36 pt-4 pb-2 px-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center space-y-2">
                        <div
                          className={`w-8 rounded-t-lg transition-all ${idx === 4 ? 'bg-amber-400 h-24 shadow-lg' : idx === 3 ? 'bg-slate-700 h-16' : 'bg-slate-800 h-4'}`}
                        ></div>
                        <span className="text-[10px] font-bold text-slate-500">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center space-x-3">
                  <img src={activeUser.avatar} alt="Avatar" className="w-10 h-10 rounded-xl bg-slate-800 border border-indigo-500" />
                  <div>
                    <p className="text-xs font-bold text-white">{activeUser.username}</p>
                    <p className="text-[11px] text-slate-400">{activeUser.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: DISCORD SERVERS & CHAT --- */}
        {activeTab === 'servers' && (
          <div className="flex-1 flex overflow-hidden w-full">
            {/* SERVER LIJST LINKS */}
            <div className="w-16 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 space-y-3 shrink-0">
              {userServers.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedServerId(s.id); setSelectedChannelId(s.channels[0]?.id || ''); }}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg transition ${
                    selectedServerId === s.id ? 'bg-indigo-600 ring-2 ring-indigo-400' : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                  title={s.name}
                >
                  {s.icon}
                </button>
              ))}

              <button
                onClick={() => setShowAddServerModal(true)}
                className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 flex items-center justify-center text-xl font-bold transition"
                title="Server Aanmaken"
              >
                +
              </button>
            </div>

            {/* KANALEN LIJST */}
            <div className="w-48 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h2 className="font-bold text-sm text-white truncate">{currentServer?.name}</h2>
                <button
                  onClick={() => handleDeleteServer(currentServer?.id)}
                  title="Server Verwijderen"
                  className="text-slate-500 hover:text-red-400 p-1"
                >
                  <IconTrash />
                </button>
              </div>

              <div className="p-3 space-y-1 flex-1 overflow-y-auto">
                <p className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-1">Tekstkanalen</p>
                {currentServer?.channels.map((chan) => (
                  <button
                    key={chan.id}
                    onClick={() => setSelectedChannelId(chan.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition ${
                      selectedChannelId === chan.id ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-slate-500">#</span>
                    <span>{chan.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CHAT SCHERM */}
            <div className="flex-1 flex flex-col bg-slate-950">
              <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between">
                <h3 className="font-bold text-slate-200 text-sm">
                  #{currentServer?.channels.find(c => c.id === selectedChannelId)?.name || 'kanaal'}
                </h3>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {(currentServer?.messages?.[selectedChannelId] || []).map((m) => (
                  <div key={m.id} className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 max-w-xl">
                    <img src={m.avatar} alt="Avatar" className="w-8 h-8 rounded-xl bg-slate-800 shrink-0" />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-bold text-indigo-300">{m.sender}</span>
                        <span className="text-[10px] text-slate-500">{m.time}</span>
                      </div>
                      <p className="text-xs text-slate-200">{m.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-900">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Typ een bericht..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <button onClick={handleSendMessage} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3 rounded-xl text-xs">
                    Stuur
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: VRIENDEN & PRIVÉBERICHTEN --- */}
        {activeTab === 'friends' && (
          <div className="flex-1 flex overflow-hidden w-full">
            <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h2 className="font-bold text-white text-sm">Vrienden</h2>
                <button
                  onClick={() => setShowAddFriendModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg"
                >
                  + Vriend
                </button>
              </div>

              <div className="flex-1 p-2 space-y-1 overflow-y-auto">
                {userFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className={`w-full p-2.5 rounded-2xl transition flex items-center justify-between ${
                      activeDmFriend?.id === friend.id ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-slate-800'
                    } ${friend.isBlocked ? 'opacity-40' : ''}`}
                  >
                    <button
                      onClick={() => setActiveDmFriend(friend)}
                      className="flex items-center space-x-3 flex-1 text-left"
                    >
                      <div className="relative">
                        <img src={friend.avatar} alt="Avatar" className="w-9 h-9 rounded-xl bg-slate-800" />
                        <span className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${friend.isBlocked ? 'bg-red-500' : (friend.status === 'online' ? 'bg-emerald-500' : 'bg-slate-600')}`}></span>
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-200 truncate">{friend.name}</p>
                        <p className="text-[10px] text-slate-400">{friend.isBlocked ? 'Geblokkeerd' : friend.game}</p>
                      </div>
                    </button>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleBlockFriend(friend.id)}
                        className={`p-1 rounded-lg ${friend.isBlocked ? 'bg-amber-600/30 text-amber-300' : 'text-slate-500 hover:text-white'}`}
                        title={friend.isBlocked ? 'Deblokkeren' : 'Blokkeren'}
                      >
                        <IconBan />
                      </button>
                      <button
                        onClick={() => handleDeleteFriend(friend.id)}
                        className="p-1 text-slate-500 hover:text-red-400"
                        title="Verwijderen"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-slate-950">
              {activeDmFriend ? (
                <>
                  <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-200 text-sm">{activeDmFriend.name}</h3>
                      <p className="text-[10px] text-emerald-400">{activeDmFriend.game}</p>
                    </div>
                  </div>

                  <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {(dmMessages[activeDmFriend.id] || []).map((m) => (
