import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { AppUserProfile, UserRole } from '../types/auth';

const USERS_COLLECTION = 'users';

/**
 * Initial Demo Roles for Paw & Polish studio in Kalyani Nagar, Pune:
 * Owner: Ananya
 * Staff: Maya, Riya
 *
 * In development, we use this whitelist table to seed verified roles on first login.
 * In production, privileged role assignment is performed strictly through the Trusted Backend
 * (Firebase Cloud Functions / Admin SDK with custom claims or protected admin endpoints).
 */
export const INITIAL_DEMO_STAFF_WHITELIST: Record<string, { role: UserRole; name: string; businessId: string }> = {
  // Matched by email prefixes or display names
  ananya: { role: 'owner', name: 'Ananya', businessId: 'paw-and-polish-pune' },
  maya: { role: 'staff', name: 'Maya', businessId: 'paw-and-polish-pune' },
  riya: { role: 'staff', name: 'Riya', businessId: 'paw-and-polish-pune' },
};

/**
 * Resolves safe initial role without allowing arbitrary client elevation.
 * Standard sign-ins default to 'customer'.
 */
export const resolveInitialRoleForDemo = (
  email: string | null,
  displayName: string | null
): { role: UserRole; businessId: string } => {
  const normEmail = (email || '').toLowerCase().trim();
  const normName = (displayName || '').toLowerCase().trim();

  // Check demo owner: Ananya
  if (normEmail.includes('ananya') || normName.includes('ananya')) {
    return { role: 'owner', businessId: 'paw-and-polish-pune' };
  }

  // Check demo staff: Maya
  if (normEmail.includes('maya') || normName.includes('maya')) {
    return { role: 'staff', businessId: 'paw-and-polish-pune' };
  }

  // Check demo staff: Riya
  if (normEmail.includes('riya') || normName.includes('riya')) {
    return { role: 'staff', businessId: 'paw-and-polish-pune' };
  }

  // All other users default securely to 'customer'
  return { role: 'customer', businessId: 'paw-and-polish-pune' };
};

export const getUserProfile = async (uid: string): Promise<AppUserProfile | null> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const snapshot = await getDoc(userDocRef);
    if (snapshot.exists()) {
      return snapshot.data() as AppUserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile from Firestore:', error);
    return null;
  }
};

/**
 * Syncs user profile upon authenticated Firebase sign-in.
 * Guaranteed to use Firebase Auth UID as the document key.
 */
export const syncUserProfileOnSignIn = async (
  uid: string,
  email: string | null,
  displayName: string | null,
  photoURL: string | null,
  phoneNumber: string | null = null
): Promise<AppUserProfile> => {
  const userDocRef = doc(db, USERS_COLLECTION, uid);
  const now = new Date().toISOString();

  try {
    const snapshot = await getDoc(userDocRef);
    if (!snapshot.exists()) {
      // Resolve initial role based on demo whitelist logic (Ananya -> owner, Maya/Riya -> staff, else -> customer)
      const assignment = resolveInitialRoleForDemo(email, displayName);

      const newProfile: AppUserProfile = {
        uid,
        email,
        displayName,
        photoURL,
        phoneNumber,
        role: assignment.role,
        createdAt: now,
        lastLoginAt: now,
        businessId: assignment.businessId,
      };

      await setDoc(userDocRef, newProfile);
      return newProfile;
    } else {
      // Existing user: update last login and profile info, preserve existing role and businessId
      const existingData = snapshot.data() as AppUserProfile;
      await updateDoc(userDocRef, {
        lastLoginAt: now,
        displayName: displayName || existingData.displayName,
        photoURL: photoURL || existingData.photoURL,
      });

      return {
        ...existingData,
        lastLoginAt: now,
        displayName: displayName || existingData.displayName,
        photoURL: photoURL || existingData.photoURL,
      };
    }
  } catch (error) {
    console.error('Error syncing user profile on sign in:', error);
    const assignment = resolveInitialRoleForDemo(email, displayName);
    return {
      uid,
      email,
      displayName,
      photoURL,
      phoneNumber,
      role: assignment.role,
      createdAt: now,
      lastLoginAt: now,
      businessId: assignment.businessId,
    };
  }
};
