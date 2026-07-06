import Button from "./ui/Button";
import useCart from "../hooks/useCart";
import { successToast } from "./ui/Toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
    successToast("Added to cart");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
      <img
        src={product.image}
        className="h-64 w-full object-cover"
        alt={product.name}
      />

      <div className="p-5">
        <h3 className="font-bold text-lg">
          {product.name}
        </h3>

        <p className="text-primary text-xl mt-2">
          ৳ {product.price}
        </p>

        <Button onClick={handleAdd} className="w-full mt-4">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
