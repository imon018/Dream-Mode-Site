import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FiHome,
  FiFileText,
  FiMap,
  FiMapPin,
  FiUser,
  FiPhone,
  FiX,
  FiGift,
  FiCreditCard,
  FiChevronDown,
  FiChevronUp,
  FiTruck,
  FiShield,
  FiCheckCircle,
  FiThumbsUp,
  FiZap,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import {
  FaFacebookMessenger,
  FaWhatsapp,
} from "react-icons/fa";


import SEO from "../seo/SEO";

import {
  getLandingPageBySlug,
  incrementLandingOrders,
} from "../services/landingPageService";

import { createOrder } from "../services/orderService";

import {
  errorToast,
} from "../components/ui/Toast";

import RelatedProducts from "../components/RelatedProducts";

import useSettings from "../hooks/useSettings";


const MESSENGER_LINK = "https://m.me/61560486613695";

const BKASH_NUMBER = "01628464209";
const NAGAD_NUMBER = "01628464209";


export default function PublicLandingPage(){



const navigate = useNavigate();

const { slug } = useParams();

const { settings } = useSettings();

const [landing,setLanding] = useState(null);

const [loading,setLoading] = useState(true);

const [ordering, setOrdering] = useState(false);

const [quantity,setQuantity] = useState(1);

const [deliveryCharge, setDeliveryCharge] = useState(80);

// ---------- PAYMENT METHOD ----------

const [paymentOpen, setPaymentOpen] = useState(true);

const [paymentMethod, setPaymentMethod] = useState("COD");

const [bkashNumber, setBkashNumber] = useState("");
const [bkashTransactionId, setBkashTransactionId] = useState("");

const [nagadNumber, setNagadNumber] = useState("");
const [nagadTransactionId, setNagadTransactionId] = useState("");

const [activeImage,setActiveImage] = useState(null);

const [fullscreen,setFullscreen] = useState(false);

const [formData, setFormData] = useState({

  name: "",
  phone: "",
  address: "",
  thana: "",
  district: "",
  notes: "",
});

// ---------- AUTO DELIVERY CHARGE BY DISTRICT ----------
// If the customer types a district other than Dhaka, switch the
// delivery charge to the "Outside Dhaka" rate automatically. If
// they type Dhaka (or clear the field), switch back to the
// "Dhaka City" rate. A manual pick from the dropdown still works
// normally since this only reacts to district changes.

useEffect(() => {

  const district = formData.district.trim().toLowerCase();

  if (!district) return;

  const isDhaka =
    district.includes("dhaka") ||
    district.includes("ঢাকা");

  setDeliveryCharge(isDhaka ? 80 : 150);

}, [formData.district]);

// Moved above the early return, and memoized so it doesn't
// produce a brand-new array reference on every render.
const images = useMemo(() => {

  if (!landing) return [];

  return landing.heroImages?.length
    ? landing.heroImages
    : landing.heroImage
    ? [landing.heroImage]
    : [];

}, [landing]);


  

useEffect(() => {

  async function loadLanding() {
    setLoading(true);

    try {

      const data =
        await getLandingPageBySlug(slug);

      if (!data) {

        setLanding(null);

        return;

      }

      setLanding(data);

      const imgs =
        data.heroImages?.length
          ? data.heroImages
          : data.heroImage
          ? [data.heroImage]
          : [];

      if (imgs.length) {

        setActiveImage(imgs[0]);

      }

    }

    catch (error) {

  console.log(error);

}

finally {

  setLoading(false);

}

}

loadLanding();

}, [slug]);

  

  useEffect(() => {
  if (images.length <= 1) return;

  const interval = setInterval(() => {
    setActiveImage((prev) => {
      const currentIndex = images.indexOf(prev || images[0]);
      const nextIndex = (currentIndex + 1) % images.length;
      return images[nextIndex];
    });
  }, 3000);

  return () => clearInterval(interval);
}, [images]);



if (loading) {

  return (

    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[#FAF7F2]
      "
    >

      <div className="flex flex-col items-center gap-4">

        <div
          className="
          w-12 h-12
          rounded-full
          border-4
          border-purple-200
          border-t-purple-600
          animate-spin
          "
        />

        <div
          className="
          text-base
          font-bold
          text-purple-700
          "
        >
          লোড হচ্ছে...
        </div>

      </div>

    </div>

  );

}


  
if(!landing){


return (

<div
className="
min-h-screen
flex
items-center
justify-center
bg-gray-100
px-5
"
>

<div
className="
bg-white
rounded-2xl
p-10
shadow-xl
text-center
max-w-sm
w-full
"
>

<div className="text-5xl mb-4">😕</div>

<h2
className="
text-xl
font-bold
text-gray-800
"
>

Landing Page পাওয়া যায়নি

</h2>

<p className="text-gray-500 text-sm mt-2">
দুঃখিত, এই পেজটি খুঁজে পাওয়া যায়নি অথবা এটি সরিয়ে ফেলা হয়েছে।
</p>


</div>


</div>

);


}





const discount =

landing.offerPrice > 0 &&
landing.price > 0

?

Math.round(

(

(landing.price - landing.offerPrice)

/

landing.price

)

*100

)

:

0;


// এই ল্যান্ডিং পেজে যদি themeColor সেট করা না থাকে (পুরাতন ল্যান্ডিং পেজ)
// তাহলে আগের ডিফল্ট বেগুনী (purple-700) কালারই ব্যবহার হবে,
// যাতে বিদ্যমান পেজের UI ভেঙে না যায়।
// themeMode === "gradient" হলে দুইটা কালার মিক্স করে gradient দেখানো হবে।

const themeColor =
  landing.themeColor || "#7e22ce";

const isGradientTheme =
  landing.themeMode === "gradient" &&
  landing.themeColorTo;

const gradientCSS =
  isGradientTheme
    ? `linear-gradient(${landing.themeGradientDirection || "to right"}, ${themeColor}, ${landing.themeColorTo})`
    : null;

// ব্যাকগ্রাউন্ড হিসেবে ব্যবহারের জন্য (যেমন ব্যানার, চেকমার্ক বৃত্ত, বাটন)

const themeBgStyle =
  isGradientTheme
    ? { backgroundImage: gradientCSS }
    : { backgroundColor: themeColor };

// টেক্সট কালার হিসেবে ব্যবহারের জন্য (গ্রেডিয়েন্ট হলে gradient text)

const themeTextStyle =
  isGradientTheme
    ? {
        backgroundImage: gradientCSS,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }
    : { color: themeColor };

// hex কালারকে rgba-তে রূপান্তর করার জন্য (হালকা টিন্ট ব্যাকগ্রাউন্ড/বর্ডার/ফোকাস রিং-এর জন্য)

const themeAlpha = (alpha) => {

  const hex =
    themeColor.replace("#","");

  const normalized =
    hex.length === 3
      ? hex.split("").map(c=>c+c).join("")
      : hex;

  const value =
    parseInt(normalized, 16);

  if (isNaN(value)) {
    return `rgba(126, 34, 206, ${alpha})`;
  }

  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;

};

const handleThemeFocus = (e) => {

  e.target.style.borderColor = themeColor;
  e.target.style.boxShadow =
    `0 0 0 3px ${themeAlpha(0.18)}`;

};

const handleThemeBlur = (e) => {

  e.target.style.borderColor = "";
  e.target.style.boxShadow = "";

};


const handleChange = (e) => {

  const { name, value } = e.target;

  setFormData((prev) => ({

    ...prev,

    [name]: value,

  }));

};
  


  const productPrice =
  landing.offerPrice > 0
    ? landing.offerPrice
    : landing.price;

const subTotal =
  productPrice * quantity;

const total =
  subTotal + deliveryCharge;


  

const formattedText = (text)=>{


if(!text)

return "";



return text
.replace(/\\n/g,"\n");


};

// থাম্বনেইলের ইনডেক্স ধরে আগের/পরের ছবিতে যাওয়ার জন্য

const goToImage = (direction) => {

  if (images.length <= 1) return;

  const currentIndex =
    images.indexOf(activeImage || images[0]);

  const nextIndex =
    direction === "next"
      ? (currentIndex + 1) % images.length
      : (currentIndex - 1 + images.length) % images.length;

  setActiveImage(images[nextIndex]);

};

const scrollToOrderForm = () => {

  const el = document.getElementById("order-form-section");

  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

};

const heroDescLines =
  formattedText(landing.heroDescription)
    .split("\n")
    .filter((line) => line.trim().length > 0);


const submitOrder = async () => {

if(
  paymentMethod === "bKash" &&
  (!bkashNumber || !bkashTransactionId)
){

  errorToast(
    "অনুগ্রহ করে আপনার বিকাশ নম্বর ও ট্রানজেকশন আইডি দিন"
  );

  return;

}

if(
  paymentMethod === "Nagad" &&
  (!nagadNumber || !nagadTransactionId)
){

  errorToast(
    "অনুগ্রহ করে আপনার নগদ নম্বর ও ট্রানজেকশন আইডি দিন"
  );

  return;

}

if (landing.orderForm?.collectName && !formData.name.trim()) {
  errorToast("অনুগ্রহ করে আপনার নাম দিন");
  return;
}

if (landing.orderForm?.collectPhone && !formData.phone.trim()) {
  errorToast("অনুগ্রহ করে আপনার ফোন নাম্বার দিন");
  return;
}

if (landing.orderForm?.collectAddress && !formData.address.trim()) {
  errorToast("অনুগ্রহ করে আপনার ঠিকানা দিন");
  return;
}

setOrdering(true);

try {

const orderData = {

title:
landing.title,


heroImages:
images,


price:
landing.offerPrice > 0
?
landing.offerPrice
:
landing.price,


regularPrice:
landing.price,


quantity,

slug,

customer: formData,

landingId: landing.id,

deliveryCharge: deliveryCharge,

total: total,

  };
  



  const orderId = await createOrder({
  landingId: landing.id,
  landingSlug: slug,

  customerName: formData.name,
  phone: formData.phone,
  address: formData.address,
  thana: formData.thana,
  district: formData.district,
  notes: formData.notes,

  productName: landing.title,
  title: landing.title,
  heroImages: images,
  items: [
  {
    productId: landing.productId || "",
    id: landing.productId || "",
    name: landing.title,
    image: images[0] || "",
    quantity,
    price: orderData.price,
  },
],
  slug: slug,
  quantity,

  price: orderData.price,
  regularPrice: orderData.regularPrice,

  deliveryCharge: orderData.deliveryCharge,
  total: orderData.total,

  status: "Pending",

  paymentMethod,

  paymentStatus:
  (paymentMethod === "bKash" || paymentMethod === "Nagad")
  ?
  "Paid"
  :
  "Pending",

  paymentDetails:
  paymentMethod === "bKash"
  ?
  {
    accountNumber: bkashNumber,
    transactionId: bkashTransactionId,
  }
  :
  paymentMethod === "Nagad"
  ?
  {
    accountNumber: nagadNumber,
    transactionId: nagadTransactionId,
  }
  :
  null,

  createdAt: new Date().toISOString(),
});

await incrementLandingOrders(
  landing.id,
  orderData.total
);

orderData.orderId = orderId;



navigate(`/landing/${slug}/success/${orderId}`);

} catch (error) {

  console.error(error);

  setOrdering(false);

}

};


return (
<>
  <SEO
    title={landing.title}
    description={
      landing.description ||
      landing.heroDescription ||
      `${landing.title} available at ${landing.storeName || settings?.storeName || ""}.`
    }
    image={
      landing.heroImages?.[0] ||
      landing.heroImage
    }
    url={`/landing/${landing.slug}`}
    type="product"
    product={{
      id: landing.id,
      name: landing.title,
      description:
        landing.description ||
        landing.heroDescription,
      images:
        landing.heroImages,
      image:
        landing.heroImage,
      price:
        landing.offerPrice > 0
          ? landing.offerPrice
          : landing.price,
      stock: 999
    }}
  />

<div className="min-h-screen bg-[#FAF7F2] pb-24 lg:pb-0">


  {/* ============ TOP ANNOUNCEMENT BAR ============ */}

  <div
    style={themeBgStyle}
    className="
    text-white
    h-10
    px-3
    flex
    items-center
    justify-center
    gap-2
    text-xs
    sm:text-sm
    font-semibold
    whitespace-nowrap
    overflow-hidden
    "
  >
    <FiGift className="text-base shrink-0" />
    <span>আজই অর্ডার করুন, ক্যাশ অন ডেলিভারি সুবিধা সহ!</span>
  </div>


  {/* ============ HERO SECTION (Gallery + Info) ============ */}

  <div className="max-w-6xl mx-auto lg:px-6 lg:pt-8">

    <div className="lg:grid lg:grid-cols-5 lg:gap-10">

      {/* ---------- IMAGE GALLERY ---------- */}

      <div className="lg:col-span-2">

        <div className="lg:sticky lg:top-6">

          <div className="relative bg-white lg:rounded-2xl lg:shadow-md overflow-hidden">

            {
              images.length > 0 && (

                <>

                  <img
                    src={activeImage || images[0]}
                    alt={landing.title}
                    onClick={() => setFullscreen(true)}
                    className="
                    w-full
                    aspect-square
                    object-cover
                    cursor-zoom-in
                    "
                  />

                  {
                    images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => goToImage("prev")}
                          aria-label="আগের ছবি"
                          className="
                          hidden
                          sm:flex
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          w-9
                          h-9
                          rounded-full
                          bg-white/90
                          shadow
                          items-center
                          justify-center
                          text-gray-700
                          hover:bg-white
                          "
                        >
                          <FiChevronLeft />
                        </button>

                        <button
                          type="button"
                          onClick={() => goToImage("next")}
                          aria-label="পরের ছবি"
                          className="
                          hidden
                          sm:flex
                          absolute
                          right-3
                          top-1/2
                          -translate-y-1/2
                          w-9
                          h-9
                          rounded-full
                          bg-white/90
                          shadow
                          items-center
                          justify-center
                          text-gray-700
                          hover:bg-white
                          "
                        >
                          <FiChevronRight />
                        </button>
                      </>
                    )
                  }

                  {
                    discount > 0 && (

                      <div
                        style={themeBgStyle}
                        className="
                        absolute
                        top-3
                        left-3
                        z-20
                        text-white
                        rounded-full
                        w-14
                        h-14
                        flex
                        flex-col
                        items-center
                        justify-center
                        shadow-lg
                        border-2
                        border-white
                        "
                      >
                        <span className="text-sm font-black leading-none">
                          {discount}%
                        </span>
                        <span className="text-[9px] font-bold leading-none mt-0.5">
                          OFF
                        </span>
                      </div>

                    )
                  }

                </>

              )
            }

          </div>

          {/* THUMBNAILS */}

          {
            images.length > 1 && (

              <div
                className="
                flex
                gap-2.5
                mt-3
                overflow-x-auto
                pb-1
                [-ms-overflow-style:none]
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                "
              >

                {
                  images.map((img, index) => (

                    <img
                      key={index}
                      src={img}
                      alt={`thumb-${index}`}
                      onClick={() => setActiveImage(img)}
                      className={`
                      w-16
                      h-16
                      sm:w-20
                      sm:h-20
                      object-cover
                      rounded-lg
                      cursor-pointer
                      shrink-0
                      border-2
                      transition
                      ${
                        (activeImage || images[0]) === img
                          ? ""
                          : "border-transparent opacity-70 hover:opacity-100"
                      }
                      `}
                      style={
                        (activeImage || images[0]) === img
                          ? { borderColor: themeColor }
                          : undefined
                      }
                    />

                  ))
                }

              </div>

            )
          }

          {/* TRUST BADGES - desktop only, under gallery */}

          <div className="hidden lg:grid grid-cols-2 gap-3 mt-6">

            {[
              { icon: <FiShield />, label: "১০০% অরিজিনাল প্রোডাক্ট" },
              { icon: <FiTruck />, label: "দ্রুত হোম ডেলিভারি" },
              { icon: <FiCheckCircle />, label: "ক্যাশ অন ডেলিভারি" },
              { icon: <FiThumbsUp />, label: "সন্তুষ্টির নিশ্চয়তা" },
            ].map((item, i) => (

              <div
                key={i}
                className="flex items-center gap-2 bg-white rounded-xl p-3 shadow-sm"
              >
                <span
                  style={{ color: themeColor }}
                  className="text-lg shrink-0"
                >
                  {item.icon}
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {item.label}
                </span>
              </div>

            ))}

          </div>

        </div>

      </div>


      {/* ---------- PRODUCT INFO ---------- */}

      <div className="lg:col-span-3">

        <div className="bg-white lg:rounded-2xl lg:shadow-md p-5 lg:p-7 mt-4 lg:mt-0">

          {/* HERO TITLE */}

          {
            landing.heroTitle && (
              <div
                style={{
                  backgroundColor: themeAlpha(0.1),
                  color: themeColor,
                }}
                className="
                inline-flex
                items-center
                gap-1.5
                px-3
                py-1
                rounded-full
                text-xs
                sm:text-sm
                font-bold
                mb-3
                "
              >
                <FiZap className="shrink-0" />
                {formattedText(landing.heroTitle)}
              </div>
            )
          }

          {/* PRODUCT NAME */}

          <h1
            className="
            text-2xl
            sm:text-3xl
            lg:text-4xl
            font-black
            text-gray-900
            leading-snug
            "
          >
            {landing.title}
          </h1>

          {/* SOCIAL PROOF ROW */}

          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
            <span className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} className="fill-current" />
              ))}
            </span>
            <span className="font-medium">
              বিশ্বস্ত ক্রেতাদের প্রথম পছন্দ
            </span>
          </div>

          {/* PRICE SECTION */}

          <div className="mt-5 flex items-center gap-3 flex-wrap">

            {
              landing.price > 0 && landing.offerPrice > 0 && landing.offerPrice < landing.price

              ?

              <>

                <span
                  style={themeTextStyle}
                  className="text-3xl sm:text-4xl font-black"
                >
                  ৳{landing.offerPrice}
                </span>

                <span className="text-lg text-gray-400 font-medium line-through">
                  ৳{landing.price}
                </span>

                {
                  discount > 0 && (
                    <span className="px-3 py-1 rounded-lg font-bold text-sm text-red-600 bg-red-50 border border-red-100">
                      {discount}% সাশ্রয়
                    </span>
                  )
                }

              </>

              :

              landing.price > 0

              ?

              <span style={themeTextStyle} className="text-3xl sm:text-4xl font-black">
                ৳{landing.price}
              </span>

              :

              null

            }

          </div>

          {/* HERO DESCRIPTION - checklist */}

          {
            heroDescLines.length > 0 && (

              <div className="mt-6 space-y-2.5">

                {
                  heroDescLines.map((line, index) => (

                    <div key={index} className="flex items-start gap-3">

                      <div
                        style={themeBgStyle}
                        className="
                        w-5
                        h-5
                        mt-0.5
                        rounded-full
                        text-white
                        flex
                        items-center
                        justify-center
                        text-[10px]
                        font-bold
                        shrink-0
                        "
                      >
                        ✓
                      </div>

                      <span className="text-gray-700 leading-relaxed">
                        {line}
                      </span>

                    </div>
                  ))
                }

              </div>

            )
          }

          {/* QUANTITY */}

          <div
            className="
            mt-6
            border
            border-gray-200
            rounded-xl
            px-4
            py-3
            flex
            justify-between
            items-center
            "
          >

            <span className="font-bold text-gray-800">
              পরিমাণ
            </span>

            <div className="flex items-center gap-4">

              <button
                onClick={() => {
                  if (quantity > 1) setQuantity(quantity - 1);
                }}
                className="
                w-8
                h-8
                rounded-lg
                bg-gray-100
                font-bold
                text-gray-700
                hover:bg-gray-200
                "
              >
                −
              </button>

              <span className="font-black text-lg w-6 text-center">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                style={themeBgStyle}
                className="w-8 h-8 rounded-lg text-white font-bold"
              >
                +
              </button>

            </div>

          </div>

          {/* CTA */}

          <button
            onClick={scrollToOrderForm}
            style={themeBgStyle}
            className="
            hidden
            lg:flex
            w-full
            mt-6
            text-white
            py-3.5
            rounded-xl
            font-bold
            text-lg
            items-center
            justify-center
            gap-2
            shadow-lg
            hover:opacity-95
            transition
            "
          >
            এখনই অর্ডার করুন — ৳{total}
          </button>

        </div>

      </div>

    </div>

  </div>


  {/* ============ MAIN CONTENT (form / description / etc.) ============ */}

  <div className="max-w-6xl mx-auto lg:px-6 mt-6 lg:grid lg:grid-cols-5 lg:gap-10 lg:items-start">

    {/* LEFT: description + related (desktop) */}

    <div className="lg:col-span-2 lg:sticky lg:top-6 space-y-6 order-2 lg:order-1">

      {/* PRODUCT DESCRIPTION */}

      {
        landing.description && (

          <div className="bg-white lg:rounded-2xl lg:shadow-md p-5 lg:p-7">

            <h2 className="text-xl font-black text-gray-900 mb-4">
              পণ্যের বিবরণ
            </h2>

            <div className="text-gray-700 leading-8 whitespace-pre-line">
              {formattedText(landing.description)}
            </div>

          </div>

        )
      }

      {/* OUR PROMISE */}

      <div
        style={{
          backgroundColor: themeAlpha(0.08),
          borderColor: themeAlpha(0.18),
        }}
        className="border rounded-2xl p-5"
      >

        <div className="flex items-start gap-3">

          <div
            style={{ backgroundColor: themeAlpha(0.15) }}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
          >
            🛡️
          </div>

          <div className="flex-1">

            <h2 style={themeTextStyle} className="text-base font-black">
              আমাদের প্রতিশ্রুতি
            </h2>

            <p className="mt-1 text-sm text-gray-600 leading-6">
              আমরা অরিজিনাল এবং দ্রুত ডেলিভারি নিশ্চিত করি। আপনার সন্তুষ্টিই আমাদের প্রধান লক্ষ্য।
            </p>

          </div>

        </div>

      </div>

      {/* CONTACT US */}

      <div className="bg-white lg:rounded-2xl lg:shadow-md p-5 lg:p-7 text-center">

        <h3 className="text-base font-bold mb-4 text-gray-800">
          যেকোন প্রয়োজনে যোগাযোগ করুন
        </h3>

        <div className="flex items-center justify-center gap-4">

          <a
            href={MESSENGER_LINK}
            target="_blank"
            rel="noreferrer"
            aria-label="Messenger"
            className="
            w-14
            h-14
            rounded-full
            bg-[#0084FF]
            text-white
            flex
            items-center
            justify-center
            shadow-md
            hover:opacity-90
            transition
            "
          >
            <FaFacebookMessenger size={24} />
          </a>

          {
            settings?.whatsapp && (

              <a
                href={`https://wa.me/${settings.whatsapp?.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="
                w-14
                h-14
                rounded-full
                bg-[#25D366]
                text-white
                flex
                items-center
                justify-center
                shadow-md
                hover:opacity-90
                transition
                "
              >
                <FaWhatsapp size={26} />
              </a>

            )
          }

        </div>

      </div>

      {/* RELATED PRODUCTS - desktop shows here, mobile shows at bottom */}

      <div className="hidden lg:block bg-white rounded-2xl shadow-md p-5 lg:p-7">

        <h3 className="text-lg text-center font-black mb-4 text-gray-900">
          সম্পর্কিত প্রোডাক্ট
        </h3>

        <RelatedProducts
          currentId={landing.productId}
          category={landing.category}
        />

      </div>

    </div>


    {/* RIGHT: order form / summary / payment (checkout) */}

    <div id="order-form-section" className="lg:col-span-3 order-1 lg:order-2 space-y-4 mt-6 lg:mt-0">

      {/* ORDER FORM */}

      <div className="bg-white lg:rounded-2xl lg:shadow-md p-5 lg:p-7">

        <h2 className="text-xl font-black text-center mb-1 text-gray-900">
          অর্ডার ফর্ম
        </h2>
        <p className="text-center text-sm text-gray-500 mb-5">
          নিচের তথ্যগুলো পূরণ করে অর্ডার নিশ্চিত করুন
        </p>

        <div className="lg:grid lg:grid-cols-2 lg:gap-4">

          {
            landing.orderForm?.collectName && (

              <div className="relative mb-3">

                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={handleThemeFocus}
                  onBlur={handleThemeBlur}
                  placeholder="আপনার নাম"
                  className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  border
                  border-gray-200
                  rounded-xl
                  focus:outline-none
                  transition
                  "
                />

              </div>

            )
          }

          {
            landing.orderForm?.collectPhone && (

              <div className="relative mb-3">

                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={handleThemeFocus}
                  onBlur={handleThemeBlur}
                  placeholder="ফোন নাম্বার"
                  className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  border
                  border-gray-200
                  rounded-xl
                  focus:outline-none
                  transition
                  "
                />

              </div>

            )
          }

          {
            landing.orderForm?.collectAddress && (

              <div className="relative mb-3 lg:col-span-2">

                <FiHome className="absolute left-3 top-4 text-gray-400" />

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onFocus={handleThemeFocus}
                  onBlur={handleThemeBlur}
                  placeholder="আপনার ঠিকানা"
                  rows="3"
                  className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  border
                  border-gray-200
                  rounded-xl
                  resize-none
                  focus:outline-none
                  transition
                  "
                />

              </div>

            )
          }

          {
            landing.orderForm?.collectCity && (

              <>

                <div className="relative mb-3">

                  <FiMap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    name="thana"
                    value={formData.thana}
                    onChange={handleChange}
                    onFocus={handleThemeFocus}
                    onBlur={handleThemeBlur}
                    placeholder="থানা"
                    className="
                    w-full
                    pl-10
                    pr-4
                    py-3
                    border
                    border-gray-200
                    rounded-xl
                    focus:outline-none
                    transition
                    "
                  />

                </div>

                <div className="relative mb-3">

                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    onFocus={handleThemeFocus}
                    onBlur={handleThemeBlur}
                    placeholder="জেলা"
                    className="
                    w-full
                    pl-10
                    pr-4
                    py-3
                    border
                    border-gray-200
                    rounded-xl
                    focus:outline-none
                    transition
                    "
                  />

                </div>

              </>

            )
          }

          {
            landing.orderForm?.collectNotes && (

              <div className="relative mb-3 lg:col-span-2">

                <FiFileText className="absolute left-3 top-4 text-gray-400" />

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  onFocus={handleThemeFocus}
                  onBlur={handleThemeBlur}
                  placeholder="অতিরিক্ত নোট (যদি থাকে)"
                  rows="3"
                  className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  border
                  border-gray-200
                  rounded-xl
                  resize-none
                  focus:outline-none
                  transition
                  "
                />

              </div>

            )
          }

        </div>

      </div>


      {/* DELIVERY CHARGE */}

      <div className="bg-white lg:rounded-2xl lg:shadow-md p-5 lg:p-7">

        <h2 className="text-lg font-bold mb-3 text-gray-900 flex items-center gap-2">
          <FiTruck style={{ color: themeColor }} />
          ডেলিভারি চার্জ
        </h2>

        <select
          value={deliveryCharge}
          onChange={(e) => setDeliveryCharge(Number(e.target.value))}
          className="
          w-full
          border
          border-gray-200
          rounded-xl
          px-4
          py-3
          outline-none
          bg-white
          "
        >
          <option value={80}>ঢাকা সিটি — ৳৮০</option>
          <option value={120}>ঢাকা সাব এরিয়া — ৳১২০</option>
          <option value={150}>ঢাকার বাইরে — ৳১৫০</option>
        </select>

      </div>


      {/* ORDER SUMMARY */}

      <div className="bg-white lg:rounded-2xl lg:shadow-md p-5 lg:p-7">

        <h2 className="text-lg font-bold mb-4 text-gray-900">
          অর্ডার বিবরণ
        </h2>

        <div className="space-y-3 text-gray-700">

          <div className="flex justify-between">
            <span>সাবটোটাল</span>
            <span>৳{subTotal}</span>
          </div>

          <div className="flex justify-between">
            <span>ডেলিভারি চার্জ</span>
            <span>৳{deliveryCharge}</span>
          </div>

          <hr className="border-gray-200" />

          <div style={themeTextStyle} className="flex justify-between text-lg font-black">
            <span>সর্বমোট</span>
            <span>৳{total}</span>
          </div>

        </div>

      </div>


      {/* PAYMENT METHOD */}

      <div className="bg-white lg:rounded-2xl lg:shadow-md p-5 lg:p-7">

        <button
          type="button"
          onClick={() => setPaymentOpen(!paymentOpen)}
          className="w-full flex items-center justify-between"
        >

          <span className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <FiCreditCard style={{ color: themeColor }} />
            পেমেন্ট পদ্ধতি
          </span>

          {
            paymentOpen
              ? <FiChevronUp className="text-gray-500" />
              : <FiChevronDown className="text-gray-500" />
          }

        </button>

        {
          paymentOpen && (

            <div className="mt-4 space-y-3">

              {/* BKASH */}

              <div
                onClick={() => setPaymentMethod("bKash")}
                className={`
                flex
                items-center
                gap-3
                p-4
                rounded-xl
                border
                cursor-pointer
                transition
                ${
                  paymentMethod === "bKash"
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }
                `}
              >

                <span
                  className={`
                  w-5
                  h-5
                  rounded-full
                  border-2
                  flex-shrink-0
                  flex
                  items-center
                  justify-center
                  ${
                    paymentMethod === "bKash" ? "border-amber-500" : "border-gray-300"
                  }
                  `}
                >
                  {
                    paymentMethod === "bKash" && (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    )
                  }
                </span>

                <span className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-100">
                  <img src="/payments/bkash-logo.png" alt="bKash" className="w-full h-full object-contain" />
                </span>

                <div>
                  <p className="font-bold text-gray-900">বিকাশ পেমেন্ট</p>
                  <p className="text-sm text-gray-500">নিরাপদে বিকাশের মাধ্যমে পে করুন</p>
                </div>

              </div>

              {
                paymentMethod === "bKash" && (

                  <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">

                    <p className="font-bold text-green-600 mb-4">
                      আপনাকে আমাদের পাঠাতে হবে ৳ {total}
                    </p>

                    <p className="text-sm text-gray-600 mb-1">
                      অ্যাকাউন্ট টাইপ: <span className="font-semibold text-gray-800">পার্সোনাল</span>
                    </p>

                    <p className="text-sm text-gray-600 mb-4">
                      অ্যাকাউন্ট নম্বর: <span className="font-semibold text-gray-800">{BKASH_NUMBER}</span>
                    </p>

                    <hr className="border-gray-200 mb-4" />

                    <label className="block text-sm text-gray-600 mb-1">
                      আপনার বিকাশ নম্বর
                    </label>

                    <input
                      value={bkashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="
                      w-full
                      mb-4
                      px-4
                      py-3
                      border
                      border-gray-300
                      rounded-xl
                      focus:outline-none
                      focus:border-amber-500
                      bg-white
                      "
                    />

                    <label className="block text-sm text-gray-600 mb-1">
                      ট্রানজেকশন আইডি
                    </label>

                    <input
                      value={bkashTransactionId}
                      onChange={(e) => setBkashTransactionId(e.target.value)}
                      placeholder="যেমন: 2M7A5"
                      className="
                      w-full
                      px-4
                      py-3
                      border
                      border-gray-300
                      rounded-xl
                      focus:outline-none
                      focus:border-amber-500
                      bg-white
                      "
                    />

                  </div>

                )
              }

              {/* NAGAD */}

              <div
                onClick={() => setPaymentMethod("Nagad")}
                className={`
                flex
                items-center
                gap-3
                p-4
                rounded-xl
                border
                cursor-pointer
                transition
                ${
                  paymentMethod === "Nagad"
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }
                `}
              >

                <span
                  className={`
                  w-5
                  h-5
                  rounded-full
                  border-2
                  flex-shrink-0
                  flex
                  items-center
                  justify-center
                  ${
                    paymentMethod === "Nagad" ? "border-amber-500" : "border-gray-300"
                  }
                  `}
                >
                  {
                    paymentMethod === "Nagad" && (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    )
                  }
                </span>

                <span className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-100">
                  <img src="/payments/nagad-logo.png" alt="Nagad" className="w-full h-full object-contain" />
                </span>

                <div>
                  <p className="font-bold text-gray-900">নগদ পেমেন্ট</p>
                  <p className="text-sm text-gray-500">নিরাপদে নগদের মাধ্যমে পে করুন</p>
                </div>

              </div>

              {
                paymentMethod === "Nagad" && (

                  <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">

                    <p className="font-bold text-green-600 mb-4">
                      আপনাকে আমাদের পাঠাতে হবে ৳ {total}
                    </p>

                    <p className="text-sm text-gray-600 mb-1">
                      অ্যাকাউন্ট টাইপ: <span className="font-semibold text-gray-800">পার্সোনাল</span>
                    </p>

                    <p className="text-sm text-gray-600 mb-4">
                      অ্যাকাউন্ট নম্বর: <span className="font-semibold text-gray-800">{NAGAD_NUMBER}</span>
                    </p>

                    <hr className="border-gray-200 mb-4" />

                    <label className="block text-sm text-gray-600 mb-1">
                      আপনার নগদ নম্বর
                    </label>

                    <input
                      value={nagadNumber}
                      onChange={(e) => setNagadNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="
                      w-full
                      mb-4
                      px-4
                      py-3
                      border
                      border-gray-300
                      rounded-xl
                      focus:outline-none
                      focus:border-amber-500
                      bg-white
                      "
                    />

                    <label className="block text-sm text-gray-600 mb-1">
                      ট্রানজেকশন আইডি
                    </label>

                    <input
                      value={nagadTransactionId}
                      onChange={(e) => setNagadTransactionId(e.target.value)}
                      placeholder="যেমন: 2M7A5"
                      className="
                      w-full
                      px-4
                      py-3
                      border
                      border-gray-300
                      rounded-xl
                      focus:outline-none
                      focus:border-amber-500
                      bg-white
                      "
                    />

                  </div>

                )
              }

              {/* COD */}

              <div
                onClick={() => setPaymentMethod("COD")}
                className={`
                flex
                items-center
                gap-3
                p-4
                rounded-xl
                border
                cursor-pointer
                transition
                ${
                  paymentMethod === "COD"
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }
                `}
              >

                <span
                  className={`
                  w-5
                  h-5
                  rounded-full
                  border-2
                  flex-shrink-0
                  flex
                  items-center
                  justify-center
                  ${
                    paymentMethod === "COD" ? "border-amber-500" : "border-gray-300"
                  }
                  `}
                >
                  {
                    paymentMethod === "COD" && (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    )
                  }
                </span>

                <span className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <FiTruck size={20} />
                </span>

                <div>
                  <p className="font-bold text-gray-900">ক্যাশ অন ডেলিভারি (COD)</p>
                  <p className="text-sm text-gray-500">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</p>
                </div>

              </div>

            </div>

          )
        }

      </div>


      {/* ORDER BUTTON - desktop / tablet (mobile uses sticky bar) */}

      <button
        disabled={ordering}
        onClick={submitOrder}
        style={themeBgStyle}
        className="
        hidden
        lg:flex
        w-full
        text-white
        py-4
        rounded-xl
        font-bold
        text-lg
        items-center
        justify-center
        gap-2
        shadow-lg
        hover:opacity-95
        transition
        disabled:opacity-60
        "
      >
        {ordering ? "অর্ডার হচ্ছে..." : `অর্ডার নিশ্চিত করুন — ৳${total}`}
      </button>

    </div>

  </div>


  {/* RELATED PRODUCTS - mobile only, at the bottom */}

  <div className="lg:hidden max-w-6xl mx-auto px-0 mt-6">

    <div className="bg-white p-5">

      <h3 className="text-lg text-center font-black mb-4 text-gray-900">
        সম্পর্কিত প্রোডাক্ট
      </h3>

      <RelatedProducts
        currentId={landing.productId}
        category={landing.category}
      />

    </div>

  </div>


  {/* ============ MOBILE STICKY ORDER BAR ============ */}

  <div
    className="
    lg:hidden
    fixed
    bottom-0
    left-0
    right-0
    z-40
    bg-white
    border-t
    border-gray-200
    px-4
    py-3
    flex
    items-center
    gap-3
    shadow-[0_-4px_16px_rgba(0,0,0,0.08)]
    "
  >

    <div className="shrink-0">
      <p className="text-[11px] text-gray-500 leading-none">সর্বমোট</p>
      <p style={themeTextStyle} className="text-lg font-black leading-tight">
        ৳{total}
      </p>
    </div>

    <button
      disabled={ordering}
      onClick={submitOrder}
      style={themeBgStyle}
      className="
      flex-1
      text-white
      py-3
      rounded-xl
      font-bold
      text-base
      disabled:opacity-60
      "
    >
      {ordering ? "অর্ডার হচ্ছে..." : "অর্ডার করুন"}
    </button>

  </div>


  {/* ============ MOBILE IMAGE FULLSCREEN ============ */}

  {
    fullscreen && (

      <div
        className="
        fixed
        inset-0
        bg-black/90
        z-50
        flex
        items-center
        justify-center
        p-5
        "
      >

        <button
          onClick={() => setFullscreen(false)}
          className="
          absolute
          top-5
          right-5
          bg-white
          text-black
          rounded-full
          w-12
          h-12
          flex
          items-center
          justify-center
          text-xl
          "
        >
          <FiX />
        </button>

        <img
          src={activeImage || images[0]}
          alt="fullscreen"
          className="max-h-full max-w-full rounded-lg object-contain"
        />

      </div>

    )
  }


</div>

</>

);

}
