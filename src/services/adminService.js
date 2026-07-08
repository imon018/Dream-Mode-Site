import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

export async function getUsers(search = "") {
  const snap = await getDocs(collection(db, "users"));

  const users = snap.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));

  if (!search) return users;

  return users.filter((user) =>
    user.email?.toLowerCase().includes(search.toLowerCase())
  );
}

export async function changeRole(id, role) {
  await updateDoc(doc(db, "users", id), {
    role,
  });
}

export async function togglePremium(id, premium) {
  await updateDoc(doc(db, "users", id), {
    premium,
  });
}

export async function deleteUser(id) {
  await deleteDoc(doc(db, "users", id));
}
