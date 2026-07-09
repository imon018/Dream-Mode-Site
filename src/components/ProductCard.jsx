import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import useCart from "../hooks/useCart";
import { successToast } from "./ui/Toast";

export default function ProductCard({
  product,
}) {
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);

    successToast(
      "Added to cart successfully"
    );
  };

  return (
    <div className="group bg-white rounded-[28px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">

      <div className="overflow-hidden relative">

        <img
  src={product.image}
  className="h-56 sm:h-64 md:h-72 lg:h-80 w-full object-cover transition duration-500 hover:scale-105"
  alt={product.name}
/>

        {product.stock > 0 && (
          <span className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs">
            In Stock
          </span>
        )}

      </div>

      <div className="p-6">

        <h3 className="mt-2 text-xl font-semibold line-clamp-1">
          {product.name}
        </h3>

        <p className="text-gray-500 mt-3 line-clamp-2 text-sm">
          {product.description}
        </p>

        <div className="mt-4 text-2xl font-bold text-primary">
          ৳ {product.price}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">

          <Button
            onClick={handleAdd}
          >
            Add Cart
          </Button>

          <Button
            onClick={() =>
              navigate(
                `/product/${product.id}`
              )
            }
            className="bg-black hover:bg-gray-900"
          >
            View
          </Button>

        </div>

      </div>
    </div>
  );
}
