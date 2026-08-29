import QRCode from "qrcode";

import { getSettings } from "../../services/settingsService";
import { ensureBengaliFont, loadImageAsDataURL } from "./generateInvoicePdf";

// This mirrors generateInvoicePdf.js on purpose: instead of screenshotting
// the live DOM (html2canvas), it draws the invoice from scratch onto a
// <canvas>, the same way generateInvoicePdf.js draws it from scratch onto
// a jsPDF doc. That's what keeps the downloaded PNG free of the overlap/
// clipping glitches a DOM screenshot can pick up from live page CSS.
//
// Unlike the PDF path, Bengali text needs no special image-run splicing
// here: a <canvas> 2D context already goes through the browser's real text
// shaping engine, so ctx.fillText() shapes Bengali correctly on its own.
// ensureBengaliFont() (imported from generateInvoicePdf.js) registers the
// Bengali font via the FontFace API — we just list it as a fallback family
// after the Latin font in each font string, and the browser substitutes it
// per-character automatically.

const SCRIPT_FONT_URLS = [
  "https://raw.githubusercontent.com/tetsuo55/external-google-fonts-dancing-script-/master/DancingScript-Bold.ttf",
  "https://cdn.jsdelivr.net/gh/tetsuo55/external-google-fonts-dancing-script-@master/DancingScript-Bold.ttf",
];

const SCRIPT_CANVAS_FONT = "DancingScriptCanvas";

let scriptFontFacePromise = null;

// Same mirror-list pattern as generateInvoicePdf.js's font loaders, just
// registered for canvas use via FontFace instead of jsPDF's VFS.
function ensureScriptFontCanvas() {

  if (!scriptFontFacePromise) {

    scriptFontFacePromise = (async () => {

      for (const url of SCRIPT_FONT_URLS) {

        try {

          const res = await fetch(url);

          if (!res.ok) continue;

          const buf = await res.arrayBuffer();

          if (!buf || buf.byteLength < 1000) continue;

          const fontFace = new FontFace(SCRIPT_CANVAS_FONT, buf);

          await fontFace.load();
          document.fonts.add(fontFace);

          return true;

        } catch (_e) {
          // try the next mirror
        }

      }

      return false;

    })();

  }

  return scriptFontFacePromise;

}

function loadImageEl(src) {

  return new Promise((resolve) => {

    if (!src) return resolve(null);

    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);

    img.src = src;

  });

}

// Font stacks: the desired Latin look first, Bengali fallback last — the
// browser only reaches for the Bengali family for glyphs Latin fonts lack.
const SANS = 'Helvetica, Arial, "NotoSansBengaliCanvas", sans-serif';
const SERIF = 'Georgia, "Times New Roman", "NotoSansBengaliCanvas", serif';

function roundedRectPath(ctx, x, y, w, h, r) {

  const rr = Math.max(0, Math.min(r, w / 2, h / 2));

  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  ctx.lineTo(x + rr, y + h);
  ctx.arcTo(x, y + h, x, y + h - rr, rr);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();

}

function drawPersonIcon(ctx, x, baseY, size, color) {

  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.09;

  const cx = x + size * 0.34;
  const headR = size * 0.19;

  ctx.beginPath();
  ctx.arc(cx, baseY - size * 0.72, headR, 0, Math.PI * 2);
  ctx.stroke();

  roundedRectPath(ctx, x + size * 0.02, baseY - size * 0.42, size * 0.64, size * 0.42, size * 0.18);
  ctx.stroke();

}

function drawPhoneIcon(ctx, x, baseY, size, color) {

  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.09;

  roundedRectPath(ctx, x + size * 0.18, baseY - size * 0.85, size * 0.34, size * 0.85, size * 0.12);
  ctx.stroke();

}

function drawPinIcon(ctx, x, baseY, size, color) {

  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.09;

  const r = size * 0.24;
  const cx = x + size * 0.3;
  const topY = baseY - size * 0.8;

  ctx.beginPath();
  ctx.moveTo(cx - r * 0.7, topY + r * 0.35);
  ctx.lineTo(cx + r * 0.7, topY + r * 0.35);
  ctx.lineTo(cx, baseY);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, topY, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, topY, r * 0.32, 0, Math.PI * 2);
  ctx.stroke();

}

function drawHeart(ctx, cx, cy, size, color) {

  const r = size / 4;

  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.arc(cx - r, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx + r, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx - size / 2, cy);
  ctx.lineTo(cx + size / 2, cy);
  ctx.lineTo(cx, cy + size / 2);
  ctx.closePath();
  ctx.fill();

}

// rightXPx/yPx are already scaled to canvas pixels (unlike the mm-space
// helpers below, this one is called with pixel coordinates directly since
// it needs its own font/measure pass). yPx is the baseline of the label
// text on the same row (e.g. "Status") — the pill is sized from the
// badge text's own real metrics and centered against that baseline so it
// scales correctly at any resolution instead of a fixed mm-tuned ratio.
function drawBadge(ctx, text, rightXPx, yPx, color, fontSizePx) {

  ctx.font = `bold ${fontSizePx}px ${SANS}`;

  const metrics = ctx.measureText(text);
  const ascent = metrics.actualBoundingBoxAscent || fontSizePx * 0.72;
  const descent = metrics.actualBoundingBoxDescent || fontSizePx * 0.2;
  const textWidth = metrics.width;

  const paddingX = fontSizePx * 0.4;
  const paddingY = fontSizePx * 0.3;

  const badgeWidth = textWidth + paddingX * 2;
  const badgeHeight = ascent + descent + paddingY * 2;

  // Center the pill on roughly the same vertical spot as the row label's
  // text (whose baseline is yPx, cap-height ~0.7 * its own font size).
  const rowCenterY = yPx - fontSizePx * 0.32;
  const badgeTop = rowCenterY - badgeHeight / 2;

  const x = rightXPx - badgeWidth;

  ctx.fillStyle = color;
  roundedRectPath(ctx, x, badgeTop, badgeWidth, badgeHeight, badgeHeight / 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(text, rightXPx - badgeWidth / 2, badgeTop + paddingY + ascent);

  ctx.fillStyle = "#000000";
  ctx.textAlign = "left";

}

function wrapText(ctx, text, maxWidthPx) {

  const words = String(text).split(/(\s+)/).filter((w) => w !== "");

  const lines = [];
  let current = "";

  words.forEach((word) => {

    const candidate = current + word;
    const w = ctx.measureText(candidate).width;

    if (w > maxWidthPx && current.trim()) {
      lines.push(current.trim());
      current = word.replace(/^\s+/, "");
    } else {
      current = candidate;
    }

  });

  if (current.trim()) lines.push(current.trim());

  return lines.length ? lines : [""];

}

// Draws the whole invoice onto ctx (a canvas 2D context whose canvas is
// already sized generously tall) and returns the final Y reached, in mm —
// the caller crops the canvas down to that height. Layout numbers here are
// a direct port of renderInvoiceContent() in generateInvoicePdf.js.
function renderInvoiceContent(ctx, { order, settings, qrImg, logoImg, scriptLoaded }, S) {

  const mm = (v) => v * S;
  const measureMm = (text) => ctx.measureText(text).width / S;

  // Font sizes below are given in the same "point" numbers
  // generateInvoicePdf.js passes to doc.setFontSize() (jsPDF font sizes
  // are always points, never the document's mm unit) — so they need a
  // pt→mm conversion before the mm→px scale, unlike every other number
  // in this layout, which is already in real mm and just needs mm().
  const PT_TO_MM = 0.352778;
  const fontPx = (pt) => pt * PT_TO_MM * S;

  const pageWidth = 58;
  const marginX = 4;
  const contentWidth = pageWidth - marginX * 2;
  const rightX = pageWidth - marginX;

  const hLine = (yMm, color = "#d2d2d2") => {
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, S * 0.08);
    ctx.beginPath();
    ctx.moveTo(mm(marginX), mm(yMm));
    ctx.lineTo(mm(rightX), mm(yMm));
    ctx.stroke();
  };

  ctx.fillStyle = "#000000";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  let y = marginX;

  // ---- LOGO + STORE NAME ----

  const headerTextX = logoImg ? marginX + 11 : pageWidth / 2;
  const headerAlign = logoImg ? "left" : "center";

  if (logoImg) {
    ctx.drawImage(logoImg, mm(marginX), mm(y), mm(9), mm(9));
  }

  const storeName = settings.storeName || "Dream Mode";

  ctx.font = `bold ${fontPx(13)}px ${SERIF}`;
  ctx.textAlign = headerAlign;
  ctx.fillText(storeName, mm(headerTextX), mm(y + 4.5));

  ctx.font = `${fontPx(6.3)}px ${SANS}`;
  ctx.fillStyle = "#5a5a5a";
  ctx.fillText("Dress Your Dream, Live Your Style", mm(headerTextX), mm(y + 8));
  ctx.fillStyle = "#000000";
  ctx.textAlign = "left";

  y += 10.5;

  // ---- INVOICE / MEMO BAR ----

  ctx.font = `bold ${fontPx(8.5)}px ${SANS}`;

  const barLabel = "INVOICE / MEMO";
  const barPaddingX = 3;
  const barWidth = measureMm(barLabel) + barPaddingX * 2;
  const barHeight = 5;
  const barX = pageWidth / 2 - barWidth / 2;

  ctx.fillStyle = "#000000";
  ctx.fillRect(mm(barX), mm(y), mm(barWidth), mm(barHeight));

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(barLabel, mm(pageWidth / 2), mm(y + barHeight / 2 + 1));
  ctx.fillStyle = "#000000";
  ctx.textAlign = "left";

  y += barHeight + 3;

  // ---- INFO ROWS ----

  const infoRow = (label, value) => {
    ctx.font = `${fontPx(8)}px ${SANS}`;
    ctx.textAlign = "left";
    ctx.fillText(label, mm(marginX), mm(y));
    ctx.textAlign = "right";
    ctx.fillText(String(value), mm(rightX), mm(y));
    ctx.textAlign = "left";
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

  ctx.font = `${fontPx(8)}px ${SANS}`;
  ctx.fillText("Status", mm(marginX), mm(y));
  drawBadge(ctx, "Confirmed", mm(rightX), mm(y), "#22c55e", fontPx(7.5));
  y += 4.4;

  infoRow("Payment Method", order.paymentMethod || "Cash On Delivery");

  ctx.font = `${fontPx(8)}px ${SANS}`;
  ctx.fillText("Payment Status", mm(marginX), mm(y));
  drawBadge(
    ctx,
    order.paymentStatus || "Pending",
    mm(rightX),
    mm(y),
    order.paymentStatus === "Paid" ? "#22c55e" : "#eab308",
    fontPx(7.5)
  );
  y += 4.4;

  y += 1;
  hLine(y);
  y += 4;

  // ---- CUSTOMER ----

  ctx.font = `bold ${fontPx(9)}px ${SERIF}`;
  ctx.fillText("Customer", mm(marginX), mm(y));
  y += 4.2;

  const iconColor = "#505050";
  const iconSize = 3;
  const textX = marginX + 4.2;
  const textWidth = contentWidth - 4.2;

  const customerName = order.customerName || "-";
  drawPersonIcon(ctx, mm(marginX), mm(y), mm(iconSize), iconColor);
  ctx.font = `${fontPx(8)}px ${SANS}`;
  ctx.fillText(customerName, mm(textX), mm(y));
  y += 4.2;

  drawPhoneIcon(ctx, mm(marginX), mm(y), mm(iconSize), iconColor);
  ctx.font = `${fontPx(8)}px ${SANS}`;
  ctx.fillText(order.phone || "-", mm(textX), mm(y));
  y += 4.2;

  const fullAddress = [
    order.address,
    order.thana,
    order.district,
  ].filter(Boolean).join(", ") || "-";

  ctx.font = `${fontPx(8)}px ${SANS}`;
  const addressLines = wrapText(ctx, fullAddress, mm(textWidth));

  addressLines.forEach((line, idx) => {
    if (idx === 0) {
      drawPinIcon(ctx, mm(marginX), mm(y), mm(iconSize), iconColor);
    }
    ctx.font = `${fontPx(8)}px ${SANS}`;
    ctx.fillText(line, mm(textX), mm(y));
    y += 4;
  });

  y += 1;
  hLine(y);
  y += 4;

  // ---- PRODUCTS ----

  ctx.font = `bold ${fontPx(9)}px ${SERIF}`;
  ctx.fillText("Products", mm(marginX), mm(y));
  y += 4.2;

  const qtyX = marginX + 34;
  const priceRightX = rightX;

  ctx.font = `bold ${fontPx(7.5)}px ${SANS}`;
  ctx.textAlign = "left";
  ctx.fillText("Item", mm(marginX), mm(y));
  ctx.textAlign = "center";
  ctx.fillText("Qty", mm(qtyX), mm(y));
  ctx.textAlign = "right";
  ctx.fillText("Price", mm(priceRightX), mm(y));
  ctx.textAlign = "left";
  y += 1.5;

  hLine(y);
  y += 3.6;

  (order.items || []).forEach((item) => {

    const itemName = item.name || "-";

    ctx.font = `bold ${fontPx(7.8)}px ${SANS}`;
    const nameLines = wrapText(ctx, itemName, mm(contentWidth - 22));

    nameLines.forEach((line, idx) => {
      ctx.font = `bold ${fontPx(7.8)}px ${SANS}`;
      ctx.fillText(line, mm(marginX), mm(y + idx * 3.4));
    });

    const priceText = `\u09F3${(item.offerPrice || item.price || 0) * (item.quantity || 1)}`;

    ctx.font = `${fontPx(7.8)}px ${SANS}`;
    ctx.textAlign = "center";
    ctx.fillText(String(item.quantity ?? "-"), mm(qtyX), mm(y));
    ctx.textAlign = "right";
    ctx.fillText(priceText, mm(priceRightX), mm(y));
    ctx.textAlign = "left";

    y += nameLines.length * 3.4;

    if (item.size || item.color) {

      const sub = `${item.size || "-"}${item.color ? ` / ${item.color}` : ""}`;

      ctx.font = `${fontPx(6.8)}px ${SANS}`;
      ctx.fillStyle = "#787878";
      ctx.fillText(sub, mm(marginX), mm(y));
      ctx.fillStyle = "#000000";

      y += 3.4;

    }

    y += 1.4;
    hLine(y, "#e1e1e1");
    y += 3.2;

  });

  // ---- SUMMARY ----

  ctx.font = `${fontPx(8)}px ${SANS}`;

  infoRow("Subtotal", `\u09F3 ${order.subtotal || order.total || 0}`);
  infoRow("Delivery", `\u09F3 ${order.deliveryCharge || 0}`);

  if ((order.discount || 0) > 0) {
    infoRow("Discount", `- \u09F3 ${order.discount}`);
  }

  y += 1;
  hLine(y);
  y += 5;

  // ---- TOTAL ----

  const totalText = `\u09F3 ${order.total ?? 0}`;

  ctx.font = `bold ${fontPx(12)}px ${SANS}`;
  ctx.textAlign = "left";
  ctx.fillText("TOTAL", mm(marginX), mm(y));
  ctx.textAlign = "right";
  ctx.fillText(totalText, mm(rightX), mm(y));
  ctx.textAlign = "left";
  y += 3;

  hLine(y);
  y += 5;

  // ---- STORE CONTACT ----

  ctx.font = `${fontPx(7.5)}px ${SANS}`;

  if (settings.phone) {
    ctx.textAlign = "center";
    ctx.fillText(`Contact Us: ${settings.phone}`, mm(pageWidth / 2), mm(y));
    ctx.textAlign = "left";
    y += 3.6;
  }

  if (settings.facebook) {

    ctx.font = `${fontPx(7.5)}px ${SANS}`;
    const fbLines = wrapText(ctx, settings.facebook, mm(contentWidth));

    fbLines.forEach((line) => {
      ctx.textAlign = "center";
      ctx.fillText(line, mm(pageWidth / 2), mm(y));
      ctx.textAlign = "left";
      y += 3.4;
    });

  }

  y += 3;

  // ---- THANK YOU + QR ----

  const qrSize = 14;
  const qrX = rightX - qrSize;
  const qrY = y;

  if (scriptLoaded) {
    ctx.font = `${fontPx(17)}px "${SCRIPT_CANVAS_FONT}", cursive`;
  } else {
    ctx.font = `bold italic ${fontPx(13)}px Georgia, serif`;
  }

  ctx.fillText("Thank You!", mm(marginX), mm(y + 5));

  const thankWidth = measureMm("Thank You! ");
  drawHeart(ctx, mm(marginX + thankWidth + 1.5), mm(y + 3.6), mm(3.2), "#ec4899");

  const forShoppingLine = `for shopping with ${storeName}`;

  ctx.font = `${fontPx(6.5)}px ${SANS}`;
  ctx.fillStyle = "#5a5a5a";
  ctx.fillText(forShoppingLine, mm(marginX), mm(y + 9));
  ctx.fillStyle = "#000000";

  if (qrImg) {
    ctx.drawImage(qrImg, mm(qrX), mm(qrY), mm(qrSize), mm(qrSize));
  }

  y = Math.max(y + 12, qrY + qrSize);
  y += marginX;

  return y;

}

// Builds the 58mm invoice as a PNG entirely by drawing onto a <canvas>
// (no DOM screenshot involved — same principle as generateInvoicePdf.js),
// and triggers the browser download.
//
// Single-pass + crop: canvas text measurement doesn't depend on the
// canvas's own height, so content is drawn once onto a generously tall
// canvas while tracking the real final Y, then that Y is used to crop a
// properly-sized output canvas from it — no separate measuring pass needed
// the way the PDF path requires (jsPDF page height DOES affect draws there).
export async function generateInvoiceImage(order) {

  if (!order) return;

  const settings = (await getSettings()) || {};

  const qrValue =
    settings.websiteUrl ||
    settings.facebook ||
    window.location.origin;

  const [qrDataUrl, logoDataUrl, , scriptLoaded] = await Promise.all([
    QRCode.toDataURL(qrValue),
    loadImageAsDataURL(settings.logoUrl),
    ensureBengaliFont(),
    ensureScriptFontCanvas(),
  ]);

  const [qrImg, logoImg] = await Promise.all([
    loadImageEl(qrDataUrl),
    loadImageEl(logoDataUrl),
  ]);

  const S = 16; // px per mm — supersampled for a crisp, print-quality PNG
  const pageWidthMm = 58;
  const tempHeightMm = 500; // generous upper bound, cropped down afterward

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = Math.round(pageWidthMm * S);
  tempCanvas.height = Math.round(tempHeightMm * S);

  const ctx = tempCanvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  const finalYmm = renderInvoiceContent(ctx, {
    order,
    settings,
    qrImg,
    logoImg,
    scriptLoaded,
  }, S);

  const finalHeightPx = Math.min(
    tempCanvas.height,
    Math.ceil(finalYmm * S)
  );

  const outCanvas = document.createElement("canvas");
  outCanvas.width = tempCanvas.width;
  outCanvas.height = finalHeightPx;

  const outCtx = outCanvas.getContext("2d");
  outCtx.fillStyle = "#ffffff";
  outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);
  outCtx.drawImage(
    tempCanvas,
    0, 0, outCanvas.width, finalHeightPx,
    0, 0, outCanvas.width, finalHeightPx
  );

  const link = document.createElement("a");
  link.download = `Invoice-${order?.id || "Order"}.png`;
  link.href = outCanvas.toDataURL("image/png");
  link.click();

}
