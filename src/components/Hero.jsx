import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getAllBanners,
} from "../services/firestoreBannerService";

export default function Hero() {

  const [banners, setBanners] =
    useState([]);

  const [current, setCurrent] =
    useState(0);

  useEffect(() => {

    const load =
      async () => {

        const data =
          await getAllBanners();

        setBanners(data);

      };

    load();

  }, []);

  useEffect(() => {

    if (banners.length <= 1)
      return;

    const interval =
      setInterval(() => {

        setCurrent((prev) =>
          prev ===
          banners.length - 1
            ? 0
            : prev + 1
        );

      }, 5000);

    return () =>
      clearInterval(interval);

  }, [banners]);

  const banner =
    banners[current];

  return (

    <section className="relative overflow-hidden bg-[#faf7f2]">

      <div className="container-box py-14 md:py-20 lg:py-28">

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          <div>

            <span className="inline-flex px-4 py-2 rounded-full bg-white shadow text-sm">
              ✨ Premium Collection
            </span>

            <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-black leading-tight">

              {banner?.title ||
                "Dream Mode"}

            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-8 max-w-xl">

              {banner?.subtitle ||
                "Luxury Fashion For Modern Lifestyle"}

            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">

              <Link
                to="/shop"
                className="primary-btn text-center"
              >
                {banner?.buttonText ||
                  "Shop Now"}
              </Link>

              <Link
                to="/shop"
                className="outline-btn text-center"
              >
                Explore
              </Link>

            </div>

            {/* Dots */}

            <div className="flex gap-3 mt-10">

              {banners.map(
                (_, index) => (

                  <button
                    key={index}
                    onClick={() =>
                      setCurrent(index)
                    }
                    className={`
                      h-3
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        current === index
                          ? "w-10 bg-black"
                          : "w-3 bg-gray-300"
                      }
                    `}
                  />

                )
              )}

            </div>

          </div>

          <div>

            <div className="overflow-hidden rounded-[35px] shadow-premium">

              <img
                src={
                  banner?.image
                }
                alt=""
                className="
                  h-[350px]
                  md:h-[500px]
                  lg:h-[650px]
                  w-full
                  object-cover
                  transition-all
                  duration-700
                "
              />

            </div>

          </div>

        </div>

      </div>

    </section>

  );
}
