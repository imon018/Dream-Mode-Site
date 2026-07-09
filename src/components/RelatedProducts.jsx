import { useEffect, useState } from "react";

import ProductCard from "./ProductCard";

import {
  getProductsFromDB,
} from "../services/firestoreProductService";

export default function RelatedProducts({
  currentId,
}) {
  const [products, setProducts] =
    useState([]);

  useEffect(() => {
    loadProducts();
  }, [currentId]);

  const loadProducts =
    async () => {
      try {
        const data =
          await getProductsFromDB();

        const filtered =
          data
            .filter(
              (item) =>
                item.id !== currentId
            )
            .slice(0, 3);

        setProducts(filtered);
      } catch (error) {
        console.log(error);
      }
    };

  if (!products.length)
    return null;

  return (
    <section className="mt-20 md:mt-28">

      <div className="text-center mb-10 md:mb-14">

        <span className="text-xs md:text-sm uppercase tracking-[4px] text-gray-400">
          Discover More
        </span>

        <h2 className="text-2xl md:text-4xl font-bold mt-3">
          Curated For You
        </h2>

        <p className="text-gray-500 mt-3 text-sm md:text-base">
          Handpicked selections chosen for your style
        </p>

      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </section>
  );
}
