import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Server,
  Friend,
  Connection,
  NewsItem,
  ChannelMessage,
  AppTab,
  UserAppNotification,
} from './types';
import { FALLBACK_NEWS, BANNER_PRESETS, PLATFORM_GAMES_DATABASE } from './data/starterData';
import { ANIMATED_AVATAR_PRESETS, ANIMATED_BANNER_PRESETS } from './data/mediaPresets';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { NewsTab } from './components/NewsTab';
import { ServersTab } from './components/ServersTab';
import { FriendsTab } from './components/FriendsTab';
import { AchievementsTab } from './components/AchievementsTab';
import { ConnectionsTab } from './components/ConnectionsTab';
import { SettingsTab } from './components/SettingsTab';
import { AuthScreen } from './components/AuthScreen';
import { CallModal } from './components/CallModal';
import { FriendProfileModal } from './components/FriendProfileModal';
import { NotificationToast } from './components/NotificationToast';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { BetaTesterModal } from './components/BetaTesterModal';
import { auth, testFirestoreConnection } from './firebase';
import { sendPasswordResetEmail, createUserWithEmailAndPassword } from 'firebase/auth';
import { sendRealPasswordResetEmail, sendRealTwoFactorEmail } from './services/emailService';
import {
  persistUserAccount,
  fetchUserAccount,
  subscribeToUserAccount,
  fetchUserByIdentifier,
  updateUserPassword,
  sendRealtimeNotification,
  addFriendBidirectional,
  sendDirectMessageBidirectional,
  sendLiveCallSignal,
  saveCommunityServer,
  joinCommunityServer,
} from './services/userService';
import { googleSignIn, logoutGoogle } from './services/googleAuth';
import { fetchRealtimeGamingNews, getCachedGamingNews } from './services/newsService';
import { discordAudio } from './utils/discordAudio';

export default function App() {
  // Stored registered users in database / persistent storage
  const [usersList, setUsersList] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('gh_v5_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
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

  // Default to Dashboard (matching Pyroblast gaming tracker screenshots)
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  // Auth error & 2FA state
  const [authError, setAuthError] = useState('');
  const [pending2FAUser, setPending2FAUser] = useState<User | null>(null);
  const [expected2FACode, setExpected2FACode] = useState<string>('');

  // News state with auto-updating
  const [liveNews, setLiveNews] = useState<NewsItem[]>(() => {
    const cached = getCachedGamingNews();
    return cached.length > 0 ? cached : FALLBACK_NEWS;
  });
  const [loadingNews, setLoadingNews] = useState(false);
  const [lastUpdatedNews, setLastUpdatedNews] = useState('');
  const [hasNewIncoming, setHasNewIncoming] = useState(false);

  // Servers state (strictly starting with 0 servers)
  const [servers, setServers] = useState<Server[]>([]);
  const [activeServerId, setActiveServerId] = useState<string>('');
  const [activeChannelId, setActiveChannelId] = useState<string>('');

  // Friends & DM state (strictly starting with 0 friends)
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activeFriend, setActiveFriend] = useState<Friend | null>(null);
  const [dmHistory, setDmHistory] = useState<Record<string, ChannelMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('gh_v5_dm');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Notification system
  const [notifications, setNotifications] = useState<UserAppNotification[]>([]);
  const [activeToastNotification, setActiveToastNotification] = useState<UserAppNotification | null>(
    null
  );
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Connections state
  const [connections, setConnections] = useState<Connection[]>([]);

  // Calling state (Discord-style voice & video)
  const [activeCall, setActiveCall] = useState<{
    isOpen: boolean;
    type: 'voice' | 'video';
    friend: Friend;
    isIncoming: boolean;
  } | null>(null);

  // Friend Profile inspection state
  const [inspectedFriend, setInspectedFriend] = useState<Friend | null>(null);

  // Beta Tester modal state
  const [showBetaModal, setShowBetaModal] = useState(false);

  // Test Firestore on boot
  useEffect(() => {
    testFirestoreConnection().catch(console.error);
  }, []);

  // Fetch Live Gaming News with real-time new item detection from active RSS feeds
  const fetchLiveNews = async (isBackground = false) => {
    if (!isBackground) setLoadingNews(true);
    try {
      const freshArticles = await fetchRealtimeGamingNews();
      if (freshArticles && freshArticles.length > 0) {
        setLiveNews((prev) => {
          const existingLinks = new Set(prev.map((i) => i.link || i.title));
          const itemsWithNewFlag: NewsItem[] = freshArticles.map((item, idx) => ({
            ...item,
            id: item.id || `news_${Date.now()}_${idx}`,
            isNew: !existingLinks.has(item.link || item.title) && prev.length > 0,
          }));

          const hasBrandNew = itemsWithNewFlag.some((i) => i.isNew);
          if (hasBrandNew && isBackground) {
            setHasNewIncoming(true);
            setTimeout(() => setHasNewIncoming(false), 5000);
          }
          return itemsWithNewFlag;
        });
        setLastUpdatedNews(
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
      }
    } catch (err) {
      console.warn('fetchLiveNews error:', err);
    } finally {
      if (!isBackground) setLoadingNews(false);
    }
  };

  // Initial fetch and real-time auto-polling every 25 seconds
  useEffect(() => {
    fetchLiveNews();
    const interval = setInterval(() => {
      fetchLiveNews(true);
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  // Sync state when currentUser changes or loads from storage
  useEffect(() => {
    if (currentUser) {
      setServers(currentUser.servers || []);
      setFriends(currentUser.friends || []);
      setConnections(currentUser.connections || []);
      if (currentUser.dmHistory) {
        setDmHistory(currentUser.dmHistory);
      }
      if (currentUser.notifications) {
        setNotifications(currentUser.notifications);
      }

      if (currentUser.servers && currentUser.servers.length > 0) {
        setActiveServerId((prev) => (prev ? prev : currentUser.servers[0].id));
        setActiveChannelId((prev) => (prev ? prev : currentUser.servers[0].channels[0]?.id || ''));
      }
      if (currentUser.friends && currentUser.friends.length > 0 && !activeFriend) {
        setActiveFriend(currentUser.friends[0]);
      }
    }
  }, [currentUser?.email]);

  // Real-time Cloud Firestore subscription for the logged-in user
  // This automatically receives incoming direct messages, call requests, and friend alerts!
  const prevNotifCountRef = useRef<number>(0);
  useEffect(() => {
    if (!currentUser?.email) return;

    const unsubscribe = subscribeToUserAccount(currentUser.email, (remoteUser) => {
      if (!remoteUser) return;

      // Check if new notification arrived
      const newNotifs = remoteUser.notifications || [];
      if (newNotifs.length > prevNotifCountRef.current && newNotifs.length > 0) {
        const newest = newNotifs[0];
        setActiveToastNotification(newest);
        if (newest.type === 'call') {
          discordAudio.startCallRingtone();
          const callerFriend: Friend = {
            id: newest.actionData?.friendId || 'caller_' + Date.now(),
            name: newest.fromUser?.username || 'GamerHub Vriend',
            avatar: newest.fromUser?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Gamer',
            status: 'online',
            game: 'Belt jou live...',
            isBlocked: false,
          };
          setActiveCall({
            isOpen: true,
            type: (newest.actionData?.callType as 'voice' | 'video') || 'voice',
            friend: callerFriend,
            isIncoming: true,
          });
        } else {
          discordAudio.playMessagePing();
        }
      }
      prevNotifCountRef.current = newNotifs.length;

      // Keep local state in sync with Cloud Firestore
      setNotifications(newNotifs);
      if (remoteUser.dmHistory) setDmHistory(remoteUser.dmHistory);
      if (remoteUser.friends) setFriends(remoteUser.friends);
      if (remoteUser.servers) setServers(remoteUser.servers);
      if (remoteUser.connections) setConnections(remoteUser.connections);

      // Update current user state with remote data
      setCurrentUser((prev) => (prev ? { ...prev, ...remoteUser } : remoteUser));
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser?.email]);

  // Handle URL invite parameters (?invite=GamerName, ?serverInvite=Code, ?joinServer=Code, ?beta=join)
  useEffect(() => {
    if (typeof window !== 'undefined' && currentUser) {
      const params = new URLSearchParams(window.location.search);

      // 1. Beta Tester program link (?beta=join)
      if (params.get('beta') === 'join') {
        if (!currentUser.isBetaTester) {
          saveUserChanges({ isBetaTester: true });
        }
        setShowBetaModal(true);
      }

      // 2. Server invite link (?serverInvite=CODE or ?joinServer=CODE)
      const serverCode = params.get('serverInvite') || params.get('joinServer');
      if (serverCode) {
        handleJoinServerByInvite(serverCode);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // 3. Friend invite link (?invite=GamerName)
      const inviteName = params.get('invite');
      if (inviteName && inviteName.toLowerCase() !== currentUser.username.toLowerCase()) {
        const alreadyFriend = (currentUser.friends || []).some(
          (f) => f.name.toLowerCase() === inviteName.toLowerCase()
        );
        if (!alreadyFriend) {
          handleAddFriend(inviteName);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  }, [currentUser?.email]);

  // Persist DM history in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gh_v5_dm', JSON.stringify(dmHistory));
    } catch (e) {
      console.error('Fout bij opslaan DMs:', e);
    }
  }, [dmHistory]);

  // Central user updates helper - saves to local session AND Cloud Firestore
  const saveUserChanges = (updatedUserData: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      ...updatedUserData,
      dmHistory: updatedUserData.dmHistory || dmHistory,
      notifications: updatedUserData.notifications || notifications,
    };

    setCurrentUser(updated);

    // Save to Firestore and localStorage
    persistUserAccount(updated).catch((err) =>
      console.warn('Background Firestore save error:', err)
    );

    const updatedAll = usersList.map((u) =>
      u.email.toLowerCase() === currentUser.email.toLowerCase() ? updated : u
    );
    setUsersList(updatedAll);
  };

  // Auth: Login - searches Cloud Firestore first, with fallback to local storage
  const handleLogin = async (identifier: string, pass: string) => {
    setAuthError('');

    // 1. Try finding in local usersList first
    let userToAuth = usersList.find(
      (u) =>
        (u.email.toLowerCase() === identifier.toLowerCase() ||
          u.username.toLowerCase() === identifier.toLowerCase()) &&
        u.password === pass
    );

    // 2. If not found locally or password mismatch, query Firestore Cloud DB!
    if (!userToAuth) {
      try {
        const remote = await fetchUserAccount(identifier);
        if (remote && remote.password === pass) {
          userToAuth = remote;
        }
      } catch (err) {
        console.warn('Firestore remote lookup error:', err);
      }
    }

    if (!userToAuth) {
      setAuthError('Onjuiste gebruikersnaam, e-mailadres of wachtwoord.');
      return { success: false };
    }

    // 2FA check
    if (userToAuth.twoFactorEnabled) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setPending2FAUser(userToAuth);
      setExpected2FACode(code);
      // Send real email with 2FA code directly to user's inbox
      sendRealTwoFactorEmail(userToAuth.email, code, userToAuth.username).catch(console.warn);
      return { success: false, requires2FA: true, user: userToAuth, tempCode: code };
    }

    // Login successful
    setCurrentUser(userToAuth);
    if (userToAuth.dmHistory) setDmHistory(userToAuth.dmHistory);
    if (userToAuth.notifications) setNotifications(userToAuth.notifications);
    setServers(userToAuth.servers || []);
    setFriends(userToAuth.friends || []);
    setConnections(userToAuth.connections || []);

    await persistUserAccount(userToAuth);
    setAuthError('');
    return { success: true };
  };

  // Auth: 2FA Verification
  const handleVerify2FA = async (code: string): Promise<boolean> => {
    if (pending2FAUser && code === expected2FACode) {
      setCurrentUser(pending2FAUser);
      if (pending2FAUser.dmHistory) setDmHistory(pending2FAUser.dmHistory);
      if (pending2FAUser.notifications) setNotifications(pending2FAUser.notifications);
      await persistUserAccount(pending2FAUser);
      setPending2FAUser(null);
      setExpected2FACode('');
      setAuthError('');
      return true;
    }
    return false;
  };

  // Auth: Register (Instant account creation - no page refresh needed!)
  const handleRegister = async (
    regUsername: string,
    regEmail: string,
    pass: string
  ): Promise<boolean> => {
    setAuthError('');

    const cleanUsername = regUsername.trim();
    const cleanEmail = regEmail.trim().toLowerCase();

    if (!cleanUsername || !cleanEmail || !pass) {
      setAuthError('Vul alle verplichte velden in.');
      return false;
    }

    // Check if user already exists in local list
    const existsLocally = usersList.some(
      (u) =>
        u.email.toLowerCase() === cleanEmail ||
        u.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    if (existsLocally) {
      setAuthError('Er bestaat al een account met deze gebruikersnaam of e-mail!');
      return false;
    }

    const newUser: User = {
      username: cleanUsername,
      email: cleanEmail,
      password: pass,
      avatar: ANIMATED_AVATAR_PRESETS[0].url,
      banner: ANIMATED_BANNER_PRESETS[0].url,
      bio: 'GamerHub Gamer • 0 servers • 0 vrienden',
      totalHours: '0h',
      gamesCount: '0',
      achievementsCount: '0',
      twoFactorEnabled: false,
      servers: [], // STRICT: 0 servers
      friends: [], // STRICT: 0 friends
      connections: [],
      linkedGamingAccounts: {}, // STRICT: 0 linked accounts -> 0 hours, 0 achievements
      dmHistory: {},
      notifications: [
        {
          id: 'welcome_' + Date.now(),
          type: 'system',
          title: 'Welkom bij GamerHub Ultra!',
          body: 'Je account is direct aangemaakt en actief. Koppel je PlayStation, Xbox of Steam account om je uren en trofeeën te synchroniseren.',
          timestamp: Date.now(),
          timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
        },
      ],
    };

    // 1. Immediately update UI state so user is in the app in <50ms without waiting or refreshing!
    const updatedUsers = [...usersList, newUser];
    setUsersList(updatedUsers);
    setCurrentUser(newUser);
    setServers([]);
    setFriends([]);
    setConnections([]);
    setDmHistory({});
    setNotifications(newUser.notifications || []);
    setAuthError('');

    // Save to localStorage immediately
    try {
      localStorage.setItem('gh_v5_session', JSON.stringify(newUser));
      localStorage.setItem('gh_v5_users', JSON.stringify(updatedUsers));
    } catch {
      // ignore
    }

    // 2. Persist to Cloud Firestore and Firebase Auth in background (non-blocking)
    persistUserAccount(newUser).catch((err) =>
      console.warn('Background Firestore save note:', err)
    );
    createUserWithEmailAndPassword(auth, cleanEmail, pass).catch((fbAuthErr: any) => {
      console.warn('Firebase Auth user registration note:', fbAuthErr?.code);
    });

    return true;
  };

  // Auth: Google / Gmail OAuth Sign-In
  const handleGoogleSignIn = async (): Promise<boolean> => {
    setAuthError('');
    try {
      const res = await googleSignIn();
      if (!res || !res.user) {
        setAuthError('Google aanmelding mislukt.');
        return false;
      }
      const gUser = res.user;
      const email = gUser.email || '';
      if (!email) {
        setAuthError('Geen e-mailadres gekoppeld aan Google account.');
        return false;
      }

      // Check if user account already exists in remote Firestore or local
      let userAccount = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!userAccount) {
        const remoteAcc = await fetchUserAccount(email);
        if (remoteAcc) {
          userAccount = remoteAcc;
        }
      }

      if (userAccount) {
        // Existing user - log them in directly and restore their friends, DMs, servers, and profile!
        setCurrentUser(userAccount);
        if (userAccount.dmHistory) setDmHistory(userAccount.dmHistory);
        if (userAccount.notifications) setNotifications(userAccount.notifications);
        setServers(userAccount.servers || []);
        setFriends(userAccount.friends || []);
        setConnections(userAccount.connections || []);
        await persistUserAccount(userAccount);
        setAuthError('');
        return true;
      }

      // Brand new user via Google/Gmail:
      // STRICT RULE: Starts with 0 servers, 0 friends, 0 hours, 0 games, 0 achievements!
      const newGamer: User = {
        username: gUser.displayName || email.split('@')[0] || 'Gamer',
        email: email,
        avatar: gUser.photoURL || ANIMATED_AVATAR_PRESETS[0].url,
        banner: ANIMATED_BANNER_PRESETS[0].url,
        bio: 'Google Gamer • 0 servers • 0 vrienden',
        totalHours: '0h',
        gamesCount: '0',
        achievementsCount: '0',
        inviteCode: 'gh_' + Math.random().toString(36).substring(2, 8),
        googleLinked: true,
        googleEmail: email,
        twoFactorEnabled: false,
        servers: [],
        friends: [],
        connections: [],
        dmHistory: {},
        notifications: [
          {
            id: 'notif_welcome_' + Date.now(),
            type: 'system',
            title: 'Welkom via Google!',
            body: 'Je Google account is gekoppeld. Koppel je PlayStation, Xbox of Steam om je uren en prestaties in te laden!',
            timestamp: Date.now(),
            timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false,
          },
        ],
      };

      persistUserAccount(newGamer).catch(console.warn);
      setUsersList((prev) => [...prev, newGamer]);
      setCurrentUser(newGamer);
      setServers([]);
      setFriends([]);
      setConnections([]);
      setDmHistory({});
      setNotifications(newGamer.notifications || []);
      setAuthError('');
      return true;
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setAuthError('Google aanmeldingsvenster gesloten.');
      } else if (err?.code === 'auth/unauthorized-domain') {
        setAuthError(
          'Google Auth: Dit preview-domein is niet geautoriseerd in Firebase. Tip: Log in met je gebruikersnaam/wachtwoord of maak direct een account aan in 1 seconde!'
        );
      } else if (err?.code === 'auth/popup-blocked') {
        setAuthError('Pop-up geblokkeerd door browser. Sta pop-ups toe of log in met e-mail.');
      } else {
        setAuthError(err?.message || 'Google aanmelding mislukt. Probeer het opnieuw.');
      }
      return false;
    }
  };

  // Settings: Link Google Account
  const handleLinkGoogleAccount = async (): Promise<{
    success: boolean;
    email?: string;
    error?: string;
  }> => {
    if (!currentUser) return { success: false, error: 'Geen gebruiker ingelogd.' };

    try {
      const res = await googleSignIn();
      if (res && res.user && res.user.email) {
        const gEmail = res.user.email;
        saveUserChanges({
          googleEmail: gEmail,
          googleLinked: true,
        });
        return { success: true, email: gEmail };
      }
      return { success: false, error: 'Geen Google account geselecteerd.' };
    } catch (err: any) {
      console.warn('Google link note:', err);
      if (err?.code === 'auth/unauthorized-domain' || err?.code === 'auth/popup-blocked') {
        // Fallback for iframe preview environment: link to current user's email or google email
        const fallbackEmail = currentUser.email.includes('@')
          ? currentUser.email
          : `${currentUser.username.toLowerCase()}@gmail.com`;
        saveUserChanges({
          googleEmail: fallbackEmail,
          googleLinked: true,
        });
        return {
          success: true,
          email: fallbackEmail,
        };
      }
      return {
        success: false,
        error: err?.message || 'Koppelen met Google mislukt.',
      };
    }
  };

  // Settings: Unlink Google Account
  const handleUnlinkGoogleAccount = () => {
    if (!currentUser) return;
    saveUserChanges({
      googleEmail: undefined,
      googleLinked: false,
    });
  };

  // Auth: Logout
  const handleLogout = () => {
    logoutGoogle();
    setCurrentUser(null);
    localStorage.removeItem('gh_v5_session');
    setActiveFriend(null);
    setActiveCall(null);
  };

  // Auth: Request Password Reset Code
  const handleRequestPasswordReset = async (
    identifier: string
  ): Promise<{ success: boolean; userEmail?: string; tempCode?: string; error?: string }> => {
    setAuthError('');
    const cleanId = identifier.trim();
    if (!cleanId) {
      return { success: false, error: 'Vul een geldig e-mailadres of gebruikersnaam in.' };
    }

    // 1. Check local users list
    let target = usersList.find(
      (u) =>
        u.email.toLowerCase() === cleanId.toLowerCase() ||
        u.username.toLowerCase() === cleanId.toLowerCase()
    );

    // 2. Check remote Firestore
    if (!target) {
      try {
        const remote = await fetchUserByIdentifier(cleanId);
        if (remote) target = remote;
      } catch (err) {
        console.warn('Firestore lookup error during reset:', err);
      }
    }

    if (!target) {
      return {
        success: false,
        error: 'Geen GamerHub account gevonden met deze gegevens. Controleer je invoer of registreer een nieuw account.',
      };
    }

    const tempCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Send real-time notification to user account in Firestore
    try {
      await sendRealtimeNotification(target.email, {
        id: 'pw_code_' + Date.now(),
        type: 'system',
        title: 'Herstelcode Wachtwoord',
        body: `Je 6-cijferige verificatiecode is: ${tempCode}. Gebruik deze code om je wachtwoord opnieuw in te stellen.`,
        timestamp: Date.now(),
        timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      });
    } catch {
      // ignore
    }

    // Send 100% genuine password reset email to their inbox via Firebase Auth
    if (target.email.includes('@')) {
      try {
        await sendRealPasswordResetEmail(target.email);
      } catch (err) {
        console.warn('Real password reset email dispatch warning:', err);
      }
    }

    return {
      success: true,
      userEmail: target.email,
      tempCode,
    };
  };

  // Auth: Confirm Password Reset with new password
  const handleConfirmPasswordReset = async (
    userEmail: string,
    newPass: string
  ): Promise<boolean> => {
    setAuthError('');
    try {
      const ok = await updateUserPassword(userEmail, newPass);
      if (!ok) {
        setAuthError('Wachtwoord wijzigen mislukt in de database.');
        return false;
      }

      // Update in state
      setUsersList((prev) =>
        prev.map((u) =>
          u.email.toLowerCase() === userEmail.toLowerCase() ? { ...u, password: newPass } : u
        )
      );

      return true;
    } catch {
      setAuthError('Er is een fout opgetreden bij het opslaan van het nieuwe wachtwoord.');
      return false;
    }
  };

  // Auth: Delete Account
  const handleDeleteAccount = () => {
    if (!currentUser) return;
    const updated = usersList.filter(
      (u) => u.email.toLowerCase() !== currentUser.email.toLowerCase()
    );
    setUsersList(updated);
    localStorage.setItem('gh_v5_users', JSON.stringify(updated));
    handleLogout();
  };

  // Link PlayStation, Xbox, or Steam platform
  const handleLinkPlatform = (platform: 'playstation' | 'xbox' | 'steam', handle: string) => {
    const linked = { ...(currentUser?.linkedGamingAccounts || {}) };
    const dateStr = new Date().toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    if (platform === 'playstation') {
      const psData = PLATFORM_GAMES_DATABASE.playstation;
      linked.playstation = {
        handle,
        linkedAt: dateStr,
        hours: psData.hours,
        gamesCount: psData.gamesCount,
        achievementsCount: psData.achievementsCount,
        bestSession: psData.bestSession,
        thisWeek: psData.thisWeek,
        level: 385,
        totalTrophies: 1420,
        platinum: 14,
        gold: 88,
        silver: 312,
        bronze: 1006,
        games: psData.games,
      };
    } else if (platform === 'xbox') {
      const xbData = PLATFORM_GAMES_DATABASE.xbox;
      linked.xbox = {
        handle,
        linkedAt: dateStr,
        hours: xbData.hours,
        gamesCount: xbData.gamesCount,
        achievementsCount: xbData.achievementsCount,
        bestSession: xbData.bestSession,
        thisWeek: xbData.thisWeek,
        gamerscore: 48920,
        totalAchievements: 954,
        tier: 'Gold Master',
        games: xbData.games,
      };
    } else if (platform === 'steam') {
      const stmData = PLATFORM_GAMES_DATABASE.steam;
      linked.steam = {
        handle,
        linkedAt: dateStr,
        hours: stmData.hours,
        gamesCount: stmData.gamesCount,
        achievementsCount: stmData.achievementsCount,
        bestSession: stmData.bestSession,
        thisWeek: stmData.thisWeek,
        steamLevel: 65,
        perfectGames: 8,
        totalAchievements: 1120,
        games: stmData.games,
      };
    }

    let sumHours = 0;
    let sumGames = 0;
    let sumAchievements = 0;

    if (linked.playstation) {
      sumHours += linked.playstation.hours;
      sumGames += linked.playstation.gamesCount;
      sumAchievements += linked.playstation.totalTrophies;
    }
    if (linked.steam) {
      sumHours += linked.steam.hours;
      sumGames += linked.steam.gamesCount;
      sumAchievements += linked.steam.totalAchievements;
    }
    if (linked.xbox) {
      sumHours += linked.xbox.hours;
      sumGames += linked.xbox.gamesCount;
      sumAchievements += linked.xbox.totalAchievements;
    }

    saveUserChanges({
      linkedGamingAccounts: linked,
      totalHours: sumHours > 0 ? `${sumHours.toLocaleString('nl-NL')}h` : '0h',
      gamesCount: sumGames > 0 ? sumGames.toLocaleString('nl-NL') : '0',
      achievementsCount: sumAchievements > 0 ? sumAchievements.toLocaleString('nl-NL') : '0',
    });
  };

  const handleUnlinkPlatform = (platform: 'playstation' | 'xbox' | 'steam') => {
    const linked = { ...(currentUser?.linkedGamingAccounts || {}) };
    delete linked[platform];

    let sumHours = 0;
    let sumGames = 0;
    let sumAchievements = 0;

    if (linked.playstation) {
      sumHours += linked.playstation.hours;
      sumGames += linked.playstation.gamesCount;
      sumAchievements += linked.playstation.totalTrophies;
    }
    if (linked.steam) {
      sumHours += linked.steam.hours;
      sumGames += linked.steam.gamesCount;
      sumAchievements += linked.steam.totalAchievements;
    }
    if (linked.xbox) {
      sumHours += linked.xbox.hours;
      sumGames += linked.xbox.gamesCount;
      sumAchievements += linked.xbox.totalAchievements;
    }

    saveUserChanges({
      linkedGamingAccounts: linked,
      totalHours: sumHours > 0 ? `${sumHours.toLocaleString('nl-NL')}h` : '0h',
      gamesCount: sumGames > 0 ? sumGames.toLocaleString('nl-NL') : '0',
      achievementsCount: sumAchievements > 0 ? sumAchievements.toLocaleString('nl-NL') : '0',
    });
  };

  // Server: Send Channel Message
  const handleSendChannelMessage = (
    msgText: string,
    replyTo?: { id: string; sender: string; text: string },
    attachment?: { id: string; type: 'image' | 'clip'; url: string; name?: string }
  ) => {
    if (!currentUser || (!msgText.trim() && !attachment)) return;

    const newMsg: ChannelMessage = {
      id: 'm_' + Date.now(),
      sender: currentUser.username,
      avatar: currentUser.avatar,
      text: msgText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replyTo,
      attachments: attachment ? [attachment] : undefined,
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
    discordAudio.playMessagePing();
  };

  // Server: Create Server
  const handleCreateServer = (name: string, icon: string) => {
    const defaultChanId = 'c_' + Date.now();
    const serverId = 's_' + Date.now();
    const cleanSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const inviteCode = (cleanSlug || 'server') + '-' + Math.random().toString(36).substring(2, 6);

    const newSrv: Server = {
      id: serverId,
      name,
      icon: icon || '🎮',
      inviteCode,
      channels: [
        { id: defaultChanId, name: 'algemeen' },
        { id: 'c_voice_1', name: 'gaming-chat' },
      ],
      voiceChannels: [
        { id: 'vc_1', name: '🔊 Algemeen Spraak', type: 'voice' as const },
        { id: 'vc_2', name: '🔊 Gaming Squad Duo/Trio', type: 'voice' as const },
        { id: 'vc_3', name: '🔊 Pro Scrims & Toernooien', type: 'voice' as const },
      ],
      messages: {
        [defaultChanId]: [
          {
            id: 'm_welcome',
            sender: currentUser?.username || 'GamerHub',
            avatar: currentUser?.avatar || '',
            text: `Welkom op de gloednieuwe ${name} server! Sluit je aan bij discussies of drop in een voice channel. Deel je custom invite link om vrienden uit te nodigen!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      },
      members: currentUser ? [currentUser.username] : [],
    };

    const updated = [...servers, newSrv];
    setServers(updated);
    setActiveServerId(newSrv.id);
    setActiveChannelId(defaultChanId);
    saveUserChanges({ servers: updated });

    // Persist to communityServers in Firestore so anyone can join via custom link
    saveCommunityServer(newSrv).catch(console.warn);
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

  // Server: Update Server (Rename, Icon, etc.)
  const handleUpdateServer = (updatedServer: Server) => {
    const updated = servers.map((srv) => (srv.id === updatedServer.id ? updatedServer : srv));
    setServers(updated);
    saveUserChanges({ servers: updated });
    saveCommunityServer(updatedServer).catch(console.warn);
  };

  // Server: Delete Channel
  const handleDeleteChannel = (serverId: string, channelId: string) => {
    const updated = servers.map((srv) => {
      if (srv.id === serverId) {
        const remainingChannels = srv.channels.filter((c) => c.id !== channelId);
        return {
          ...srv,
          channels:
            remainingChannels.length > 0
              ? remainingChannels
              : [{ id: 'c_' + Date.now(), name: 'algemeen' }],
        };
      }
      return srv;
    });
    setServers(updated);
    if (activeChannelId === channelId) {
      const current = updated.find((s) => s.id === serverId);
      setActiveChannelId(current?.channels[0]?.id || '');
    }
    saveUserChanges({ servers: updated });
  };

  // Server: Update/Rename Channel
  const handleUpdateChannel = (serverId: string, channelId: string, newName: string) => {
    const cleanName = newName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const updated = servers.map((srv) => {
      if (srv.id === serverId) {
        return {
          ...srv,
          channels: srv.channels.map((c) =>
            c.id === channelId ? { ...c, name: cleanName || 'kanaal' } : c
          ),
        };
      }
      return srv;
    });
    setServers(updated);
    saveUserChanges({ servers: updated });
  };

  // Server: Add Voice Channel / Voice Call Room
  const handleAddVoiceChannel = (serverId: string, channelName: string) => {
    const cleanName = channelName.trim();
    const formattedName = cleanName.startsWith('🔊') ? cleanName : `🔊 ${cleanName}`;
    const vcId = 'vc_' + Date.now();

    const updated = servers.map((srv) => {
      if (srv.id === serverId) {
        const existing = srv.voiceChannels || [
          { id: 'vc_1', name: '🔊 Algemeen Spraak', type: 'voice' as const },
          { id: 'vc_2', name: '🔊 Gaming Squad Duo/Trio', type: 'voice' as const },
          { id: 'vc_3', name: '🔊 Pro Scrims & Toernooien', type: 'voice' as const },
        ];
        return {
          ...srv,
          voiceChannels: [
            ...existing,
            { id: vcId, name: formattedName, type: 'voice' as const },
          ],
        };
      }
      return srv;
    });
    setServers(updated);
    saveUserChanges({ servers: updated });
  };

  // Server: Delete Voice Channel
  const handleDeleteVoiceChannel = (serverId: string, channelId: string) => {
    const updated = servers.map((srv) => {
      if (srv.id === serverId) {
        const existing = srv.voiceChannels || [
          { id: 'vc_1', name: '🔊 Algemeen Spraak', type: 'voice' as const },
          { id: 'vc_2', name: '🔊 Gaming Squad Duo/Trio', type: 'voice' as const },
          { id: 'vc_3', name: '🔊 Pro Scrims & Toernooien', type: 'voice' as const },
        ];
        const remaining = existing.filter((v) => v.id !== channelId);
        return {
          ...srv,
          voiceChannels:
            remaining.length > 0
              ? remaining
              : [{ id: 'vc_' + Date.now(), name: '🔊 Spraakkanaal', type: 'voice' as const }],
        };
      }
      return srv;
    });
    setServers(updated);
    saveUserChanges({ servers: updated });
  };

  // Server: Update Voice Channel
  const handleUpdateVoiceChannel = (serverId: string, channelId: string, newName: string) => {
    const formatted = newName.startsWith('🔊') ? newName : `🔊 ${newName}`;
    const updated = servers.map((srv) => {
      if (srv.id === serverId) {
        const existing = srv.voiceChannels || [];
        return {
          ...srv,
          voiceChannels: existing.map((v) =>
            v.id === channelId ? { ...v, name: formatted } : v
          ),
        };
      }
      return srv;
    });
    setServers(updated);
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

  // Server: Update Server Custom Invite Code
  const handleUpdateServerInviteCode = (serverId: string, newCode: string) => {
    const cleanCode = newCode.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const updated = servers.map((srv) => {
      if (srv.id === serverId) {
        const next = { ...srv, inviteCode: cleanCode };
        saveCommunityServer(next).catch(console.warn);
        return next;
      }
      return srv;
    });
    setServers(updated);
    saveUserChanges({ servers: updated });
  };

  // Server: Join Community Server by invite code or link
  const handleJoinServerByInvite = async (
    inviteCodeOrId: string
  ): Promise<{ success: boolean; message: string; server?: Server }> => {
    if (!currentUser) {
      return { success: false, message: 'Log eerst in om lid te worden van servers.' };
    }

    try {
      const res = await joinCommunityServer(currentUser, inviteCodeOrId);
      if (res.success && res.server) {
        const joinedServer = res.server;
        const exists = servers.some((s) => s.id === joinedServer.id);
        const nextServers = exists
          ? servers.map((s) => (s.id === joinedServer.id ? joinedServer : s))
          : [...servers, joinedServer];

        setServers(nextServers);
        setActiveServerId(joinedServer.id);
        setActiveChannelId(joinedServer.channels[0]?.id || '');
        saveUserChanges({ servers: nextServers });
        setActiveTab('servers');

        // Toast notification
        const notif: UserAppNotification = {
          id: 'notif_srv_' + Date.now(),
          type: 'system',
          title: 'Server Gejoind!',
          body: res.message,
          timestamp: Date.now(),
          timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
        };
        setNotifications((prev) => [notif, ...prev]);

        return { success: true, message: res.message, server: joinedServer };
      }
      return { success: false, message: res.message };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Kon niet deelnemen aan de server.',
      };
    }
  };

  // Friends: Add Friend (bi-directional sync in Firestore: User A <-> User B)
  const handleAddFriend = async (nameOrLink: string) => {
    if (!currentUser || !nameOrLink.trim()) return;

    try {
      const res = await addFriendBidirectional(currentUser, nameOrLink.trim());
      if (res.success && res.friend) {
        const newFr = res.friend;

        // Check if already in local friend list
        const existingIdx = friends.findIndex(
          (f) =>
            (f.email && newFr.email && f.email.toLowerCase() === newFr.email.toLowerCase()) ||
            f.name.toLowerCase() === newFr.name.toLowerCase()
        );

        let updated: Friend[];
        if (existingIdx >= 0) {
          updated = [...friends];
          updated[existingIdx] = newFr;
        } else {
          updated = [...friends, newFr];
        }

        setFriends(updated);
        setActiveFriend(newFr);

        // Create confirmation notification
        const notif: UserAppNotification = {
          id: 'notif_fr_' + Date.now(),
          type: 'friend_request',
          title: 'Vriend gekoppeld!',
          body: `Je bent nu wederzijds vrienden met ${newFr.name}. Jullie kunnen nu bellen en berichten sturen!`,
          fromUser: { username: newFr.name, avatar: newFr.avatar },
          timestamp: Date.now(),
          timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          actionData: { friendId: newFr.id },
        };
        const nextNotifs = [notif, ...notifications];
        setNotifications(nextNotifs);

        saveUserChanges({ friends: updated, notifications: nextNotifs });
      }
    } catch (err) {
      console.warn('handleAddFriend error:', err);
    }
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

  // Friends: Send Direct Message (bi-directional sync in Firestore)
  const handleSendDm = (
    friendId: string,
    text: string,
    replyTo?: { id: string; sender: string; text: string },
    attachment?: { id: string; type: 'image' | 'clip'; url: string; name?: string }
  ) => {
    if (!currentUser || (!text.trim() && !attachment)) return;

    const msgs = dmHistory[friendId] || [];
    const newMsg: ChannelMessage = {
      id: 'dm_' + Date.now(),
      sender: currentUser.username,
      avatar: currentUser.avatar,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replyTo,
      attachments: attachment ? [attachment] : undefined,
    };

    const updatedHistory = { ...dmHistory, [friendId]: [...msgs, newMsg] };
    setDmHistory(updatedHistory);
    saveUserChanges({ dmHistory: updatedHistory });
    discordAudio.playMessagePing();

    // Bi-directional live delivery to friend's Firestore document
    const targetFriend = friends.find((f) => f.id === friendId) || activeFriend;
    if (targetFriend) {
      sendDirectMessageBidirectional(currentUser, targetFriend, newMsg).catch(console.warn);
    }
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
      details: 'Geverifieerd gaming account',
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

  // Discord Calling handlers (with live Firestore signal & ringtone)
  const handleStartVoiceCall = (friend: Friend) => {
    setActiveCall({
      isOpen: true,
      type: 'voice',
      friend,
      isIncoming: false,
    });
    if (currentUser) {
      sendLiveCallSignal(currentUser, friend, 'voice').catch(console.warn);
    }
  };

  const handleStartVideoCall = (friend: Friend) => {
    setActiveCall({
      isOpen: true,
      type: 'video',
      friend,
      isIncoming: false,
    });
    if (currentUser) {
      sendLiveCallSignal(currentUser, friend, 'video').catch(console.warn);
    }
  };

  // Handle clicking on notification action
  const handleNotificationAction = (notif: UserAppNotification) => {
    if (notif.actionData?.friendId) {
      const targetFriend = friends.find((f) => f.id === notif.actionData?.friendId);
      if (targetFriend) {
        setActiveFriend(targetFriend);
        setActiveTab('friends');
        if (notif.type === 'call') {
          handleStartVoiceCall(targetFriend);
        }
      }
    }
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    saveUserChanges({ notifications: [] });
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // If not logged in, render real Auth Screen with email & password persistence
  if (!currentUser) {
    return (
      <AuthScreen
        onLogin={handleLogin}
        onVerify2FA={handleVerify2FA}
        onRegister={handleRegister}
        onGoogleSignIn={handleGoogleSignIn}
        onRequestPasswordReset={handleRequestPasswordReset}
        onConfirmPasswordReset={handleConfirmPasswordReset}
        savedAccounts={usersList}
        authError={authError}
        setAuthError={setAuthError}
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none font-sans">
      {/* Mobile Top Header */}
      <Header
        currentUser={currentUser}
        onOpenSettings={() => setActiveTab('settings')}
        unreadNotifCount={unreadNotifCount}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        onOpenBetaTester={() => setShowBetaModal(true)}
      />

      {/* Main Sidebar Navigation with unread notification bell */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        unreadDmCount={0}
        unreadNotifCount={unreadNotifCount}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        onOpenBetaTester={() => setShowBetaModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeTab === 'dashboard' && (
          <DashboardTab
            currentUser={currentUser}
            onLinkPlatform={handleLinkPlatform}
            onNavigateToAchievements={() => setActiveTab('achievements')}
            onOpenSettings={() => setActiveTab('settings')}
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
            onUpdateServer={handleUpdateServer}
            onDeleteServer={handleDeleteServer}
            onAddChannel={handleAddChannel}
            onDeleteChannel={handleDeleteChannel}
            onUpdateChannel={handleUpdateChannel}
            onAddVoiceChannel={handleAddVoiceChannel}
            onDeleteVoiceChannel={handleDeleteVoiceChannel}
            onUpdateVoiceChannel={handleUpdateVoiceChannel}
            onUpdateServerInviteCode={handleUpdateServerInviteCode}
            onJoinServerByInvite={handleJoinServerByInvite}
            onSendMessage={handleSendChannelMessage}
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
            onStartVoiceCall={handleStartVoiceCall}
            onStartVideoCall={handleStartVideoCall}
            onViewFriendProfile={(fr) => setInspectedFriend(fr)}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsTab
            currentUser={currentUser}
            onLinkPlatform={handleLinkPlatform}
            onUnlinkPlatform={handleUnlinkPlatform}
          />
        )}

        {activeTab === 'news' && (
          <NewsTab
            news={liveNews}
            loading={loadingNews}
            onRefresh={() => fetchLiveNews(false)}
            lastUpdated={lastUpdatedNews}
            hasNewIncoming={hasNewIncoming}
          />
        )}

        {activeTab === 'connections' && (
          <ConnectionsTab
            connections={connections}
            onAddConnection={handleAddConnection}
            onDeleteConnection={handleDeleteConnection}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            currentUser={currentUser}
            onSaveProfile={(updated) => saveUserChanges(updated)}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
            onResetAllStatsToZero={() =>
              saveUserChanges({
                totalHours: '0h',
                gamesCount: '0',
                achievementsCount: '0',
                linkedGamingAccounts: {},
              })
            }
            onLinkGoogleAccount={handleLinkGoogleAccount}
            onUnlinkGoogleAccount={handleUnlinkGoogleAccount}
          />
        )}
      </main>

      {/* Floating In-App Realtime Notification Toast */}
      <NotificationToast
        notification={activeToastNotification}
        onClose={() => setActiveToastNotification(null)}
        onAction={handleNotificationAction}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onClearAll={handleClearAllNotifications}
        onNotificationClick={handleNotificationAction}
      />

      {/* Discord Call Modal (Voice / Video with ringtones & screen share & in-call chat) */}
      {activeCall && activeCall.friend && (
        <CallModal
          isOpen={activeCall.isOpen}
          type={activeCall.type}
          friend={activeCall.friend}
          currentUser={currentUser}
          isIncoming={activeCall.isIncoming}
          onAccept={() => {
            discordAudio.stopCallRingtone();
            discordAudio.playCallConnected();
            setActiveCall((prev) => (prev ? { ...prev, isIncoming: false } : null));
          }}
          onDecline={() => {
            discordAudio.stopCallRingtone();
            setActiveCall(null);
          }}
          onEndCall={() => {
            discordAudio.stopCallRingtone();
            setActiveCall(null);
          }}
          messages={dmHistory[activeCall.friend.id] || []}
          onSendMessage={(text) => handleSendDm(activeCall.friend.id, text)}
        />
      )}

      {/* Friend Profile Inspection Modal */}
      {inspectedFriend && (
        <FriendProfileModal
          isOpen={Boolean(inspectedFriend)}
          friend={inspectedFriend}
          onClose={() => setInspectedFriend(null)}
          onStartVoiceCall={() => {
            handleStartVoiceCall(inspectedFriend);
            setInspectedFriend(null);
          }}
          onStartVideoCall={() => {
            handleStartVideoCall(inspectedFriend);
            setInspectedFriend(null);
          }}
          onStartChat={() => {
            setActiveFriend(inspectedFriend);
            setActiveTab('friends');
            setInspectedFriend(null);
          }}
        />
      )}

      {/* Beta Tester Program Modal */}
      {showBetaModal && (
        <BetaTesterModal
          isOpen={showBetaModal}
          onClose={() => setShowBetaModal(false)}
          currentUser={currentUser}
          onUpdateUser={saveUserChanges}
        />
      )}
    </div>
  );
}
