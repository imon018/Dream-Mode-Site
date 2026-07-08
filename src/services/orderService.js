import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

const orderRef = collection(db, "orders");

export const createOrder = async (order) => {
  await addDoc(orderRef, order);
};

export const getUserOrders = async (email) => {
  const q = query(
    orderRef,
    where("email", "==", email)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getAllOrders = async () => {
  const snapshot = await getDocs(orderRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const updateOrderStatus = async (
  id,
  status
) => {
  const orderDoc = doc(db, "orders", id);

  await updateDoc(orderDoc, {
    status,
  });
};
