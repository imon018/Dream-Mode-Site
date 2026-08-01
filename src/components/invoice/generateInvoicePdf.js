import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Turns an already-rendered Invoice58mm DOM node into a downloadable PDF
// by screenshotting it (html2canvas) and embedding that screenshot as a
// full-page image (jsPDF addImage).
//
// Why a screenshot instead of drawing text with jsPDF directly:
// jsPDF has no complex-script text shaping, so Bengali conjuncts/matras
// render as disconnected, broken glyphs (see generateInvoicePdf.js).
// The browser itself renders Bengali correctly, so capturing the actual
// rendered element sidesteps the problem entirely — whatever the user
// sees on screen is exactly what ends up in the PDF.
//
// `element` must already be mounted in the DOM (e.g. the hidden node
// used for printing, or the one shown in a "View Invoice" modal) and
// should already have its QR code loaded (Invoice58mm loads it async).
export async function generateInvoicePdfFromElement(element, order) {

  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  const pageWidthMm = 58;

  const pageHeightMm =
    (canvas.height / canvas.width) * pageWidthMm;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [pageWidthMm, pageHeightMm],
  });

  doc.addImage(
    imgData,
    "PNG",
    0,
    0,
    pageWidthMm,
    pageHeightMm
  );

  doc.save(`Invoice-${order?.id || "Order"}.pdf`);

}
