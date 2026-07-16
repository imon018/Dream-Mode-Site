import {
  Link,
  useLocation
} from "react-router-dom";

import useCart from "../hooks/useCart";



export default function MobileBottomNav() {


  const location =
    useLocation();


  const {
    cartCount
  } = useCart();




  const isActive = (path) =>
    location.pathname === path;




  return (

    <div

      className="
      md:hidden

      fixed

      bottom-0
      left-0
      right-0

      z-[999]

      px-3
      pb-3
      "

    >


      <div

        className="
        grid
        grid-cols-4

        h-16

        rounded-[24px]

        bg-white/95

        backdrop-blur-xl

        border
        border-slate-200

        shadow-xl
        "

      >



        {/* HOME */}

        <Link

          to="/"

          className={`
          flex
          flex-col
          items-center
          justify-center

          transition

          ${
            isActive("/")
            ?
            "text-yellow-500"
            :
            "text-slate-500"
          }

          `}

        >

          <span className="text-xl">
            🏠
          </span>

          <span
            className="
            text-xs
            font-medium
            "
          >
            Home
          </span>


        </Link>





        {/* SHOP */}


        <Link

          to="/shop"

          className={`
          flex
          flex-col
          items-center
          justify-center

          transition

          ${
            isActive("/shop")
            ?
            "text-yellow-500"
            :
            "text-slate-500"
          }

          `}

        >


          <span className="text-xl">
            🛍
          </span>


          <span
            className="
            text-xs
            font-medium
            "
          >
            Shop
          </span>


        </Link>






        {/* CART */}


        <Link

          to="/cart"

          className={`
          relative

          flex
          flex-col
          items-center
          justify-center

          transition

          ${
            isActive("/cart")
            ?
            "text-yellow-500"
            :
            "text-slate-500"
          }

          `}

        >


          <span className="text-xl">
            🛒
          </span>



          {
            cartCount > 0 &&

            <span

              className="
              absolute

              top-1

              right-5

              bg-red-500

              text-white

              text-[10px]

              min-w-[18px]

              h-[18px]

              rounded-full

              flex
              items-center
              justify-center
              "

            >

              {cartCount}

            </span>

          }





          <span
            className="
            text-xs
            font-medium
            "
          >

            Cart

          </span>


        </Link>







        {/* PROFILE */}


        <Link

          to="/profile"

          className={`
          flex
          flex-col
          items-center
          justify-center

          transition

          ${
            location.pathname.startsWith("/profile")
            ?
            "text-yellow-500"
            :
            "text-slate-500"
          }

          `}

        >


          <span className="text-xl">
            👤
          </span>


          <span
            className="
            text-xs
            font-medium
            "
          >

            Profile

          </span>


        </Link>




      </div>


    </div>


  );

}
