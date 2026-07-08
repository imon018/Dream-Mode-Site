import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
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
