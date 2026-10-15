import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { User, UserAppNotification } from '../types';

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
      const data = snap.data() as User;
      return data;
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
