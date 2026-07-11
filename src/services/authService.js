import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth } from "../firebase/auth";
import { db } from "../firebase/firestore";

export const login = async (
  email,
  password
) => {

  const result =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );


  const userRef = doc(
    db,
    "users",
    result.user.uid
  );


  await setDoc(
    userRef,
    {
      lastLogin: serverTimestamp(),
    },
    {
      merge: true,
    }
  );


  return result;

};

export const register = async (
  name,
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

    await sendEmailVerification(result.user);

    const userRef = doc(
      db,
      "users",
      result.user.uid
    );

    await setDoc(userRef, {
      name,
      email: result.user.email,
      phone: "",
      address: "",
      photoURL: "",
      role: "user",
      createdAt: serverTimestamp(),
    });

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const resendVerificationEmail = async (user) => {
  await sendEmailVerification(user);
};

export const forgotPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const changePassword = async (
  user,
  newPassword
) => {
  await updatePassword(user, newPassword);
};

export const sendVerificationEmail = async (user) => {
  await sendEmailVerification(user);
};


export const deleteUserAccount = async (user) => {
  await deleteUser(user);
};

export const logout = () => signOut(auth);

