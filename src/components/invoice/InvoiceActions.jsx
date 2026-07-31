import { useRef } from "react";
import { FiEye, FiPrinter, FiDownload } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import Invoice58mm from "./Invoice58mm";

export default function InvoiceActions({ order }) {

  const invoiceRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${order?.id || "Order"}`,
  });

  const handleDownload = async () => {

    const element = invoiceRef.current;

    if (!element) return;

    // Make sure all images (logo, QR) and web fonts have
    // fully finished loading before we snapshot the element,
    // otherwise html2canvas can capture it mid-layout and
    // produce overlapping/cut-off text.
    const images = Array.from(element.querySelectorAll("img"));

    await Promise.all(
      images.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            })
      )
    );

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    // Two animation frames to let the browser finish a layout pass
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [58, canvas.height * 58 / canvas.width],
    });

    const pdfHeight =
      canvas.height * 58 / canvas.width;

    pdf.addImage(
      img,
      "PNG",
      0,
      0,
      58,
      pdfHeight
    );

    pdf.save(
      `Invoice-${order?.id || "Order"}.pdf`
    );

  };

  return (

    <>

      <div
        className="
        flex
        gap-2
        mt-4
        "
      >

        <button
          onClick={() => {

            document
              .getElementById("invoice58mm")
              ?.scrollIntoView({
                behavior: "smooth",
              });

          }}
          className="
          flex-1
          h-11
          rounded-xl
          bg-slate-700
          text-white
          font-bold
          flex
          items-center
          justify-center
          gap-2
          "
        >

          <FiEye />

          View

        </button>

        <button
          onClick={handlePrint}
          className="
          flex-1
          h-11
          rounded-xl
          bg-amber-500
          text-white
          font-bold
          flex
          items-center
          justify-center
          gap-2
          "
        >

          <FiPrinter />

          Print

        </button>

        <button
          onClick={handleDownload}
          className="
          flex-1
          h-11
          rounded-xl
          bg-emerald-600
          text-white
          font-bold
          flex
          items-center
          justify-center
          gap-2
          "
        >

          <FiDownload />

          PDF

        </button>

      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "hidden",
          width: 0,
          height: 0,
        }}
      >

        <div ref={invoiceRef}>

          <Invoice58mm
            order={order}
          />

        </div>

      </div>

    </>

  );

}
