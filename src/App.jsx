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

// --- STANDAARD MOCK DATA VOOR NIEUWE GEBRUIKERS ---
const INITIAL_SERVERS = [
  {
    id: 's_default_1',
    name: 'Chunkz Official SMP',
    icon: '⛏️',
    channels: [
      { id: 'c_1', name: 'algemeen' },
      { id: 'c_2', name: 'mc-builds' }
    ],
    messages: {
      'c_1': [
        { id: 'm1', sender: 'ChunkzAdmin#9999', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin', text: 'Welkom op de server!', time: '12:00' }
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
        { id: 'm2', sender: 'PalMaster#1010', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Pal', text: 'Wie komt er meebouwen?', time: '14:30' }
      ]
    }
  }
];

const INITIAL_FRIENDS = [
  { id: 'f_1', name: 'PopeyeSpeirs#1111', status: 'online', game: 'ARC Raiders', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Popeye', isBlocked: false },
  { id: 'f_2', name: 'grimmkiller#5127', status: 'offline', game: 'Niet Actief', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Grimm', isBlocked: false },
  { id: 'f_3', name: 'VermeerCraats#2026', status: 'online', game: 'Elden Ring', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Vermeer', isBlocked: false }
];

const INITIAL_CONNECTIONS = [
  { id: 'conn_psn', platform: 'PlayStation', handle: 'Maffia_Games_', verified: true, icon: '🎮', color: 'bg-indigo-600' },
  { id: 'conn_steam', platform: 'Steam', handle: 'maffia_games', verified: true, details: '91 games', icon: '💨', color: 'bg-slate-800' },
  { id: 'conn_tiktok', platform: 'TikTok', handle: 'maffiagames', verified: true, details: '113 volgers', icon: '📱', color: 'bg-pink-600' }
];

export default function App() {
  // ACCOUNTS EN SESSIE OP SLAAN IN LOCALSTORAGE
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('gh_v4_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('gh_v4_session');
    return saved ? JSON.parse(saved) : null;
  });

  // INLOG / REGISTRATIE STATE
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [inputIdentifier, setInputIdentifier] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // NAVIGATIE STATE
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPlatform, setSelectedPlatform] = useState('All');

  // DISCORD / SERVERS STATE
  const [servers, setServers] = useState(INITIAL_SERVERS);
  const [activeServerId, setActiveServerId] = useState('s_default_1');
  const [activeChannelId, setActiveChannelId] = useState('c_1');
  const [chatMessage, setChatMessage] = useState('');
  const [newChannelName, setNewChannelName] = useState('');

  // VRIENDEN & DM STATE
  const [friends, setFriends] = useState(INITIAL_FRIENDS);
  const [activeFriend, setActiveFriend] = useState(null);
  const [dmHistory, setDmHistory] = useState({});
  const [dmText, setDmText] = useState('');

  // VERBINDINGEN STATE
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);

  // MODALS
  const [showAddServer, setShowAddServer] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerIcon, setNewServerIcon] = useState('🎮');

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');

  const [showAddConn, setShowAddConn] = useState(false);
  const [connPlatform, setConnPlatform] = useState('Twitch');
  const [connHandle, setConnHandle] = useState('');

  // INSTELLINGEN
  const [editAvatar, setEditAvatar] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editHours, setEditHours] = useState('');
  const [editGames, setEditGames] = useState('');
  const [editAchievements, setEditAchievements] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const chatScrollRef = useRef(null);

  // GELIJKTREKKEN MET ACTIEVE GEBRUIKER
  useEffect(() => {
    if (currentUser) {
      setServers(currentUser.servers || INITIAL_SERVERS);
      setFriends(currentUser.friends || INITIAL_FRIENDS);
      setConnections(currentUser.connections || INITIAL_CONNECTIONS);
      setEditAvatar(currentUser.avatar || '');
      setEditBio(currentUser.bio || '');
      setEditPassword(currentUser.password || '');
      setEditHours(currentUser.totalHours || '14.466h');
      setEditGames(currentUser.gamesCount || '1.071');
      setEditAchievements(currentUser.achievementsCount || '6.895');
    }
  }, [currentUser]);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [servers, dmHistory]);

  // SLA GEBRUIKERSGEGEVENS OP
  const saveUserChanges = (updatedUserData) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedUserData };
    setCurrentUser(updated);
    localStorage.setItem('gh_v4_session', JSON.stringify(updated));

    const updatedAll = usersList.map(u => u.email === currentUser.email ? updated : u);
    setUsersList(updatedAll);
    localStorage.setItem('gh_v4_users', JSON.stringify(updatedAll));
  };

  // INLOGGEN
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    const found = usersList.find(
      u => (u.email.toLowerCase() === inputIdentifier.toLowerCase() || u.username.toLowerCase() === inputIdentifier.toLowerCase()) && u.password === inputPassword
    );

    if (!found) {
      setAuthError('Onjuiste gebruikersnaam, e-mailadres of wachtwoord.');
      return;
    }

    setCurrentUser(found);
    localStorage.setItem('gh_v4_session', JSON.stringify(found));
  };

  // REGISTREREN (DIRECT INGELOGD!)
  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError('');

    const exists = usersList.some(
      u => u.email.toLowerCase() === regEmail.toLowerCase() || u.username.toLowerCase() === regUsername.toLowerCase()
    );

    if (exists) {
      setAuthError('Er bestaat al een account met deze gebruikersnaam of e-mail!');
      return;
    }

    const newUser = {
      username: regUsername,
      email: regEmail,
      password: inputPassword,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${regUsername}`,
      bio: 'GamerHub Gamer',
      totalHours: '14.466h',
      gamesCount: '1.071',
      achievementsCount: '6.895',
      servers: INITIAL_SERVERS,
      friends: INITIAL_FRIENDS,
      connections: INITIAL_CONNECTIONS
    };

    const updatedUsers = [...usersList, newUser];
    setUsersList(updatedUsers);
    localStorage.setItem('gh_v4_users', JSON.stringify(updatedUsers));

    setCurrentUser(newUser);
    localStorage.setItem('gh_v4_session', JSON.stringify(newUser));
  };

  // UITLOGGEN
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gh_v4_session');
    setIsRegisterMode(false);
  };

  // ACCOUNT VERWIJDEREN
  const handleDeleteAccount = () => {
    if (window.confirm('Weet je zeker dat je jouw account definitief wilt verwijderen?')) {
      const updated = usersList.filter(u => u.email !== currentUser.email);
      setUsersList(updated);
      localStorage.setItem('gh_v4_users', JSON.stringify(updated));
      handleLogout();
    }
  };

  // BERICHT STUREN IN KANAAL
  const handleSendChannelMessage = () => {
    if (!chatMessage.trim()) return;

    const newMsg = {
      id: 'm_' + Date.now(),
      sender: currentUser.username,
      avatar: currentUser.avatar,
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedServers = servers.map(srv => {
      if (srv.id === activeServerId) {
        const msgs = srv.messages?.[activeChannelId] || [];
        return {
          ...srv,
          messages: {
            ...srv.messages,
            [activeChannelId]: [...msgs, newMsg]
          }
        };
      }
      return srv;
    });

    setServers(updatedServers);
    saveUserChanges({ servers: updatedServers });
    setChatMessage('');
  };

  // SERVER AANMAKEN
  const handleCreateServer = (e) => {
    e.preventDefault();
    if (!newServerName.trim()) return;

    const newSrv = {
      id: 's_' + Date.now(),
      name: newServerName,
      icon: newServerIcon || '🎮',
      channels: [{ id: 'c_' + Date.now(), name: 'algemeen' }],
      messages: {}
    };

    const updated = [...servers, newSrv];
    setServers(updated);
    setActiveServerId(newSrv.id);
    setActiveChannelId(newSrv.channels[0].id);
    saveUserChanges({ servers: updated });
