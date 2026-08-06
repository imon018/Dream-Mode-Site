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
        image: p.image || "",
      });

    }


  });

  // AI-কে বেশি টোকেন খরচ না করিয়ে সবচেয়ে প্রাসঙ্গিক ১০টা রেজাল্ট
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
    stock: p.stock ?? 0,
    inStock: (p.stock ?? 0) > 0,
    price: p.price ?? 0,
    offerPrice: p.offerPrice || 0,
  };

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
// CREATE ORDER (চ্যাট থেকে)
// orderService.js-এর createOrder()-এর সাথে schema মিলিয়ে লেখা।
// শুধু Cash on Delivery-তে সীমাবদ্ধ রাখা হয়েছে — bKash/Nagad-এর
// মতো পেমেন্ট চ্যাট থেকে ট্রানজেকশন আইডি ছাড়া নেওয়া নিরাপদ না,
// তাই এখন শুধু COD সাপোর্ট করছে। পরে চাইলে payment flow যোগ করা
// যাবে।
// -------------------------------------------------
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

  if (!customerName || !phone || !address || !items || !items.length) {

    return {
      error:
        "অর্ডার করতে নাম, ফোন নাম্বার, ঠিকানা এবং কমপক্ষে একটা প্রোডাক্ট লাগবে।",
    };

  }

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

  const deliveryCharge = 0; // চাইলে settings/store থেকে ডাইনামিক করা যাবে
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

  return {
    orderId: docRef.id,
    total,
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

module.exports = {
  searchProducts,
  checkStock,
  getOrderStatus,
  createOrderViaChat,
  generateInvoiceText,
};
