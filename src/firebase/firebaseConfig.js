import { initializeApp } from "firebase/app";

const required = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);

export const isFirebaseConfigured = missing.length === 0;

if (!isFirebaseConfigured) {
  // provide a clear runtime warning for developers and avoid initializing Firebase
  // when environment variables are missing (this prevents confusing Firebase errors
  // in production builds when env is not set).
  // Example missing list will be visible in the browser console during development.
  // Do NOT include secrets in client logs in production.
  // The app export will be `null` when not configured.
  // To fix: set the VITE_FIREBASE_* environment variables in your hosting provider.
  // For local development create a .env.local file with these values or set them in your environment.
  console.error("Firebase configuration not found. Missing:", missing);
}

let app = null;

if (isFirebaseConfigured) {
  const firebaseConfig = {
    apiKey: required.apiKey,
    authDomain: required.authDomain,
    projectId: required.projectId,
    storageBucket: required.storageBucket,
    messagingSenderId: required.messagingSenderId,
    appId: required.appId
  };

  app = initializeApp(firebaseConfig);
}

export default app;
