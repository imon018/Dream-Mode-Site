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
  try {

    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("AUTH CREATED:", result.user.uid);

    const userRef = doc(db, "users", result.user.uid);

    console.log("WRITING TO FIRESTORE...");
    
    try {
  await setDoc(userRef, {
    email: result.user.email,
    role: "user",
    createdAt: serverTimestamp(),
  });

  console.log("FIRESTORE CREATED");

} catch (e) {
  console.error("SETDOC ERROR:", e.code, e.message);
  throw e;
}

    await setDoc(userRef, {
      email: result.user.email,
      role: "user",
      createdAt: serverTimestamp(),
    });

    console.log("FIRESTORE CREATED");
    console.log("UID:", result.user.uid);

    return result;

  } catch (error) {

    console.error("REGISTER/FIRESTORE ERROR:", error);

    throw error;
  }
};


export const logout = () => signOut(auth);
