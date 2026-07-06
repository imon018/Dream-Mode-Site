import app, { isFirebaseConfigured } from "./firebaseConfig";
import { getAuth } from "firebase/auth";

export const auth = isFirebaseConfigured ? getAuth(app) : null;
