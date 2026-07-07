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

export const register = async (email, password) => {

  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result;
};

export const logout = () => signOut(auth);
