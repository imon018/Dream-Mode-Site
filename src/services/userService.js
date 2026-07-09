import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const createUserProfile = async (
  uid,
  data
) => {
  const userRef = doc(db, "users", uid);

  await setDoc(userRef, data, {
    merge: true,
  });
};

export const updateUserProfile = async (
  uid,
  data
) => {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, data);
};
