import jsPDF from "jspdf";
import QRCode from "qrcode";

import { getSettings } from "../services/settingsService";

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

const PAGE_WIDTH = 58;
const MARGIN_X = 4;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const RIGHT_X = PAGE_WIDTH - MARGIN_X;

// Draws the full invoice onto the given jsPDF doc (already created at
// some page height) and returns the final y position content reached.
//
// IMPORTANT: jsPDF converts the y coordinate you pass into doc.text()
// into an absolute PDF coordinate (measured from the BOTTOM of the
// page) at the moment you call it, using whatever page height the
// doc currently has. So the page's final height must already be
// correct *before* any drawing happens — resizing the page afterward
// (as the old code did) does not move already-drawn content, it just
// shrinks the page around it, pushing everything above the visible
// area. That was the actual cause of the fully blank PDF. That's why
// this is called twice by buildInvoicePdf: once on a throwaway page
// just to measure the required height, then again on a doc created
// at that exact height.
function drawInvoice(doc, order, settings, qrCode, logoData) {

  doc.setTextColor(0, 0, 0);

  let y = MARGIN_X;

  // ---- LOGO + STORE NAME ----

  const headerTextX = logoData ? MARGIN_X + 11 : PAGE_WIDTH / 2;
  const headerAlign = logoData ? "left" : "center";

  if (logoData) {
    try {
      doc.addImage(logoData, "PNG", MARGIN_X, y, 9, 9);
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
  const barX = PAGE_WIDTH / 2 - barWidth / 2;

  doc.setFillColor(0, 0, 0);
  doc.rect(barX, y, barWidth, barHeight, "F");

  doc.setTextColor(255, 255, 255);
  doc.text(barLabel, PAGE_WIDTH / 2, y + barHeight / 2 + 1, { align: "center" });
  doc.setTextColor(0, 0, 0);

  y += barHeight + 3;

  // ---- INFO ROWS ----

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  const infoRow = (label, value) => {
    doc.setFont("helvetica", "normal");
    doc.text(label, MARGIN_X, y);
    doc.text(String(value), RIGHT_X, y, { align: "right" });
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

  doc.text("Status", MARGIN_X, y);
  drawBadge(doc, "Confirmed", RIGHT_X, y, [34, 197, 94]);
  y += 4.4;

  infoRow("Payment Method", order.paymentMethod || "Cash On Delivery");

  doc.text("Payment Status", MARGIN_X, y);
  drawBadge(
    doc,
    order.paymentStatus || "Pending",
    RIGHT_X,
    y,
    order.paymentStatus === "Paid" ? [34, 197, 94] : [234, 179, 8]
  );
  y += 4.4;

  y += 1;
  doc.setDrawColor(210, 210, 210);
  doc.line(MARGIN_X, y, RIGHT_X, y);
  y += 4;

  // ---- CUSTOMER ----

  doc.setFont("times", "bold");
  doc.setFontSize(9);
  doc.text("Customer", MARGIN_X, y);
  y += 4.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(order.customerName || "-", MARGIN_X, y);
  y += 4.2;

  doc.text(order.phone || "-", MARGIN_X, y);
  y += 4.2;

  const fullAddress = [
    order.address,
    order.thana,
    order.district,
  ].filter(Boolean).join(", ");

  const addressLines = doc.splitTextToSize(fullAddress || "-", CONTENT_WIDTH);

  addressLines.forEach((line) => {
    doc.text(line, MARGIN_X, y);
    y += 4;
  });

  y += 1;
  doc.setDrawColor(210, 210, 210);
  doc.line(MARGIN_X, y, RIGHT_X, y);
  y += 4;

  // ---- PRODUCTS ----

  doc.setFont("times", "bold");
  doc.setFontSize(9);
  doc.text("Products", MARGIN_X, y);
  y += 4.2;

  const qtyX = MARGIN_X + 34;
  const priceRightX = RIGHT_X;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("Item", MARGIN_X, y);
  doc.text("Qty", qtyX, y, { align: "center" });
  doc.text("Price", priceRightX, y, { align: "right" });
  y += 1.5;

  doc.setDrawColor(210, 210, 210);
  doc.line(MARGIN_X, y, RIGHT_X, y);
  y += 3.6;

  (order.items || []).forEach((item) => {

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.8);

    const nameLines = doc.splitTextToSize(
      item.name || "-",
      CONTENT_WIDTH - 22
    );

    nameLines.forEach((line, idx) => {
      doc.text(line, MARGIN_X, y + idx * 3.4);
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
      doc.text(sub, MARGIN_X, y);

      doc.setTextColor(0, 0, 0);
      y += 3.4;

    }

    y += 1.4;
    doc.setDrawColor(225, 225, 225);
    doc.line(MARGIN_X, y, RIGHT_X, y);
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
  doc.line(MARGIN_X, y, RIGHT_X, y);
  y += 5;

  // ---- TOTAL ----

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL", MARGIN_X, y);
  doc.text(`\u09F3 ${order.total ?? 0}`, RIGHT_X, y, { align: "right" });
  y += 3;

  doc.setDrawColor(210, 210, 210);
  doc.line(MARGIN_X, y, RIGHT_X, y);
  y += 5;

  // ---- STORE CONTACT ----

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  if (settings.phone) {
    doc.text(`Contact Us: ${settings.phone}`, PAGE_WIDTH / 2, y, { align: "center" });
    y += 3.6;
  }

  if (settings.facebook) {

    const fbLines = doc.splitTextToSize(settings.facebook, CONTENT_WIDTH);

    fbLines.forEach((line) => {
      doc.text(line, PAGE_WIDTH / 2, y, { align: "center" });
      y += 3.4;
    });

  }

  y += 3;

  // ---- THANK YOU + QR ----

  const qrSize = 14;
  const qrX = RIGHT_X - qrSize;
  const qrY = y;

  doc.setFont("times", "bolditalic");
  doc.setFontSize(13);
  doc.text("Thank You!", MARGIN_X, y + 5);

  const thankWidth = doc.getTextWidth("Thank You! ");
  drawHeart(doc, MARGIN_X + thankWidth + 1.5, y + 3.6, 3.2, [236, 72, 153]);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(90, 90, 90);
  doc.text(
    `for shopping with ${settings.storeName || "Dream Mode"}`,
    MARGIN_X,
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
  y += MARGIN_X;

  return y;

}

// Builds the 58mm invoice as a real text-based jsPDF document (no
// html2canvas screenshotting involved) so text is always crisp,
// selectable, and never gets clipped or misaligned by font/layout
// timing issues. Returns the jsPDF doc instance — callers decide
// whether to .save() it or use it another way.
export async function buildInvoicePdf(order) {

  const settings = (await getSettings()) || {};

  const qrValue =
    settings.websiteUrl ||
    settings.facebook ||
    window.location.origin;

  const [qrCode, logoData] = await Promise.all([
    QRCode.toDataURL(qrValue),
    loadImageAsDataURL(settings.logoUrl),
  ]);

  // PASS 1 — measure only. Draw onto a generously tall throwaway page
  // just to find out how tall the real content is. This doc is
  // discarded; nothing from it is saved.
  const measureDoc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [PAGE_WIDTH, 400],
  });

  const finalHeight = drawInvoice(measureDoc, order, settings, qrCode, logoData);

  // PASS 2 — the real doc, created at the exact final height from the
  // start. Every coordinate jsPDF bakes into the PDF this time is
  // computed against the correct page height, so nothing ends up
  // drawn outside the visible page.
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [PAGE_WIDTH, finalHeight],
  });

  drawInvoice(doc, order, settings, qrCode, logoData);

  return doc;

}

// Convenience wrapper: builds the invoice PDF and saves/downloads it.
// This is the single entry point both InvoiceActions.jsx (customer-
// facing) and OrderDetails.jsx (admin) call, so there is only ever
// one PDF implementation to fix.
export async function downloadInvoicePdf(order) {

  if (!order) return;

  const doc = await buildInvoicePdf(order);

  doc.save(`Invoice-${order?.id || "Order"}.pdf`);

}
