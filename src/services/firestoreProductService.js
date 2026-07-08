import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
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
    ...doc.data(),
  }));
};

export const getLatestProducts = async () => {
  const snapshot = await getDocs(productRef);

  const products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return products
    .sort(
      (a, b) =>
        b.createdAt?.seconds -
        a.createdAt?.seconds
    )
    .slice(0, 8);
};

export const getProductById = async (id) => {
  const productDoc = doc(db, "products", id);

  const snapshot = await getDoc(productDoc);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const updateProductInDB = async (
  id,
  updatedData
) => {
  const productDoc = doc(db, "products", id);

  await updateDoc(productDoc, updatedData);
};

export const deleteProductFromDB = async (id) => {
  await deleteDoc(doc(db, "products", id));
};
