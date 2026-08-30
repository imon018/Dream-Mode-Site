import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

import {
  notifyAdmin,
  NotificationTypes,
  NotificationPriority,
} from "./notificationService";

const messagesRef = collection(db, "contactMessages");

// Bangladeshi mobile number, either as 01XXXXXXXXX (11 digits) or
// +8801XXXXXXXXX (with the country code) — anything else is rejected.
export const BD_PHONE_REGEX = /^(?:\+8801\d{9}|01\d{9})$/;

// SEND — used by the public Contact Us page

export async function sendContactMessage({ name, phone, subject, message }) {

  name = (name || "").trim();
  phone = (phone || "").trim();
  subject = (subject || "").trim();
  message = (message || "").trim();

  if (!name) {
    throw new Error("Name is required.");
  }

  if (!BD_PHONE_REGEX.test(phone)) {
    throw new Error(
      "Enter a valid phone number as 01XXXXXXXXX or +8801XXXXXXXXX."
    );
  }

  if (!message) {
    throw new Error("Message is required.");
  }

  await addDoc(messagesRef, {
    name,
    phone,
    subject,
    message,
    isRead: false,
    createdAt: serverTimestamp(),
  });

  await notifyAdmin({
    title: "📩 New Contact Message",
    message: `${name} (${phone}) sent a message${subject ? `: ${subject}` : "."}`,
    type: NotificationTypes.CONTACT_MESSAGE,
    priority: NotificationPriority.MEDIUM,
    actionUrl: "/admin/messages",
    metadata: {
      name,
      phone,
    },
  });

}

// Admin List

export async function getContactMessages() {

  const q = query(
    messagesRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

}

// DELETE

export async function deleteContactMessage(id) {

  await deleteDoc(
    doc(db, "contactMessages", id)
  );

}
