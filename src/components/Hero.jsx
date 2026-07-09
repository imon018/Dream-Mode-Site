import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getHeroBannerProduct,
} from "../services/firestoreProductService";

export default function Hero() {
  const [heroProduct, setHeroProduct] =
    useState(null);

  useEffect(() => {
    const loadHero =
      async () => {
        const product =
          await getHeroBannerProduct();

        setHeroProduct(product);
      };

    loadHero();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#faf7f2]">

      <div className="container-box py-16 lg:py-28">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div>

            <span className="inline-block px-5 py-2 rounded-full bg-white shadow text-sm">

              Premium Collection

            </span>

            <h1 className="mt-6 text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">

              {heroProduct?.name ||
                "Dream Mode Collection"}

            </h1>

            <p className="mt-6 text-gray-600 text-lg leading-8">

              {heroProduct?.description ||
                "Discover premium fashion collections designed for modern style and elegance."}

            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">

              <Link
                to="/shop"
                className="primary-btn text-center"
              >
                Shop Now
              </Link>

              <Link
                to={`/product/${heroProduct?.id || ""}`}
                className="outline-btn text-center"
              >
                View Product
              </Link>

            </div>

          </div>

          <div>

            <img
              src={
                heroProduct?.image ||
                "https://via.placeholder.com/800x900"
              }
              alt={
                heroProduct?.name ||
                "Dream Mode"
              }
              className="rounded-[35px] shadow-premium h-[350px] md:h-[500px] lg:h-[650px] w-full object-cover"
            />

          </div>

        </div>

      </div>

    </section>
  );
}
