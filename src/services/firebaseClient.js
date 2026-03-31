import { initializeApp, getApps } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

let authEmulatorConnected = false;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

export const getFirebaseApp = () => {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    throw new Error(
      "Firebase client is not configured. Set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID."
    );
  }

  return initializeApp(firebaseConfig);
};

export const getFirebaseAuth = () => {
  const app = getFirebaseApp();
  const auth = getAuth(app);

  const useEmulator =
    String(import.meta.env.VITE_USE_FIREBASE_AUTH_EMULATOR || "").toLowerCase() ===
    "true";
  const emulatorUrl =
    import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL || "http://localhost:9099";

  if (useEmulator && !authEmulatorConnected) {
    connectAuthEmulator(auth, emulatorUrl, { disableWarnings: true });
    authEmulatorConnected = true;
  }

  return auth;
};
