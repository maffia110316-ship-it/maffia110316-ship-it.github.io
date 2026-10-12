import React, { useState, useEffect, useRef } from 'react';

// --- ICONEN ---
const IconNews = () => (
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
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

// --- STANDAARD MOCK DATA ---
const INITIAL_SERVERS = []; /* Nieuwe accounts beginnen zonder servers. */
/*
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
{ id: 'm1', sender: 'ChunkzAdmin#9999', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin', text: 'Welkom op de Chunkz SMP community server!', time: '12:00' }
]
}
},
{
id: 's_default_2',
name: 'Palworld Guild NL',
icon: '🐾',
channels: [{ id: 'c_3', name: 'general-pals' }],
messages: {
'c_3': [
{ id: 'm2', sender: 'PalMaster#1010', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Pal', text: 'Wie doet er mee met de volgende boss raid?', time: '14:30' }
]
}
}
]; */

const INITIAL_FRIENDS = []; /* Nieuwe accounts beginnen zonder vrienden. */
/*
{ id: 'f_1', name: 'PopeyeSpeirs#1111', status: 'online', game: 'ARC Raiders', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Popeye', isBlocked: false },
{ id: 'f_2', name: 'grimmkiller#5127', status: 'offline', game: 'Niet Actief', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Grimm', isBlocked: false },
{ id: 'f_3', name: 'VermeerCraats#2026', status: 'online', game: 'Elden Ring', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Vermeer', isBlocked: false }
]; */

const INITIAL_CONNECTIONS = []; /* Geen vooraf gekoppelde accounts. */
/*
{ id: 'conn_psn', platform: 'PlayStation', handle: 'Maffia_Games_', verified: true, icon: '🎮', color: 'bg-indigo-600' },
{ id: 'conn_steam', platform: 'Steam', handle: 'maffia_games', verified: true, details: '91 games', icon: '💨', color: 'bg-slate-800' },
{ id: 'conn_tiktok', platform: 'TikTok', handle: 'maffiagames', verified: true, details: '113 volgers', icon: '📱', color: 'bg-pink-600' }
]; */

export default function App() {
const [usersList, setUsersList] = useState(() => {
const saved = localStorage.getItem('gh_v5_users');
return saved ? JSON.parse(saved) : [];
});

const [currentUser, setCurrentUser] = useState(() => {
const saved = localStorage.getItem('gh_v5_session');
return saved ? JSON.parse(saved) : null;
});

const [isRegisterMode, setIsRegisterMode] = useState(false);
const [authError, setAuthError] = useState('');
const [inputIdentifier, setInputIdentifier] = useState('');
const [inputPassword, setInputPassword] = useState('');
const [regUsername, setRegUsername] = useState('');
const [regEmail, setRegEmail] = useState('');

const [activeTab, setActiveTab] = useState('news');
const [liveNews, setLiveNews] = useState([]);
const [loadingNews, setLoadingNews] = useState(false);

const [servers, setServers] = useState([]);
const [activeServerId, setActiveServerId] = useState('');
const [activeChannelId, setActiveChannelId] = useState('');
const [chatMessage, setChatMessage] = useState('');
const [newChannelName, setNewChannelName] = useState('');

const [friends, setFriends] = useState([]);
const [activeFriend, setActiveFriend] = useState(null);
const [dmHistory, setDmHistory] = useState({});
const [dmText, setDmText] = useState('');

const [connections, setConnections] = useState([]);

const [showAddServer, setShowAddServer] = useState(false);
const [newServerName, setNewServerName] = useState('');
const [newServerIcon, setNewServerIcon] = useState('🎮');

const [showAddFriend, setShowAddFriend] = useState(false);
const [newFriendName, setNewFriendName] = useState('');

const [showAddConn, setShowAddConn] = useState(false);
const [connPlatform, setConnPlatform] = useState('Twitch');
const [connHandle, setConnHandle] = useState('');

const [editAvatar, setEditAvatar] = useState('');
const [editBio, setEditBio] = useState('');
const [editPassword, setEditPassword] = useState('');
const [editHours, setEditHours] = useState('');
const [editGames, setEditGames] = useState('');
const [editAchievements, setEditAchievements] = useState('');
const [statusMsg, setStatusMsg] = useState('');

const chatScrollRef = useRef(null);

// OPHALEN LIVE GAMING NIEUWS VIA RSS-TO-JSON API
const fetchLiveNews = async () => {
setLoadingNews(true);
try {
const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.gamer.nl/feed');
const data = await res.json();
if (data.items) {
setLiveNews(data.items);
}
} catch (e) {
console.error('Fout bij ophalen nieuws:', e);
} finally {
setLoadingNews(false);
}
};

useEffect(() => {
fetchLiveNews();
}, []);

useEffect(() => {
if (currentUser) {
setServers(currentUser.servers || []);
setFriends(currentUser.friends || []);
setConnections(currentUser.connections || []);
setEditAvatar(currentUser.avatar || '');
setEditBio(currentUser.bio || '');
setEditPassword(currentUser.password || '');
setEditHours(currentUser.totalHours || '0h');
setEditGames(currentUser.gamesCount || '0');
setEditAchievements(currentUser.achievementsCount || '0');
}
}, [currentUser]);

useEffect(() => {
chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [servers, dmHistory]);

const saveUserChanges = (updatedUserData) => {
if (!currentUser) return;
const updated = { ...currentUser, ...updatedUserData };
setCurrentUser(updated);
localStorage.setItem('gh_v5_session', JSON.stringify(updated));

const updatedAll = usersList.map(u => u.email === currentUser.email ? updated : u);  
setUsersList(updatedAll);  
localStorage.setItem('gh_v5_users', JSON.stringify(updatedAll));

};

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
localStorage.setItem('gh_v5_session', JSON.stringify(found));

};

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
  totalHours: '0h',  
  gamesCount: '0',  
  achievementsCount: '0',  
  servers: [],  
  friends: [],  
  connections: []  
};  

const updatedUsers = [...usersList, newUser];  
setUsersList(updatedUsers);  
localStorage.setItem('gh_v5_users', JSON.stringify(updatedUsers));  

setCurrentUser(newUser);  
localStorage.setItem('gh_v5_session', JSON.stringify(newUser));

};

const handleLogout = () => {
setCurrentUser(null);
localStorage.removeItem('gh_v5_session');
setIsRegisterMode(false);
};

const handleDeleteAccount = () => {
if (window.confirm('Weet je zeker dat je jouw account definitief wilt verwijderen?')) {
const updated = usersList.filter(u => u.email !== currentUser.email);
setUsersList(updated);
localStorage.setItem('gh_v5_users', JSON.stringify(updated));
handleLogout();
}
};

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

setNewServerName('');  
setShowAddServer(false);

};

const handleAddChannel = () => {
if (!newChannelName.trim()) return;
const chanId = 'c_' + Date.now();
const updated = servers.map(srv => {
if (srv.id === activeServerId) {
return {
...srv,
channels: [...srv.channels, { id: chanId, name: newChannelName.toLowerCase().replace(/\s+/g, '-') }]
};
}
return srv;
});

setServers(updated);  
setActiveChannelId(chanId);  
saveUserChanges({ servers: updated });  
setNewChannelName('');

};

const handleDeleteServer = (srvId) => {
if (!srvId) return;
if (window.confirm('Server verwijderen?')) {
const updated = servers.filter(s => s.id !== srvId);
setServers(updated);
setActiveServerId(updated[0]?.id || '');
setActiveChannelId(updated[0]?.channels[0]?.id || '');
saveUserChanges({ servers: updated });
}
};

const handleAddFriend = (e) => {
e.preventDefault();
if (!newFriendName.trim()) return;

const newFr = {  
  id: 'f_' + Date.now(),  
  name: newFriendName.includes('#') ? newFriendName : `${newFriendName}#${Math.floor(1000 + Math.random() * 9000)}`,  
  status: 'online',  
  game: 'GamerHub Lid',  
  avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${newFriendName}`,  
  isBlocked: false  
};  

const updated = [...friends, newFr];  
setFriends(updated);  
saveUserChanges({ friends: updated });  
setNewFriendName('');  
setShowAddFriend(false);

};

const handleToggleBlockFriend = (frId) => {
const updated = friends.map(f => f.id === frId ? { ...f, isBlocked: !f.isBlocked } : f);
setFriends(updated);
saveUserChanges({ friends: updated });
};

const handleDeleteFriend = (frId) => {
if (window.confirm('Vriend verwijderen?')) {
const updated = friends.filter(f => f.id !== frId);
setFriends(updated);
if (activeFriend?.id === frId) setActiveFriend(null);
saveUserChanges({ friends: updated });
}
};

const handleSendDm = () => {
if (!dmText.trim() || !activeFriend) return;
const frId = activeFriend.id;
const msgs = dmHistory[frId] || [];
const newMsg = {
id: 'dm_' + Date.now(),
sender: currentUser.username,
avatar: currentUser.avatar,
text: dmText,
time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

setDmHistory({ ...dmHistory, [frId]: [...msgs, newMsg] });  
setDmText('');

};

const handleAddConnection = (e) => {
e.preventDefault();
if (!connHandle.trim()) return;

const colors = { Twitch: 'bg-purple-600', YouTube: 'bg-red-600', Discord: 'bg-indigo-600', Spotify: 'bg-emerald-600', TikTok: 'bg-pink-600' };  
const icons = { Twitch: '💜', YouTube: '▶️', Discord: '💬', Spotify: '🎵', TikTok: '📱' };  

const newConn = {  
  id: 'conn_' + Date.now(),  
  platform: connPlatform,  
  handle: connHandle,  
  verified: true,  
  icon: icons[connPlatform] || '🌐',  
  color: colors[connPlatform] || 'bg-slate-800'  
};  

const updated = [...connections, newConn];  
setConnections(updated);  
saveUserChanges({ connections: updated });  
setConnHandle('');  
setShowAddConn(false);

};

const handleDeleteConn = (connId) => {
const updated = connections.filter(c => c.id !== connId);
setConnections(updated);
saveUserChanges({ connections: updated });
};

const handleSaveProfile = (e) => {
e.preventDefault();
saveUserChanges({
avatar: editAvatar || currentUser.avatar,
bio: editBio || currentUser.bio,
password: editPassword || currentUser.password,
totalHours: editHours || currentUser.totalHours,
gamesCount: editGames || currentUser.gamesCount,
achievementsCount: editAchievements || currentUser.achievementsCount
});
setStatusMsg('✅ Profiel succesvol bijgewerkt!');
setTimeout(() => setStatusMsg(''), 3000);
};

if (!currentUser) {
return (
<div className="flex items-center justify-center min-h-screen bg-slate-950 p-4 font-sans text-slate-100">
<div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
<div className="text-center mb-6">
<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 font-black text-2xl text-white mb-3 shadow-lg">
GH
</div>
<h1 className="text-2xl font-black">GamerHub Ultra</h1>
<p className="text-xs text-slate-400 mt-1">
{isRegisterMode ? 'Maak direct een uniek account aan' : 'Meld je aan bij jouw account'}
</p>
</div>

{authError && (  
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs text-center font-semibold">  
          ⚠️ {authError}  
        </div>  
      )}  

      {!isRegisterMode ? (  
        <form onSubmit={handleLogin} className="space-y-4">  
          <div>  
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">E-mail of Gebruikersnaam</label>  
            <input  
              type="text"  
              required  
              value={inputIdentifier}  
              onChange={(e) => setInputIdentifier(e.target.value)}  
              placeholder="GamerTag of E-mailadres"  
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"  
            />  
          </div>  
          <div>  
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Wachtwoord</label>  
            <input  
              type="password"  
              required  
              value={inputPassword}  
              onChange={(e) => setInputPassword(e.target.value)}  
              placeholder="••••••••"  
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"  
            />  
          </div>  
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg">  
            Inloggen  
          </button>  
          <div className="text-center mt-4">  
            <button  
              type="button"  
              onClick={() => { setIsRegisterMode(true); setAuthError(''); }}  
              className="text-xs text-indigo-400 font-semibold underline"  
            >  
              Nog geen account? Registreer hier  
            </button>  
          </div>  
        </form>  
      ) : (  
        <form onSubmit={handleRegister} className="space-y-3">  
          <div>  
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gebruikersnaam</label>  
            <input  
              type="text"  
              required  
              value={regUsername}  
              onChange={(e) => setRegUsername(e.target.value)}  
              placeholder="bijv. MaffiaGamer#1337"  
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"  
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"  
            />  
          </div>  
          <div>  
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Wachtwoord</label>  
            <input  
              type="password"  
              required  
              value={inputPassword}  
              onChange={(e) => setInputPassword(e.target.value)}  
              placeholder="Kies een wachtwoord"  
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"  
            />  
          </div>  
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg mt-2">  
            Account Aanmaken & Starten  
          </button>  
          <div className="text-center mt-3">  
            <button  
              type="button"  
              onClick={() => { setIsRegisterMode(false); setAuthError(''); }}  
              className="text-xs text-indigo-400 font-semibold underline"  
            >  
              Al een account? Inloggen  
            </button>  
          </div>  
        </form>  
      )}  
    </div>  
  </div>  
);

}

const currentServer = servers.find(s => s.id === activeServerId) || servers[0];

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
    <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full bg-slate-800 border border-indigo-500" />  
  </div>  

  {/* NAVIGATIEBALK LINKS */}  
  <div className="order-last md:order-first w-full md:w-20 h-16 md:h-full bg-slate-900 border-t md:border-t-0 md:border-r border-slate-800 flex flex-row md:flex-col items-center justify-around md:justify-start py-0 md:py-6 space-x-1 md:space-x-0 md:space-y-6 z-30 shrink-0">  
    <div className="hidden md:flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 items-center justify-center font-black text-white text-xl shadow-lg">  
      GH  
    </div>  
    <hr className="hidden md:block w-10 border-slate-800" />  

    <button  
      onClick={() => setActiveTab('news')}  
      className={`p-3 rounded-2xl transition flex flex-col md:flex-row items-center ${activeTab === 'news' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}  
      title="Live Gaming Nieuws"  
    >  
      <IconNews />  
      <span className="text-[9px] md:hidden mt-0.5 font-bold">Nieuws</span>  
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

  {/* HOOFD INHOUD */}  
  <div className="flex-1 flex overflow-hidden relative">  

    {/* --- TAB 1: LIVE GAMING NIEUWS --- */}  
    {activeTab === 'news' && (  
      <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">  
        <div className="flex items-center justify-between">  
          <div>  
            <h1 className="text-2xl md:text-3xl font-black text-white">🔴 Live Gaming Nieuws Feed</h1>  
            <p className="text-xs md:text-sm text-slate-400">Rechtstreeks opgehaald van live gaming RSS-servers</p>  
          </div>  
          <button  
            onClick={fetchLiveNews}  
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition"  
          >  
            🔄 Vernieuwen  
          </button>  
        </div>  

        {loadingNews ? (  
          <div className="p-12 text-center text-slate-400 text-sm">  
            ⏳ Live gaming artikelen aan het ophalen van de servers...  
          </div>  
        ) : (  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">  
            {liveNews.map((item, index) => (  
              <a  
                key={index}  
                href={item.link}  
                target="_blank"  
                rel="noopener noreferrer"  
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 transition flex flex-col justify-between shadow-lg"  
              >  
                <div>  
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{item.pubDate}</span>  
                  <h2 className="text-base font-bold text-white mt-1 mb-2">{item.title}</h2>  
                  <div className="text-xs text-slate-400 line-clamp-3" dangerouslySetInnerHTML={{ __html: item.description }}></div>  
                </div>  
                <div className="mt-4 text-xs font-bold text-indigo-400 flex items-center space-x-1">  
                  <span>Lees artikel op de site</span>  
                  <span>→</span>  
                </div>  
              </a>  
            ))}  
          </div>  
        )}  
      </div>  
    )}  

    {/* --- TAB 2: DISCORD SERVERS --- */}  
    {activeTab === 'servers' && (  
      <div className="flex-1 flex overflow-hidden w-full">  
        <div className="w-16 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 space-y-3 shrink-0">  
          {servers.map((s) => (  
            <button  
              key={s.id}  
              onClick={() => { setActiveServerId(s.id); setActiveChannelId(s.channels[0]?.id || ''); }}  
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg transition ${  
                activeServerId === s.id ? 'bg-indigo-600 ring-2 ring-indigo-400' : 'bg-slate-800 hover:bg-slate-700'  
              }`}  
              title={s.name}  
            >  
              {s.icon}  
            </button>  
          ))}  

          <button  
            onClick={() => setShowAddServer(true)}  
            className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 flex items-center justify-center text-xl font-bold transition"  
            title="Server Aanmaken"  
          >  
            +  
          </button>  
        </div>  

        <div className="w-52 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">  
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">  
            <h2 className="font-bold text-sm text-white truncate">{currentServer?.name}</h2>  
            <button onClick={() => handleDeleteServer(currentServer?.id)} className="text-slate-500 hover:text-red-400 p-1">  
              <IconTrash />  
            </button>  
          </div>  

          <div className="p-3 space-y-1 flex-1 overflow-y-auto">
            {servers.length === 0 && <p className="text-[11px] text-slate-500 p-2">Je hebt nog geen servers. Maak je eerste server aan met +.</p>}  
            <p className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-1">Kanalen</p>  
            {currentServer?.channels.map((chan) => (  
              <button  
                key={chan.id}  
                onClick={() => setActiveChannelId(chan.id)}  
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition ${  
                  activeChannelId === chan.id ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-400 hover:bg-slate-800'  
                }`}  
              >  
                <span className="text-slate-500">#</span>  
                <span>{chan.name}</span>  
              </button>  
            ))}  

            <div className="pt-3">  
              <input  
                type="text"  
                value={newChannelName}  
                onChange={(e) => setNewChannelName(e.target.value)}  
                onKeyDown={(e) => e.key === 'Enter' && handleAddChannel()}  
                placeholder="+ Nieuw kanaal..."  
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"  
              />  
            </div>  
          </div>  
        </div>  

        <div className="flex-1 flex flex-col bg-slate-950">  
          <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between">  
            <h3 className="font-bold text-slate-200 text-sm">  
              #{currentServer?.channels.find(c => c.id === activeChannelId)?.name || 'kanaal'}  
            </h3>  
          </div>  

          <div className="flex-1 p-6 overflow-y-auto space-y-4">  
            {(currentServer?.messages?.[activeChannelId] || []).map((m) => (  
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
            <div ref={chatScrollRef} />  
          </div>  

          <div className="p-4 border-t border-slate-800 bg-slate-900">  
            <div className="flex space-x-2">  
              <input  
                type="text"  
                value={chatMessage}  
                onChange={(e) => setChatMessage(e.target.value)}  
                onKeyDown={(e) => e.key === 'Enter' && handleSendChannelMessage()}  
                placeholder="Typ een bericht..."  
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"  
              />  
              <button onClick={handleSendChannelMessage} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3 rounded-xl text-xs">  
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
            <button onClick={() => setShowAddFriend(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg">  
              + Vriend  
            </button>  
          </div>  

          <div className="flex-1 p-2 space-y-1 overflow-y-auto">  
            {friends.map((fr) => (  
              <div  
                key={fr.id}  
                className={`w-full p-2.5 rounded-2xl transition flex items-center justify-between ${  
                  activeFriend?.id === fr.id ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-slate-800'  
                } ${fr.isBlocked ? 'opacity-40' : ''}`}  
              >  
                <button onClick={() => setActiveFriend(fr)} className="flex items-center space-x-3 flex-1 text-left">  
                  <div className="relative">  
                    <img src={fr.avatar} alt="Avatar" className="w-9 h-9 rounded-xl bg-slate-800" />  
                    <span className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${fr.isBlocked ? 'bg-red-500' : 'bg-emerald-500'}`}></span>  
                  </div>  
                  <div className="truncate">  
                    <p className="text-xs font-bold text-slate-200 truncate">{fr.name}</p>  
                    <p className="text-[10px] text-slate-400">{fr.isBlocked ? 'Geblokkeerd' : fr.game}</p>  
                  </div>  
                </button>  

                <div className="flex items-center space-x-1">  
                  <button onClick={() => handleToggleBlockFriend(fr.id)} className="p-1 text-slate-500 hover:text-white">  
                    <IconBan />  
                  </button>  
                  <button onClick={() => handleDeleteFriend(fr.id)} className="p-1 text-slate-500 hover:text-red-400">  
                    <IconTrash />  
                  </button>  
                </div>  
              </div>  
            ))}  
          </div>  
        </div>  

        <div className="flex-1 flex flex-col bg-slate-950">  
          {activeFriend ? (  
            <>  
              <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between">  
                <div>  
                  <h3 className="font-bold text-slate-200 text-sm">{activeFriend.name}</h3>  
                  <p className="text-[10px] text-emerald-400">{activeFriend.game}</p>  
                </div>  
              </div>  

              <div className="flex-1 p-6 overflow-y-auto space-y-4">  
                {(dmHistory[activeFriend.id] || []).map((m) => (  
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
              </div>  

              <div className="p-4 border-t border-slate-800 bg-slate-900">  
                <div className="flex space-x-2">  
                  <input  
                    type="text"  
                    value={dmText}  
                    onChange={(e) => setDmText(e.target.value)}  
                    onKeyDown={(e) => e.key === 'Enter' && handleSendDm()}  
                    placeholder={`Privébericht naar ${activeFriend.name}...`}  
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"  
                  />  
                  <button onClick={handleSendDm} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3 rounded-xl text-xs">  
                    Stuur  
                  </button>  
                </div>  
              </div>  
            </>  
          ) : (  
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">  
              Selecteer een vriend om een privébericht te sturen.  
            </div>  
          )}  
        </div>  
      </div>  
    )}  

    {/* --- TAB 4: VERBINDINGEN --- */}  
    {activeTab === 'connections' && (  
      <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">  
        <div className="flex items-center justify-between">  
          <div>  
            <h1 className="text-2xl md:text-3xl font-black text-white">Gekoppelde Accounts</h1>  
            <p className="text-xs md:text-sm text-slate-400">Verbindingen zichtbaar op je profiel</p>  
          </div>  
          <button onClick={() => setShowAddConn(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl">  
            + Verbinding  
          </button>  
        </div>  

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl space-y-3">  
          {connections.map((c) => (  
            <div key={c.id} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">  
              <div className="flex items-center space-x-4">  
                <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center text-lg`}>  
                  {c.icon}  
                </div>  
                <div>  
                  <div className="flex items-center space-x-2">  
                    <span className="text-sm font-bold text-white">{c.handle}</span>  
                    <span className="text-xs text-blue-400">✓</span>  
                  </div>  
                  <p className="text-xs text-slate-400">{c.platform}</p>  
                </div>  
              </div>  
              <button onClick={() => handleDeleteConn(c.id)} className="text-slate-500 hover:text-red-400 p-2">  
                <IconTrash />  
              </button>  
            </div>  
          ))}  
        </div>  
      </div>  
    )}  

    {/* --- TAB 5: ACCOUNT INSTELLINGEN --- */}  
    {activeTab === 'settings' && (  
      <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">  
        <h1 className="text-2xl md:text-3xl font-black text-white">Account Instellingen</h1>  

        {statusMsg && (  
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs text-center font-bold">  
            {statusMsg}  
          </div>  
        )}  

        <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">  
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profiel Bewerken</h2>  
          <div>  
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Profielfoto URL</label>  
            <input  
              type="url"  
              value={editAvatar}  
              onChange={(e) => setEditAvatar(e.target.value)}  
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200"  
            />  
          </div>  

          <div>  
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status / Bio</label>  
            <input  
              type="text"  
              value={editBio}  
              onChange={(e) => setEditBio(e.target.value)}  
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200"  
            />  
          </div>  

          <div className="grid grid-cols-3 gap-2">  
            <div>  
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Totaal Uren</label>  
              <input  
                type="text"  
                value={editHours}  
                onChange={(e) => setEditHours(e.target.value)}  
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"  
              />  
            </div>  
            <div>  
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Games</label>  
              <input  
                type="text"  
                value={editGames}  
                onChange={(e) => setEditGames(e.target.value)}  
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"  
              />  
            </div>  
            <div>  
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Trophies</label>  
              <input  
                type="text"  
                value={editAchievements}  
                onChange={(e) => setEditAchievements(e.target.value)}  
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"  
              />  
            </div>  
          </div>  

          <div>  
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Wachtwoord Wijzigen</label>  
            <input  
              type="password"  
              value={editPassword}  
              onChange={(e) => setEditPassword(e.target.value)}  
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200"  
            />  
          </div>  

          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl">  
            Wijzigingen Opslaan  
          </button>  
        </form>  

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">  
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Opties</h2>  
          <button onClick={handleLogout} className="w-full text-left py-2 text-sm font-bold text-amber-400">  
            Uitloggen  
          </button>  
          <hr className="border-slate-800" />  
          <button onClick={handleDeleteAccount} className="w-full text-left py-2 text-sm font-bold text-red-500">  
            Verwijder Account Definitief  
          </button>  
        </div>  
      </div>  
    )}  

  </div>  

  {/* MODAL SERVER */}  
  {showAddServer && (  
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">  
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">  
        <h2 className="text-lg font-black text-white mb-4">+ Server Aanmaken</h2>  
        <form onSubmit={handleCreateServer} className="space-y-4">  
          <input  
            type="text"  
            required  
            value={newServerName}  
            onChange={(e) => setNewServerName(e.target.value)}  
            placeholder="Servernaam"  
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100"  
          />  
          <input  
            type="text"  
            value={newServerIcon}  
            onChange={(e) => setNewServerIcon(e.target.value)}  
            placeholder="Emoji (bijv. 🎮)"  
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100"  
          />  
          <div className="flex space-x-2 pt-2">  
            <button type="button" onClick={() => setShowAddServer(false)} className="flex-1 bg-slate-800 text-slate-300 font-bold py-3 rounded-xl text-xs">  
              Annuleren  
            </button>  
            <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs">  
              Aanmaken  
            </button>  
          </div>  
        </form>  
      </div>  
    </div>  
  )}  

  {/* MODAL VRIEND */}  
  {showAddFriend && (  
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">  
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">  
        <h2 className="text-lg font-black text-white mb-4">+ Vriend Toevoegen</h2>  
        <form onSubmit={handleAddFriend} className="space-y-4">  
          <input  
            type="text"  
            required  
            value={newFriendName}  
            onChange={(e) => setNewFriendName(e.target.value)}  
            placeholder="Gebruikersnaam of Tag"  
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100"  
          />  
          <div className="flex space-x-2 pt-2">  
            <button type="button" onClick={() => setShowAddFriend(false)} className="flex-1 bg-slate-800 text-slate-300 font-bold py-3 rounded-xl text-xs">  
              Annuleren  
            </button>  
            <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs">  
              Toevoegen  
            </button>  
          </div>  
        </form>  
      </div>  
    </div>  
  )}  

  {/* MODAL VERBINDING */}  
  {showAddConn && (  
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">  
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">  
        <h2 className="text-lg font-black text-white mb-4">+ Verbinding Koppelen</h2>  
        <form onSubmit={handleAddConnection} className="space-y-4">  
          <select  
            value={connPlatform}  
            onChange={(e) => setConnPlatform(e.target.value)}  
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100"  
          >  
            <option value="Twitch">Twitch</option>  
            <option value="YouTube">YouTube</option>  
            <option value="Discord">Discord</option>  
            <option value="Spotify">Spotify</option>  
            <option value="TikTok">TikTok</option>  
          </select>  
          <input  
            type="text"  
            required  
            value={connHandle}  
            onChange={(e) => setConnHandle(e.target.value)}  
            placeholder="Gebruikersnaam op platform"  
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100"  
          />  
          <div className="flex space-x-2 pt-2">  
            <button type="button" onClick={() => setShowAddConn(false)} className="flex-1 bg-slate-800 text-slate-300 font-bold py-3 rounded-xl text-xs">  
              Annuleren  
            </button>  
            <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs">  
              Koppelen  
            </button>  
          </div>  
        </form>  
      </div>  
    </div>  
  )}  

</div>

);
}
