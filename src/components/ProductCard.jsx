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
    <div
      className="
      group
      bg-white
      rounded-[32px]
      overflow-hidden
      border
      border-gray-100
      shadow-sm
      hover:shadow-2xl
      hover:-translate-y-2
      transition-all
      duration-500
    "
    >
      {/* IMAGE */}

      <div className="relative overflow-hidden">

        <img
          src={product.image}
          alt={product.name}
          className="
            h-64
            sm:h-72
            md:h-80
            lg:h-[360px]
            w-full
            object-cover
            group-hover:scale-110
            transition-all
            duration-700
          "
        />

        {/* STOCK BADGE */}

        {product.stock > 0 && (
          <span
            className="
              absolute
              top-4
              left-4
              bg-black
              text-white
              text-xs
              px-4
              py-2
              rounded-full
              backdrop-blur
            "
          >
            ✨ Available
          </span>
        )}

        {/* PRICE FLOAT */}

        <div
          className="
            absolute
            bottom-4
            right-4
            bg-white/90
            backdrop-blur-md
            px-4
            py-2
            rounded-full
            font-bold
            shadow-lg
          "
        >
          ৳ {product.price}
        </div>

      </div>

      {/* CONTENT */}

      <div className="p-6">

        <h3
          className="
            text-xl
            md:text-2xl
            font-bold
            line-clamp-1
          "
        >
          {product.name}
        </h3>

        <p
          className="
            mt-3
            text-gray-500
            text-sm
            leading-6
            line-clamp-2
          "
        >
          {product.description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">

          <Button
            onClick={handleAdd}
            className="rounded-2xl"
          >
            Add Cart
          </Button>

          <Button
            onClick={() =>
              navigate(
                `/product/${product.id}`
              )
            }
            className="
              bg-black
              hover:bg-gray-900
              rounded-2xl
            "
          >
            View
          </Button>

        </div>

      </div>

    </div>
  );
}
