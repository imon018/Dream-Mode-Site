import { useNavigate } from "react-router-dom";

import Button from "./ui/Button";

import useCart from "../hooks/useCart";

import {
  successToast,
} from "./ui/Toast";

import ProductRating from "./product/ProductRating";


export default function ProductCard({
  product,
}) {


  const navigate =
    useNavigate();


  const {
    addToCart,
  } = useCart();




  const handleAdd = ()=>{


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
        rounded-[36px]
        overflow-hidden
        border
        border-yellow-100
        shadow-lg
        hover:shadow-2xl
        hover:-translate-y-3
        transition-all
        duration-500
      "
    >




      {/* IMAGE SECTION */}


      <div className="
        relative
        overflow-hidden
      ">


        <img

          src={
            product.image ||
            "https://via.placeholder.com/600"
          }

          alt={product.name}

          className="
            h-64
            sm:h-72
            md:h-80
            w-full
            object-cover
            transition-all
            duration-700
            group-hover:scale-110
          "

        />





        {/* DARK OVERLAY */}


        <div className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/30
          to-transparent
          opacity-0
          group-hover:opacity-100
          transition
        " />







        {/* PREMIUM BADGE */}


        <div
          className="
            absolute
            top-4
            left-4
            px-4
            py-2
            rounded-full
            bg-gradient-to-r
            from-yellow-400
            to-amber-500
            text-black
            text-xs
            font-black
            shadow-xl
          "
        >

          ✨ Premium

        </div>







        {/* PRICE */}


        <div
          className="
            absolute
            bottom-4
            right-4
            px-5
            py-3
            rounded-full
            bg-white/95
            backdrop-blur
            shadow-xl
            font-black
            text-blue-900
          "
        >

          ৳ {product.price}

        </div>



      </div>








      {/* CONTENT */}



      <div className="
        p-6
      ">



        <h3
          className="
            text-xl
            font-black
            text-slate-900
            line-clamp-1
          "
        >

          {product.name}

        </h3>






        {/* RATING */}


        <ProductRating

          productId={
            product.id
          }

        />







        <p
          className="
            mt-4
            text-gray-500
            text-sm
            leading-6
            line-clamp-2
          "
        >

          {product.description}

        </p>









        {/* STOCK */}


        <div className="
          mt-5
        ">


          {
            product.stock > 0

            ?

            <span
              className="
                inline-flex
                items-center
                px-4
                py-2
                rounded-full
                bg-green-50
                text-green-700
                text-sm
                font-bold
              "
            >

              ✓ In Stock

            </span>


            :

            <span
              className="
                inline-flex
                items-center
                px-4
                py-2
                rounded-full
                bg-red-50
                text-red-600
                text-sm
                font-bold
              "
            >

              Out Of Stock

            </span>


          }


        </div>









        {/* ACTION BUTTONS */}



        <div className="
          grid
          grid-cols-2
          gap-3
          mt-7
        ">



          <Button

            onClick={handleAdd}

            className="
              rounded-2xl
              bg-gradient-to-r
              from-blue-900
              to-yellow-500
              text-white
              font-bold
              hover:shadow-xl
            "

          >

            🛒 Add Cart

          </Button>








          <Button

            onClick={()=>

              navigate(
                `/product/${product.id}`
              )

            }


            className="
              rounded-2xl
              bg-slate-900
              hover:bg-black
              font-bold
            "

          >

            👁 View

          </Button>




        </div>





      </div>





    </div>

  );

}
