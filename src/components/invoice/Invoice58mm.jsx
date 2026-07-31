import { FiPhone, FiMapPin, FiUser } from "react-icons/fi";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { getSettings } from "../../services/settingsService";

// Load a script/handwriting font for the "Thank You" line
if (typeof document !== "undefined" && !document.getElementById("dm-thankyou-font")) {
  const link = document.createElement("link");
  link.id = "dm-thankyou-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap";
  document.head.appendChild(link);
}

export default function Invoice58mm({ order }) {

  const [settings, setSettings] = useState({
    storeName: "",
    logoUrl: "",
    phone: "",
    facebook: "",
    websiteUrl: "",
  });

  const [qrCode, setQrCode] = useState("");

  useEffect(() => {

    async function load() {

      const data = await getSettings();

      setSettings(data || {});

      const qrValue =
        data?.websiteUrl ||
        data?.facebook ||
        window.location.origin;

      const qr = await QRCode.toDataURL(qrValue);

      setQrCode(qr);

    }

    load();

  }, []);

  if (!order) return null;


  return (

    <div
      id="invoice58mm"
      className="
      bg-white
      mx-auto
      text-black
      p-2
      "
      style={{
        width: "58mm",
        minWidth: "58mm",
        maxWidth: "58mm",
        fontSize: "11px",
        lineHeight: 1.4,
      }}
    >


            {/* LOGO + STORE */}

      <div className="flex items-center justify-center gap-1.5">

        {settings.logoUrl && (
          <img
            src={settings.logoUrl}
            alt={settings.storeName}
            crossOrigin="anonymous"
            className="w-11 h-11 object-contain shrink-0"
          />
        )}

        <div className="text-left min-w-0 flex-1">

          <h1
            className="
            text-[17px]
            font-black
            tracking-wide
            uppercase
            leading-tight
            whitespace-nowrap
            "
          >
            {settings.storeName}
          </h1>

          <p
            className="
            text-[8px]
            text-gray-600
            whitespace-nowrap
            overflow-hidden
            text-ellipsis
            "
          >
            Dress Your Dream, Live Your Style
          </p>

        </div>

      </div>

      {/* INVOICE TITLE */}

      <div className="my-1.5 flex justify-center">

        <div
          className="
          bg-black
          text-white
          px-4
          py-0.5
          text-[11px]
          font-bold
          tracking-wide
          "
        >
          INVOICE / MEMO
        </div>

      </div>

      {/* INFO */}

      <div className="space-y-1 text-[11px]">

        <div className="flex justify-between gap-2">
          <span>Invoice No</span>
          <span>
            DM-
            {String(order.id || "")
              .slice(0,8)
              .toUpperCase()}
          </span>
        </div>

        <div className="flex justify-between gap-2">
          <span>Date</span>

          <span>
            {new Date(
              order.createdAt
            ).toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between gap-2">

          <span>Status</span>

          <span
            className="
            px-2
            rounded-full
            text-white
            text-[10px]
            bg-green-500
            "
          >
            Confirmed
          </span>

        </div>

        <div className="flex justify-between gap-2">
          <span>Payment Method</span>
          <span>
            {order.paymentMethod || "Cash On Delivery"}
          </span>
        </div>

        <div className="flex justify-between gap-2">

          <span>Payment Status</span>

          <span
            className={`
            px-2
            rounded-full
            text-white
            text-[10px]
            ${
              order.paymentStatus === "Paid"
                ? "bg-green-500"
                : "bg-yellow-500"
            }
            `}
          >
            {order.paymentStatus || "Pending"}
          </span>

        </div>

      </div>

      <hr className="my-1.5" />

      {/* CUSTOMER */}

      <h2 className="font-bold mb-1">
        Customer
      </h2>

      <div className="space-y-1 text-[11px]">

        <div className="flex gap-2 items-center">

          <FiUser size={13}/>

          <span>{order.customerName}</span>

        </div>

        <div className="flex gap-2 items-center">

          <FiPhone size={13}/>

          <span>{order.phone}</span>

        </div>

        <div className="flex gap-2 items-start">

          <FiMapPin
            size={13}
            className="mt-0.5"
          />

          <span>
            {order.address}
            {order.thana ? `, ${order.thana}` : ""}
            {order.district ? `, ${order.district}` : ""}
          </span>

        </div>

      </div>

      <hr className="my-1.5" />

            {/* PRODUCTS */}

      <h2 className="font-bold mb-1">
        Products
      </h2>

      <table className="w-full text-[10px]">

        <thead>

          <tr className="border-b">

            <th className="text-left py-1">
              Item
            </th>

            <th className="text-center py-1">
              Qty
            </th>

            <th className="text-right py-1">
              Price
            </th>

          </tr>

        </thead>

        <tbody>

          {order.items?.map((item,index)=>(

            <tr
              key={item.id || index}
              className="border-b"
            >

              <td className="py-1">

                <div className="font-semibold">
                  {item.name}
                </div>

                {(item.size || item.color) && (

                  <div className="text-[9px] text-gray-500">

                    {item.size || "-"}

                    {item.color
                      ? ` / ${item.color}`
                      : ""}

                  </div>

                )}

              </td>

              <td className="text-center">
                {item.quantity}
              </td>

              <td className="text-right">

                ৳
                {(item.offerPrice || item.price || 0) *
                  item.quantity}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <hr className="my-1.5" />

      {/* SUMMARY */}

      <div className="space-y-1 text-[11px]">

        <div className="flex justify-between">

          <span>
            Subtotal
          </span>

          <span>
            ৳ {order.subtotal || order.total}
          </span>

        </div>

        <div className="flex justify-between">

          <span>
            Delivery
          </span>

          <span>
            ৳ {order.deliveryCharge || 0}
          </span>

        </div>

        {(order.discount || 0) > 0 && (

          <div className="flex justify-between">

            <span>
              Discount
            </span>

            <span>
              - ৳ {order.discount}
            </span>

          </div>

        )}

      </div>

      <hr className="my-1.5" />

      <div className="flex justify-between font-black text-[14px]">

        <span>
          TOTAL
        </span>

        <span>
          ৳ {order.total}
        </span>

      </div>

      <hr className="my-1.5" />

            {/* STORE CONTACT */}

      <div className="text-center text-[10px] space-y-0.5">

        {settings.phone && (
          <p>
            Contact Us: {settings.phone}
          </p>
        )}

        {settings.facebook && (
          <p className="break-all">
            {settings.facebook}
          </p>
        )}

      </div>

      {/* THANK YOU + QR */}

      <div className="flex items-center justify-between mt-2">

        <div>
          <p
            className="text-[16px]"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Thank You! <span className="text-pink-500">♥</span>
          </p>

          <p className="text-[9px] text-gray-600">
            for shopping with {settings.storeName || "Dream Mode"}
          </p>
        </div>

        {qrCode && (
          <img
            src={qrCode}
            alt="QR"
            className="w-14 h-14"
          />
        )}

      </div>

    </div>

  );

}
