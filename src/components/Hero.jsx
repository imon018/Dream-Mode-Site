import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import Button from "./ui/Button";

import {
  FiShoppingBag,
  FiEye,
} from "react-icons/fi";

import {
  FaWhatsapp,
} from "react-icons/fa6";

import {
  getAllBanners,
} from "../services/firestoreBannerService";

export default function Hero() {

  const [banners, setBanners] =
    useState([]);

  const [current, setCurrent] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadBanners =
      async () => {

        try {

          const data =
            await getAllBanners();

          setBanners(
            data.slice(0, 5)
          );

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);

        }

      };

    loadBanners();

  }, []);

  useEffect(() => {

    if (
      banners.length <= 1
    )
      return;

    const interval =
      setInterval(() => {

        setCurrent(
          (prev) =>
            prev ===
            banners.length - 1
              ? 0
              : prev + 1
        );

      }, 5000);

    return () =>
      clearInterval(
        interval
      );

  }, [banners]);

  const nextSlide = () => {

    setCurrent(
      current ===
        banners.length - 1
        ? 0
        : current + 1
    );

  };

  const prevSlide = () => {

    setCurrent(
      current === 0
        ? banners.length - 1
        : current - 1
    );

  };

  if (loading) {

    return (

      <section
        className="
        h-[80vh]
        flex
        items-center
        justify-center
        bg-black
        text-white
      "
      >

        <div
          className="
          text-center
        "
        >

          <div
            className="
            w-16
            h-16
            border-4
            border-white/20
            border-t-white
            rounded-full
            animate-spin
            mx-auto
          "
          />

          <p
            className="
            mt-4
            text-lg
          "
          >
            Loading Banner...
          </p>

        </div>

      </section>

    );

  }

  if (
    banners.length === 0
  ) {

    return (

      <section
        className="
        h-[80vh]
        bg-black
        text-white
        flex
        items-center
        justify-center
      "
      >

        <h2
          className="
          text-3xl
          font-bold
        "
        >
          No Banner Found
        </h2>

      </section>

    );

  }

  const banner =
  banners[current];

return (
  
<section
  className="
    relative
    h-[460px]
    md:h-[430px]
    lg:h-[500px]
    overflow-hidden
    rounded-b-[30px]
  "
>
      {/* BACKGROUND IMAGE */}

      <img
  src={banner.image}
  alt={banner.title}
  className="
    absolute
    inset-0
    w-full
    h-full
    object-contain
    bg-black
  "
/>

      {/* DARK OVERLAY */}

   <div
  className="
  absolute
  inset-0
  bg-black/5
  "
/>

      {/* GRADIENT */}

      <div
        className="
        absolute
        inset-0
        bg-gradient-to-r
        from-black/35
        via-black/10
        to-transparent
      "
      />

      {/* CONTENT */}

      <div
        className="
        relative
        z-10
        h-full
        container-box
        flex
        items-start
pt-6
      "
      >

        <div
  className="
    max-w-3xl
    text-white
    pt-2
  "
>

<div
  className="
  relative
  inline-flex
  overflow-hidden
  rounded-full
  border
  border-amber-500
  shadow-[0_0_20px_rgba(245,158,11,.45)]
  "
>

  {/* BLUR BACKGROUND */}

  <img
  src={banner.image}
  alt=""
  className="
    absolute
    inset-0
    w-full
    h-full
    object-cover
    blur-lg
    scale-100
    rounded-full
    "
/>

  {/* GLASS OVERLAY */}

  <div
  className="
    absolute
    inset-0
    rounded-full
    bg-black/40
    backdrop-blur-md
    "
/>

  {/* TEXT */}

  <span
  className="
    relative
    z-10
    px-3
    py-1.5
    text-amber-300
    font-normal
    text-[11px]
    tracking-wide
    "
>

    {banner.badgeText ||
      "🔥 Premium Collection"}

  </span>

</div>

          <h1
  className="
    mt-4
    text-3xl
    md:text-5xl
    lg:text-6xl
    font-extrabold
    leading-tight
    tracking-tight
    text-amber-300
    drop-shadow-[0_3px_12px_rgba(245,158,11,.35)]
  "
>
  {banner?.title || "Premium Product"}
</h1>
         
          <p
  className="
    mt-3
    text-[13px]
    md:text-base
    text-white/90
    max-w-[320px]
    leading-6
  "
>
  {banner.title}
</p>

         <div className="h-[45px]" />
         
                      {/* PRICE BOX */}
          
<div
  className="
    absolute
    left-5
    bottom-20
    grid
    grid-cols-3
    gap-2
    max-w-[310px]
  "
>
  
  {/* OFFER PRICE */}

  <div
    className="
  rounded-lg
  bg-black/35
  backdrop-blur-md
  border
  border-amber-500
  shadow-[0_0_20px_rgba(245,158,11,.20)]
  p-2
  text-center
"
  >

    <p
      className="
        text-xs
        text-white/70
        mb-1
      "
    >
      Offer Price
    </p>


    <h3
      className="
  text-lg
  md:text-xl
  font-bold
  text-amber-300
"
    >
      ৳ {banner.offerPrice}
    </h3>


  </div>





  {/* REGULAR PRICE */}

  <div
    className="
      rounded-xl
      bg-black/30
      backdrop-blur-md
      border
      border-amber-500
      p-3
      text-center
    "
  >

    <p
      className="
  text-[10px]
  text-amber-300
  font-medium
  mb-1
"
    >
      Regular Price
    </p>


    <h3
      className="
        text-base
md:text-lg
        font-bold
        text-white
        line-through
      "
    >
      ৳ {banner.regularPrice}
    </h3>


  </div>






  {/* SAVE */}

  {/* SAVE */}

<div
  className="
    w-[72px]
    h-[72px]
    rounded-full
    bg-gradient-to-br
    from-amber-200
    via-amber-400
    to-amber-600
    border-[3px]
    border-amber-500
    shadow-[0_0_20px_rgba(245,158,11,.45)]
    flex
    flex-col
    justify-center
    items-center
    text-center
    shrink-0
  "
>

  <span
    className="
      text-[10px]
      font-medium
      text-black
      uppercase
      tracking-wide
    "
  >
    SAVE
  </span>

  <span
    className="
      text-base
      font-black
      text-black
      leading-none
    "
  >
    ৳ {banner.regularPrice - banner.offerPrice}
  </span>

</div>
</div>
            {/* BUTTONS */}
          
<div
  className="
    absolute
    left-5
    bottom-12
    grid
    grid-cols-3
    gap-2
    max-w-[310px]
  "
>

  {/* SHOP NOW */}

  <Link
    to="/shop"
    className="w-full"
  >
    <Button
      className="
  w-full
  h-10
  rounded-lg

  bg-gradient-to-r
  from-amber-400
  to-amber-500

  text-black
  font-semibold
  text-[11px]

  shadow-[0_0_20px_rgba(245,158,11,.35)]
"
    >
      
      <span className="flex items-center justify-center gap-2">
    <FiShoppingBag className="text-base" />
    Shop Now
  </span>
      
    </Button>
  </Link>


  {/* VIEW PRODUCT */}

  {banner?.productId && (

    <Link
      to={`/product/${banner.productId}`}
      className="w-full"
    >

      <Button
        className="
          w-full
          h-10
          rounded-lg
          bg-purple-700/40
backdrop-blur-md
border
border-amber-500
text-white
font-medium
text-[11px]
shadow-[0_0_20px_rgba(245,158,11,.18)]
        "
      >
        
        <span className="flex items-center justify-center gap-2">
    <FiEye className="text-base" />
    View
  </span>
        
      </Button>

    </Link>

  )}


  {/* WHATSAPP */}

  <a
    href={`https://wa.me/${
      banner?.whatsappNumber ||
      "8801406978619"
    }`}
    target="_blank"
    rel="noreferrer"
    className="w-full"
  >

    <Button
      className="
  w-full
  h-10
  rounded-lg
  bg-black/35
  backdrop-blur-md
  border
  border-amber-500
  text-white
  font-medium
  text-[11px]
  shadow-[0_0_20px_rgba(245,158,11,.18)]
"
    >
      
<span className="flex items-center justify-center gap-2">
    <FaWhatsapp className="text-base" />
    WhatsApp
  </span>
      
    </Button>

  </a>


</div>

          {/* RIGHT SIDE EMPTY FOR FULL BACKGROUND HERO */}

       <div>
</div>
        </div>
        </div>
  
       
        {/* DOTS */}

        {banners.length > 1 && (
          <div
            className="
              absolute
              bottom-3
              left-1/2
              -translate-x-1/2
              flex
              gap-3
              z-30
            "
          >
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() =>
                  setCurrent(index)
                }
                className={`
                  transition-all
                  duration-300
                  rounded-full
                  ${
                    current === index
                      ? "w-10 h-3 bg-yellow-400"
                      : "w-3 h-3 bg-white/40"
                  }
                `}
              />
            ))}
          </div>
        )}
 
    </section>
  );
}
