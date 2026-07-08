import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth } from "../firebase/auth";
import { db } from "../firebase/firestore";

export const login = (email, password) =>
  signInWithEmailAndPassword(
    auth,
    email,
    password
  );

export const register = async (
  email,
  password
) => {
  try {
    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    await sendEmailVerification(
      result.user
    );

    const userRef = doc(
      db,
      "users",
      result.user.uid
    );

    await setDoc(userRef, {
      email: result.user.email,
      role: "user",
      createdAt: serverTimestamp(),
    });

    return result;
  } catch (error) {
    console.error(
      "REGISTER/FIRESTORE ERROR:",
      error
    );

    throw error;
  }
};

export const resendVerificationEmail =
  async (user) => {
    await sendEmailVerification(user);
  };

export const logout = () =>
  signOut(auth);
