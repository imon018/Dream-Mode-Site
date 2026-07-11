import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  limit,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

const subscribersRef = collection(db, "subscribers");



// Subscribe

export async function subscribeEmail(email) {

  const q = query(
    subscribersRef,
    where("email", "==", email),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    throw new Error("Email already subscribed.");
  }

  await addDoc(subscribersRef, {
    email,
    active: true,
    createdAt: serverTimestamp(),
  });
}



// Admin List

export async function getSubscribers() {

  const q = query(
    subscribersRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

}
