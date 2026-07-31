import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Waits for every <img> inside the given element to finish loading
// (logo, QR code, etc.) so html2canvas never snapshots a half-loaded
// frame. Each image is capped at 4s so a broken/slow logo URL can
// never hang the download.
function waitForImages(element) {

  const imgs = Array.from(element.querySelectorAll("img"));

  return Promise.all(
    imgs.map((img) => {

      if (img.complete && img.naturalWidth > 0) return Promise.resolve();

      return new Promise((resolve) => {
        const done = () => resolve();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
        setTimeout(done, 4000);
      });

    })
  );

}

// Captures the element to a canvas.
//
// html2canvas has two renderers:
//  - its default renderer re-implements the CSS box model and guesses
//    font ascent/descent/line-height itself. For bold/large text that
//    guess is often wrong, which is exactly what caused headings to
//    overlap the line below them in the exported PDF.
//  - foreignObjectRendering:true instead hands the DOM to the real
//    browser SVG renderer, so text is laid out exactly as it is on
//    screen -- no font-metric guessing, no overlap.
// Not every WebView supports it, so if it throws (or produces a
// tainted canvas that fails on toDataURL) we fall back to the
// default renderer rather than breaking the download entirely.
// foreignObjectRendering silently produces a fully blank canvas (every
// pixel 0,0,0,0 -- the untouched default state of a <canvas>) on some
// WebViews (notably Android/Capacitor) instead of throwing. No
// exception means the try/catch below never sees a failure, so the
// bad canvas would otherwise sail straight through to the PDF. Sample
// pixels across the canvas and treat "nothing was ever drawn" as a
// failure that should trigger the same fallback as a thrown error.
function isCanvasBlank(canvas) {

  const ctx = canvas.getContext("2d");
  if (!ctx) return true;

  const { width, height } = canvas;
  if (width === 0 || height === 0) return true;

  // Sampling a grid instead of the full buffer keeps this cheap even
  // at scale:3 on a tall receipt-style canvas.
  const stepX = Math.max(1, Math.floor(width / 40));
  const stepY = Math.max(1, Math.floor(height / 80));

  for (let y = 0; y < height; y += stepY) {
    const row = ctx.getImageData(0, y, width, 1).data;
    for (let x = 0; x < row.length; x += 4 * stepX) {
      if (row[x] !== 0 || row[x + 1] !== 0 || row[x + 2] !== 0 || row[x + 3] !== 0) {
        return false;
      }
    }
  }

  return true;

}

async function captureElement(element) {

  const baseOptions = {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  };

  try {

    const canvas = await html2canvas(element, {
      ...baseOptions,
      foreignObjectRendering: true,
    });

    // Tainted-canvas security errors from foreignObjectRendering only
    // surface once you try to read pixel data back out -- trigger
    // that now so we can still fall back cleanly.
    canvas.toDataURL("image/png");

    if (isCanvasBlank(canvas)) {
      throw new Error("foreignObjectRendering produced a blank canvas");
    }

    return canvas;

  } catch (e) {

    return html2canvas(element, baseOptions);

  }

}

// Renders the ACTUAL on-screen 58mm invoice DOM node to a canvas and
// embeds that image into a jsPDF document.
//
// Why this approach: the original version re-drew everything from
// scratch with jsPDF's built-in fonts, which (a) can't render Bangla
// glyphs at all (they just vanish) and (b) resized the PDF page
// *after* drawing to "trim" it, which breaks jsPDF's Y-axis (it
// flips coordinates using the page height at draw time) and produced
// a blank page. Capturing the real DOM sidesteps both problems: the
// browser renders the Bangla text and lays everything out exactly as
// shown on screen, and the PDF page is sized correctly from the
// start so nothing shifts off-page.
export async function generateInvoicePdf(order, element) {

  if (!order || !element) return;

  // Make sure webfonts (Dancing Script, Bangla-capable fallback, etc.)
  // have finished loading before snapshotting, or html2canvas can
  // capture a frame with fallback glyphs.
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      // ignore
    }
  }

  await waitForImages(element);

  const canvas = await captureElement(element);

  const imgData = canvas.toDataURL("image/png");

  const pageWidth = 58; // mm, fixed thermal-receipt width
  const pageHeight = (canvas.height * pageWidth) / canvas.width;

  // Build the PDF at its final height up front instead of resizing
  // afterward -- that's what broke it before.
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [pageWidth, pageHeight],
  });

  doc.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");

  doc.save(`Invoice-${order?.id || "Order"}.pdf`);

}
