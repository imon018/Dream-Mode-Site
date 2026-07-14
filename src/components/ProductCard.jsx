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





  const productImage =
    product.images?.length
      ?
      product.images[0]
      :
      product.image ||
      "https://via.placeholder.com/600";





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

          ?

          `
          rounded-[24px]
          shadow-[0_0_15px_rgba(245,158,11,.12)]
          `

          :

          `
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
    bg-gray-100
  "
>


  <img

    src={
      product.image ||
      product.images?.[0] ||
      "https://via.placeholder.com/600"
    }


    alt={product.name}


    className={`
      w-full

      object-cover

      transition-all
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

    onClick={()=>
      toggleWishlist(product)
    }

    className="
      absolute
      top-1
      right-1

      text-sm

      bg-transparent

      backdrop-blur-sm

      text-white

      drop-shadow-[0_1px_4px_rgba(0,0,0,.9)]

      opacity-90

      hover:scale-110

      transition-all

      duration-300
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

      top-1.5
      left-1.5

      px-1.5
      py-[1px]

      rounded-full

      border
      border-amber-400/70

      bg-black/20

      backdrop-blur-md

      text-amber-400

      font-semibold

      text-[7px]

      shadow-[0_0_10px_rgba(245,158,11,.25)]
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
            ?
            "p-3"
            :
            "p-5"
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







        {
          !compact && (

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

          )
        }








        {/* BUTTONS */}

<div
  className="
    flex
    items-center
    gap-1
    mt-4
    w-full
  "
>


{/* ADD CART */}

<Button
  onClick={handleAdd}
  className="
    flex-1
    h-8
    rounded-lg
    bg-black
    border
    border-amber-500
    text-white
    text-[10px]
    font-semibold
    px-2
    flex
    items-center
    justify-center
  "
>

<span
 className="
 flex
 items-center
 justify-center
 gap-1
 whitespace-nowrap
 "
>

<FiShoppingCart size={12}/>

Add To Cart

</span>

</Button>





{/* VIEW DETAIL */}

<button

  onClick={() =>
    navigate(
      `/product/${product.id}`
    )
  }

  className="
    flex-[0.65]
    h-8
    rounded-lg
    bg-white
    border
    border-amber-500/50
    text-amber-500
    text-[10px]
    font-semibold
    flex
    items-center
    justify-center
    px-2.5
    ml-1
  "

>

  <FiEye size={14}/>

</button>

</div>





      </div>



    </div>


  );

}
