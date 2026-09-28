import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { syncUserProfileOnSignIn, getUserProfile } from '../firebase/userProfile';
import { AppUserProfile, UserRole, RolePermissions, ROLE_PERMISSIONS } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  userProfile: AppUserProfile | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  // Role checks
  isOwner: boolean;
  isStaff: boolean;
  isCustomer: boolean;
  isAdmin: boolean;
  permissions: RolePermissions;
  // Tenant context
  businessId: string;
  // Dev demo testing switcher (simulates changing role in preview for evaluation)
  devSimulateRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setError(null);
      if (user) {
        setCurrentUser(user);
        try {
          const profile = await syncUserProfileOnSignIn(
            user.uid,
            user.email,
            user.displayName,
            user.photoURL,
            user.phoneNumber
          );
          setUserProfile(profile);
        } catch (err: unknown) {
          console.error('Failed to sync user profile:', err);
          setError(err instanceof Error ? err.message : 'Error syncing profile');
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const profile = await syncUserProfileOnSignIn(
          result.user.uid,
          result.user.email,
          result.user.displayName,
          result.user.photoURL,
          result.user.phoneNumber
        );
        setUserProfile(profile);
      }
    } catch (err: unknown) {
      console.error('Google Sign-in failed:', err);
      setError(err instanceof Error ? err.message : 'Google Sign-in failed');
      throw err;
    }
  };

  const logOut = async () => {
    setError(null);
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err: unknown) {
      console.error('Sign-out failed:', err);
      setError(err instanceof Error ? err.message : 'Sign out failed');
      throw err;
    }
  };

  // Safe developer inspection switch for preview evaluation
  const devSimulateRole = (role: UserRole) => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        role,
      });
    } else if (currentUser) {
      setUserProfile({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        role,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        businessId: 'paw-and-polish-pune',
      });
    }
  };

  const userRole: UserRole = userProfile?.role || 'customer';
  const isOwner = userRole === 'owner';
  const isStaff = userRole === 'staff';
  const isCustomer = userRole === 'customer';
  const isAdmin = userRole === 'admin';

  const permissions = useMemo(() => {
    return ROLE_PERMISSIONS[userRole];
  }, [userRole]);

  const businessId = userProfile?.businessId || 'paw-and-polish-pune';

  const value = useMemo(
    () => ({
      currentUser,
      userProfile,
      loading,
      error,
      signInWithGoogle,
      logOut,
      isOwner,
      isStaff,
      isCustomer,
      isAdmin,
      permissions,
      businessId,
      devSimulateRole,
    }),
    [
      currentUser,
      userProfile,
      loading,
      error,
      isOwner,
      isStaff,
      isCustomer,
      isAdmin,
      permissions,
      businessId,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
