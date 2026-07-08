import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "../firebase/firestore";

const productRef = collection(db, "products");

export const addProductToDB = async (product) => {
  await addDoc(productRef, product);
};

export const getProductsFromDB = async () => {
  const snapshot = await getDocs(productRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const deleteProductFromDB = async (id) => {
  await deleteDoc(doc(db, "products", id));
};

export const getLatestProducts = async () => {
  const snapshot = await getDocs(productRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

import { getDoc } from "firebase/firestore";

export const getProductById = async (id) => {
  const productRef = doc(db, "products", id);

  const snapshot = await getDoc(productRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};
