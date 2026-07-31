import jsPDF from "jspdf";
import QRCode from "qrcode";

import { getSettings } from "../../services/settingsService";

// Try to load a (possibly remote) image and convert it to a data URL
// so it can be embedded into the PDF. Resolves to null on any failure
// so a missing/blocked logo never breaks PDF generation.
function loadImageAsDataURL(url) {

  return new Promise((resolve) => {

    if (!url) return resolve(null);

    const img = new Image();

    img.crossOrigin = "anonymous";

    img.onload = () => {

      try {

        const canvas = document.createElement("canvas");

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL("image/png"));

      } catch (e) {

        resolve(null);

      }

    };

    img.onerror = () => resolve(null);

    img.src = url;

  });

}

// Draws a simple filled heart shape using two circles + a triangle
function drawHeart(doc, cx, cy, size, color) {

  const r = size / 4;

  doc.setFillColor(...color);

  doc.circle(cx - r, cy, r, "F");
  doc.circle(cx + r, cy, r, "F");
  doc.triangle(
    cx - size / 2, cy,
    cx + size / 2, cy,
    cx, cy + size / 2,
    "F"
  );

}

// Draws a small pill/badge with centered white text, right-aligned to rightX.
function drawBadge(doc, text, rightX, y, color) {

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);

  const paddingX = 1.6;
  const textWidth = doc.getTextWidth(text);
  const badgeWidth = textWidth + paddingX * 2;
  const badgeHeight = 3.6;

  const x = rightX - badgeWidth;

  doc.setFillColor(...color);
  doc.roundedRect(x, y - badgeHeight + 0.9, badgeWidth, badgeHeight, 1.8, 1.8, "F");

  doc.setTextColor(255, 255, 255);
  doc.text(text, rightX - badgeWidth / 2, y, { align: "center" });
  doc.setTextColor(0, 0, 0);

}

// Builds the 58mm invoice PDF entirely by drawing text/shapes with jsPDF
// (no DOM screenshot involved), and triggers the browser download.
export async function generateInvoicePdf(order) {

  if (!order) return;

  const settings = (await getSettings()) || {};

  const qrValue =
    settings.websiteUrl ||
    settings.facebook ||
    window.location.origin;

  const [qrCode, logoData] = await Promise.all([
    QRCode.toDataURL(qrValue),
    loadImageAsDataURL(settings.logoUrl),
  ]);

  const pageWidth = 58;
  const marginX = 4;
  const contentWidth = pageWidth - marginX * 2;
  const rightX = pageWidth - marginX;

  // Start with a generous height; the page gets trimmed to the
  // actual content height right before saving.
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [pageWidth, 400],
  });

  doc.setTextColor(0, 0, 0);

  let y = marginX;

  // ---- LOGO + STORE NAME ----

  const headerTextX = logoData ? marginX + 11 : pageWidth / 2;
  const headerAlign = logoData ? "left" : "center";

  if (logoData) {
    try {
      doc.addImage(logoData, "PNG", marginX, y, 9, 9);
    } catch (e) {
      // ignore broken image data
    }
  }

  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.text(settings.storeName || "Dream Mode", headerTextX, y + 4.5, { align: headerAlign });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.3);
  doc.setTextColor(90, 90, 90);
  doc.text("Dress Your Dream, Live Your Style", headerTextX, y + 8, { align: headerAlign });
  doc.setTextColor(0, 0, 0);

  y += 13;

  // ---- INVOICE / MEMO BAR ----

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);

  const barLabel = "INVOICE / MEMO";
  const barPaddingX = 3;
  const barWidth = doc.getTextWidth(barLabel) + barPaddingX * 2;
  const barHeight = 5;
  const barX = pageWidth / 2 - barWidth / 2;

  doc.setFillColor(0, 0, 0);
  doc.rect(barX, y, barWidth, barHeight, "F");

  doc.setTextColor(255, 255, 255);
  doc.text(barLabel, pageWidth / 2, y + barHeight / 2 + 1, { align: "center" });
  doc.setTextColor(0, 0, 0);

  y += barHeight + 3;

  // ---- INFO ROWS ----

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  const infoRow = (label, value) => {
    doc.setFont("helvetica", "normal");
    doc.text(label, marginX, y);
    doc.text(String(value), rightX, y, { align: "right" });
    y += 4.4;
  };

  infoRow(
    "Invoice No",
    `DM-${String(order.id || "").slice(0, 8).toUpperCase()}`
  );

  infoRow(
    "Date",
    order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"
  );

  doc.text("Status", marginX, y);
  drawBadge(doc, "Confirmed", rightX, y, [34, 197, 94]);
  y += 4.4;

  infoRow("Payment Method", order.paymentMethod || "Cash On Delivery");

  doc.text("Payment Status", marginX, y);
  drawBadge(
    doc,
    order.paymentStatus || "Pending",
    rightX,
    y,
    order.paymentStatus === "Paid" ? [34, 197, 94] : [234, 179, 8]
  );
  y += 4.4;

  y += 1;
  doc.setDrawColor(210, 210, 210);
  doc.line(marginX, y, rightX, y);
  y += 4;

  // ---- CUSTOMER ----

  doc.setFont("times", "bold");
  doc.setFontSize(9);
  doc.text("Customer", marginX, y);
  y += 4.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(order.customerName || "-", marginX, y);
  y += 4.2;

  doc.text(order.phone || "-", marginX, y);
  y += 4.2;

  const fullAddress = [
    order.address,
    order.thana,
    order.district,
  ].filter(Boolean).join(", ");

  const addressLines = doc.splitTextToSize(fullAddress || "-", contentWidth);

  addressLines.forEach((line) => {
    doc.text(line, marginX, y);
    y += 4;
  });

  y += 1;
  doc.setDrawColor(210, 210, 210);
  doc.line(marginX, y, rightX, y);
  y += 4;

  // ---- PRODUCTS ----

  doc.setFont("times", "bold");
  doc.setFontSize(9);
  doc.text("Products", marginX, y);
  y += 4.2;

  const qtyX = marginX + 34;
  const priceRightX = rightX;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("Item", marginX, y);
  doc.text("Qty", qtyX, y, { align: "center" });
  doc.text("Price", priceRightX, y, { align: "right" });
  y += 1.5;

  doc.setDrawColor(210, 210, 210);
  doc.line(marginX, y, rightX, y);
  y += 3.6;

  (order.items || []).forEach((item) => {

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.8);

    const nameLines = doc.splitTextToSize(
      item.name || "-",
      contentWidth - 22
    );

    nameLines.forEach((line, idx) => {
      doc.text(line, marginX, y + idx * 3.4);
    });

    const price =
      (item.offerPrice || item.price || 0) * (item.quantity || 1);

    doc.setFont("helvetica", "normal");
    doc.text(String(item.quantity ?? "-"), qtyX, y, { align: "center" });
    doc.text(`\u09F3${price}`, priceRightX, y, { align: "right" });

    y += nameLines.length * 3.4;

    if (item.size || item.color) {

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      doc.setTextColor(120, 120, 120);

      const sub = `${item.size || "-"}${item.color ? ` / ${item.color}` : ""}`;
      doc.text(sub, marginX, y);

      doc.setTextColor(0, 0, 0);
      y += 3.4;

    }

    y += 1.4;
    doc.setDrawColor(225, 225, 225);
    doc.line(marginX, y, rightX, y);
    y += 3.2;

  });

  // ---- SUMMARY ----

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  infoRow("Subtotal", `\u09F3 ${order.subtotal || order.total || 0}`);
  infoRow("Delivery", `\u09F3 ${order.deliveryCharge || 0}`);

  if ((order.discount || 0) > 0) {
    infoRow("Discount", `- \u09F3 ${order.discount}`);
  }

  y += 1;
  doc.setDrawColor(210, 210, 210);
  doc.line(marginX, y, rightX, y);
  y += 5;

  // ---- TOTAL ----

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL", marginX, y);
  doc.text(`\u09F3 ${order.total ?? 0}`, rightX, y, { align: "right" });
  y += 3;

  doc.setDrawColor(210, 210, 210);
  doc.line(marginX, y, rightX, y);
  y += 5;

  // ---- STORE CONTACT ----

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  if (settings.phone) {
    doc.text(`Contact Us: ${settings.phone}`, pageWidth / 2, y, { align: "center" });
    y += 3.6;
  }

  if (settings.facebook) {

    const fbLines = doc.splitTextToSize(settings.facebook, contentWidth);

    fbLines.forEach((line) => {
      doc.text(line, pageWidth / 2, y, { align: "center" });
      y += 3.4;
    });

  }

  y += 3;

  // ---- THANK YOU + QR ----

  const qrSize = 14;
  const qrX = rightX - qrSize;
  const qrY = y;

  doc.setFont("times", "bolditalic");
  doc.setFontSize(13);
  doc.text("Thank You!", marginX, y + 5);

  const thankWidth = doc.getTextWidth("Thank You! ");
  drawHeart(doc, marginX + thankWidth + 1.5, y + 3.6, 3.2, [236, 72, 153]);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(90, 90, 90);
  doc.text(
    `for shopping with ${settings.storeName || "Dream Mode"}`,
    marginX,
    y + 9
  );
  doc.setTextColor(0, 0, 0);

  if (qrCode) {
    try {
      doc.addImage(qrCode, "PNG", qrX, qrY, qrSize, qrSize);
    } catch (e) {
      // ignore
    }
  }

  y = Math.max(y + 12, qrY + qrSize);
  y += marginX;

  // Trim the page to the actual content height
  doc.internal.pageSize.setHeight(y);
  if (typeof doc.internal.pageSize.height !== "undefined") {
    doc.internal.pageSize.height = y;
  }

  doc.save(`Invoice-${order?.id || "Order"}.pdf`);

}
