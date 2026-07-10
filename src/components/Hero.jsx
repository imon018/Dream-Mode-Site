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
} from "react-icons/fa";

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
      h-[560px]
      md:h-[650px]
      lg:h-[720px]
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
  bg-black/40
  "
/>

      {/* GRADIENT */}

      <div
        className="
        absolute
        inset-0
        bg-gradient-to-r
        from-black/70
        via-black/30
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
        items-center
      "
      >

        <div
          className="
          max-w-3xl
          text-white
        "
        >

<div
  className="
  relative
  inline-flex
  overflow-hidden
  rounded-full
  border
  border-yellow-400
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
    blur-md
    scale-110
    "
  />

  {/* GLASS OVERLAY */}

  <div
    className="
    absolute
    inset-0
    bg-black/30
    backdrop-blur-sm
    "
  />

  {/* TEXT */}

  <span
    className="
    relative
    z-10
    px-6
    py-3
    text-yellow-300
    font-bold
    text-sm
    "
  >

    {banner.badgeText ||
      "💥 Premium Collection"}

  </span>

</div>

          <h1
  className="
    mt-6
    text-4xl
    md:text-6xl
    lg:text-7xl
    font-black
    leading-tight
    text-yellow-400
  "
>
  {banner?.title || "Premium Product"}
</h1>

          <p
  className="
    mt-4
    text-base
    md:text-lg
    text-white
    max-w-2xl
    leading-7
  "
>
  {banner.title}
</p>

                      {/* PRICE BOX */}

<div
  className="
    mt-8
    grid
    grid-cols-3
    gap-3
    max-w-3xl
  "
>


  {/* OFFER PRICE */}

  <div
    className="
      rounded-xl
      bg-black/30
      backdrop-blur-md
      border
      border-yellow-400/30
      p-3
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
        text-2xl
        md:text-3xl
        font-black
        text-yellow-400
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
      border-white/20
      p-3
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
      Regular Price
    </p>


    <h3
      className="
        text-xl
        md:text-2xl
        font-bold
        text-white
        line-through
      "
    >
      ৳ {banner.regularPrice}
    </h3>


  </div>






  {/* SAVE */}

  <div
    className="
      rounded-xl
      bg-yellow-400
      p-3
      text-center
      flex
      flex-col
      justify-center
    "
  >

    <p
      className="
        text-xs
        text-black
        font-bold
      "
    >
      Save
    </p>


    <h3
      className="
        text-xl
        md:text-2xl
        font-black
        text-black
      "
    >

      ৳ {
        banner.regularPrice -
        banner.offerPrice
      }

    </h3>


  </div>



</div>

            {/* BUTTONS */}

<div
  className="
    mt-8
    grid
    grid-cols-3
    gap-3
    w-full
    max-w-3xl
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
  h-14
  rounded-xl

  bg-yellow-400
  hover:bg-yellow-300

  text-black
  font-bold
  text-sm
  md:text-base
"
    >
      
      <span className="flex items-center justify-center gap-2">
    <FiShoppingBag className="text-xl" />
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
          h-14
          rounded-xl
          bg-purple-700/40
          backdrop-blur-md
          border
          border-purple-300
          text-white
          font-bold
          text-sm
          md:text-base
        "
      >
        
        <span className="flex items-center justify-center gap-2">
    <FiEye className="text-xl" />
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
  h-14
  rounded-xl
  bg-white/10
  backdrop-blur-md
  border
  border-yellow-400
  text-white
  font-bold
"
    >
      
<span className="flex items-center justify-center gap-2">
    <FaWhatsapp className="text-xl" />
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
              bottom-8
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
