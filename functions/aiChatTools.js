// =================================================
// AI CHAT — TOOL FUNCTIONS
// এই ফাইলে AI যেসব "tool" কল করতে পারবে সেগুলো ডিফাইন করা।
// প্রতিটা ফাংশন আপনার আসল Firestore schema (products, orders)
// অনুযায়ী লেখা — orderService.js-এ createOrder() যেভাবে order
// বানায়, ঠিক সেই একই ফরম্যাটে এখানেও order বানানো হচ্ছে।
//
// নিরাপত্তার জন্য গুরুত্বপূর্ণ নিয়ম:
// - কাস্টমার চ্যাট থেকে কখনোই stock/price/product এডিট করা যাবে না।
// - কাস্টমার শুধু তার নিজের অর্ডার দেখতে পারবে (userId বা phone match)।
// - Admin-only action (stock/price update, order status change) এই
//   ফাইলে রাখা হয়নি ইচ্ছাকৃতভাবে — সেগুলো আলাদা, admin-verified
//   ফাংশনে রাখা উচিত (Phase 2)।
// =================================================

const admin = require("firebase-admin");

// -------------------------------------------------
// DELIVERY CHARGE — সত্যিকারের সোর্স (Checkout.jsx-এর সাথে হুবহু
// মিলিয়ে রাখা হয়েছে)। আগে AI নিজে থেকে দাম "অনুমান" করে বলতো
// (ভুল/এলোমেলো তথ্য দিতো) — এখন থেকে এই একই তালিকা থেকেই সবসময়
// সত্যি সংখ্যা বলা হবে, এবং create_order-ও এই একই হিসাব দিয়ে
// deliveryCharge বসায় — তাই কাস্টমারকে যা বলা হয় আর আসলে যা
// চার্জ হয়, দুটো সবসময় এক থাকবে।
// -------------------------------------------------
const DELIVERY_TIERS = [
  { key: "dhaka_city", label: "ঢাকা সিটির ভেতরে", charge: 80 },
  { key: "dhaka_sub_area", label: "ঢাকার আশেপাশের এলাকা (সাব-এরিয়া)", charge: 120 },
  { key: "outside_dhaka", label: "ঢাকার বাইরে (সারাদেশ)", charge: 150 },
];

// আনুমানিক ডেলিভারি সময় — src/courier/estimatedDelivery.js-এর সাথে
// হুবহু মিলিয়ে রাখা হয়েছে, যাতে ফ্রন্টএন্ড আর AI চ্যাট একই সংখ্যা বলে।
const DELIVERY_ETA = {
  dhaka_city: "১-২ দিন",
  dhaka_sub_area: "২-৩ দিন",
  outside_dhaka: "৩-৫ দিন",
};

function calculateDeliveryCharge(district) {

  const d = (district || "").toString().trim().toLowerCase();

  if (!d) return null; // এলাকা জানা না গেলে অনুমান করা হবে না

  if (d.includes("ঢাকা") || d.includes("dhaka")) {
    return DELIVERY_TIERS[0].charge; // ডিফল্ট: ঢাকা সিটি রেট
  }

  return DELIVERY_TIERS[2].charge; // ঢাকার বাইরে

}

// -------------------------------------------------
// DELIVERY INFO (READ-ONLY)
// কাস্টমার ডেলিভারি চার্জ জিজ্ঞেস করলে AI অবশ্যই এটা কল করবে —
// নিজে থেকে সংখ্যা বানাবে না। district দিলে সেই এলাকার জন্য সঠিক
// চার্জও বলে দেওয়া হয়।
// -------------------------------------------------
async function getDeliveryInfo({ district } = {}) {

  const charge = district ? calculateDeliveryCharge(district) : null;

  return {
    tiers: DELIVERY_TIERS.map((t) => ({ ...t, estimatedDays: DELIVERY_ETA[t.key] })),
    freeDeliveryOver: 3000,
    matchedCharge: charge,
    matchedEstimatedDays: charge
      ? DELIVERY_ETA[
          DELIVERY_TIERS.find((t) => t.charge === charge)?.key || "outside_dhaka"
        ]
      : null,
    note:
      "৳৩০০০ বা তার বেশি অর্ডারে ডেলিভারি ফ্রি। এলাকা অনুযায়ী চার্জ ও " +
      "আনুমানিক সময় উপরের tiers থেকে বলুন, matchedCharge/matchedEstimatedDays " +
      "থাকলে সরাসরি সেটাই বলুন।",
  };

}

// -------------------------------------------------
// PRODUCT SEARCH (READ-ONLY)
// -------------------------------------------------
async function searchProducts({ query, category }) {

  const snap = await admin
    .firestore()
    .collection("products")
    .get();

  // query আর category — দুটোকেই একসাথে "search terms" হিসেবে
  // treat করা হচ্ছে, এবং কোনো একটা শব্দ মিললেই (strict AND এর
  // বদলে OR) প্রোডাক্ট দেখানো হচ্ছে। আগে category-এর জন্য exact
  // match লাগতো, যেটা AI যদি ইংরেজিতে অনুবাদ করে category পাঠায়
  // (যেমন কাস্টমার "জুয়েলারি" লিখলেও AI "Jewelry" tool-এ পাঠায়)
  // তাহলে বাংলা ক্যাটাগরির সাথে কখনোই মিলতো না, ফলে ভুলভাবে
  // "কোনো প্রোডাক্ট নেই" দেখাতো।
  const terms = [query, category]
    .filter(Boolean)
    .join(" ")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const results = [];

  snap.forEach((doc) => {

    const p = doc.data();

    const haystack = [
      p.name,
      p.title,
      p.category,
      p.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matches =
      !terms.length ||
      terms.some((term) => haystack.includes(term));

    if (matches) {

      results.push({
        id: doc.id,
        name: p.name || p.title || "Unnamed",
        category: p.category || "",
        price: p.price ?? 0,
        offerPrice: p.offerPrice || 0,
        stock: p.stock ?? 0,
        inStock: (p.stock ?? 0) > 0,
        image: p.image || (Array.isArray(p.images) ? p.images[0] : "") || "",
      });

    }


  });

  // AI-কে বেশি টোকেন খরচ না করিয়ে সবচেয়ে প্রাসঙ্গিক ১০টা রেজাল্ট।
  // এই একই লিস্ট frontend-এ প্রোডাক্ট কার্ড রেন্ডার করতেও ব্যবহার
  // হবে (aiChat.js orchestrator এটা কালেক্ট করে রাখে), তাই id/image
  // বাদ দেওয়া যাবে না — শুধু চ্যাট টেক্সটে id দেখানো হয় না।
  return results.slice(0, 10);

}

// -------------------------------------------------
// STOCK CHECK (READ-ONLY)
// -------------------------------------------------
async function checkStock({ productId }) {

  if (!productId) {
    return { error: "productId প্রয়োজন।" };
  }

  const snap = await admin
    .firestore()
    .collection("products")
    .doc(productId)
    .get();

  if (!snap.exists) {
    return { error: "এই প্রোডাক্ট খুঁজে পাওয়া যায়নি।" };
  }

  const p = snap.data();

  return {
    id: snap.id,
    name: p.name || p.title || "Unnamed",
    category: p.category || "",
    stock: p.stock ?? 0,
    inStock: (p.stock ?? 0) > 0,
    price: p.price ?? 0,
    offerPrice: p.offerPrice || 0,
    image: p.image || (Array.isArray(p.images) ? p.images[0] : "") || "",
  };

}

// -------------------------------------------------
// RELATED PRODUCTS (READ-ONLY)
// একটা প্রোডাক্টের সাথে মিলিয়ে (একই category) আরও কিছু প্রোডাক্ট
// সাজেস্ট করার জন্য — কাস্টমার একটা প্রোডাক্ট দেখার পর/কিনতে চাইলে
// "এটার সাথে আরও কী ভালো লাগবে" টাইপ প্রশ্নে ব্যবহার হয়। আসল
// Firestore ডেটা থেকেই আসে, কোনো কিছু বানানো হয় না।
// -------------------------------------------------
async function getRelatedProducts({ productId, category } = {}) {

  let targetCategory = (category || "").trim();
  let excludeId = productId || "";

  if (!targetCategory && productId) {

    const pSnap = await admin
      .firestore()
      .collection("products")
      .doc(productId)
      .get();

    if (pSnap.exists) {
      targetCategory = pSnap.data().category || "";
    }

  }

  if (!targetCategory) {
    return { error: "related products খুঁজতে productId বা category লাগবে।" };
  }

  const snap = await admin
    .firestore()
    .collection("products")
    .where("category", "==", targetCategory)
    .limit(15)
    .get();

  const results = [];

  snap.forEach((doc) => {

    if (doc.id === excludeId) return;

    const p = doc.data();

    results.push({
      id: doc.id,
      name: p.name || p.title || "Unnamed",
      category: p.category || "",
      price: p.price ?? 0,
      offerPrice: p.offerPrice || 0,
      stock: p.stock ?? 0,
      inStock: (p.stock ?? 0) > 0,
      image: p.image || (Array.isArray(p.images) ? p.images[0] : "") || "",
    });

  });

  return results.slice(0, 6);

}

// -------------------------------------------------
// WISHLIST দেখা (শুধু লগইন করা কাস্টমারের জন্য)
// কাস্টমার তার wishlist-এ কী আছে জিজ্ঞেস করলে, বা personalized
// সাজেশন দেওয়ার আগে (আগে থেকে মনে রাখা আইটেম) এটা কল হয়।
// -------------------------------------------------
async function getWishlistItems({ uid } = {}) {

  if (!uid) {
    return {
      error: "wishlist দেখতে হলে কাস্টমারকে লগইন করা থাকতে হবে।",
    };
  }

  const snap = await admin
    .firestore()
    .collection("wishlist")
    .where("userId", "==", uid)
    .limit(10)
    .get();

  if (snap.empty) {
    return { items: [] };
  }

  const items = [];

  snap.forEach((doc) => {

    const w = doc.data();
    const p = w.product || {};

    if (!p.id) return;

    items.push({
      id: p.id,
      name: p.name || p.title || "Unnamed",
      category: p.category || "",
      price: p.price ?? 0,
      offerPrice: p.offerPrice || 0,
      stock: p.stock ?? 0,
      inStock: (p.stock ?? 0) > 0,
      image: p.image || (Array.isArray(p.images) ? p.images[0] : "") || "",
    });

  });

  return { items };

}

// -------------------------------------------------
// TRENDING PRODUCTS (READ-ONLY)
// সাম্প্রতিক অর্ডারগুলোর items থেকে গণনা করে কোন প্রোডাক্ট সবচেয়ে
// বেশি বিক্রি হচ্ছে বের করা হয় — কোনো আলাদা "trending" ফিল্ড
// বানানো হয়নি, আসল অর্ডার ডেটা থেকেই হিসাব হচ্ছে।
// -------------------------------------------------
async function getTrendingProducts() {

  const ordersSnap = await admin
    .firestore()
    .collection("orders")
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();

  const countByProduct = {};

  ordersSnap.forEach((doc) => {

    const items = doc.data().items || [];

    for (const item of items) {
      if (!item.productId) continue;
      const qty = Number(item.qty || item.quantity || 1);
      countByProduct[item.productId] = (countByProduct[item.productId] || 0) + qty;
    }

  });

  const topIds = Object.entries(countByProduct)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id]) => id);

  if (!topIds.length) {
    return { items: [], note: "এখনো পর্যাপ্ত অর্ডার ডেটা নেই ট্রেন্ডিং বের করার জন্য।" };
  }

  const items = [];

  for (const id of topIds) {

    const pSnap = await admin.firestore().collection("products").doc(id).get();

    if (!pSnap.exists) continue;

    const p = pSnap.data();

    items.push({
      id: pSnap.id,
      name: p.name || p.title || "Unnamed",
      category: p.category || "",
      price: p.price ?? 0,
      offerPrice: p.offerPrice || 0,
      stock: p.stock ?? 0,
      inStock: (p.stock ?? 0) > 0,
      image: p.image || (Array.isArray(p.images) ? p.images[0] : "") || "",
    });

  }

  return { items };

}

// -------------------------------------------------
// NEW ARRIVALS (READ-ONLY) — Proactive AI-এর জন্য
// -------------------------------------------------
async function getNewArrivals() {

  const snap = await admin
    .firestore()
    .collection("products")
    .orderBy("createdAt", "desc")
    .limit(6)
    .get();

  const items = [];

  snap.forEach((doc) => {

    const p = doc.data();

    items.push({
      id: doc.id,
      name: p.name || p.title || "Unnamed",
      category: p.category || "",
      price: p.price ?? 0,
      offerPrice: p.offerPrice || 0,
      stock: p.stock ?? 0,
      inStock: (p.stock ?? 0) > 0,
      image: p.image || (Array.isArray(p.images) ? p.images[0] : "") || "",
    });

  });

  return { items };

}

// -------------------------------------------------
// WISHLIST-এ যোগ করা (শুধু লগইন করা কাস্টমারের জন্য)
// কাস্টমার চ্যাটেই "এটা wishlist-এ রাখো" বললে ব্যবহার হয়। ফ্রন্টএন্ডের
// wishlistService.js-এর ঠিক একই schema (userId, productId, product,
// createdAt) মিলিয়ে লেখা হয়েছে যাতে দুই জায়গা থেকেই সেভ করা
// আইটেম একইভাবে দেখা যায়।
// -------------------------------------------------
async function addToWishlist({ productId, uid } = {}) {

  if (!uid) {
    return { error: "wishlist-এ যোগ করতে হলে কাস্টমারকে লগইন করা থাকতে হবে।" };
  }

  if (!productId) {
    return { error: "productId প্রয়োজন।" };
  }

  const db = admin.firestore();

  const pSnap = await db.collection("products").doc(productId).get();

  if (!pSnap.exists) {
    return { error: "এই প্রোডাক্ট খুঁজে পাওয়া যায়নি।" };
  }

  const existing = await db
    .collection("wishlist")
    .where("userId", "==", uid)
    .where("productId", "==", productId)
    .limit(1)
    .get();

  if (!existing.empty) {
    return { alreadyExists: true, message: "এই প্রোডাক্ট আগে থেকেই wishlist-এ আছে।" };
  }

  const p = pSnap.data();

  await db.collection("wishlist").add({
    userId: uid,
    productId,
    product: { id: pSnap.id, ...p },
    createdAt: new Date(),
  });

  return { added: true, productName: p.name || p.title || "প্রোডাক্ট" };

}

// -------------------------------------------------
// শপিং মেমরি — প্রিয় রঙ/ক্যাটাগরি/বাজেট মনে রাখা (শুধু লগইন করা
// কাস্টমারের জন্য, users/{uid}.chatPreferences ফিল্ডে সেভ হয়)
// -------------------------------------------------
async function saveShoppingPreference({ color, category, budget, uid } = {}) {

  if (!uid) {
    return { error: "পছন্দ মনে রাখতে হলে কাস্টমারকে লগইন করা থাকতে হবে।" };
  }

  const update = { updatedAt: new Date() };

  if (color) update.color = color;
  if (category) update.category = category;
  if (budget) update.budget = budget;

  await admin
    .firestore()
    .collection("users")
    .doc(uid)
    .set({ chatPreferences: update }, { merge: true });

  return { saved: true };

}

async function getShoppingPreference({ uid } = {}) {

  if (!uid) {
    return { error: "লগইন করা না থাকলে আগের পছন্দ দেখা যাবে না।" };
  }

  const snap = await admin.firestore().collection("users").doc(uid).get();

  const prefs = snap.exists ? snap.data().chatPreferences : null;

  if (!prefs) {
    return { found: false };
  }

  return {
    found: true,
    color: prefs.color || "",
    category: prefs.category || "",
    budget: prefs.budget || "",
  };

}

// -------------------------------------------------
// ORDER CANCEL REQUEST
// নিরাপত্তার জন্য AI সরাসরি অর্ডার Cancelled করে না — শুধু
// cancelRequested ফ্ল্যাগ সেট করে Admin-কে নোটিফিকেশন পাঠায়,
// চূড়ান্ত Cancel Admin-ই করবে (ঠিক ফ্রন্টএন্ডের Return/Cancel UI-এর
// মতোই আচরণ)।
// -------------------------------------------------
async function requestOrderCancel({ orderId, phone, uid, reason } = {}) {

  if (!orderId) {
    return { error: "orderId প্রয়োজন।" };
  }

  const db = admin.firestore();
  const orderRef = db.collection("orders").doc(orderId);
  const snap = await orderRef.get();

  if (!snap.exists) {
    return { error: "এই অর্ডার নম্বর দিয়ে কিছু পাওয়া যায়নি।" };
  }

  const order = snap.data();

  const authorized = (uid && order.userId === uid) || (phone && order.phone === phone);

  if (!authorized) {
    return {
      error:
        "নিরাপত্তার জন্য এই অর্ডারের জন্য cancel request পাঠানো যাচ্ছে না। " +
        "অনুগ্রহ করে যে ফোন নাম্বার দিয়ে অর্ডার করেছিলেন সেটা দিন।",
    };
  }

  if (order.status === "Cancelled" || order.status === "Delivered") {
    return { error: `এই অর্ডার এখন "${order.status}" অবস্থায় আছে, cancel request পাঠানো যাচ্ছে না।` };
  }

  await orderRef.update({ cancelRequested: true, cancelReason: reason || "" });

  try {

    await db.collection("notifications").add({
      title: "❌ Order Cancel Request",
      message: `${order.customerName || "Customer"} requested cancellation for order #${orderId.slice(-8)} via AI chat.`,
      type: "cancel",
      priority: "high",
      receiverId: "ADMIN",
      senderId: null,
      senderName: "",
      senderRole: "",
      actionUrl: `/admin/orders/${orderId}`,
      image: "",
      extra: { reason: reason || "" },
      isRead: false,
      isDeleted: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  } catch (notifyErr) {
    console.error("AI CHAT — cancel request notification failed:", notifyErr.message);
  }

  return { requested: true, orderId, message: "আপনার cancel request Admin-এর কাছে পাঠানো হয়েছে।" };

}

// -------------------------------------------------
// RETURN REQUEST
// একটা আলাদা "returnRequests" কালেকশনে রিকোয়েস্ট জমা রাখা হয়
// (অর্ডার নিজে বদলানো হয় না) — Admin পরে review করে সিদ্ধান্ত নেবে।
// -------------------------------------------------
async function requestReturn({ orderId, phone, uid, reason } = {}) {

  if (!orderId || !reason) {
    return { error: "return request পাঠাতে orderId এবং কারণ (reason) দুটোই লাগবে।" };
  }

  const db = admin.firestore();
  const snap = await db.collection("orders").doc(orderId).get();

  if (!snap.exists) {
    return { error: "এই অর্ডার নম্বর দিয়ে কিছু পাওয়া যায়নি।" };
  }

  const order = snap.data();

  const authorized = (uid && order.userId === uid) || (phone && order.phone === phone);

  if (!authorized) {
    return {
      error:
        "নিরাপত্তার জন্য এই অর্ডারের জন্য return request পাঠানো যাচ্ছে না। " +
        "অনুগ্রহ করে যে ফোন নাম্বার দিয়ে অর্ডার করেছিলেন সেটা দিন।",
    };
  }

  const docRef = await db.collection("returnRequests").add({
    orderId,
    userId: uid || null,
    phone: order.phone || phone || "",
    customerName: order.customerName || "",
    reason,
    status: "Pending",
    source: "ai-chat",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  try {

    await db.collection("notifications").add({
      title: "↩️ Return Request",
      message: `${order.customerName || "Customer"} requested a return for order #${orderId.slice(-8)} via AI chat.`,
      type: "return",
      priority: "high",
      receiverId: "ADMIN",
      senderId: null,
      senderName: "",
      senderRole: "",
      actionUrl: `/admin/orders/${orderId}`,
      image: "",
      extra: { reason },
      isRead: false,
      isDeleted: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  } catch (notifyErr) {
    console.error("AI CHAT — return request notification failed:", notifyErr.message);
  }

  return { requested: true, returnRequestId: docRef.id, message: "আপনার return request Admin-এর কাছে পাঠানো হয়েছে।" };

}

// -------------------------------------------------
// ORDER STATUS LOOKUP
// নিরাপত্তা: যদি ইউজার লগইন করা থাকে (uid দেওয়া থাকে), তাহলে শুধু
// তার নিজের userId-এর অর্ডারই দেখাবে। লগইন ছাড়া হলে orderId +
// phone দুটোই মিলতে হবে, যাতে অন্যের অর্ডার কেউ চ্যাট করে দেখতে
// না পারে।
// -------------------------------------------------
async function getOrderStatus({ orderId, phone, uid }) {

  if (!orderId) {
    return { error: "orderId প্রয়োজন।" };
  }

  const snap = await admin
    .firestore()
    .collection("orders")
    .doc(orderId)
    .get();

  if (!snap.exists) {
    return { error: "এই অর্ডার নম্বর দিয়ে কিছু পাওয়া যায়নি।" };
  }

  const order = snap.data();

  const authorized =
    (uid && order.userId === uid) ||
    (phone && order.phone === phone);

  if (!authorized) {
    return {
      error:
        "নিরাপত্তার জন্য এই অর্ডারের তথ্য দেখানো যাচ্ছে না। " +
        "অনুগ্রহ করে যে ফোন নাম্বার দিয়ে অর্ডার করেছিলেন সেটা দিন।",
    };
  }

  return {
    id: snap.id,
    status: order.status || "Pending",
    paymentStatus: order.paymentStatus || "Pending",
    customerName: order.customerName || "",
    total: order.total || 0,
    items: (order.items || []).map((i) => ({
      name: i.name || i.title || "Item",
      qty: i.qty || i.quantity || 1,
      price: i.price || 0,
    })),
    createdAt: order.createdAt || "",
  };

}

// -------------------------------------------------
// PHONE/ACCOUNT দিয়ে সাম্প্রতিক অর্ডার লিস্ট খোঁজা
// কাস্টমার সবসময় Order ID মনে রাখে না — "আমার প্রোডাক্টের কি
// অবস্থা?" জিজ্ঞেস করলে AI প্রথমে এটা কল করে সবগুলো (বা লগইন
// করা থাকলে তার নিজের) অর্ডার খুঁজে বের করবে, তারপর দরকার হলে
// কাস্টমারকে জিজ্ঞেস করে নির্দিষ্ট একটা বেছে নেবে।
// নিরাপত্তা: লগইন করা না থাকলে অবশ্যই phone লাগবে — খালি
// অনুরোধে (uid/phone ছাড়া) কখনো ডাটাবেস স্ক্যান করা হবে না।
// -------------------------------------------------
async function getOrdersByPhone({ phone, uid }) {

  if (!uid && !phone) {
    return {
      error:
        "অর্ডার খুঁজতে ফোন নাম্বার লাগবে (যেটা দিয়ে অর্ডার করা " +
        "হয়েছিল), অথবা লগইন করা থাকলে সেটাই যথেষ্ট।",
    };
  }

  const db = admin.firestore();
  let snap;

  if (uid) {
    snap = await db
      .collection("orders")
      .where("userId", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();
  } else {
    snap = await db
      .collection("orders")
      .where("phone", "==", phone)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();
  }

  if (snap.empty) {
    return {
      error:
        "এই তথ্য দিয়ে কোনো অর্ডার খুঁজে পাওয়া যায়নি। ফোন নাম্বারটা " +
        "আবার একটু চেক করে দিন।",
    };
  }

  const orders = [];

  snap.forEach((doc) => {

    const order = doc.data();

    orders.push({
      id: doc.id,
      status: order.status || "Pending",
      paymentStatus: order.paymentStatus || "Pending",
      customerName: order.customerName || "",
      total: order.total || 0,
      itemsSummary: (order.items || [])
        .map((i) => `${i.name || i.title || "Item"} x${i.qty || i.quantity || 1}`)
        .join(", "),
      createdAt: order.createdAt || "",
    });

  });

  return { orders };

}

// -------------------------------------------------
// ADMIN কন্টাক্ট তথ্য (READ-ONLY, settings/store থেকে)
// কাস্টমার সরাসরি মানুষের (Admin) সাথে কথা বলতে চাইলে এটা কল
// করে WhatsApp নাম্বার/লিংক বের করে দিতে হবে।
// -------------------------------------------------
async function getAdminContact() {

  const snap = await admin
    .firestore()
    .collection("settings")
    .doc("store")
    .get();

  const s = snap.exists ? snap.data() : {};

  const whatsapp = (s.whatsapp || "").toString().trim();

  if (!whatsapp) {
    return {
      error:
        "এই মুহূর্তে WhatsApp নাম্বার সেট করা নেই। কাস্টমারকে ফোন " +
        "নাম্বার বা ইমেইল দিয়ে সাহায্য করুন যদি পাওয়া যায়।",
      phone: s.phone || "",
      email: s.email || "",
    };
  }

  // whatsapp লিংক বানানো — শুধু সংখ্যা রাখা হচ্ছে (+, স্পেস, ড্যাশ বাদ)
  const digitsOnly = whatsapp.replace(/[^\d]/g, "");

  return {
    whatsapp,
    whatsappLink: digitsOnly ? `https://wa.me/${digitsOnly}` : "",
    phone: s.phone || "",
    email: s.email || "",
  };

}

// -------------------------------------------------
// CREATE ORDER (চ্যাট থেকে)
// orderService.js-এর createOrder()-এর সাথে schema মিলিয়ে লেখা।
// শুধু Cash on Delivery-তে সীমাবদ্ধ রাখা হয়েছে — bKash/Nagad-এর
// মতো পেমেন্ট চ্যাট থেকে ট্রানজেকশন আইডি ছাড়া নেওয়া নিরাপদ না,
// তাই এখন শুধু COD সাপোর্ট করছে। পরে চাইলে payment flow যোগ করা
// যাবে।
// -------------------------------------------------
// -------------------------------------------------
// বাংলাদেশি মোবাইল নাম্বার normalize + validate করা
// - 01XXXXXXXXX (মোট ১১ সংখ্যা) সরাসরি গ্রহণযোগ্য
// - +8801XXXXXXXXX দিলে শুরুর "+88" কেটে বাকি ১১ সংখ্যা রাখা হয়
// - অন্য কোনো ফরম্যাট হলে null রিটার্ন করে (invalid ধরা হয়)
// -------------------------------------------------
function normalizeBDPhone(raw) {

  if (!raw) return null;

  let p = String(raw).trim().replace(/[\s\-()]/g, "");

  if (p.startsWith("+8801")) {
    p = p.slice(3); // "+88" (৩ ক্যারেক্টার) কেটে বাকি "01XXXXXXXXX" রাখা হচ্ছে
  } else if (p.startsWith("8801") && p.length === 13) {
    p = p.slice(2); // "88" কেটে বাকি "01XXXXXXXXX" রাখা হচ্ছে
  }

  return /^01\d{9}$/.test(p) ? p : null;

}

async function createOrderViaChat({
  customerName,
  phone,
  address,
  thana,
  district,
  items,
  notes,
  uid,
}) {

  if (!customerName || !phone || !address || !district || !items || !items.length) {

    return {
      error:
        "অর্ডার কনফার্ম করতে নাম, ১১ সংখ্যার মোবাইল নাম্বার, সম্পূর্ণ ঠিকানা, " +
        "জেলা এবং কমপক্ষে একটা প্রোডাক্ট — সবগুলো লাগবে। যা যা এখনো পাননি সেগুলো " +
        "কাস্টমারের কাছে চেয়ে নিন।",
    };

  }

  const normalizedPhone = normalizeBDPhone(phone);

  if (!normalizedPhone) {

    return {
      error:
        "মোবাইল নাম্বারটা সঠিক ফরম্যাটে নেই। এটা অবশ্যই ১১ সংখ্যার এবং " +
        "০১ দিয়ে শুরু হতে হবে (যেমন 01712345678), অথবা +৮৮ সহ দিতে পারেন " +
        "(যেমন +8801712345678)। কাস্টমারকে সঠিক নাম্বার আবার চাইুন।",
    };

  }

  if (address.trim().length < 8) {

    return {
      error:
        "ঠিকানাটা যথেষ্ট বিস্তারিত মনে হচ্ছে না। বাসা/হোল্ডিং নাম্বার, " +
        "রোড, এলাকাসহ সম্পূর্ণ ঠিকানা কাস্টমারের কাছে চেয়ে নিন।",
    };

  }

  phone = normalizedPhone;

  // প্রতিটা প্রোডাক্ট আসল Firestore থেকে verify করা হচ্ছে —
  // AI যেন নিজে থেকে দাম বানিয়ে না দেয়, stock না থাকা প্রোডাক্টও
  // যেন অর্ডার না হয়ে যায়।
  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {

    const pSnap = await admin
      .firestore()
      .collection("products")
      .doc(item.productId)
      .get();

    if (!pSnap.exists) {
      return { error: `প্রোডাক্ট (${item.productId}) খুঁজে পাওয়া যায়নি।` };
    }

    const p = pSnap.data();
    const qty = Math.max(1, Number(item.qty) || 1);

    if ((p.stock ?? 0) < qty) {
      return {
        error: `"${p.name || p.title}" স্টকে পর্যাপ্ত নেই (আছে ${p.stock ?? 0}টা)।`,
      };
    }

    const unitPrice = p.offerPrice || p.price || 0;

    verifiedItems.push({
      productId: pSnap.id,
      name: p.name || p.title,
      price: unitPrice,
      qty,
      image: p.image || "",
    });

    subtotal += unitPrice * qty;

  }

  // Checkout পেজের মতো একই hisab দিয়ে ডেলিভারি চার্জ বসানো হচ্ছে —
  // AI এটা নিজে থেকে বানায় না, এবং কাস্টমারকে যা বলা হয়েছে (get_delivery_info
  // থেকে) তার সাথেই এটা মিলবে। district অস্পষ্ট/না-দেওয়া থাকলে
  // ডিফল্ট হিসেবে "ঢাকার বাইরে"-র রেট ধরা হচ্ছে (নিরাপদ দিক)।
  const deliveryCharge = calculateDeliveryCharge(district) ?? DELIVERY_TIERS[2].charge;
  const total = subtotal + deliveryCharge;

  const orderData = {
    ...(uid ? { userId: uid } : {}),
    customerName,
    phone,
    address,
    thana: thana || "",
    district: district || "",
    notes: notes || "",
    deliveryCharge,
    items: verifiedItems,
    subtotal,
    total,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    paymentDetails: null,
    status: "Pending",
    source: "ai-chat",
    createdAt: new Date().toISOString(),
  };

  const docRef = await admin
    .firestore()
    .collection("orders")
    .add(orderData);

  // ফ্রন্টএন্ড checkout থেকে অর্ডার করলে admin/user notification
  // তৈরি হয় (notificationService.js), কিন্তু চ্যাট থেকে অর্ডার হলে
  // আগে এটা বাদ পড়তো — ফলে admin panel-এ bell-এ কিছু দেখা যেতো
  // না। এখানে একই notification schema (isDeleted/isRead/receiverId
  // ইত্যাদি) হুবহু মিলিয়ে সরাসরি Admin SDK দিয়ে লেখা হচ্ছে যাতে
  // admin-এর নোটিফিকেশন ড্রপডাউনে এটাও দেখা যায়।
  try {

    await admin.firestore().collection("notifications").add({
      title: "📦 New Order Received",
      message: `${customerName} placed a new order via AI chat.`,
      type: "order",
      priority: "high",
      receiverId: "ADMIN",
      senderId: null,
      senderName: "",
      senderRole: "",
      actionUrl: `/admin/orders/${docRef.id}`,
      image: "",
      extra: {},
      isRead: false,
      isDeleted: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    if (uid) {

      await admin.firestore().collection("notifications").add({
        title: "🛒 Order Placed",
        message: "Your order has been placed successfully.",
        type: "order",
        priority: "medium",
        receiverId: uid,
        senderId: null,
        senderName: "",
        senderRole: "",
        actionUrl: `/profile/orders/${docRef.id}`,
        image: "",
        extra: {},
        isRead: false,
        isDeleted: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    }

  } catch (notifyErr) {

    // নোটিফিকেশন ব্যর্থ হলেও অর্ডার তৈরি সফল থাকবে — শুধু লগ করা হলো
    console.error("AI CHAT — order notification failed:", notifyErr.message);

  }

  return {
    orderId: docRef.id,
    total,
    deliveryCharge,
    items: verifiedItems,
    message: "অর্ডার সফলভাবে নেওয়া হয়েছে।",
  };

}

// -------------------------------------------------
// INVOICE (TEXT SUMMARY — MVP)
// পূর্ণাঙ্গ PDF ইনভয়েস Phase 2-তে যোগ করা যাবে; এখন AI চ্যাটেই
// পড়ার/কপি করার মতো একটা পরিষ্কার ইনভয়েস টেক্সট রিটার্ন করছে।
// -------------------------------------------------
async function generateInvoiceText({ orderId, phone, uid }) {

  const result = await getOrderStatus({ orderId, phone, uid });

  if (result.error) {
    return result;
  }

  const lines = [
    `Dream Mode — Invoice`,
    `Order ID: ${result.id}`,
    `Customer: ${result.customerName}`,
    `Status: ${result.status} | Payment: ${result.paymentStatus}`,
    ``,
    `Items:`,
    ...result.items.map(
      (i) => `- ${i.name} x${i.qty} — ৳${i.price * i.qty}`
    ),
    ``,
    `Total: ৳${result.total}`,
  ];

  return { invoiceText: lines.join("\n") };

}

// -------------------------------------------------
// INVOICE — PDF (Phase 2)
// একই authorization নিয়ম (uid/phone match) — কিন্তু এবার পুরো
// order ডকুমেন্ট (address, delivery charge ইত্যাদি সহ) নিয়ে
// একটা প্রকৃত ডাউনলোডযোগ্য PDF বানানো হচ্ছে।
// -------------------------------------------------
async function generateInvoicePdf({ orderId, phone, uid }) {

  if (!orderId) {
    return { error: "orderId প্রয়োজন।" };
  }

  const snap = await admin.firestore().collection("orders").doc(orderId).get();

  if (!snap.exists) {
    return { error: "এই অর্ডার নম্বর দিয়ে কিছু পাওয়া যায়নি।" };
  }

  const order = snap.data();

  const authorized =
    (uid && order.userId === uid) ||
    (phone && order.phone === phone);

  if (!authorized) {

    return {
      error:
        "নিরাপত্তার জন্য এই অর্ডারের ইনভয়েস দেখানো যাচ্ছে না। " +
        "অনুগ্রহ করে যে ফোন নাম্বার দিয়ে অর্ডার করেছিলেন সেটা দিন।",
    };

  }

  try {

    const { generateInvoicePdfForOrder } = require("./pdfInvoice");

    const { pdfUrl } = await generateInvoicePdfForOrder({ order, orderId: snap.id });

    return { pdfUrl, orderId: snap.id };

  } catch (error) {

    console.error("INVOICE PDF GENERATION ERROR:", error);

    return { error: "ইনভয়েস PDF বানাতে সমস্যা হয়েছে, একটু পর আবার চেষ্টা করুন।" };

  }

}

module.exports = {
  getDeliveryInfo,
  searchProducts,
  checkStock,
  getRelatedProducts,
  getWishlistItems,
  getTrendingProducts,
  getNewArrivals,
  addToWishlist,
  saveShoppingPreference,
  getShoppingPreference,
  requestOrderCancel,
  requestReturn,
  getOrderStatus,
  getOrdersByPhone,
  getAdminContact,
  createOrderViaChat,
  generateInvoiceText,
  generateInvoicePdf,
};
