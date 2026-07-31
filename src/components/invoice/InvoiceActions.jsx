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

    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: "#ffffff",
      useCORS: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
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
        style={{
          position: "fixed",
          top: 0,
          left: "-9999px",
          zIndex: -1,
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
