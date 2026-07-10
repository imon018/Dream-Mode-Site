import {
  Link,
} from "react-router-dom";


import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import useWishlist from "../hooks/useWishlist";



export default function Navbar() {


  const {
    cart,
  } = useCart();



  const {
    user,
  } = useAuth();




  const {
    wishlistCount,
  } = useWishlist();





  return (


    <nav

      className="
        sticky
        top-0
        z-50
        bg-white/90
        backdrop-blur-xl
        border-b
        border-yellow-100
        shadow-lg
        px-4
        md:px-8
        py-4
      "

    >




      <div className="
        max-w-7xl
        mx-auto
        flex
        justify-between
        items-center
      ">




        {/* LOGO */}



        <Link

          to="/"

          className="
            text-2xl
            md:text-3xl
            font-black
            bg-gradient-to-r
            from-blue-900
            to-yellow-500
            bg-clip-text
            text-transparent
          "

        >

          Dream Mode ✨

        </Link>







        {/* MENU */}



        <div

          className="
            flex
            items-center
            gap-3
            md:gap-6
            text-sm
            md:text-base
            font-semibold
          "

        >




          <Link

            to="/"

            className="
              hover:text-blue-700
              transition
            "

          >

            Home

          </Link>





          <Link

            to="/shop"

            className="
              hover:text-blue-700
              transition
            "

          >

            Shop

          </Link>








          {/* WISHLIST */}



          <Link

            to="/wishlist"

            className="
              relative
              flex
              items-center
              gap-1
              hover:scale-105
              transition
            "

          >

            <span className="
              text-xl
            ">
              ❤️
            </span>


            <span className="
              hidden
              md:block
            ">
              Wishlist
            </span>





            {
              wishlistCount > 0 &&


              <span

                className="
                  absolute
                  -top-3
                  -right-3
                  min-w-[22px]
                  h-[22px]
                  px-1
                  rounded-full
                  bg-gradient-to-r
                  from-yellow-400
                  to-orange-500
                  text-black
                  text-xs
                  font-black
                  flex
                  items-center
                  justify-center
                  shadow-lg
                "

              >

                {wishlistCount}

              </span>


            }



          </Link>









          {/* CART */}



          <Link

            to="/cart"

            className="
              relative
              flex
              items-center
              gap-1
              hover:scale-105
              transition
            "

          >

            <span className="
              text-xl
            ">
              🛒
            </span>



            <span className="
              hidden
              md:block
            ">
              Cart
            </span>





            {
              cart.length > 0 &&


              <span

                className="
                  absolute
                  -top-3
                  -right-3
                  min-w-[22px]
                  h-[22px]
                  px-1
                  rounded-full
                  bg-blue-900
                  text-white
                  text-xs
                  font-black
                  flex
                  items-center
                  justify-center
                  shadow-lg
                "

              >

                {cart.length}

              </span>


            }




          </Link>









          {/* USER */}



          {
            user

            ?

            <Link

              to="/profile"

              className="
                px-4
                py-2
                rounded-full
                bg-blue-50
                text-blue-900
                font-bold
                hover:bg-blue-100
                transition
              "

            >

              👤
              {
                user.email
                .split("@")[0]
              }

            </Link>



            :


            <Link

              to="/login"

              className="
                px-5
                py-2
                rounded-full
                bg-gradient-to-r
                from-blue-900
                to-yellow-500
                text-white
                font-bold
                hover:scale-105
                transition
              "

            >

              Login

            </Link>


          }





        </div>





      </div>




    </nav>


  );


}
