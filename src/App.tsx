import React, { useState, useEffect } from 'react';
import { User, Server, Friend, Connection, NewsItem, ChannelMessage } from './types';
import {
  STARTER_SERVERS,
  STARTER_FRIENDS,
  STARTER_CONNECTIONS,
  DEMO_USER,
  FALLBACK_NEWS,
} from './data/starterData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NewsTab } from './components/NewsTab';
import { ServersTab } from './components/ServersTab';
import { FriendsTab } from './components/FriendsTab';
import { ConnectionsTab } from './components/ConnectionsTab';
import { SettingsTab } from './components/SettingsTab';
import { AuthScreen } from './components/AuthScreen';

export default function App() {
  // Stored registered users
  const [usersList, setUsersList] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('gh_v5_users');
      return saved ? JSON.parse(saved) : [DEMO_USER];
    } catch {
      return [DEMO_USER];
    }
  });

  // Current logged-in user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('gh_v5_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation
  const [activeTab, setActiveTab] = useState<'news' | 'servers' | 'friends' | 'connections' | 'settings'>('news');

  // Auth state
  const [authError, setAuthError] = useState('');

  // News state
  const [liveNews, setLiveNews] = useState<NewsItem[]>(FALLBACK_NEWS);
  const [loadingNews, setLoadingNews] = useState(false);
  const [lastUpdatedNews, setLastUpdatedNews] = useState('');

  // Servers state
  const [servers, setServers] = useState<Server[]>([]);
  const [activeServerId, setActiveServerId] = useState<string>('');
  const [activeChannelId, setActiveChannelId] = useState<string>('');

  // Friends & DM state
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activeFriend, setActiveFriend] = useState<Friend | null>(null);
  const [dmHistory, setDmHistory] = useState<Record<string, ChannelMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('gh_v5_dm');
      return saved
        ? JSON.parse(saved)
        : {
            f_1: [
              {
                id: 'dm_init_1',
                sender: 'PopeyeSpeirs#1111',
                avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Popeye',
                text: 'Yo! Ben je straks online voor ARC Raiders?',
                time: '11:20',
              },
            ],
            f_3: [
              {
                id: 'dm_init_2',
                sender: 'VermeerCraats#2026',
                avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Vermeer',
                text: 'Heb je die nieuwe Elden Ring DLC boss al verslagen?',
                time: '15:45',
              },
            ],
          };
    } catch {
      return {};
    }
  });

  // Connections state
  const [connections, setConnections] = useState<Connection[]>([]);

  // Fetch Live RSS Gaming News from Gamer.nl
  const fetchLiveNews = async () => {
    setLoadingNews(true);
    try {
      const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.gamer.nl/feed');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        setLiveNews(data.items);
        setLastUpdatedNews(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        setLiveNews(FALLBACK_NEWS);
      }
    } catch (e) {
      console.warn('Kan Gamer.nl feed niet bereiken, gebruik fallback nieuws:', e);
      setLiveNews(FALLBACK_NEWS);
      setLastUpdatedNews('Offline modus (gecached)');
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchLiveNews();
  }, []);

  // Sync state when current user changes
  useEffect(() => {
    if (currentUser) {
      setServers(currentUser.servers || []);
      setFriends(currentUser.friends || []);
      setConnections(currentUser.connections || []);

      if (currentUser.servers && currentUser.servers.length > 0) {
        setActiveServerId((prev) => (prev ? prev : currentUser.servers[0].id));
        setActiveChannelId((prev) => (prev ? prev : currentUser.servers[0].channels[0]?.id || ''));
      }
      if (currentUser.friends && currentUser.friends.length > 0 && !activeFriend) {
        setActiveFriend(currentUser.friends[0]);
      }
    }
  }, [currentUser]);

  // Persist DM history in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gh_v5_dm', JSON.stringify(dmHistory));
    } catch (e) {
      console.error('Fout bij opslaan DMs:', e);
    }
  }, [dmHistory]);

  // Central user state update helper
  const saveUserChanges = (updatedUserData: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...updatedUserData };
    setCurrentUser(updated);
    localStorage.setItem('gh_v5_session', JSON.stringify(updated));

    const updatedAll = usersList.map((u) => (u.email === currentUser.email ? updated : u));
    setUsersList(updatedAll);
    localStorage.setItem('gh_v5_users', JSON.stringify(updatedAll));
  };

  // Auth: Login
  const handleLogin = (identifier: string, pass: string): boolean => {
    const found = usersList.find(
      (u) =>
        (u.email.toLowerCase() === identifier.toLowerCase() ||
          u.username.toLowerCase() === identifier.toLowerCase()) &&
        u.password === pass
    );

    if (!found) {
      setAuthError('Onjuiste gebruikersnaam, e-mailadres of wachtwoord.');
      return false;
    }

    setCurrentUser(found);
    localStorage.setItem('gh_v5_session', JSON.stringify(found));
    setAuthError('');
    return true;
  };

  // Auth: Register
  const handleRegister = (regUsername: string, regEmail: string, pass: string): boolean => {
    const exists = usersList.some(
      (u) =>
        u.email.toLowerCase() === regEmail.toLowerCase() ||
        u.username.toLowerCase() === regUsername.toLowerCase()
    );

    if (exists) {
      setAuthError('Er bestaat al een account met deze gebruikersnaam of e-mail!');
      return false;
    }

    const newUser: User = {
      username: regUsername,
      email: regEmail,
      password: pass,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(regUsername)}`,
      bio: 'GamerHub Gamer',
      totalHours: '0h',
      gamesCount: '0',
      achievementsCount: '0',
      servers: STARTER_SERVERS,
      friends: STARTER_FRIENDS,
      connections: [],
    };

    const updatedUsers = [...usersList, newUser];
    setUsersList(updatedUsers);
    localStorage.setItem('gh_v5_users', JSON.stringify(updatedUsers));

    setCurrentUser(newUser);
    localStorage.setItem('gh_v5_session', JSON.stringify(newUser));
    setAuthError('');
    return true;
  };

  // Auth: Demo Login
  const handleDemoLogin = () => {
    const demo = DEMO_USER;
    const exists = usersList.some((u) => u.email === demo.email);
    if (!exists) {
      const updated = [...usersList, demo];
      setUsersList(updated);
      localStorage.setItem('gh_v5_users', JSON.stringify(updated));
    }
    setCurrentUser(demo);
    localStorage.setItem('gh_v5_session', JSON.stringify(demo));
    setAuthError('');
  };

  // Auth: Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gh_v5_session');
    setActiveFriend(null);
  };

  // Auth: Delete Account
  const handleDeleteAccount = () => {
    if (!currentUser) return;
    const updated = usersList.filter((u) => u.email !== currentUser.email);
    setUsersList(updated);
    localStorage.setItem('gh_v5_users', JSON.stringify(updated));
    handleLogout();
  };

  // Server: Send Channel Message
  const handleSendChannelMessage = (msgText: string) => {
    if (!currentUser || !msgText.trim()) return;

    const newMsg: ChannelMessage = {
      id: 'm_' + Date.now(),
      sender: currentUser.username,
      avatar: currentUser.avatar,
      text: msgText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedServers = servers.map((srv) => {
      if (srv.id === activeServerId) {
        const msgs = srv.messages?.[activeChannelId] || [];
        return {
          ...srv,
          messages: {
            ...srv.messages,
            [activeChannelId]: [...msgs, newMsg],
          },
        };
      }
      return srv;
    });

    setServers(updatedServers);
    saveUserChanges({ servers: updatedServers });
  };

  // Server: Create Server
  const handleCreateServer = (name: string, icon: string) => {
    const defaultChanId = 'c_' + Date.now();
    const newSrv: Server = {
      id: 's_' + Date.now(),
      name,
      icon: icon || '🎮',
      channels: [{ id: defaultChanId, name: 'algemeen' }],
      messages: {
        [defaultChanId]: [
          {
            id: 'm_welcome',
            sender: currentUser?.username || 'GamerHub',
            avatar: currentUser?.avatar || '',
            text: `Welkom op de gloednieuwe ${name} server!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      },
    };

    const updated = [...servers, newSrv];
    setServers(updated);
    setActiveServerId(newSrv.id);
    setActiveChannelId(defaultChanId);
    saveUserChanges({ servers: updated });
  };

  // Server: Add Channel
  const handleAddChannel = (channelName: string) => {
    const cleanName = channelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const chanId = 'c_' + Date.now();

    const updated = servers.map((srv) => {
      if (srv.id === activeServerId) {
        return {
          ...srv,
          channels: [...srv.channels, { id: chanId, name: cleanName || 'kanaal' }],
        };
      }
      return srv;
    });

    setServers(updated);
    setActiveChannelId(chanId);
    saveUserChanges({ servers: updated });
  };

  // Server: Delete Server
  const handleDeleteServer = (srvId: string) => {
    const updated = servers.filter((s) => s.id !== srvId);
    setServers(updated);
    if (activeServerId === srvId) {
      setActiveServerId(updated[0]?.id || '');
      setActiveChannelId(updated[0]?.channels[0]?.id || '');
    }
    saveUserChanges({ servers: updated });
  };

  // Friends: Add Friend
  const handleAddFriend = (friendName: string) => {
    const cleanName = friendName.trim();
    const hasTag = cleanName.includes('#');
    const finalName = hasTag ? cleanName : `${cleanName}#${Math.floor(1000 + Math.random() * 9000)}`;

    const newFr: Friend = {
      id: 'f_' + Date.now(),
      name: finalName,
      status: 'online',
      game: 'GamerHub Lid',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(finalName)}`,
      isBlocked: false,
    };

    const updated = [...friends, newFr];
    setFriends(updated);
    setActiveFriend(newFr);
    saveUserChanges({ friends: updated });
  };

  // Friends: Toggle Block
  const handleToggleBlockFriend = (frId: string) => {
    const updated = friends.map((f) => (f.id === frId ? { ...f, isBlocked: !f.isBlocked } : f));
    setFriends(updated);
    saveUserChanges({ friends: updated });
    if (activeFriend?.id === frId) {
      setActiveFriend({ ...activeFriend, isBlocked: !activeFriend.isBlocked });
    }
  };

  // Friends: Delete Friend
  const handleDeleteFriend = (frId: string) => {
    const updated = friends.filter((f) => f.id !== frId);
    setFriends(updated);
    if (activeFriend?.id === frId) {
      setActiveFriend(updated[0] || null);
    }
    saveUserChanges({ friends: updated });
  };

  // Friends: Send Direct Message
  const handleSendDm = (friendId: string, text: string) => {
    if (!currentUser || !text.trim()) return;

    const msgs = dmHistory[friendId] || [];
    const newMsg: ChannelMessage = {
      id: 'dm_' + Date.now(),
      sender: currentUser.username,
      avatar: currentUser.avatar,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = { ...dmHistory, [friendId]: [...msgs, newMsg] };
    setDmHistory(updatedHistory);
  };

  // Connections: Add Connection
  const handleAddConnection = (platform: Connection['platform'], handle: string) => {
    const colors: Record<Connection['platform'], string> = {
      Twitch: 'bg-purple-600',
      YouTube: 'bg-red-600',
      Discord: 'bg-indigo-600',
      Spotify: 'bg-emerald-600',
      TikTok: 'bg-pink-600',
      PlayStation: 'bg-blue-600',
      Steam: 'bg-slate-800',
      Xbox: 'bg-emerald-700',
      Nintendo: 'bg-rose-600',
    };
    const icons: Record<Connection['platform'], string> = {
      Twitch: '💜',
      YouTube: '▶️',
      Discord: '💬',
      Spotify: '🎵',
      TikTok: '📱',
      PlayStation: '🎮',
      Steam: '💨',
      Xbox: '🟩',
      Nintendo: '🔴',
    };

    const newConn: Connection = {
      id: 'conn_' + Date.now(),
      platform,
      handle,
      verified: true,
      details: 'Geverifieerd account',
      icon: icons[platform] || '🌐',
      color: colors[platform] || 'bg-slate-800',
    };

    const updated = [...connections, newConn];
    setConnections(updated);
    saveUserChanges({ connections: updated });
  };

  // Connections: Delete Connection
  const handleDeleteConnection = (connId: string) => {
    const updated = connections.filter((c) => c.id !== connId);
    setConnections(updated);
    saveUserChanges({ connections: updated });
  };

  // Quick Seed Helpers
  const handleLoadStarterServers = () => {
    setServers(STARTER_SERVERS);
    setActiveServerId(STARTER_SERVERS[0].id);
    setActiveChannelId(STARTER_SERVERS[0].channels[0].id);
    saveUserChanges({ servers: STARTER_SERVERS });
  };

  const handleLoadStarterFriends = () => {
    setFriends(STARTER_FRIENDS);
    setActiveFriend(STARTER_FRIENDS[0]);
    saveUserChanges({ friends: STARTER_FRIENDS });
  };

  const handleLoadStarterConnections = () => {
    setConnections(STARTER_CONNECTIONS);
    saveUserChanges({ connections: STARTER_CONNECTIONS });
  };

  // If not logged in, show Auth Screen
  if (!currentUser) {
    return (
      <AuthScreen
        onLogin={handleLogin}
        onRegister={handleRegister}
        onDemoLogin={handleDemoLogin}
        authError={authError}
        setAuthError={setAuthError}
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none font-sans">
      {/* Mobile Top Header */}
      <Header currentUser={currentUser} onOpenSettings={() => setActiveTab('settings')} />

      {/* Main Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} />

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeTab === 'news' && (
          <NewsTab
            news={liveNews}
            loading={loadingNews}
            onRefresh={fetchLiveNews}
            lastUpdated={lastUpdatedNews}
          />
        )}

        {activeTab === 'servers' && (
          <ServersTab
            servers={servers}
            activeServerId={activeServerId}
            activeChannelId={activeChannelId}
            setActiveServerId={setActiveServerId}
            setActiveChannelId={setActiveChannelId}
            onCreateServer={handleCreateServer}
            onDeleteServer={handleDeleteServer}
            onAddChannel={handleAddChannel}
            onSendMessage={handleSendChannelMessage}
            onLoadStarterServers={handleLoadStarterServers}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'friends' && (
          <FriendsTab
            friends={friends}
            activeFriend={activeFriend}
            setActiveFriend={setActiveFriend}
            dmHistory={dmHistory}
            onSendDm={handleSendDm}
            onAddFriend={handleAddFriend}
            onToggleBlockFriend={handleToggleBlockFriend}
            onDeleteFriend={handleDeleteFriend}
            onLoadStarterFriends={handleLoadStarterFriends}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'connections' && (
          <ConnectionsTab
            connections={connections}
            onAddConnection={handleAddConnection}
            onDeleteConnection={handleDeleteConnection}
            onLoadStarterConnections={handleLoadStarterConnections}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            currentUser={currentUser}
            onSaveProfile={saveUserChanges}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        )}
      </main>
    </div>
  );
}
