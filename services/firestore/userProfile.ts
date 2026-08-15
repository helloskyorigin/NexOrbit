import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  provider: string;
  country: string;
  language: string;
  onboardingCompleted: boolean;
  createdAt: string | Timestamp | any;
  updatedAt: string | Timestamp | any;
  lastLoginAt: string | Timestamp | any;
  timezone?: string;
  workStyle?: string;
}

export enum FirestoreOperation {
  GET = 'get',
  CREATE = 'create',
  UPDATE = 'update',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: FirestoreOperation;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: FirestoreOperation,
  path: string | null
): void {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
}

/**
 * Fetch a user profile document from Firestore (`users/{uid}`)
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return snapshot.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.GET, path);
    return null;
  }
}

/**
 * Create a new user profile document in Firestore (`users/{uid}`)
 */
export async function createUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<UserProfile> {
  const path = `users/${uid}`;
  const now = serverTimestamp();

  const newProfile: UserProfile = {
    uid,
    displayName: data.displayName || '',
    email: data.email || '',
    photoURL: data.photoURL || null,
    provider: data.provider || 'password',
    country: data.country || '',
    language: data.language || 'en',
    onboardingCompleted: data.onboardingCompleted ?? false,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
    timezone: data.timezone,
    workStyle: data.workStyle,
  };

  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, newProfile);
    return newProfile;
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.CREATE, path);
    throw error;
  }
}

/**
 * Update an existing user profile document in Firestore (`users/{uid}`)
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const updateData: Record<string, any> = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    // Ensure sensitive/immutable fields are not overwritten
    delete updateData.uid;
    delete updateData.createdAt;

    await updateDoc(userRef, updateData);
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.UPDATE, path);
    throw error;
  }
}

/**
 * Get or create a user profile document upon login/authentication
 * - If user profile exists: Preserves existing user profile data and updates `lastLoginAt` & `updatedAt`
 * - If user profile does not exist: Creates new user profile with initial defaults
 */
export async function getOrCreateUserProfile(authUser: {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  providerData?: Array<{ providerId?: string | null }>;
}): Promise<UserProfile> {
  const uid = authUser.uid;
  const path = `users/${uid}`;

  try {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      const existingData = snapshot.data() as UserProfile;

      // Update only login metadata, keeping all user custom profile settings intact
      const metadataUpdates: Record<string, any> = {
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Sync latest provider photo/name if missing in profile
      if (!existingData.displayName && authUser.displayName) {
        metadataUpdates.displayName = authUser.displayName;
      }
      if (!existingData.photoURL && authUser.photoURL) {
        metadataUpdates.photoURL = authUser.photoURL;
      }

      await updateDoc(userRef, metadataUpdates);

      return {
        ...existingData,
        ...metadataUpdates,
      };
    } else {
      // First-time login: create new user profile document
      const provider = authUser.providerData?.[0]?.providerId || 'password';
      const initialProfile: UserProfile = {
        uid,
        displayName: authUser.displayName || authUser.email?.split('@')[0] || '',
        email: authUser.email || '',
        photoURL: authUser.photoURL || null,
        provider,
        country: '',
        language: 'en',
        onboardingCompleted: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };

      await setDoc(userRef, initialProfile);
      return initialProfile;
    }
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.WRITE, path);

    // Fallback profile if Firestore is offline/unreachable to prevent blocking auth session
    const provider = authUser.providerData?.[0]?.providerId || 'password';
    return {
      uid,
      displayName: authUser.displayName || authUser.email?.split('@')[0] || 'User',
      email: authUser.email || '',
      photoURL: authUser.photoURL || null,
      provider,
      country: '',
      language: 'en',
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
  }
}
