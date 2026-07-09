import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

const bannerRef =
  collection(db, "heroBanners");

export const addBanner = async (
  banner
) => {
  await addDoc(
    bannerRef,
    banner
  );
};

export const getBanners = async () => {
  const snapshot =
    await getDocs(bannerRef);

  return snapshot.docs.map(
    (doc) => ({
      id: doc.id,
      ...doc.data(),
    })
  );
};

export const deleteBanner =
  async (id) => {
    await deleteDoc(
      doc(
        db,
        "heroBanners",
        id
      )
    );
  };
