import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

const categoryRef = collection(db, "categories");

/* =========================
   GET ALL
========================= */

export async function getCategories() {
  const q = query(categoryRef, orderBy("name"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* =========================
   ADD
========================= */

export async function addCategory(category) {
  return addDoc(categoryRef, {
    ...category,
    createdAt: serverTimestamp(),
  });
}

/* =========================
   UPDATE
========================= */

export async function updateCategory(id, data) {
  const ref = doc(db, "categories", id);

  return updateDoc(ref, data);
}

/* =========================
   DELETE
========================= */

export async function deleteCategory(id) {
  const ref = doc(db, "categories", id);

  return deleteDoc(ref);
}
