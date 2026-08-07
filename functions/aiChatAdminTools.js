// =================================================
// AI CHAT — ADMIN-ONLY TOOL FUNCTIONS (Phase 2)
//
// ⚠️ এই ফাইলের সব ফাংশন শুধুমাত্র aiChatAdmin.js থেকে কল হওয়ার
// কথা, এবং aiChatAdmin.js নিজেই প্রতিটা রিকোয়েস্টে caller
// আসলে admin কিনা (Firestore users/{uid}.role === "admin")
// যাচাই করে তবেই এই ফাংশনগুলোর কাছাকাছি যায়। এই ফাইলের কোনো
// ফাংশন কখনো customer-facing aiChat.js/aiChatTools.js-এ import
// করা যাবে না — করলে যেকোনো কাস্টমার চ্যাট থেকেই স্টক/দাম বদলে
// ফেলতে পারবে।
// =================================================

const admin = require("firebase-admin");

const VALID_ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// -------------------------------------------------
// প্রোডাক্ট স্টক আপডেট
// -------------------------------------------------
async function updateProductStock({ productId, stock }) {

  if (!productId) {
    return { error: "productId প্রয়োজন।" };
  }

  const newStock = Number(stock);

  if (!Number.isFinite(newStock) || newStock < 0) {
    return { error: "স্টক একটা বৈধ, ০ বা তার বেশি সংখ্যা হতে হবে।" };
  }

  const ref = admin.firestore().collection("products").doc(productId);
  const snap = await ref.get();

  if (!snap.exists) {
    return { error: "এই প্রোডাক্টটা খুঁজে পাওয়া যায়নি।" };
  }

  const before = snap.data();

  await ref.update({
    stock: newStock,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    productId,
    name: before.name || before.title || "",
    previousStock: before.stock ?? 0,
    newStock,
  };

}

// -------------------------------------------------
// প্রোডাক্ট দাম আপডেট (regular price ও/অথবা offer price)
// -------------------------------------------------
async function updateProductPrice({ productId, price, offerPrice }) {

  if (!productId) {
    return { error: "productId প্রয়োজন।" };
  }

  if (price === undefined && offerPrice === undefined) {
    return { error: "price অথবা offerPrice — অন্তত একটা দিতে হবে।" };
  }

  const ref = admin.firestore().collection("products").doc(productId);
  const snap = await ref.get();

  if (!snap.exists) {
    return { error: "এই প্রোডাক্টটা খুঁজে পাওয়া যায়নি।" };
  }

  const before = snap.data();
  const updates = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };

  if (price !== undefined) {

    const newPrice = Number(price);

    if (!Number.isFinite(newPrice) || newPrice < 0) {
      return { error: "price একটা বৈধ সংখ্যা হতে হবে।" };
    }

    updates.price = newPrice;

  }

  if (offerPrice !== undefined) {

    const newOfferPrice = Number(offerPrice);

    if (!Number.isFinite(newOfferPrice) || newOfferPrice < 0) {
      return { error: "offerPrice একটা বৈধ সংখ্যা হতে হবে।" };
    }

    updates.offerPrice = newOfferPrice;

  }

  const effectivePrice =
    updates.price !== undefined ? updates.price : before.price;
  const effectiveOfferPrice =
    updates.offerPrice !== undefined ? updates.offerPrice : before.offerPrice;

  if (
    effectiveOfferPrice &&
    effectivePrice &&
    Number(effectiveOfferPrice) > Number(effectivePrice)
  ) {

    return {
      error:
        "অফার দাম নিয়মিত দামের চেয়ে বেশি হতে পারে না — একবার " +
        "সংখ্যাগুলো আবার চেক করে দিন।",
    };

  }

  await ref.update(updates);

  return {
    success: true,
    productId,
    name: before.name || before.title || "",
    previousPrice: before.price ?? 0,
    previousOfferPrice: before.offerPrice ?? 0,
    newPrice: effectivePrice ?? 0,
    newOfferPrice: effectiveOfferPrice ?? 0,
  };

}

// -------------------------------------------------
// অর্ডার স্ট্যাটাস আপডেট
// -------------------------------------------------
async function updateOrderStatus({ orderId, status }) {

  if (!orderId) {
    return { error: "orderId প্রয়োজন।" };
  }

  if (!VALID_ORDER_STATUSES.includes(status)) {

    return {
      error: `status অবশ্যই এগুলোর একটা হতে হবে: ${VALID_ORDER_STATUSES.join(", ")}`,
    };

  }

  const ref = admin.firestore().collection("orders").doc(orderId);
  const snap = await ref.get();

  if (!snap.exists) {
    return { error: "এই অর্ডারটা খুঁজে পাওয়া যায়নি।" };
  }

  const before = snap.data();

  await ref.update({
    status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    orderId,
    customerName: before.customerName || "",
    previousStatus: before.status || "Pending",
    newStatus: status,
  };

}

// -------------------------------------------------
// সাম্প্রতিক অর্ডার লিস্ট (Admin — phone/uid restriction ছাড়াই
// সব অর্ডার দেখতে পারবে, কারণ caller আগেই admin হিসেবে verified)
// -------------------------------------------------
async function listRecentOrders({ status, limit } = {}) {

  let query = admin.firestore().collection("orders").orderBy("createdAt", "desc");

  if (status) {

    if (!VALID_ORDER_STATUSES.includes(status)) {

      return {
        error: `status অবশ্যই এগুলোর একটা হতে হবে: ${VALID_ORDER_STATUSES.join(", ")}`,
      };

    }

    query = query.where("status", "==", status);

  }

  const cappedLimit = Math.min(Math.max(Number(limit) || 10, 1), 25);

  const snap = await query.limit(cappedLimit).get();

  const orders = [];

  snap.forEach((doc) => {

    const order = doc.data();

    orders.push({
      id: doc.id,
      status: order.status || "Pending",
      paymentStatus: order.paymentStatus || "Pending",
      customerName: order.customerName || "",
      phone: order.phone || "",
      total: order.total || 0,
      itemsSummary: (order.items || [])
        .map((i) => `${i.name || i.title || "Item"} x${i.qty || i.quantity || 1}`)
        .join(", "),
      createdAt: order.createdAt || "",
    });

  });

  return { orders };

}

module.exports = {
  VALID_ORDER_STATUSES,
  updateProductStock,
  updateProductPrice,
  updateOrderStatus,
  listRecentOrders,
};
