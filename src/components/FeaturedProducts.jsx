import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getLatestProducts } from "../services/firestoreProductService";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getLatestProducts();
      setProducts(data);
    } catch (error) {
      console.log("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 max-w-7xl mx-auto px-6">

      <h2 className="text-3xl font-bold text-center mb-12">
        Featured Products
      </h2>

      {loading ? (
        <div className="text-center text-lg">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500">
          No products available.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}

    </section>
  );
}
