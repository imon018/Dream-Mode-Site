// =================================================
// PDF INVOICE GENERATOR
// order থেকে একটা প্রকৃত PDF ইনভয়েস বানিয়ে Firebase Storage-এ
// আপলোড করে, তারপর download লিংক রিটার্ন করে। customer এবং
// admin — দুইজনের চ্যাট থেকেই ব্যবহার হয় (aiChatTools.js ও
// aiChatAdminTools.js উভয়েই এখান থেকে import করে)।
// =================================================

const admin = require("firebase-admin");
const PDFDocument = require("pdfkit");

async function getStoreNameForInvoice() {

  const snap = await admin.firestore().collection("settings").doc("store").get();

  if (snap.exists && snap.data().storeName) {
    return snap.data().storeName.trim();
  }

  return "DREAM MODE";

}

function formatDate(value) {

  try {

    const d = value ? new Date(value) : new Date();

    if (isNaN(d.getTime())) return new Date().toLocaleDateString("en-GB");

    return d.toLocaleDateString("en-GB");

  } catch (err) {

    return new Date().toLocaleDateString("en-GB");

  }

}

// -------------------------------------------------
// PDF বাফার বানানো (in-memory, ডিস্কে কিছু লেখা হয় না)
// -------------------------------------------------
function buildInvoicePdfBuffer({ order, orderId, storeName }) {

  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // ---- Header ----
    doc
      .fontSize(20)
      .fillColor("#111111")
      .text(storeName, { align: "left" })
      .fontSize(10)
      .fillColor("#666666")
      .text("INVOICE", { align: "left" });

    doc.moveDown(1.2);

    doc
      .fontSize(10)
      .fillColor("#333333")
      .text(`Invoice / Order ID: ${orderId}`)
      .text(`Date: ${formatDate(order.createdAt)}`)
      .text(`Payment Method: ${order.paymentMethod || "N/A"}`)
      .text(`Payment Status: ${order.paymentStatus || "Pending"}`)
      .text(`Order Status: ${order.status || "Pending"}`);

    doc.moveDown(1);

    // ---- Customer info ----
    doc.fontSize(11).fillColor("#111111").text("Bill To:", { underline: true });
    doc
      .fontSize(10)
      .fillColor("#333333")
      .text(order.customerName || "")
      .text(order.phone || "")
      .text(
        [order.address, order.thana, order.district]
          .filter(Boolean)
          .join(", ")
      );

    doc.moveDown(1.2);

    // ---- Items table ----
    const items = order.items || [];

    const tableTop = doc.y;
    const col = { name: 50, qty: 300, price: 370, subtotal: 460 };

    doc
      .fontSize(10)
      .fillColor("#ffffff")
      .rect(50, tableTop, 495, 20)
      .fill("#111111");

    doc
      .fillColor("#ffffff")
      .text("Item", col.name + 5, tableTop + 5)
      .text("Qty", col.qty, tableTop + 5)
      .text("Price", col.price, tableTop + 5)
      .text("Subtotal", col.subtotal, tableTop + 5);

    let y = tableTop + 25;

    doc.fillColor("#333333").fontSize(10);

    items.forEach((item) => {

      const name = item.name || item.title || "Item";
      const qty = item.qty || item.quantity || 1;
      const price = item.price || 0;
      const lineTotal = qty * price;

      doc
        .text(name, col.name + 5, y, { width: 240 })
        .text(String(qty), col.qty, y)
        .text(`৳${price}`, col.price, y)
        .text(`৳${lineTotal}`, col.subtotal, y);

      y += 20;

    });

    doc
      .moveTo(50, y + 5)
      .lineTo(545, y + 5)
      .strokeColor("#dddddd")
      .stroke();

    y += 15;

    const subtotal =
      order.subtotal ??
      items.reduce(
        (sum, i) => sum + (i.qty || i.quantity || 1) * (i.price || 0),
        0
      );

    doc
      .fontSize(10)
      .text("Subtotal:", col.price, y)
      .text(`৳${subtotal}`, col.subtotal, y);

    y += 18;

    doc
      .text("Delivery Charge:", col.price, y)
      .text(`৳${order.deliveryCharge || 0}`, col.subtotal, y);

    y += 18;

    doc
      .fontSize(12)
      .fillColor("#111111")
      .text("Total:", col.price, y, { continued: false })
      .text(`৳${order.total || 0}`, col.subtotal, y);

    doc.moveDown(3);

    doc
      .fontSize(9)
      .fillColor("#888888")
      .text(
        `Thank you for shopping with ${storeName}!`,
        50,
        doc.y,
        { align: "center", width: 495 }
      );

    doc.end();

  });

}

// -------------------------------------------------
// মূল ফাংশন — order নিয়ে PDF বানিয়ে Storage-এ আপলোড করে link
// রিটার্ন করে।
// `order` এবং `orderId` — কল করা ফাংশন (aiChatTools.js বা
// aiChatAdminTools.js) থেকেই আসে, যারা আগেই authorization চেক
// করে নিশ্চিত হয়েছে যে এই order দেখানো নিরাপদ। এই ফাংশন নিজে
// কোনো auth চেক করে না — শুধু PDF বানায়।
// -------------------------------------------------
async function generateInvoicePdfForOrder({ order, orderId }) {

  const storeName = await getStoreNameForInvoice();

  const pdfBuffer = await buildInvoicePdfBuffer({ order, orderId, storeName });

  // ফাইলের নামে একটা random token রাখা হচ্ছে, যাতে URL অনুমান
  // করে অন্য কারো ইনভয়েস কেউ খুলে ফেলতে না পারে (path-এর মধ্যেই
  // একটা হালকা সুরক্ষা)।
  const token = Math.random().toString(36).slice(2, 10);
  const filePath = `invoices/${orderId}-${token}.pdf`;

  const bucket = admin.storage().bucket();
  const file = bucket.file(filePath);

  await file.save(pdfBuffer, {
    contentType: "application/pdf",
    metadata: {
      cacheControl: "private, max-age=0",
    },
  });

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // ৭ দিন valid
  });

  return { pdfUrl: url };

}

module.exports = { generateInvoicePdfForOrder };
