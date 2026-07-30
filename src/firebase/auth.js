import app from "./firebaseConfig";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

export const auth = getAuth(app);

// =========================
// SOCIAL LOGIN PROVIDER
// =========================

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
