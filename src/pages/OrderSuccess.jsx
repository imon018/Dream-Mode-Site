import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firestore";


import {
  FiCheckCircle,
  FiPackage,
  FiCalendar,
  FiTruck,
  FiCreditCard,
  FiShoppingBag,
  FiHeadphones,
  FiHome,
} from "react-icons/fi";


import { IoShieldCheckmarkSharp } from "react-icons/io5";

import { useSettings } from "../context/SettingsContext";

import { getEffectivePrice } from "../utils/helpers";



export default function OrderSuccess(){


  const navigate = useNavigate();

  const location = useLocation();

  const orderId =
    location.state?.orderId;

  const [order,setOrder] = useState(null);

  const [loading,setLoading] = useState(true);

  const { settings } = useSettings();


  const confetti = [
    {
      left:"20%",
      top:"15%",
      color:"bg-green-400",
      delay:"0s"
    },
    {
      left:"35%",
      top:"8%",
      color:"bg-yellow-400",
      delay:"0.3s"
    },
    {
      left:"50%",
      top:"12%",
      color:"bg-purple-500",
      delay:"0.6s"
    },
    {
      left:"65%",
      top:"10%",
      color:"bg-blue-400",
      delay:"0.9s"
    },
    {
      left:"80%",
      top:"20%",
      color:"bg-orange-400",
      delay:"1.2s"
    },
    {
      left:"25%",
      top:"35%",
      color:"bg-purple-400",
      delay:"1.5s"
    },
    {
      left:"75%",
      top:"35%",
      color:"bg-green-400",
      delay:"1.8s"
    }
  ];



  useEffect(() => {

    async function loadOrder() {

      try {

        const snap = await getDoc(
          doc(db, "orders", orderId)
        );

        if (!snap.exists()) {
          setOrder(null);
          return;
        }

        const data = snap.data();

        setOrder({
          id: snap.id,
          ...data,
          items: data.items || [],
        });

      } catch (error) {
        console.log(error);
        setOrder(null);
      } finally {
        setLoading(false);
      }

    }

    if (orderId) {
      loadOrder();
    } else {
      setLoading(false);
    }

  }, [orderId]);




  if(loading){

    return (

      <div
        className="
          min-h-screen
          bg-[#FAF7F2]
          flex
          items-center
          justify-center
        "
      >

        <p className="text-gray-500">
          Loading...
        </p>

      </div>

    );

  }




  if(!order){


    return (

      <div
        className="
          min-h-screen
          bg-[#FAF7F2]
          flex
          items-center
          justify-center
          px-4
        "
      >


        <div
          className="
            bg-white
            rounded-lg
            shadow
            p-8
            text-center
          "
        >


          <h2
            className="
              text-xl
              font-bold
              text-gray-800
            "
          >

            Order Data Not Found

          </h2>


          <Link
            to="/shop"
            className="
              inline-block
              mt-5
              px-6
              py-3
              rounded-lg
              bg-black
              text-white
              font-bold
            "
          >

            Continue Shopping

          </Link>


        </div>


      </div>

    );


  }



  const displayOrderId =
    order.id
    ? "DM-" + order.id.slice(0, 8).toUpperCase()
    : "";




  const orderDate =
    order.createdAt
    ? new Date(
        order.createdAt.seconds
          ? order.createdAt.seconds * 1000
          : order.createdAt
      ).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
      })
    : "";



  const items =
    order.items || [];



  return (

    <div

      className="
        min-h-screen
        bg-[#FAF7F2]
        p-0
      "

    >


      <div

        className="
          w-full
          max-w-lg
          mx-auto
          py-6
        "

      >





        {/* SUCCESS MESSAGE CARD */}


        <div
          className="
            relative
            bg-[#fffaf0]
            py-8
            text-center
            overflow-hidden
            rounded-t-lg
          "
        >


          {/* CONFETTI / FIRE CRACKER EFFECT */}

          <div
            className="
              absolute
              inset-0
              pointer-events-none
            "
          >


            {
              confetti.map((item,index)=>(

                <span

                  key={index}

                  style={{
                    left:item.left,
                    top:item.top,
                    animationDelay:item.delay
                  }}

                  className={`
                    absolute
                    w-3
                    h-3
                    ${item.color}
                    rounded-sm
                    animate-confetti
                  `}
                >

                </span>

              ))

            }


          </div>





          {/* CHECK ICON */}


          <div
            className="
              w-24
              h-24
              mx-auto
              rounded-full
              bg-green-100
              flex
              items-center
              justify-center
              success-icon-animation
            "
          >

            <FiCheckCircle

              size={65}

              className="
                text-green-600
              "

            />

          </div>





          <h2
            className="
              relative
              z-10
              mt-6
              text-3xl
              font-black
              text-green-700
            "
          >

            Order Successful

          </h2>





          <p
            className="
              relative
              z-10
              mt-3
              text-gray-600
              leading-7
            "
          >

            Your order has been placed successfully.

            <br/>

            Thank you for trusting {settings.storeName || "us"}.

          </p>


        </div>



        <div className="mx-5">

          {/* ORDER INFORMATION */}

          <div
            className="
              -mt-px
              bg-gray-50
              rounded-b-lg
              border
              border-gray-50
              overflow-hidden
            "
          >

            {/* ORDER ID */}

            <div
              className="
                flex
                items-center
                justify-between
                px-5
                py-4
                bg-gray-50
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                <FiPackage
                  size={26}
                  className="
                    text-green-600
                  "
                />

                <div>

                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    Order Number
                  </p>

                  <p
                    className="
                      text-2xl
                      font-black
                      text-green-700
                    "
                  >
                    {displayOrderId}
                  </p>

                </div>

              </div>

            </div>



            <div className="border-t border-gray-200"/>



            {/* ORDER DATE */}

            <div
              className="
                flex
                items-center
                justify-between
                px-5
                py-4
                bg-gray-50
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                <FiCalendar
                  size={22}
                  className="
                    text-gray-600
                  "
                />

                <p
                  className="
                    text-gray-700
                    font-medium
                  "
                >
                  Order Date
                </p>

              </div>

              <p
                className="
                  text-gray-700
                  font-medium
                "
              >
                {orderDate}
              </p>

            </div>



            <div className="border-t border-gray-200"/>



            {/* PAYMENT */}

            <div
              className="
                flex
                items-center
                justify-between
                px-5
                py-4
                bg-gray-50
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                <FiCreditCard
                  size={22}
                  className="
                    text-gray-600
                  "
                />

                <p
                  className="
                    text-gray-700
                    font-medium
                  "
                >
                  Payment Method
                </p>

              </div>

              <p
                className="
                  text-gray-700
                  font-medium
                "
              >
                Cash on Delivery
              </p>

            </div>



            <div className="border-t border-gray-200"/>



            {/* DELIVERY */}

            <div
              className="
                flex
                items-center
                justify-between
                px-5
                py-4
                bg-gray-50
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                <FiTruck
                  size={22}
                  className="
                    text-gray-600
                  "
                />

                <p
                  className="
                    text-gray-700
                    font-medium
                  "
                >
                  Delivery Time
                </p>

              </div>

              <p
                className="
                  text-gray-700
                  font-medium
                "
              >
                2 - 4 Business Days
              </p>

            </div>

          </div>



          {/* PRODUCT CARD */}

          <div
            className="
              mt-4
              bg-gray-50
              rounded-lg
              border
              border-gray-200
              p-3
            "
          >

            <p
              className="
                text-lg
                font-bold
                text-gray-900
                mb-4
              "
            >
              Ordered Products
            </p>

            <div className="space-y-4">

              {

                items.map((item,index)=>{

                  const effectivePrice =
                    getEffectivePrice(item);

                  const productImage =
                    item.images?.length
                    ?
                    item.images[0]
                    :
                    item.image ||
                    "https://via.placeholder.com/600";

                  return (

                    <div

                      key={item.id || index}

                      className="
                        flex
                        items-center
                        gap-2
                      "

                    >

                      {/* PRODUCT IMAGE */}

                      <div
                        className="
                          w-24
                          h-24
                          shrink-0
                          rounded-lg
                          overflow-hidden
                          bg-gray-100
                        "
                      >

                        <img
                          src={productImage}
                          alt={item.name}
                          className="
                            w-full
                            h-full
                            object-cover
                          "
                        />

                      </div>

                      {/* PRODUCT DETAILS */}

                      <div
                        className="
                          flex-1
                          flex
                          flex-col
                          justify-between
                          self-stretch
                          min-w-0
                        "
                      >

                        <h3
                          className="
                            font-bold
                            text-lg
                            text-gray-900
                            leading-6
                            line-clamp-2
                          "
                        >
                          {item.name}
                        </h3>

                        <p
                          className="
                            text-gray-500
                            text-base
                          "
                        >
                          Quantity: {item.quantity || 1}
                        </p>

                      </div>

                      {/* PRICE */}

                      <div
                        className="
                          self-end
                          text-right
                          shrink-0
                          pb-1
                        "
                      >

                        <p
                          className="
                            text-2xl
                            font-black
                            text-purple-700
                            leading-none
                          "
                        >
                          ৳{effectivePrice}
                        </p>

                        {

                          Number(item.price) >
                          effectivePrice && (

                            <p
                              className="
                                mt-1
                                text-sm
                                text-gray-400
                                line-through
                              "
                            >
                              ৳{item.price}
                            </p>

                          )

                        }

                      </div>

                    </div>

                  );

                })

              }

            </div>

          </div>





          {/* ORDER SUMMARY */}

          <div
            className="
              mt-4
              bg-gray-50
              rounded-lg
              border
              border-gray-200
              p-5
            "
          >

            <h2
              className="
                text-lg
                font-bold
                mb-4
              "
            >
              Order Summary
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">

                <span>Sub Total</span>

                <span>
                  ৳{order.subtotal || 0}
                </span>

              </div>

              <div className="flex justify-between">

                <span>Delivery Charge</span>

                <span>
                  ৳{order.deliveryCharge || 0}
                </span>

              </div>

              <hr />

              <div
                className="
                  flex
                  justify-between
                  text-lg
                  font-black
                  text-purple-700
                "
              >

                <span>Total</span>

                <span>
                  ৳{order.total || 0}
                </span>

              </div>

            </div>

          </div>



          {/* =========================
              ORDER CONFIRMATION
          ========================= */}

          <div
            className="
              mt-3
              bg-gradient-to-r
              from-green-50
              to-lime-50
              border
              border-green-200
              rounded-lg
              px-4
              py-3
              flex
              items-start
              gap-3
            "
          >

            <IoShieldCheckmarkSharp
              size={42}
              className="
                text-green-600
                shrink-0
                mt-1
              "
            />

            <div className="flex-1 min-w-0">

              <h3
                className="
                  text-[17px]
                  font-bold
                  text-green-700
                  leading-6
                "
              >
                We have confirmed your order
              </h3>

              <p
                className="
                  mt-1
                  text-[13px]
                  text-gray-600
                  leading-5
                "
              >
                Our team is processing your order quickly.
                We will contact you shortly.
              </p>

            </div>

          </div>



          {/* HOME BUTTON */}

          <button

            type="button"
            onClick={() => navigate("/")}

            className="
              mt-5
              w-full
              bg-purple-700
              text-white
              py-3
              rounded-lg
              font-bold
              text-lg
              flex
              items-center
              justify-center
              gap-2
            "

          >

            <FiHome/>

            Go To Home

          </button>



          {/* SHOPPING BUTTON */}

          <button

            type="button"

            onClick={() => navigate("/shop")}

            className="
              mt-3
              w-full
              border
              border-purple-700
              text-purple-700
              py-3
              rounded-lg
              font-bold
              text-lg
              flex
              items-center
              justify-center
              gap-2
              hover:bg-purple-50
              transition
            "

          >

            <FiShoppingBag/>

            Continue Shopping

          </button>



          {/* SUPPORT & FEATURES */}

          <div
            className="
              mt-5
            "
          >

            {/* Help Line */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                py-5
              "
            >

              <FiHeadphones
                size={28}
                className="text-gray-700"
              />

              <div>

                <p
                  className="
                    text-gray-800
                    font-bold
                  "
                >
                  Have Any Questions?
                </p>

                <p
                  className="
                    text-[15px]
                    text-gray-600
                  "
                >
                  Help Line:
                  <span
                    className="
                      text-purple-700
                      font-bold
                      ml-1
                    "
                  >
                    {settings?.phone || settings?.phoneNumber || ""}
                  </span>
                </p>

              </div>

            </div>

            <div className="border-t border-gray-200" />

            {/* Bottom Features */}

            <div
              className="
                flex
                items-center
                justify-center
                py-4
                text-[14px]
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-green-700
                  font-medium
                "
              >

                <IoShieldCheckmarkSharp size={20} />

                Secure Payment

              </div>

              <div className="mx-5 text-gray-300">|</div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-green-700
                  font-medium
                "
              >

                <FiTruck
                  size={20}
                  className="text-green-700"
                />

                <span className="text-green-700">
                  Cash On Delivery
                </span>

              </div>

            </div>

          </div>

        </div>



      </div>


    </div>

  );

}
