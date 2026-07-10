import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  Link,
} from "react-router-dom";

import Button from "../ui/Button";

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
      h-[85vh]
      md:h-[95vh]
      lg:h-screen
      overflow-hidden
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
          object-cover
        "
      />

      {/* DARK OVERLAY */}

      <div
        className="
        absolute
        inset-0
        bg-black/45
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

          <span
            className="
            inline-flex
            px-5
            py-2
            rounded-full
            bg-yellow-400
            text-black
            font-bold
            text-sm
            shadow-xl
          "
          >
            {banner.badgeText ||
              "🔥 Premium Collection"}
          </span>

          <h1
            className="
            mt-6
            text-4xl
            md:text-6xl
            lg:text-7xl
            font-black
            leading-tight
          "
          >
            {banner.title}
          </h1>

          <p
            className="
            mt-5
            text-lg
            md:text-xl
            text-white/90
            max-w-2xl
            leading-8
          "
          >
            {banner.subtitle}
          </p>

                      {/* PRICE BOX */}

            <div
              className="
                mt-8
                flex
                flex-wrap
                items-center
                gap-4
              "
            >
              {banner?.offerPrice && (
                <span
                  className="
                    text-4xl
                    md:text-5xl
                    font-black
                    text-yellow-300
                  "
                >
                  ৳ {banner.offerPrice}
                </span>
              )}

              {banner?.regularPrice && (
                <span
                  className="
                    text-xl
                    text-white/60
                    line-through
                  "
                >
                  ৳ {banner.regularPrice}
                </span>
              )}
            </div>

            {/* BUTTONS */}

            <div
              className="
                mt-10
                flex
                flex-wrap
                gap-4
              "
            >
              {/* SHOP NOW */}

              <Link
                to="/shop"
              >
                <Button
                  className="
                    bg-yellow-400
                    text-black
                    font-bold
                    px-8
                  "
                >
                  🛍 Shop Now
                </Button>
              </Link>

              {/* WHATSAPP */}

              <a
                href={`https://wa.me/${
                  banner?.whatsappNumber ||
                  "8801406978619"
                }`}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  className="
                    bg-green-600
                    hover:bg-green-700
                    px-8
                  "
                >
                  💬 WhatsApp Order
                </Button>
              </a>

              {/* VIEW PRODUCT */}

              {banner?.productId && (
                <Link
                  to={`/product/${banner.productId}`}
                >
                  <Button
                    className="
                      bg-white
                      text-black
                      px-8
                    "
                  >
                    👁 View Product
                  </Button>
                </Link>
              )}
            </div>

          </div>

          {/* RIGHT SIDE EMPTY FOR FULL BACKGROUND HERO */}

          <div />

        </div>

        {/* ARROWS */}

        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="
                absolute
                left-4
                md:left-8
                top-1/2
                -translate-y-1/2
                z-30
                w-14
                h-14
                rounded-full
                bg-black/40
                backdrop-blur
                text-white
                text-2xl
                hover:bg-black/60
                transition
              "
            >
              ←
            </button>

            <button
              onClick={nextSlide}
              className="
                absolute
                right-4
                md:right-8
                top-1/2
                -translate-y-1/2
                z-30
                w-14
                h-14
                rounded-full
                bg-black/40
                backdrop-blur
                text-white
                text-2xl
                hover:bg-black/60
                transition
              "
            >
              →
            </button>
          </>
        )}

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
