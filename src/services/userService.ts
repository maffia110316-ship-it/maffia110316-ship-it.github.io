import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { User, UserAppNotification, Friend, Server, ChannelMessage } from '../types';

// Convert email to safe Firestore document ID
export const getDocIdFromEmail = (email: string): string => {
  return email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
};

/**
 * Permanently save/sync user account data to Firestore and localStorage
 */
export const persistUserAccount = async (user: User): Promise<void> => {
  if (!user || !user.email) return;

  const docId = getDocIdFromEmail(user.email);
  const userPayload: User = {
    ...user,
    email: user.email.trim().toLowerCase(),
    dmHistory: user.dmHistory || {},
    notifications: user.notifications || [],
  };

  // 1. Always update local storage for immediate offline/fast load
  try {
    localStorage.setItem('gh_v5_session', JSON.stringify(userPayload));

    // Update users directory in local storage
    const storedUsersJson = localStorage.getItem('gh_v5_users');
    const storedUsers: User[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
    const index = storedUsers.findIndex((u) => u.email.toLowerCase() === userPayload.email);
    if (index >= 0) {
      storedUsers[index] = userPayload;
    } else {
      storedUsers.push(userPayload);
    }
    localStorage.setItem('gh_v5_users', JSON.stringify(storedUsers));
  } catch (err) {
    console.warn('LocalStorage save warning:', err);
  }

  // 2. Persist to Cloud Firestore
  try {
    const userRef = doc(db, 'users', docId);
    await setDoc(userRef, userPayload, { merge: true });
  } catch (err) {
    console.error('Firestore persistUserAccount error (will rely on local storage):', err);
  }
};

/**
 * Retrieve user by email (from Firestore first, then localStorage fallback)
 */
export const fetchUserAccount = async (email: string): Promise<User | null> => {
  if (!email) return null;
  const docId = getDocIdFromEmail(email);

  // 1. Try Firestore first
  try {
    const userRef = doc(db, 'users', docId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as User;
    }
  } catch (err) {
    console.warn('Firestore fetch error, falling back to local storage:', err);
  }

  // 2. Fallback to localStorage
  try {
    const storedUsersJson = localStorage.getItem('gh_v5_users');
    if (storedUsersJson) {
      const storedUsers: User[] = JSON.parse(storedUsersJson);
      const found = storedUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (found) return found;
    }
  } catch (err) {
    console.warn('LocalStorage lookup error:', err);
  }

  return null;
};

/**
 * Search user in Firestore by email, username, or invite code
 */
export const findUserInFirestore = async (queryText: string): Promise<User | null> => {
  if (!queryText) return null;
  const clean = queryText.trim().toLowerCase();

  // 1. Direct doc lookup by email
  if (clean.includes('@')) {
    const byEmail = await fetchUserAccount(clean);
    if (byEmail) return byEmail;
  }

  // 2. Query Firestore users collection
  try {
    const usersCol = collection(db, 'users');
    const snap = await getDocs(usersCol);
    for (const d of snap.docs) {
      const u = d.data() as User;
      const uName = (u.username || '').toLowerCase();
      const uEmail = (u.email || '').toLowerCase();
      const uCode = (u.inviteCode || '').toLowerCase();

      // Check match: exact username, username without tag, email, or invite code
      if (
        uEmail === clean ||
        uName === clean ||
        uName.split('#')[0] === clean ||
        clean.includes(uName) ||
        uCode === clean
      ) {
        return u;
      }
    }
  } catch (err) {
    console.warn('Error querying users collection in Firestore:', err);
  }

  // 3. Fallback to local storage users
  try {
    const storedUsersJson = localStorage.getItem('gh_v5_users');
    if (storedUsersJson) {
      const storedUsers: User[] = JSON.parse(storedUsersJson);
      const found = storedUsers.find((u) => {
        const uName = (u.username || '').toLowerCase();
        const uEmail = (u.email || '').toLowerCase();
        return (
          uEmail === clean ||
          uName === clean ||
          uName.split('#')[0] === clean ||
          (u.inviteCode || '').toLowerCase() === clean
        );
      });
      if (found) return found;
    }
  } catch {
    // ignore
  }

  return null;
};

/**
 * Bi-directional friend addition!
 * Adds TargetUser to CurrentUser's list AND CurrentUser to TargetUser's list in Firestore!
 */
export const addFriendBidirectional = async (
  currentUser: User,
  identifier: string
): Promise<{ success: boolean; friend: Friend; isRemoteSynced: boolean }> => {
  let cleanName = identifier.trim();

  // Strip invite url if present
  if (cleanName.includes('?invite=')) {
    try {
      const url = new URL(cleanName);
      const inv = url.searchParams.get('invite');
      if (inv) cleanName = decodeURIComponent(inv);
    } catch {
      const match = cleanName.match(/\?invite=([^&]+)/);
      if (match) cleanName = decodeURIComponent(match[1]);
    }
  }

  // 1. Try to find real registered user in Firestore
  const targetUser = await findUserInFirestore(cleanName);
  const now = Date.now();

  let targetFriend: Friend;
  let isRemoteSynced = false;

  if (targetUser && targetUser.email.toLowerCase() !== currentUser.email.toLowerCase()) {
    // Real registered user found!
    const targetDocId = getDocIdFromEmail(targetUser.email);
    const myDocId = getDocIdFromEmail(currentUser.email);

    targetFriend = {
      id: 'f_' + targetDocId,
      name: targetUser.username,
      email: targetUser.email,
      status: 'online',
      game: 'GamerHub Gamer',
      avatar: targetUser.avatar,
      isBlocked: false,
      lastActiveTimestamp: now,
      lastSeen: 'Nu actief',
    };

    // Construct CurrentUser as a Friend for TargetUser
    const meAsFriend: Friend = {
      id: 'f_' + myDocId,
      name: currentUser.username,
      email: currentUser.email,
      status: 'online',
      game: 'GamerHub Gamer',
      avatar: currentUser.avatar,
      isBlocked: false,
      lastActiveTimestamp: now,
      lastSeen: 'Nu actief',
    };

    // Update TargetUser in Firestore: add CurrentUser to their friends and create notification!
    try {
      const targetRef = doc(db, 'users', targetDocId);
      const targetSnap = await getDoc(targetRef);
      if (targetSnap.exists()) {
        const remoteData = targetSnap.data() as User;
        const existingFriends = remoteData.friends || [];
        const alreadyHasMe = existingFriends.some(
          (f) =>
            (f.email && f.email.toLowerCase() === currentUser.email.toLowerCase()) ||
            f.name.toLowerCase() === currentUser.username.toLowerCase()
        );

        const updatedFriends = alreadyHasMe
          ? existingFriends
          : [meAsFriend, ...existingFriends];

        const notif: UserAppNotification = {
          id: 'notif_fr_' + now,
          type: 'friend_request',
          title: 'Nieuwe Vriend!',
          body: `${currentUser.username} heeft je toegevoegd als vriend! Jullie kunnen nu bellen en berichten sturen.`,
          fromUser: { username: currentUser.username, avatar: currentUser.avatar },
          timestamp: now,
          timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          actionData: { friendId: meAsFriend.id },
        };

        const updatedNotifs = [notif, ...(remoteData.notifications || [])].slice(0, 50);

        await setDoc(
          targetRef,
          { friends: updatedFriends, notifications: updatedNotifs },
          { merge: true }
        );
        isRemoteSynced = true;
      }
    } catch (err) {
      console.warn('Failed to update target user in Firestore:', err);
    }
  } else {
    // Simulated friend or user hasn't registered yet
    const hasTag = cleanName.includes('#');
    const assignedName = hasTag
      ? cleanName
      : `${cleanName}#${Math.floor(1000 + Math.random() * 9000)}`;

    targetFriend = {
      id: 'f_' + now,
      name: assignedName,
      status: 'online',
      game: 'GamerHub Lid',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(assignedName)}`,
      isBlocked: false,
      lastActiveTimestamp: now,
      lastSeen: 'Nu actief',
    };
  }

  return { success: true, friend: targetFriend, isRemoteSynced };
};

/**
 * Bi-directional Direct Message sending!
 * Writes to CurrentUser's history AND writes directly into Friend's Firestore account!
 */
export const sendDirectMessageBidirectional = async (
  currentUser: User,
  targetFriend: Friend,
  message: ChannelMessage
): Promise<void> => {
  if (!currentUser || !targetFriend) return;

  // If friend has an email or matches a user doc in Firestore
  const targetEmail = targetFriend.email;
  const myDocId = getDocIdFromEmail(currentUser.email);
  const myFriendIdKey = 'f_' + myDocId;

  if (targetEmail) {
    try {
      const targetDocId = getDocIdFromEmail(targetEmail);
      const targetRef = doc(db, 'users', targetDocId);
      const targetSnap = await getDoc(targetRef);

      if (targetSnap.exists()) {
        const targetData = targetSnap.data() as User;
        const currentTargetDMs = targetData.dmHistory || {};

        // Find existing key for current user in target's DM history
        const possibleKeys = [myFriendIdKey, currentUser.username, targetFriend.id];
        const activeKey = possibleKeys.find((k) => currentTargetDMs[k]) || myFriendIdKey;

        const updatedTargetMsgs = [...(currentTargetDMs[activeKey] || []), message];
        const nextDmHistory = { ...currentTargetDMs, [activeKey]: updatedTargetMsgs };

        // Also add incoming message notification
        const notif: UserAppNotification = {
          id: 'dm_notif_' + Date.now(),
          type: 'message',
          title: `Bericht van ${currentUser.username}`,
          body: message.text.slice(0, 70),
          fromUser: { username: currentUser.username, avatar: currentUser.avatar },
          timestamp: Date.now(),
          timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          actionData: { friendId: myFriendIdKey },
        };

        const nextNotifs = [notif, ...(targetData.notifications || [])].slice(0, 50);

        await setDoc(
          targetRef,
          { dmHistory: nextDmHistory, notifications: nextNotifs },
          { merge: true }
        );
      }
    } catch (err) {
      console.warn('Failed to deliver DM to remote user:', err);
    }
  }

  // Also save in shared directMessages collection for full persistence
  try {
    const pairId = [currentUser.email.toLowerCase(), (targetEmail || targetFriend.name).toLowerCase()]
      .sort()
      .join('___')
      .replace(/[^a-z0-9_]/g, '_');
    const dmRef = doc(db, 'directMessages', pairId);
    const dmSnap = await getDoc(dmRef);
    const existing = dmSnap.exists() ? (dmSnap.data().messages || []) : [];
    await setDoc(dmRef, { messages: [...existing, message], lastUpdated: Date.now() }, { merge: true });
  } catch (err) {
    console.warn('Shared DM collection save warning:', err);
  }
};

/**
 * Send real-time calling signal to a friend via Firestore
 */
export const sendLiveCallSignal = async (
  currentUser: User,
  targetFriend: Friend,
  callType: 'voice' | 'video'
): Promise<void> => {
  if (!currentUser || !targetFriend) return;
  const targetEmail = targetFriend.email;

  if (targetEmail) {
    try {
      const targetDocId = getDocIdFromEmail(targetEmail);
      const targetRef = doc(db, 'users', targetDocId);
      const targetSnap = await getDoc(targetRef);

      if (targetSnap.exists()) {
        const targetData = targetSnap.data() as User;
        const myFriendIdKey = 'f_' + getDocIdFromEmail(currentUser.email);

        const callNotif: UserAppNotification = {
          id: 'call_' + Date.now(),
          type: 'call',
          title: `Inkomende ${callType === 'video' ? 'Video' : 'Spraak'}oproep!`,
          body: `${currentUser.username} belt jou live... Neem op om te praten!`,
          fromUser: { username: currentUser.username, avatar: currentUser.avatar },
          timestamp: Date.now(),
          timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          actionData: {
            friendId: myFriendIdKey,
            callType,
          },
        };

        const updatedNotifs = [callNotif, ...(targetData.notifications || [])].slice(0, 50);
        await setDoc(targetRef, { notifications: updatedNotifs }, { merge: true });
      }
    } catch (err) {
      console.warn('Call signal delivery warning:', err);
    }
  }
};

/**
 * Real-time listener for user document changes (new messages, call notifications, friend requests)
 */
export const subscribeToUserAccount = (
  email: string,
  onUpdate: (user: User) => void
): (() => void) => {
  if (!email) return () => {};
  const docId = getDocIdFromEmail(email);

  try {
    const userRef = doc(db, 'users', docId);
    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const updatedUser = docSnap.data() as User;
          onUpdate(updatedUser);
        }
      },
      (error) => {
        console.warn('User subscription offline or error:', error.message);
      }
    );
    return unsubscribe;
  } catch {
    return () => {};
  }
};

/**
 * Send real-time notification to another user's account
 */
export const sendRealtimeNotification = async (
  targetEmail: string,
  notification: UserAppNotification
): Promise<void> => {
  if (!targetEmail) return;
  const docId = getDocIdFromEmail(targetEmail);

  try {
    const userRef = doc(db, 'users', docId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const existingUser = snap.data() as User;
      const currentNotifs = existingUser.notifications || [];
      const updatedNotifs = [notification, ...currentNotifs.slice(0, 49)]; // Keep latest 50
      await setDoc(userRef, { notifications: updatedNotifs }, { merge: true });
    }
  } catch (err) {
    console.warn('Failed to send notification via Firestore:', err);
  }
};

/**
 * Find user by email or username (checks Firestore and localStorage)
 */
export const fetchUserByIdentifier = async (identifier: string): Promise<User | null> => {
  return findUserInFirestore(identifier);
};

/**
 * Update user password in Firestore & local storage
 */
export const updateUserPassword = async (email: string, newPass: string): Promise<boolean> => {
  if (!email || !newPass) return false;
  try {
    const existing = await fetchUserAccount(email);
    if (!existing) return false;

    const updatedUser: User = {
      ...existing,
      password: newPass,
      notifications: [
        {
          id: 'pw_reset_' + Date.now(),
          type: 'system',
          title: 'Wachtwoord Gewijzigd',
          body: 'Je GamerHub wachtwoord is zojuist succesvol gewijzigd.',
          timestamp: Date.now(),
          timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
        },
        ...(existing.notifications || []),
      ],
    };

    await persistUserAccount(updatedUser);
    return true;
  } catch (err) {
    console.error('Fout bij bijwerken wachtwoord:', err);
    return false;
  }
};

/* =========================================================================
   COMMUNITY SERVERS & CUSTOM INVITE LINKS
   ========================================================================= */

/**
 * Save or update a community server in Cloud Firestore
 */
export const saveCommunityServer = async (server: Server): Promise<void> => {
  if (!server || !server.id) return;
  try {
    const serverRef = doc(db, 'communityServers', server.id);
    await setDoc(serverRef, server, { merge: true });
  } catch (err) {
    console.warn('Firestore saveCommunityServer warning:', err);
  }
};

/**
 * Find a community server by its custom invite code or server ID
 */
export const fetchCommunityServerByInvite = async (code: string): Promise<Server | null> => {
  if (!code) return null;
  const cleanCode = code.trim().toLowerCase();

  // 1. Direct lookup by ID
  try {
    const directRef = doc(db, 'communityServers', code);
    const snap = await getDoc(directRef);
    if (snap.exists()) {
      return snap.data() as Server;
    }
  } catch {
    // continue to query
  }

  // 2. Query by custom inviteCode
  try {
    const colRef = collection(db, 'communityServers');
    const q = query(colRef, where('inviteCode', '==', cleanCode));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as Server;
    }

    // Try case-insensitive scan of servers
    const allSnap = await getDocs(colRef);
    for (const d of allSnap.docs) {
      const s = d.data() as Server;
      if (
        (s.inviteCode || '').toLowerCase() === cleanCode ||
        s.id.toLowerCase() === cleanCode ||
        s.name.toLowerCase().replace(/\s+/g, '-') === cleanCode
      ) {
        return s;
      }
    }
  } catch (err) {
    console.warn('Error fetching server by invite:', err);
  }

  return null;
};

/**
 * Join an existing community server via invite code or link
 */
export const joinCommunityServer = async (
  currentUser: User,
  inviteCodeOrId: string
): Promise<{ success: boolean; server?: Server; message: string }> => {
  const server = await fetchCommunityServerByInvite(inviteCodeOrId);
  if (!server) {
    return {
      success: false,
      message: 'Geen server gevonden met deze uitnodigingscode of link.',
    };
  }

  const currentMembers = server.members || [];
  const alreadyMember = currentMembers.includes(currentUser.username);
  const updatedMembers = alreadyMember ? currentMembers : [...currentMembers, currentUser.username];

  const updatedServer: Server = {
    ...server,
    members: updatedMembers,
  };

  // Save member update to Firestore
  await saveCommunityServer(updatedServer);

  return {
    success: true,
    server: updatedServer,
    message: `Je bent succesvol lid geworden van '${server.name}'!`,
  };
};

/**
 * Send a message to a shared community server channel in Firestore
 */
export const sendServerMessageShared = async (
  serverId: string,
  channelId: string,
  message: ChannelMessage
): Promise<void> => {
  try {
    const serverRef = doc(db, 'communityServers', serverId);
    const snap = await getDoc(serverRef);
    if (snap.exists()) {
      const srv = snap.data() as Server;
      const channelMsgs = srv.messages?.[channelId] || [];
      const updatedMessages = {
        ...(srv.messages || {}),
        [channelId]: [...channelMsgs, message],
      };
      await setDoc(serverRef, { messages: updatedMessages }, { merge: true });
    }
  } catch (err) {
    console.warn('Failed to sync server message to Firestore:', err);
  }
};

/**
 * Real-time listener for a community server in Firestore
 */
export const subscribeToCommunityServer = (
  serverId: string,
  onUpdate: (server: Server) => void
): (() => void) => {
  if (!serverId) return () => {};
  try {
    const serverRef = doc(db, 'communityServers', serverId);
    return onSnapshot(serverRef, (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as Server);
      }
    });
  } catch {
    return () => {};
  }
};
