import {
  useNavigate,
} from "react-router-dom";

import Button from "./ui/Button";

import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";

import {
  successToast,
} from "./ui/Toast";

import {
  FiEye,
  FiShoppingCart,
} from "react-icons/fi";


export default function ProductCard({
  product,
  compact = false,
}) {

  const navigate =
    useNavigate();


  const {
    addToCart,
  } = useCart();


  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();


  const liked =
    isWishlisted(
      product.id
    );


  const handleAdd = () => {

    addToCart(product);

    successToast(
      "Added to cart successfully"
    );

  };


  return (

    <div
      className={`
        group
        bg-white
        overflow-hidden

        border
        border-amber-500/20

        transition-all
        duration-500

        ${
          compact
            ? `
              rounded-[24px]
              shadow-[0_0_15px_rgba(245,158,11,.12)]
            `
            : `
              rounded-[32px]
              shadow-lg
              hover:shadow-2xl
              hover:-translate-y-2
            `
        }
      `}
    >


      {/* IMAGE */}

      <div
        className="
          relative
          overflow-hidden
        "
      >

        <img
          src={
            product.image ||
            "https://via.placeholder.com/600"
          }

          alt={
            product.name
          }

          className={`
            w-full
            object-cover

            transition
            duration-700

            group-hover:scale-110

            ${
              compact
              ?
              "h-36 md:h-44"
              :
              "h-64 sm:h-72 md:h-80"
            }
          `}
        />



        {/* WISHLIST */}

        <button
          onClick={() =>
            toggleWishlist(
              product
            )
          }

          className="
            absolute
            top-3
            right-3

            w-8
            h-8

            rounded-full

            bg-white/90

            backdrop-blur-md

            shadow-xl

            flex
            items-center
            justify-center

            text-base

            hover:scale-110

            transition
          "
        >

          {
            liked
            ?
            "❤️"
            :
            "🤍"
          }

        </button>



        {/* NEW BADGE */}

        <div
          className="
            absolute
            top-3
            left-2

            px-2
            py-1

            rounded-full

            border
            border-amber-500

            bg-transparent

            text-amber-500

            font-bold

            text-[9px]

            shadow-[0_0_20px_rgba(245,158,11,.35)]

            backdrop-blur-md
          "
        >

          ✨ New

        </div>


      </div>





      {/* CONTENT */}

      <div
        className={`
          ${
            compact
              ? "p-3"
              : "p-5"
          }

          -mt-[14px]

          relative
          z-20

          bg-white

          rounded-t-[22px]

          shadow-[0_-8px_25px_rgba(0,0,0,.08)]
        `}
      >



        <h3
          className={`
            font-black
            text-slate-900
            line-clamp-1

            ${
              compact
              ?
              "text-sm"
              :
              "text-xl"
            }
          `}
        >

          {product.name}

        </h3>



        <p
          className="
            mt-1
            text-sm
            font-bold
            text-amber-600
          "
        >

          ৳ {product.price}

        </p>




        {!compact && (

          <p
            className="
              mt-3
              text-sm
              text-gray-500
              line-clamp-2
            "
          >

            {product.description}

          </p>

        )}






        {/* BUTTONS */}

        <div
          className="
            flex
            flex-col
            gap-2
            mt-4
            w-full
          "
        >



          {/* ADD CART */}

          <Button

            onClick={
              handleAdd
            }

            className="
              w-full
              h-10

              rounded-lg

              bg-[#021B4A]

              backdrop-blur-md

              border
              border-amber-500

              text-white

              font-medium
              text-[11px]

              shadow-[0_0_20px_rgba(245,158,11,.18)]
            "
          >

            <span className="flex items-center justify-center gap-2">

              <FiShoppingCart
                className="text-base"
              />

              Add To Cart

            </span>


          </Button>





          {/* VIEW */}

          <Button

            onClick={() =>
              navigate(
                `/product/${product.id}`
              )
            }


            className="
              w-full
              h-10

              rounded-lg

              bg-purple-900/70

              backdrop-blur-md

              border
              border-amber-500

              text-white

              font-medium
              text-[11px]

              shadow-[0_0_20px_rgba(245,158,11,.18)]
            "
          >

            <span className="flex items-center justify-center gap-2">

              <FiEye
                className="text-base"
              />

              View Details

            </span>


          </Button>


        </div>


      </div>


    </div>

  );

}
