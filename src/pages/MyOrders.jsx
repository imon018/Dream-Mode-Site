import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

import {
  FiPackage,
  FiChevronRight,
} from "react-icons/fi";

import {
  getUserOrders,
} from "../services/orderService";

import {
  errorToast,
} from "../components/ui/Toast";

export default function MyOrders() {

  const { user } = useAuth();

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [filter, setFilter] =
    useState("All");



  useEffect(() => {

    async function loadOrders() {

      if (!user) {

        setLoading(false);

        return;

      }

      try {

        const data =
          await getUserOrders(
            user.email
          );

        const sorted =
          data.sort(

            (a, b) =>

              new Date(
                b.createdAt
              ) -

              new Date(
                a.createdAt
              )

          );

        setOrders(sorted);

      }

      catch (error) {

        console.log(error);

        errorToast(
          "Failed to load orders."
        );

      }

      finally {

        setLoading(false);

      }

    }

    loadOrders();

  }, [user]);



  const tabs = [

    "All",

    "Pending",

    "Processing",

    "Shipped",

    "Delivered",

    "Cancelled",

  ];



  const filteredOrders =
    useMemo(() => {

      if (filter === "All")
        return orders;

      return orders.filter(

        order =>
          order.status === filter

      );

    }, [
      orders,
      filter,
    ]);



  const totalOrders =
    orders.length;



  const totalSpent =
    orders.reduce(

      (sum, order) =>

        sum +

        Number(
          order.total || 0
        ),

      0

    );



  function statusStyle(status) {

    if (status === "Delivered") {

      return "bg-green-100 text-green-700";

    }

    if (status === "Processing") {

      return "bg-blue-100 text-blue-700";

    }

    if (status === "Shipped") {

      return "bg-purple-100 text-purple-700";

    }

    if (status === "Cancelled") {

      return "bg-red-100 text-red-700";

    }

    return "bg-yellow-100 text-yellow-700";

  }



  if (!user) {

    return (

      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        "
      >

        Please login first.

      </div>

    );

  }



  if (loading) {

    return (

      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        font-bold
        "
      >

        Loading Orders...

      </div>

    );

  }



  return (

    <div
      className="
      bg-[#faf9f6]
      min-h-screen
      p-4
      space-y-4
      "
    >

            {/* HEADER */}

      <h1
        className="
        text-xl
        font-bold
        "
      >
        My Orders
      </h1>



      {/* FILTER */}

      <div
        className="
        flex
        gap-2
        overflow-x-auto
        pb-1
        no-scrollbar
        "
      >

        {

          tabs.map((tab)=>(

            <button

              key={tab}

              onClick={()=>
                setFilter(tab)
              }

              className={`
              whitespace-nowrap
              px-4
              h-9
              rounded-full
              text-xs
              font-bold
              border
              transition

              ${
                filter===tab

                ?

                "bg-amber-500 text-white border-amber-500"

                :

                "bg-white border-gray-100 text-gray-600"

              }

              `}

            >

              {tab}

            </button>

          ))

        }

      </div>



      {/* SUMMARY */}

      <div
        className="
        bg-white
        border
        border-gray-100
        rounded-lg
        p-4
        shadow-sm
        flex
        justify-between
        items-center
        "
      >

        <div
          className="
          flex
          gap-8
          "
        >

          <div>

            <p
              className="
              text-xs
              text-gray-500
              "
            >
              Total Orders
            </p>

            <h2
              className="
              mt-1
              text-2xl
              font-black
              "
            >
              {totalOrders}
            </h2>

          </div>



          <div>

            <p
              className="
              text-xs
              text-gray-500
              "
            >
              Total Spent
            </p>

            <h2
              className="
              mt-1
              text-2xl
              font-black
              "
            >
              ৳ {totalSpent}
            </h2>

          </div>

        </div>



        <div
          className="
          w-12
          h-12
          rounded-full
          bg-amber-50
          flex
          items-center
          justify-center
          text-amber-600
          text-xl
          "
        >

          📦

        </div>

      </div>



      {

        filteredOrders.length===0

        ?

        (

          <div
            className="
            bg-white
            border
            border-gray-100
            rounded-lg
            p-8
            shadow-sm
            text-center
            "
          >

            <h2
              className="
              text-lg
              font-bold
              "
            >
              No Orders Found
            </h2>

            <p
              className="
              text-sm
              text-gray-500
              mt-2
              "
            >
              No orders available in this status.
            </p>

          </div>

        )

        :

        (

          <div
            className="
            space-y-4
            "
          >

            {

  filteredOrders.map((order)=>(

    <div

      key={order.id}

      className="
      bg-white
      border
      border-gray-100
      rounded-lg
      p-4
      shadow-sm
      "

    >



      {/* TOP */}

      <div
        className="
        flex
        justify-between
        items-start
        "
      >

        <div>

          <div
            className="
            flex
            items-center
            gap-2
            "
          >

            <FiPackage
              className="
              text-amber-500
              "
            />

            <h2
              className="
              font-bold
              text-sm
              "
            >

              Order #

              {order.id?.slice(0,8)}

            </h2>

          </div>



          <p
            className="
            text-xs
            text-gray-500
            mt-1
            "
          >

            {

              new Date(
                order.createdAt
              ).toLocaleString()

            }

          </p>

        </div>



        <span

          className={`
          text-xs
          font-bold
          px-3
          py-1.5
          rounded-full

          ${
            statusStyle(
              order.status
            )
          }

          `}

        >

          {order.status}

        </span>

      </div>



      <hr
        className="
        my-4
        border-gray-100
        "
      />



      {/* PRODUCT */}

      <div
        className="
        flex
        justify-between
        items-center
        "
      >

        <div
          className="
          flex
          items-center
          gap-3
          "
        >

          <img

            src={
              order.items?.[0]?.image ||

              "https://via.placeholder.com/60"
            }

            className="
            w-16
            h-16
            rounded-lg
            object-cover
            bg-gray-50
            "

          />



          <div>

            <h3
              className="
              font-bold
              text-sm
              "
            >

              {

                order.items?.[0]?.name

              }

            </h3>



            <p
              className="
              text-xs
              text-gray-500
              mt-1
              "
            >

              Qty :

              {

                order.items?.[0]?.quantity || 1

              }

            </p>

          </div>

        </div>



        <p
          className="
          font-bold
          text-base
          "
        >

          ৳

          {

            Number(
              order.items?.[0]?.price || 0
            )

            *

            Number(
              order.items?.[0]?.quantity || 1
            )

          }

        </p>

      </div>



      <hr
        className="
        my-4
        border-gray-100
        "
      />



      {/* VIEW DETAILS */}

      <button

        onClick={()=>

          navigate(

            `/profile/orders/${order.id}`

          )

        }

        className="
        w-full
        flex
        justify-between
        items-center
        text-sm
        font-bold
        text-amber-600
        "

      >

        <span>

          View Details

        </span>

        <FiChevronRight
          size={18}
        />

      </button>

    </div>

  ))

}

                      </div>

        )

      }

    </div>

  );

}
