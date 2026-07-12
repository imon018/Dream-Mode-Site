import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  FiCheckCircle,
  FiShoppingBag,
} from "react-icons/fi";



export default function OrderSuccess(){


  const location =
    useLocation();



  const orderId =
    location.state?.orderId;



  return (

    <div
      className="
        min-h-screen
        bg-[#FCFAF5]
        flex
        items-center
        justify-center

        px-4
        md:px-8

        py-12
      "
    >



      <div
        className="
          w-full
          max-w-lg

          bg-white

          rounded-[36px]

          border
          border-amber-500/20

          shadow-xl

          p-8
          md:p-10

          text-center
        "
      >




        {/* ICON */}


        <div
          className="
            w-24
            h-24

            mx-auto

            rounded-full

            bg-amber-50

            border
            border-amber-500/30

            flex
            items-center
            justify-center

            mb-6
          "
        >

          <FiCheckCircle
            size={55}
            className="
              text-amber-500
            "
          />

        </div>







        <h1
          className="
            text-4xl
            md:text-5xl

            font-black

            text-black
          "
        >

          Order Successful

        </h1>





        <p
          className="
            mt-4

            text-gray-500

            leading-relaxed
          "
        >

          Thank you for shopping with
          <span
            className="
              font-bold
              text-black
              mx-1
            "
          >
            Dream Mode
          </span>

          Your order has been placed successfully.

        </p>








        {
          orderId && (

            <div
              className="
                mt-8

                bg-[#FCFAF5]

                border
                border-amber-500/20

                rounded-2xl

                p-5
              "
            >

              <p
                className="
                  text-sm
                  text-gray-500
                "
              >

                Order ID

              </p>



              <p
                className="
                  mt-2

                  font-bold

                  text-sm

                  break-all

                  text-black
                "
              >

                {orderId}

              </p>


            </div>

          )
        }








        <div
          className="
            mt-8

            flex
            flex-col

            gap-4
          "
        >



          <Link
            to="/profile/orders"

            className="
              h-14

              rounded-2xl

              bg-black

              border
              border-amber-500

              text-white

              font-bold

              flex
              items-center
              justify-center

              gap-2

              transition

              hover:scale-[1.02]
            "
          >

            <FiShoppingBag size={20}/>

            View My Orders

          </Link>






          <Link
            to="/shop"

            className="
              h-14

              rounded-2xl

              border
              border-amber-500

              text-amber-600

              font-bold

              flex
              items-center
              justify-center

              transition

              hover:bg-amber-50
            "
          >

            Continue Shopping

          </Link>




        </div>






      </div>




    </div>

  );

}
