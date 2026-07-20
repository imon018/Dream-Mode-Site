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



/* ===========================================
   USER REALTIME NOTIFICATIONS
=========================================== */

export function listenUserNotifications(userId, callback) {
  const q = query(
    collection(db, "notifications"),
    where("receiverId", "in", [userId, "ALL_USERS"]),
    where("isDeleted", "==", false),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      callback(notifications);
    },
    (error) => {
      console.error("User Notification Listener:", error);
      callback([]);
    }
  );
}

/* ===========================================
   ADMIN REALTIME NOTIFICATIONS
=========================================== */

export function listenAdminNotifications(callback) {
  const q = query(
    collection(db, "notifications"),
    where("receiverId", "==", "ADMIN"),
    where("isDeleted", "==", false),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      callback(notifications);
    },
    (error) => {
      console.error("Admin Notification Listener:", error);
      callback([]);
    }
  );
}

/* ===========================================
   GET USER NOTIFICATIONS
=========================================== */

export async function getUserNotifications(userId) {
  try {
    const q = query(
      collection(db, "notifications"),
      where("receiverId", "==", userId),
      where("isDeleted", "==", false),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* ===========================================
   GET ADMIN NOTIFICATIONS
=========================================== */

export async function getAdminNotifications() {
  try {
    const q = query(
      collection(db, "notifications"),
      where("receiverId", "==", "ADMIN"),
      where("isDeleted", "==", false),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* ===========================================
   MARK ONE READ
=========================================== */

export async function markNotificationRead(id) {
  try {
    await updateDoc(doc(db, "notifications", id), {
      isRead: true,
    });
  } catch (error) {
    console.error(error);
  }
}

/* ===========================================
   MARK ALL READ
=========================================== */

export async function markAllNotificationsRead(
  notifications
) {
  try {
    await Promise.all(
      notifications
        .filter((item) => !item.isRead)
        .map((item) =>
          updateDoc(doc(db, "notifications", item.id), {
            isRead: true,
          })
        )
    );
  } catch (error) {
    console.error(error);
  }
}

/* ===========================================
   SOFT DELETE
=========================================== */

export async function deleteNotification(id) {
  try {
    await updateDoc(doc(db, "notifications", id), {
      isDeleted: true,
    });
  } catch (error) {
    console.error(error);
  }
}

/* ===========================================
   SOFT DELETE ALL
=========================================== */

export async function deleteAllNotifications(
  notifications
) {
  try {
    await Promise.all(
      notifications.map((item) =>
        updateDoc(doc(db, "notifications", item.id), {
          isDeleted: true,
        })
      )
    );
  } catch (error) {
    console.error(error);
  }
}

/* ===========================================
   EVENT HELPERS
=========================================== */

// =========================
// USER REGISTER
// =========================

export async function notifyUserRegistered(user) {
  // Admin
  await notifyAdmin({
    title: "New User Registered",
    message: `${user.displayName} has created a new account.`,
    type: NotificationTypes.REGISTER,
    priority: NotificationPriority.MEDIUM,
    senderId: user.uid,
    senderName: user.displayName,
    senderRole: "user",
    actionUrl: "/admin/users",
  });

  // User
  await notifyUser(user.uid, {
    title: "Welcome 🎉",
    message: "Your account has been created successfully.",
    type: NotificationTypes.REGISTER,
    priority: NotificationPriority.LOW,
    actionUrl: "/profile",
  });
}

// =========================
// USER LOGIN
// =========================

export async function notifyUserLogin(user) {
  await notifyUser(user.uid, {
    title: "Login Successful",
    message: "You have logged in successfully.",
    type: NotificationTypes.LOGIN,
    priority: NotificationPriority.LOW,
  });
}

// =========================
// ADMIN LOGIN
// =========================

export async function notifyAdminLogin(admin) {
  await notifyAdmin({
    title: "Admin Login",
    message: `${admin.displayName} logged into the dashboard.`,
    type: NotificationTypes.ADMIN,
    priority: NotificationPriority.MEDIUM,
    senderId: admin.uid,
    senderName: admin.displayName,
    senderRole: "admin",
  });
}

// =========================
// PROFILE UPDATED
// =========================

export async function notifyProfileUpdated(user) {
  await notifyUser(user.uid, {
    title: "Profile Updated",
    message: "Your profile information has been updated.",
    type: NotificationTypes.PROFILE,
    priority: NotificationPriority.LOW,
    actionUrl: "/profile",
  });

  if (user.role === "admin") {
    await notifyAdmin({
      title: "Admin Profile Updated",
      message: `${user.displayName} updated the admin profile.`,
      type: NotificationTypes.ADMIN,
      priority: NotificationPriority.MEDIUM,
      senderId: user.uid,
      senderName: user.displayName,
    });
  }
}

// =========================
// ORDER PLACED
// =========================

export async function notifyOrderPlaced(order) {
  await notifyAdmin({
    title: "New Order",
    message: `${order.customerName} placed a new order.`,
    type: NotificationTypes.ORDER,
    priority: NotificationPriority.HIGH,
    senderId: order.userId,
    senderName: order.customerName,
    actionUrl: `/admin/orders/${order.id}`,
  });

  await notifyUser(order.userId, {
    title: "Order Placed",
    message: "Your order has been placed successfully.",
    type: NotificationTypes.ORDER,
    priority: NotificationPriority.LOW,
    actionUrl: `/orders/${order.id}`,
  });
}

// =========================
// ORDER STATUS
// =========================

export async function notifyOrderStatusChanged(order) {
  await notifyUser(order.userId, {
    title: "Order Updated",
    message: `Your order is now ${order.status}.`,
    type: NotificationTypes.ORDER_STATUS,
    priority: NotificationPriority.HIGH,
    actionUrl: `/orders/${order.id}`,
  });

  await notifyAdmin({
    title: "Order Status Changed",
    message: `${order.customerName}'s order changed to ${order.status}.`,
    type: NotificationTypes.ORDER_STATUS,
    priority: NotificationPriority.MEDIUM,
    actionUrl: `/admin/orders/${order.id}`,
  });
}

// =========================
// CANCEL
// =========================

export async function notifyOrderCancelled(order) {
  await notifyAdmin({
    title: "Order Cancel Request",
    message: `${order.customerName} requested order cancellation.`,
    type: NotificationTypes.CANCEL,
    priority: NotificationPriority.HIGH,
    actionUrl: `/admin/orders/${order.id}`,
  });

  await notifyUser(order.userId, {
    title: "Order Cancelled",
    message: "Your cancellation request has been submitted.",
    type: NotificationTypes.CANCEL,
    priority: NotificationPriority.MEDIUM,
    actionUrl: `/orders/${order.id}`,
  });
}

// =========================
// RETURN
// =========================

export async function notifyReturnRequest(order) {
  await notifyAdmin({
    title: "Return Request",
    message: `${order.customerName} requested a return.`,
    type: NotificationTypes.RETURN,
    priority: NotificationPriority.HIGH,
    actionUrl: `/admin/orders/${order.id}`,
  });

  await notifyUser(order.userId, {
    title: "Return Request Sent",
    message: "Your return request has been submitted.",
    type: NotificationTypes.RETURN,
    priority: NotificationPriority.MEDIUM,
    actionUrl: `/orders/${order.id}`,
  });
}

// =========================
// REVIEW
// =========================

export async function notifyReviewSubmitted(review) {
  await notifyAdmin({
    title: "New Review",
    message: `${review.userName} submitted a review.`,
    type: NotificationTypes.REVIEW,
    priority: NotificationPriority.MEDIUM,
    actionUrl: `/admin/reviews`,
  });

  await notifyUser(review.userId, {
    title: "Review Submitted",
    message: "Thank you for your feedback.",
    type: NotificationTypes.REVIEW,
    priority: NotificationPriority.LOW,
  });
}

// =========================
// SUBSCRIBER
// =========================

export async function notifySubscriber(email) {
  await notifyAdmin({
    title: "New Subscriber",
    message: `${email} subscribed to the newsletter.`,
    type: NotificationTypes.SUBSCRIBER,
    priority: NotificationPriority.MEDIUM,
    actionUrl: "/admin/subscribers",
  });
}

// =========================
// SETTINGS
// =========================

export async function notifySettingsUpdated(adminName) {
  await notifyAllUsers({
    title: "Settings Updated",
    message: "Website settings have been updated.",
    type: NotificationTypes.SETTINGS,
    priority: NotificationPriority.LOW,
  });

  await notifyAdmin({
    title: "Settings Updated",
    message: `${adminName} updated website settings.`,
    type: NotificationTypes.SETTINGS,
    priority: NotificationPriority.MEDIUM,
  });
}

// =========================
// PRODUCT
// =========================

export async function notifyProductAdded(product) {
  await notifyAdmin({
    title: "Product Added",
    message: `${product.name} has been added.`,
    type: NotificationTypes.PRODUCT,
    priority: NotificationPriority.LOW,
  });
}

export async function notifyProductDeleted(product) {
  await notifyAdmin({
    title: "Product Deleted",
    message: `${product.name} has been deleted.`,
    type: NotificationTypes.PRODUCT,
    priority: NotificationPriority.HIGH,
  });
}

// =========================
// CUSTOM
// =========================

export async function notifyCustom(receiverId, title, message) {
  await notifyUser(receiverId, {
    title,
    message,
    type: NotificationTypes.CUSTOM,
    priority: NotificationPriority.MEDIUM,
  });
}


// =========================
// Compatibility Helpers
// =========================

export async function sendAdminNotification(data) {
  return notifyAdmin(data);
}

export async function sendNotification(data) {
  const { receiverId, ...notification } = data;
  return notifyUser(receiverId, notification);
}

export async function sendNotificationToAllUsers(data) {
  return notifyAllUsers(data);
}
