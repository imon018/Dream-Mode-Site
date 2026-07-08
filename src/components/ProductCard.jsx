import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import useCart from "../hooks/useCart";
import { successToast } from "./ui/Toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

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

        <p className="text-sm text-gray-500 mt-1">
          {product.category}
        </p>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {product.description}
        </p>

        <p className="text-primary text-xl mt-3 font-bold">
          ৳ {product.price}
        </p>

        <p
          className={`mt-2 font-medium ${
            product.stock > 0
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {product.stock > 0
            ? `In Stock (${product.stock})`
            : "Out of Stock"}
        </p>

        <div className="flex gap-3 mt-5">

          <Button
            onClick={handleAdd}
            className="flex-1"
          >
            Add to Cart
          </Button>

          <Button
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex-1 bg-gray-800 hover:bg-black"
          >
            View
          </Button>

        </div>

      </div>

    </div>
  );
}
