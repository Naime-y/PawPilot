import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// In AI Studio, firebase-applet-config.json is generated at the project root upon provisioning.
// We support both environment variables and fallback to the auto-generated config file.
let firebaseConfig: Record<string, string> = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
};

let databaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || '';

try {
  // Dynamic or static load of config if env variables are empty
  const localConfig = await import('../../firebase-applet-config.json');
  if (localConfig && localConfig.default) {
    const cfg = localConfig.default;
    firebaseConfig = {
      projectId: firebaseConfig.projectId || cfg.projectId || '',
      appId: firebaseConfig.appId || cfg.appId || '',
      apiKey: firebaseConfig.apiKey || cfg.apiKey || '',
      authDomain: firebaseConfig.authDomain || cfg.authDomain || '',
      storageBucket: firebaseConfig.storageBucket || cfg.storageBucket || '',
      messagingSenderId: firebaseConfig.messagingSenderId || cfg.messagingSenderId || '',
    };
    if (!databaseId && cfg.firestoreDatabaseId) {
      databaseId = cfg.firestoreDatabaseId;
    }
  }
} catch {
  // If json is not available at build or runtime, fallback cleanly to env variables
}

const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth: Auth = getAuth(app);
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with custom databaseId if provisioned, or default
export const db: Firestore = databaseId && databaseId !== '(default)'
  ? getFirestore(app, databaseId)
  : getFirestore(app);

export default app;
