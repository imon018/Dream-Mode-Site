import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

const bannerRef = doc(
  db,
  "shopHero",
  "banner"
);

export const getShopHeroBanner =
  async () => {
    const snapshot =
      await getDoc(bannerRef);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data();
  };

export const saveShopHeroBanner =
  async (data) => {
    await setDoc(
      bannerRef,
      data
    );
  };
