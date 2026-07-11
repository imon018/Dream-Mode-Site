import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";

import {
  useNavigate,
} from "react-router-dom";

import {
  FiShoppingBag,
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";


export default function CartPage() {


  const {

    cart,

    removeFromCart,

    updateQuantity,

    clearCart,

  } = useCart();




  const {
    user
  } = useAuth();




  const navigate =
    useNavigate();





  const total =

    cart.reduce(

      (sum,item)=>

      sum +

      item.price *

      item.quantity,

      0

    );





  const handleCheckout = ()=>{


    if(!user){

      navigate(
        "/login?redirect=checkout"
      );

      return;

    }


    navigate("/checkout");


  };





  return (

    <div
      className="
        min-h-screen

        bg-gradient-to-b
        from-slate-50
        to-white

        px-4
        md:px-8

        py-10
        md:py-16
      "
    >


      <div
        className="
          max-w-7xl
          mx-auto
        "
      >



        {/* HEADER */}


        <div
          className="
            mb-10
          "
        >

          <h1
            className="
              text-3xl
              md:text-5xl

              font-black

              text-slate-900
            "
          >

            Shopping Cart

          </h1>


          <p
            className="
              mt-2
              text-gray-500
            "
          >

            Review your selected items before checkout

          </p>


        </div>





        {
          cart.length === 0 ?


          (

            <div
              className="
                bg-white

                rounded-[32px]

                shadow-xl

                border
                border-amber-500/20

                p-10
                md:p-16

                text-center
              "
            >


              <div
                className="
                  w-24
                  h-24

                  mx-auto

                  rounded-full

                  bg-[#071F57]

                  border
                  border-amber-500

                  flex
                  items-center
                  justify-center
                "
              >

                <FiShoppingBag
                  size={45}
                  className="
                    text-white
                  "
                />

              </div>




              <h2
                className="
                  mt-8

                  text-3xl

                  font-black
                "
              >

                Your Cart is Empty

              </h2>




              <p
                className="
                  mt-3

                  text-gray-500
                "
              >

                Looks like you haven't added anything yet.

              </p>





              <button

                onClick={()=>navigate("/shop")}

                className="
                  mt-8

                  px-8
                  py-3

                  rounded-xl

                  bg-[#071F57]

                  border
                  border-amber-500

                  text-white

                  font-bold

                  hover:scale-105

                  transition

                  shadow-lg
                "
              >

                Continue Shopping

              </button>



            </div>


          )


          :


          (

            <div
              className="
                grid

                lg:grid-cols-3

                gap-8
              "
            >



              {/* PRODUCT LIST */}


              <div
                className="
                  lg:col-span-2

                  space-y-5
                "
              >


                {
                  cart.map((item)=>(


                    <div

                      key={item.id}

                      className="
                        bg-white

                        rounded-[30px]

                        border
                        border-amber-500/20

                        shadow-lg

                        p-4
                        md:p-5

                        flex

                        gap-4

                        items-center
                      "

                    >



                      <img

                        src={item.image}

                        alt={item.name}

                        className="
                          w-24
                          h-24

                          md:w-32
                          md:h-32

                          rounded-2xl

                          object-cover
                        "

                      />




                      <div
                        className="
                          flex-1
                        "
                      >


                        <h3
                          className="
                            font-black

                            text-slate-900
                          "
                        >

                          {item.name}

                        </h3>


                        <p
                          className="
                            mt-1

                            text-amber-600

                            font-bold
                          "
                        >

                          ৳ {item.price}

                        </p>





                        <div
                          className="
                            flex

                            items-center

                            gap-3

                            mt-4
                          "
                        >

                          <button
                            onClick={()=>updateQuantity(
                              item.id,
                              item.quantity - 1
                            )}

                            className="
                              w-8
                              h-8

                              rounded-lg

                              border

                              flex

                              items-center

                              justify-center
                            "
                          >

                            <FiMinus size={14}/>

                          </button>



                          <span
                            className="
                              font-bold
                            "
                          >

                            {item.quantity}

                          </span>




                          <button
                            onClick={()=>updateQuantity(
                              item.id,
                              item.quantity + 1
                            )}

                            className="
                              w-8
                              h-8

                              rounded-lg

                              border

                              flex

                              items-center

                              justify-center
                            "
                          >

                            <FiPlus size={14}/>

                          </button>


                        </div>


                      </div>




                      <button

                        onClick={()=>removeFromCart(item.id)}

                        className="
                          w-10
                          h-10

                          rounded-xl

                          bg-red-50

                          text-red-500

                          flex

                          items-center

                          justify-center
                        "
                      >

                        <FiTrash2/>

                      </button>



                    </div>


                  ))
                }


              </div>

                            {/* ORDER SUMMARY */}


              <div
                className="
                  bg-white

                  rounded-[32px]

                  border
                  border-amber-500/20

                  shadow-xl

                  p-6

                  h-fit

                  lg:sticky

                  lg:top-28
                "
              >



                <h2
                  className="
                    text-2xl

                    font-black

                    text-slate-900
                  "
                >

                  Order Summary

                </h2>





                <div
                  className="
                    flex

                    justify-between

                    mt-6

                    text-gray-600
                  "
                >

                  <span>
                    Subtotal
                  </span>


                  <span
                    className="
                      font-semibold
                    "
                  >
                    ৳ {total}
                  </span>


                </div>





                <div
                  className="
                    flex

                    justify-between

                    mt-3

                    text-gray-600
                  "
                >

                  <span>
                    Delivery
                  </span>


                  <span
                    className="
                      font-semibold
                    "
                  >

                    Calculated at checkout

                  </span>


                </div>





                <div
                  className="
                    border-t

                    border-gray-200

                    my-6
                  "
                />





                <div
                  className="
                    flex

                    justify-between

                    text-xl

                    font-black
                  "
                >

                  <span>
                    Total
                  </span>


                  <span
                    className="
                      text-amber-500
                    "
                  >

                    ৳ {total}

                  </span>


                </div>







                {/* CHECKOUT BUTTON */}


                <button

                  onClick={handleCheckout}

                  className="
                    mt-8

                    w-full

                    h-12

                    rounded-xl


                    bg-[#071F57]


                    border

                    border-amber-500


                    text-white


                    font-bold


                    flex

                    items-center

                    justify-center


                    gap-2


                    hover:scale-[1.03]


                    transition


                    shadow-lg
                  "

                >

                  Proceed To Checkout


                  <FiArrowRight
                    size={18}
                  />


                </button>







                {/* CLEAR CART */}


                <button

                  onClick={clearCart}

                  className="
                    mt-5

                    w-full

                    text-red-500

                    font-semibold

                    hover:text-red-700

                    transition
                  "

                >

                  Clear Cart

                </button>





              </div>



            </div>


          )

        }



      </div>


    </div>

  );

}
