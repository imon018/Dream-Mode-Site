import ProductCard from "./ProductCard";
import products from "../data/products";

export default function FeaturedProducts() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">

      <h2 className="text-3xl font-bold text-center mb-12">
        Featured Products
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}

      </div>

    </section>
  );
}
