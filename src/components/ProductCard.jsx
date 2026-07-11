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

      className="

      group

      bg-white

      rounded-[24px]

      overflow-hidden

      border

      border-amber-500/20

      shadow-[0_8px_25px_rgba(0,0,0,.07)]

      transition-all

      duration-300

      hover:-translate-y-1

      "

    >




      {/* IMAGE */}


      <div

        className="

        relative

        overflow-hidden

        h-52

        md:h-60

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

          group-hover:scale-105

          "

        />





        {/* NEW BADGE */}



        <span

          className="

          absolute

          top-2

          left-2


          px-2

          py-[2px]


          rounded-full


          text-[8px]


          font-semibold


          text-amber-400


          border

          border-amber-400


          bg-black/30


          backdrop-blur-md

          "

        >

          ✨ New

        </span>






        {/* WISHLIST */}


        <button

          onClick={() =>
            toggleWishlist(
              product
            )
          }


          className="

          absolute

          top-2

          right-2


          text-lg


          text-white


          drop-shadow-[0_2px_6px_rgba(0,0,0,.8)]


          hover:scale-110


          transition

          "

        >

          {

          liked

          ?

          "♥"

          :

          "♡"

          }


        </button>




      </div>








      {/* CONTENT */}



      <div

        className="

        p-3

        "

      >





        {/* NAME */}


        <h3

          className="

          text-[16px]

          font-bold

          text-slate-900

          truncate

          "

        >

          {
            product.name
          }


        </h3>







        {/* RATING */}


        <div

          className="

          flex

          items-center

          gap-1

          mt-1

          text-xs

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







        {/* PRICE FLOAT */}



        <div

          className="

          mt-2

          inline-flex

          px-2

          py-[3px]

          rounded-md


          bg-white


          border

          border-amber-500/30


          shadow-sm

          "

        >

          <p

            className="

            text-base

            leading-none

            font-bold

            text-amber-600

            "

          >

            ৳ {product.price}

          </p>


        </div>









        {/* BUTTONS */}



        <div

          className="

          flex

          items-center

          gap-2

          mt-4

          "

        >





          {/* ADD TO CART */}



          <Button

            onClick={
              handleAdd
            }


            className="

            flex-1

            h-10


            rounded-xl


            bg-black


            border

            border-amber-500


            text-white


            text-[11px]


            font-semibold


            px-2


            whitespace-nowrap


            "

          >


            <span

              className="

              flex

              items-center

              justify-center

              gap-1

              "

            >

              <FiShoppingCart
                size={14}
              />

              Add To Cart


            </span>


          </Button>








          {/* VIEW */}



          <button


            onClick={() =>
              navigate(
                `/product/${product.id}`
              )
            }


            className="

            w-12

            h-10


            shrink-0


            rounded-xl


            bg-white/60


            backdrop-blur-xl


            border

            border-amber-500


            text-amber-500


            flex

            items-center

            justify-center


            shadow-sm


            hover:bg-amber-500

            hover:text-white


            transition

            "

          >

            <FiEye
              size={18}
            />


          </button>






        </div>




      </div>




    </div>

  );

}
