import { db } from "../firebase/firestore";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

const landingCollection = collection(db, "landingPages");

// Create Landing Page
export const createLandingPage = async (data) => {

  const slug =
  data.slug
  .toLowerCase()
  .trim();

  const q=query(

    landingCollection,

    where(
      "slug",
      "==",
      slug
    )

  );

  const exists=
  await getDocs(q);

  if(!exists.empty){

    throw new Error(
      "Landing page slug already exists."
    );

  }

  const landing={

    productId:
    data.productId,

    title:
    data.title,

    slug,

    description:
    data.description,

    heroTitle:
    data.heroTitle||"",

    heroDescription:
    data.heroDescription||"",

    heroImages:
    data.heroImages||[],

    price:
    Number(data.price)||0,

    offerPrice:
    Number(data.offerPrice)||0,

    deliveryCharge:
    Number(data.deliveryCharge)||0,

    cashOnDelivery:
    data.cashOnDelivery,

    orderForm:
    data.orderForm||{},

    facebookPixel:
    data.facebookPixel||"",

    googleAnalytics:
    data.googleAnalytics||"",

    successMessage:
    data.successMessage||"",

    status:
    data.status||
    "published",

    views:0,

    orders:0,

    revenue:0,

    createdAt:
    serverTimestamp(),

    updatedAt:
    serverTimestamp(),

  };

  const docRef=
  await addDoc(

    landingCollection,

    landing

  );

  return docRef.id;

};

// Get All Landing Pages
export const getLandingPages = async () => {
  const snapshot = await getDocs(landingCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Get By ID
export const getLandingPageById = async (id) => {
  const ref = doc(db, "landingPages", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return {
    id: snap.id,
    ...snap.data(),
  };
};

// Get By Slug
export const getLandingPageBySlug = async (slug) => {
  const q = query(
    landingCollection,
    where("slug", "==", slug),
    where("status", "==", "published")
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
};

// Update Landing Page
export const updateLandingPage = async (id, data) => {
  const ref = doc(db, "landingPages", id);

  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};


// =========================
// Increment Landing View
// =========================
export const incrementLandingView = async (id) => {
  const ref = doc(db, "landingPages", id);

  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  await updateDoc(ref, {
    views: (data.views || 0) + 1,
    updatedAt: serverTimestamp(),
  });
};



// =========================
// Increment Landing Orders
// =========================
export const incrementLandingOrders = async (
  id,
  amount = 0
) => {
  const ref = doc(db, "landingPages", id);

  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  await updateDoc(ref, {
    orders: (data.orders || 0) + 1,
    revenue: (data.revenue || 0) + Number(amount),
    updatedAt: serverTimestamp(),
  });
};


// =========================
// Get Published Landing Pages
// =========================
export const getPublishedLandingPages = async () => {
  const q = query(
    landingCollection,
    where("status", "==", "published")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};



// =========================
// Duplicate Landing Page
// =========================
export const duplicateLandingPage = async (id) => {
  const landing = await getLandingPageById(id);

  if (!landing) return null;

  delete landing.id;

  landing.slug =
    landing.slug +
    "-" +
    Date.now();

  landing.title =
  `${landing.title} Copy`;

  landing.status = "draft";

  landing.heroImages =
  landing.heroImages || [];

  landing.createdAt = serverTimestamp();
  landing.updatedAt = serverTimestamp();

  const docRef = await addDoc(
    landingCollection,
    landing
  );

  return docRef.id;
};



// Delete Landing Page
export const deleteLandingPage = async (id) => {
  const ref = doc(db, "landingPages", id);

  await deleteDoc(ref);
};

// Publish / Draft
export const toggleLandingPageStatus = async (id, status) => {
  const ref = doc(db, "landingPages", id);

  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp(),
  });
};
