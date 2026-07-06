export default function ProductCard({ product }) {
  return (
    <div className="bg-white p-4 rounded-xl border">
      <h3>{product.name}</h3>
      <p>৳ {product.price}</p>
    </div>
  );
}
