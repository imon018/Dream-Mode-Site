import {
  useNavigate,
} from "react-router-dom";

import Button from "./ui/Button";

import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";

import {
  successToast,
} from "./ui/Toast";

import ProductRating from "./product/ProductRating";


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

            w-10
            h-10

            rounded-full

            bg-white/90

            backdrop-blur-md

            shadow-xl

            flex
            items-center
            justify-center

            text-xl

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
            left-3

            px-3
            py-1.5

            rounded-full

            border
            border-amber-500

            bg-transparent

            text-amber-500

            font-bold

            text-[10px]

            shadow-[0_0_20px_rgba(245,158,11,.35)]

            backdrop-blur-md
          "

        >

          ✨ New

        </div>





        {/* PRICE */}


        <div

          className="
            absolute
            bottom-3
            right-3

            px-4
            py-2

            rounded-full

            bg-white/95

            shadow-xl

            font-black

            text-blue-900
          "

        >

          ৳ {product.price}

        </div>


      </div>

      {/* CONTENT */}

      <div
        className={
          compact
          ?
          "p-3"
          :
          "p-5"
        }
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



        <ProductRating
          productId={
            product.id
          }
        />



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



        {/* STOCK */}

        <div
          className="
            mt-3
          "
        >

          {
            product.stock > 0

            ?

            <span
              className="
                inline-flex
                px-3
                py-1

                rounded-full

                bg-green-50

                text-green-700

                text-xs

                font-bold
              "
            >

              ✓ In Stock

            </span>

            :

            <span
              className="
                inline-flex
                px-3
                py-1

                rounded-full

                bg-red-50

                text-red-600

                text-xs

                font-bold
              "
            >

              Out Of Stock

            </span>

          }

        </div>




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
              h-9

              rounded-xl

              bg-gradient-to-r
              from-yellow-400
              to-amber-500

              backdrop-blur-md

              border
              border-amber-500

              text-black

              font-bold

              text-xs

              shadow-[0_0_20px_rgba(245,158,11,.35)]

              hover:scale-[1.02]

              transition
            "

          >

            <span
              className="
                flex
                items-center
                justify-center
                gap-2
              "
            >

              🛒
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
              h-9

              rounded-xl

              bg-purple-700/40

              backdrop-blur-md

              border
              border-amber-500

              text-white

              font-bold

              text-xs

              shadow-[0_0_20px_rgba(245,158,11,.18)]

              hover:scale-[1.02]

              transition
            "

          >

            <span
              className="
                flex
                items-center
                justify-center
                gap-2
              "
            >

              👁
              View

            </span>


          </Button>


        </div>


      </div>


    </div>

  );

}
