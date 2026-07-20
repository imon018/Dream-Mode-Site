import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  limit,
  serverTimestamp,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

import {
  notifyAdmin,
  NotificationTypes,
  NotificationPriority,
} from "./notificationService";

const subscribersRef = collection(db, "subscribers");



// Subscribe

export async function subscribeEmail(email) {

  email = email.trim().toLowerCase();

  const q = query(
    subscribersRef,
    where("email", "==", email),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    throw new Error("Email already subscribed.");
  }

  await addDoc(subscribersRef, {
    email,
    active: true,
    createdAt: serverTimestamp(),
  });

 await notifyAdmin({
  title: "👥 New Subscriber",
  message: `${email} subscribed to the newsletter.`,
  type: NotificationTypes.SUBSCRIBER,
  priority: NotificationPriority.MEDIUM,
  actionUrl: "/admin/subscribers",
  metadata: {
    email,
  },
});
  

}


// GET ONLY ACTIVE SUBSCRIBER EMAILS

export async function getSubscriberEmails() {

  const subscribers = await getSubscribers();

  return subscribers
    .filter(item => item.active)
    .map(item => item.email);

}



// Admin List

export async function getSubscribers() {

  const q = query(
    subscribersRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

}

// DELETE SUBSCRIBER

export async function deleteSubscriber(id) {

  await deleteDoc(
    doc(db, "subscribers", id)
  );

  await notifyAdmin({
  title: "🗑 Subscriber Removed",
  message: "A subscriber has been removed.",
  type: NotificationTypes.SUBSCRIBER,
  priority: NotificationPriority.LOW,
  actionUrl: "/admin/subscribers",
});

}
