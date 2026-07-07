import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import { auth } from "../firebase/auth";
import { db } from "../firebase/firestore";

export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const register = async (email, password) => {

  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await setDoc(doc(db, "users", result.user.uid), {
    email: result.user.email,
    role: "user",
    createdAt: serverTimestamp()
  });

  return result;
};

export const logout = () => signOut(auth);
