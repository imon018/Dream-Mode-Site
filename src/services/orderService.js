import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db } from "../firebase/firestore";

const orderRef = collection(db, "orders");

export const createOrder = async (order) => {
  await addDoc(orderRef, order);
};

export const getUserOrders = async (email) => {
  const q = query(orderRef, where("email", "==", email));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};
