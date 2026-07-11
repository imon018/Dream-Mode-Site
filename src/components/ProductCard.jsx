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

      className={`
      group

      bg-white

      rounded-[28px]

      overflow-hidden

      border

      border-amber-500/20

      transition-all

      duration-500

      shadow-[0_10px_35px_rgba(0,0,0,.06)]

      hover:-translate-y-2

      hover:shadow-2xl

      `}

    >




      {/* IMAGE AREA */}


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

            "h-40"

            :

            "h-64 md:h-72"

          }

          `}

        />





        {/* NEW BADGE */}


        <div

          className="
          absolute

          top-3

          left-3


          px-3

          py-1


          rounded-full


          bg-white/20


          backdrop-blur-xl


          border

          border-amber-500


          text-amber-500


          text-[10px]


          font-bold

          "

        >

          ✨ New


        </div>






        {/* WISHLIST BUTTON */}



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


          bg-white/20


          backdrop-blur-xl


          border

          border-white/40


          flex

          items-center

          justify-center



          text-xl


          transition


          hover:scale-110

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
        p-4

        "

      >




        {/* TITLE */}


        <h3

          className="
          font-bold

          text-slate-900

          text-base

          line-clamp-1

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

          mt-2

          text-xs

          "

        >

          <span>

            ⭐

          </span>


          <span
            className="
            text-gray-500
            "
          >

            4.8 (120)

          </span>


        </div>







        {/* PRICE */}



        <p

          className="
          mt-2

          text-lg

          font-bold

          text-amber-600

          "

        >

          ৳ {product.price}


        </p>





        {
          !compact && product.description && (


            <p

              className="
              mt-2

              text-xs

              text-gray-500

              line-clamp-2

              "

            >

              {
                product.description
              }


            </p>


          )
        }








        {/* BUTTONS */}



        <div

          className="
          flex

          gap-2

          mt-4

          "

        >




          {/* ADD CART */}



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


            font-medium


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

              <FiShoppingCart/>

              Cart


            </span>



          </Button>







          {/* VIEW DETAILS */}




          <button


            onClick={() =>
              navigate(
                `/product/${product.id}`
              )
            }



            className="

            w-11

            h-10


            rounded-xl



            bg-white/20



            backdrop-blur-xl



            border

            border-amber-500



            text-amber-500



            flex

            items-center

            justify-center



            hover:bg-amber-500/10



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
