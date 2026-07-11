import {
  useNavigate,
} from "react-router-dom";

import {
  FiEye,
  FiShoppingCart,
} from "react-icons/fi";

import Button from "./ui/Button";

import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";

import {
  successToast,
} from "./ui/Toast";


export default function ProductCard({
  product,
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



  const handleCart = ()=>{

    addToCart(product);

    successToast(
      "Added to cart successfully"
    );

  };




  return (

    <div
      className="
      bg-white
      rounded-[24px]
      overflow-hidden

      border
      border-amber-500/20

      shadow-[0_10px_30px_rgba(0,0,0,.08)]

      transition
      duration-300

      hover:-translate-y-1
      "
    >



      {/* IMAGE AREA */}

      <div
        className="
        relative
        h-[180px]
        md:h-[220px]
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

          className="
          w-full
          h-full
          object-cover

          transition
          duration-500

          hover:scale-105
          "

        />



        {/* NEW */}

        <span
          className="
          absolute
          top-2
          left-2

          px-2
          py-[3px]

          rounded-full

          text-[9px]

          font-bold

          text-amber-500

          border
          border-amber-500

          bg-black/20

          backdrop-blur-md
          "
        >

          ✨ New

        </span>




        {/* WISHLIST */}

        <button

          onClick={()=>toggleWishlist(product)}

          className="
          absolute
          top-2
          right-2

          text-white

          text-xl

          drop-shadow-lg

          hover:scale-125

          transition
          "

        >

          {
            liked
            ?
            "❤️"
            :
            "♡"
          }


        </button>



      </div>





      {/* CONTENT */}


      <div
        className="
        p-4
        "
      >



        <h3
          className="
          text-[17px]

          font-bold

          text-slate-900

          truncate
          "
        >

          {product.name}


        </h3>



        {/* RATING */}

        <div
          className="
          flex
          items-center
          gap-1

          mt-2

          text-sm
          text-gray-500
          "
        >

          <span
            className="
            text-amber-500
            "
          >
            ★
          </span>


          <span>
            4.8
          </span>


          <span>
            (120)
          </span>


        </div>





        {/* PRICE */}

        <p
          className="
          mt-2

          text-xl

          font-bold

          text-amber-600
          "
        >

          ৳ {product.price}


        </p>






        {/* BUTTON AREA */}


        <div
          className="
          flex
          items-center
          gap-3

          mt-5
          "
        >




          {/* CART */}

          <Button

            onClick={
              handleCart
            }


            className="
            flex-1

            h-12

            rounded-xl

            bg-black

            border
            border-amber-500

            text-white

            text-sm

            font-semibold

            shadow-lg

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

              <FiShoppingCart />

              Add To Cart


            </span>


          </Button>






          {/* VIEW */}

          <button

            onClick={()=>navigate(
              `/product/${product.id}`
            )}


            className="
            w-14
            h-12

            rounded-xl

            bg-white/70

            backdrop-blur-xl

            border
            border-amber-500

            text-amber-500

            flex
            items-center
            justify-center

            text-xl

            shadow-md

            hover:bg-amber-500
            hover:text-white

            transition
            "

          >

            <FiEye />


          </button>



        </div>



      </div>



    </div>


  );

}
