import { db } from "../firebase/firestore";

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  limit,
} from "firebase/firestore";

/* ===========================================
   Notification Types
=========================================== */

export const NotificationTypes = {
  REGISTER: "register",
  LOGIN: "login",
  PROFILE: "profile",
  ORDER: "order",
  ORDER_STATUS: "order_status",
  RETURN: "return",
  CANCEL: "cancel",
  REVIEW: "review",
  PRODUCT: "product",
  BANNER: "banner",
  SETTINGS: "settings",
  SUBSCRIBER: "subscriber",
  ADMIN: "admin",
  SYSTEM: "system",
  CUSTOM: "custom",
};

/* ===========================================
   Priority
=========================================== */

export const NotificationPriority = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

/* ===========================================
   Build Notification Object
=========================================== */

function buildNotification(data) {
  return {
    title: data.title || "Notification",

    message: data.message || "",

    type: data.type || NotificationTypes.SYSTEM,

    priority:
      data.priority || NotificationPriority.LOW,

    receiverId: data.receiverId,

    senderId: data.senderId || null,

    senderName: data.senderName || "",

    senderRole: data.senderRole || "",

    actionUrl: data.actionUrl || "",

    image: data.image || "",

    extra: data.extra || {},

    isRead: false,

    isDeleted: false,

    createdAt: serverTimestamp(),
  };
}

/* ===========================================
   Duplicate Prevention
=========================================== */

async function hasDuplicate(data) {
  const q = query(
    collection(db, "notifications"),
    where("receiverId", "==", data.receiverId),
    where("title", "==", data.title),
    where("message", "==", data.message),
    limit(1)
  );

  const snap = await getDocs(q);

  return !snap.empty;
}

/* ===========================================
   Create Notification
=========================================== */

export async function createNotification(data) {
  try {
    const notification = buildNotification(data);

    const duplicate = await hasDuplicate(notification);

    if (duplicate) return;

    await addDoc(
      collection(db, "notifications"),
      notification
    );
  } catch (error) {
    console.error(
      "Create Notification Error:",
      error
    );
  }
}

/* ===========================================
   Shortcut Helpers
=========================================== */

export async function notifyAdmin(data) {
  return createNotification({
    ...data,
    receiverId: "ADMIN",
  });
}

export async function notifyUser(userId, data) {
  return createNotification({
    ...data,
    receiverId: userId,
  });
}

export async function notifyAllUsers(data) {
  return createNotification({
    ...data,
    receiverId: "ALL_USERS",
  });
}
