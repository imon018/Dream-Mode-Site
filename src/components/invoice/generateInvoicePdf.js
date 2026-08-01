import jsPDF from "jspdf";
import QRCode from "qrcode";

import { getSettings } from "../../services/settingsService";

// A few mirrors for each font, tried in order until one works. Having
// more than one source matters: a single wrong/unreachable URL should
// never silently take down Bengali text or the Thank You script font.
const BENGALI_FONT_URLS = [
  "https://raw.githubusercontent.com/notofonts/noto-fonts/main/hinted/ttf/NotoSansBengali/NotoSansBengali-Regular.ttf",
  "https://cdn.jsdelivr.net/gh/notofonts/noto-fonts@main/hinted/ttf/NotoSansBengali/NotoSansBengali-Regular.ttf",
  "https://raw.githubusercontent.com/openmaptiles/fonts/master/noto-sans/NotoSansBengali-Regular.ttf",
];

const SCRIPT_FONT_URLS = [
  "https://raw.githubusercontent.com/tetsuo55/external-google-fonts-dancing-script-/master/DancingScript-Bold.ttf",
  "https://cdn.jsdelivr.net/gh/tetsuo55/external-google-fonts-dancing-script-@master/DancingScript-Bold.ttf",
];

const BENGALI_RANGE = /[\u0980-\u09FF]/;

// Each font's fetched bytes are cached (per page load) so repeated
// PDF downloads don't re-fetch every time.
let bengaliFontBase64Promise = null;
let scriptFontBase64Promise = null;

function arrayBufferToBase64(buffer) {

  let binary = "";

  const bytes = new Uint8Array(buffer);

  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {

    const chunk = bytes.subarray(i, i + chunkSize);

    binary += String.fromCharCode.apply(null, chunk);

  }

  return btoa(binary);

}

// Tries each URL in order and resolves with the first successful
// font's base64 bytes, or null if every mirror fails.
async function fetchFirstAvailableFont(urls) {

  for (const url of urls) {

    try {

      const res = await fetch(url);

      if (!res.ok) continue;

      const buf = await res.arrayBuffer();

      if (!buf || buf.byteLength < 1000) continue; // sanity check

      return arrayBufferToBase64(buf);

    } catch (e) {

      // try the next mirror

    }

  }

  return null;

}

// Registers the Bengali font on the given jsPDF doc instance.
// Returns true if the font is available to use on this doc.
async function ensureBengaliFont(doc) {

  if (!bengaliFontBase64Promise) {
    bengaliFontBase64Promise = fetchFirstAvailableFont(BENGALI_FONT_URLS);
  }

  const base64 = await bengaliFontBase64Promise;

  if (!base64) return false;

  try {

    doc.addFileToVFS("NotoSansBengali.ttf", base64);
    doc.addFont("NotoSansBengali.ttf", "NotoSansBengali", "normal");

    return true;

  } catch (e) {

    return false;

  }

}

// Registers the Dancing Script font (used for the "Thank You!" line)
// on the given jsPDF doc instance. Returns true if available.
async function ensureScriptFont(doc) {

  if (!scriptFontBase64Promise) {
    scriptFontBase64Promise = fetchFirstAvailableFont(SCRIPT_FONT_URLS);
  }

  const base64 = await scriptFontBase64Promise;

  if (!base64) return false;

  try {

    doc.addFileToVFS("DancingScript-Bold.ttf", base64);
    doc.addFont("DancingScript-Bold.ttf", "DancingScript", "bold");

    return true;

  } catch (e) {

    return false;

  }

}

// Splits text into consecutive runs of Bengali-script vs everything
// else, preserving order — e.g. "Basabo, সবুজবাগ" becomes
// ["Basabo, ", "সবুজবাগ"].
function splitScriptRuns(text) {

  const str = String(text);

  const matches = str.match(/[\u0980-\u09FF]+|[^\u0980-\u09FF]+/g);

  return matches || [""];

}

// Draws text that may mix Latin and Bengali characters by rendering
// each script run in its own font, rather than picking a single font
// for the whole string. This is what makes a line like
// "Basabo, সবুজবাগ, ঢাকা" reliable: even if the Bengali font that
// happened to load lacks Latin glyphs (or vice versa), each run still
// gets a font that actually has it — nothing silently vanishes.
// Caller must set the desired font size on `doc` beforehand.
// Returns the total rendered width (mm).
function drawSmartText(doc, text, x, y, opts = {}) {

  const {
    align = "left",
    bengaliLoaded,
    latinFamily = "helvetica",
    latinStyle = "normal",
  } = opts;

  const setRunFont = (isBengali) => {
    if (isBengali && bengaliLoaded) {
      doc.setFont("NotoSansBengali", "normal");
    } else {
      doc.setFont(latinFamily, latinStyle);
    }
  };

  const runs = splitScriptRuns(text).map((run) => {
    const isBengali = BENGALI_RANGE.test(run);
    setRunFont(isBengali);
    return { run, isBengali, width: doc.getTextWidth(run) };
  });

  const totalWidth = runs.reduce((sum, r) => sum + r.width, 0);

  let cursorX;

  if (align === "right") cursorX = x - totalWidth;
  else if (align === "center") cursorX = x - totalWidth / 2;
  else cursorX = x;

  runs.forEach(({ run, isBengali, width }) => {
    setRunFont(isBengali);
    doc.text(run, cursorX, y);
    cursorX += width;
  });

  return totalWidth;

}

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

// Small line-style icons used next to the Customer section rows,
// drawn as thin outlines (stroke only) to match the Feather-style
// (FiUser/FiPhone/FiMapPin) icons used on the website, rather than
// solid filled shapes. `baseY` is the text baseline they sit next
// to; `size` is the icon's rough height in mm.

function drawPersonIcon(doc, x, baseY, size, color) {

  doc.setDrawColor(...color);
  doc.setLineWidth(size * 0.09);

  const cx = x + size * 0.34;
  const headR = size * 0.19;

  doc.circle(cx, baseY - size * 0.72, headR, "S");
  doc.roundedRect(
    x + size * 0.02, baseY - size * 0.42,
    size * 0.64, size * 0.42,
    size * 0.18, size * 0.18,
    "S"
  );

}

function drawPhoneIcon(doc, x, baseY, size, color) {

  doc.setDrawColor(...color);
  doc.setLineWidth(size * 0.09);

  doc.roundedRect(
    x + size * 0.18, baseY - size * 0.85,
    size * 0.34, size * 0.85,
    size * 0.12, size * 0.12,
    "S"
  );

}

function drawPinIcon(doc, x, baseY, size, color) {

  doc.setDrawColor(...color);
  doc.setLineWidth(size * 0.09);

  const r = size * 0.24;
  const cx = x + size * 0.3;
  const topY = baseY - size * 0.8;

  doc.triangle(
    cx - r * 0.7, topY + r * 0.35,
    cx + r * 0.7, topY + r * 0.35,
    cx, baseY,
    "S"
  );
  doc.circle(cx, topY, r, "S");
  doc.circle(cx, topY, r * 0.32, "S");

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

// Draws the entire invoice onto the given doc and returns the final Y
// (mm) the content reached, so the caller knows how tall the page
// needs to be. This same function is used both to *measure* (on a
// throwaway doc) and to do the *real* render (on the correctly-sized
// final doc) — it must be side-effect-free with respect to anything
// other than the doc it's given.
function renderInvoiceContent(doc, { order, settings, qrCode, logoData, bengaliLoaded, scriptLoaded }) {

  const pageWidth = 58;
  const marginX = 4;
  const contentWidth = pageWidth - marginX * 2;
  const rightX = pageWidth - marginX;

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

  const storeName = settings.storeName || "Dream Mode";

  doc.setFontSize(13);
  drawSmartText(doc, storeName, headerTextX, y + 4.5, {
    align: headerAlign,
    bengaliLoaded,
    latinFamily: "times",
    latinStyle: "bold",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.3);
  doc.setTextColor(90, 90, 90);
  doc.text("Dress Your Dream, Live Your Style", headerTextX, y + 8, { align: headerAlign });
  doc.setTextColor(0, 0, 0);

  y += 10.5;

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

  doc.setFontSize(8);

  const infoRow = (label, value) => {
    doc.setFont("helvetica", "normal");
    doc.text(label, marginX, y);
    doc.setFontSize(8);
    drawSmartText(doc, String(value), rightX, y, {
      align: "right",
      bengaliLoaded,
      latinFamily: "helvetica",
      latinStyle: "normal",
    });
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

  doc.setFont("helvetica", "normal");
  doc.text("Status", marginX, y);
  drawBadge(doc, "Confirmed", rightX, y, [34, 197, 94]);
  y += 4.4;

  infoRow("Payment Method", order.paymentMethod || "Cash On Delivery");

  doc.setFont("helvetica", "normal");
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

  doc.setFontSize(8);

  const iconColor = [80, 80, 80];
  const iconSize = 3;
  const textX = marginX + 4.2;
  const textWidth = contentWidth - 4.2;

  const customerName = order.customerName || "-";
  drawPersonIcon(doc, marginX, y, iconSize, iconColor);
  drawSmartText(doc, customerName, textX, y, {
    align: "left",
    bengaliLoaded,
    latinFamily: "helvetica",
    latinStyle: "normal",
  });
  y += 4.2;

  doc.setFont("helvetica", "normal");
  drawPhoneIcon(doc, marginX, y, iconSize, iconColor);
  doc.text(order.phone || "-", textX, y);
  y += 4.2;

  const fullAddress = [
    order.address,
    order.thana,
    order.district,
  ].filter(Boolean).join(", ") || "-";

  // Best-effort wrapping width: uses whichever single font is set at
  // the time, which is fine for the (usually short, one-line) address.
  doc.setFont(bengaliLoaded && BENGALI_RANGE.test(fullAddress) ? "NotoSansBengali" : "helvetica", "normal");

  const addressLines = doc.splitTextToSize(fullAddress, textWidth);

  addressLines.forEach((line, idx) => {
    doc.setFontSize(8);
    if (idx === 0) {
      drawPinIcon(doc, marginX, y, iconSize, iconColor);
    }
    drawSmartText(doc, line, textX, y, {
      align: "left",
      bengaliLoaded,
      latinFamily: "helvetica",
      latinStyle: "normal",
    });
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

    const itemName = item.name || "-";

    doc.setFont(bengaliLoaded && BENGALI_RANGE.test(itemName) ? "NotoSansBengali" : "helvetica", "bold");
    doc.setFontSize(7.8);

    const nameLines = doc.splitTextToSize(itemName, contentWidth - 22);

    nameLines.forEach((line, idx) => {
      doc.setFontSize(7.8);
      drawSmartText(doc, line, marginX, y + idx * 3.4, {
        align: "left",
        bengaliLoaded,
        latinFamily: "helvetica",
        latinStyle: "bold",
      });
    });

    const priceText = `\u09F3${(item.offerPrice || item.price || 0) * (item.quantity || 1)}`;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.8);
    doc.text(String(item.quantity ?? "-"), qtyX, y, { align: "center" });

    drawSmartText(doc, priceText, priceRightX, y, {
      align: "right",
      bengaliLoaded,
      latinFamily: "helvetica",
      latinStyle: "normal",
    });

    y += nameLines.length * 3.4;

    if (item.size || item.color) {

      const sub = `${item.size || "-"}${item.color ? ` / ${item.color}` : ""}`;

      doc.setFontSize(6.8);
      doc.setTextColor(120, 120, 120);

      drawSmartText(doc, sub, marginX, y, {
        align: "left",
        bengaliLoaded,
        latinFamily: "helvetica",
        latinStyle: "normal",
      });

      doc.setTextColor(0, 0, 0);
      y += 3.4;

    }

    y += 1.4;
    doc.setDrawColor(225, 225, 225);
    doc.line(marginX, y, rightX, y);
    y += 3.2;

  });

  // ---- SUMMARY ----

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

  const totalText = `\u09F3 ${order.total ?? 0}`;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL", marginX, y);

  drawSmartText(doc, totalText, rightX, y, {
    align: "right",
    bengaliLoaded,
    latinFamily: "helvetica",
    latinStyle: "bold",
  });
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

  if (scriptLoaded) {
    doc.setFont("DancingScript", "bold");
    doc.setFontSize(17);
  } else {
    doc.setFont("times", "bolditalic");
    doc.setFontSize(13);
  }

  doc.text("Thank You!", marginX, y + 5);

  const thankWidth = doc.getTextWidth("Thank You! ");
  drawHeart(doc, marginX + thankWidth + 1.5, y + 3.6, 3.2, [236, 72, 153]);

  const forShoppingLine = `for shopping with ${storeName}`;

  doc.setFontSize(6.5);
  doc.setTextColor(90, 90, 90);
  drawSmartText(doc, forShoppingLine, marginX, y + 9, {
    align: "left",
    bengaliLoaded,
    latinFamily: "helvetica",
    latinStyle: "normal",
  });
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

  return y;

}

// Builds the 58mm invoice PDF entirely by drawing text/shapes with jsPDF
// (no DOM screenshot involved), and triggers the browser download.
//
// This renders in two passes: the first pass draws onto a throwaway
// doc just to measure the total content height, then a second doc is
// created at that exact height and the real content is drawn onto it.
// (jsPDF resolves each element's Y position relative to the page
// height *at the moment it's drawn*, so resizing a page after content
// has already been added leaves everything positioned outside the new,
// smaller page — this two-pass approach avoids that entirely.)
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

  const measureDoc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [58, 400],
  });

  const [bengaliLoaded, scriptLoaded] = await Promise.all([
    ensureBengaliFont(measureDoc),
    ensureScriptFont(measureDoc),
  ]);

  const finalHeight = renderInvoiceContent(measureDoc, {
    order,
    settings,
    qrCode,
    logoData,
    bengaliLoaded,
    scriptLoaded,
  });

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [58, finalHeight],
  });

  if (bengaliLoaded) {
    await ensureBengaliFont(doc);
  }

  if (scriptLoaded) {
    await ensureScriptFont(doc);
  }

  renderInvoiceContent(doc, {
    order,
    settings,
    qrCode,
    logoData,
    bengaliLoaded,
    scriptLoaded,
  });

  doc.save(`Invoice-${order?.id || "Order"}.pdf`);

}
