import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import {
  getUserOrders,
  requestCancelOrder,
  requestReturnOrder,
} from "../services/orderService";

import {
  successToast,
  errorToast,
} from "../components/ui/Toast";

export default function MyOrders() {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [processingId, setProcessingId] =
    useState("");



  useEffect(() => {

    const loadOrders =
      async () => {

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
                )

                -

                new Date(
                  a.createdAt
                )

            );

          setOrders(sorted);

        } catch (error) {

          console.log(error);

          errorToast(
            "Failed to load orders."
          );

        } finally {

          setLoading(false);

        }

      };

    loadOrders();

  }, [user]);



  const statusStyle =
    (status) => {

      if (status === "Delivered")
        return "bg-green-100 text-green-700";

      if (status === "Shipped")
        return "bg-purple-100 text-purple-700";

      if (status === "Processing")
        return "bg-blue-100 text-blue-700";

      if (status === "Cancelled")
        return "bg-red-100 text-red-700";

      return "bg-yellow-100 text-yellow-700";

    };



  const handleCancelRequest =
    async (id) => {

      try {

        setProcessingId(id);

        await requestCancelOrder(id);

        setOrders((prev) =>

          prev.map((order) =>

            order.id === id

              ? {
                  ...order,
                  cancelRequested: true,
                }

              : order

          )

        );

        successToast(
          "Cancel request sent."
        );

      } catch (error) {

        console.log(error);

        errorToast(
          "Failed to send request."
        );

      } finally {

        setProcessingId("");

      }

    };

  const handleReturnRequest =
    async (id) => {

      try {

        setProcessingId(id);

        await requestReturnOrder(id);

        setOrders((prev) =>

          prev.map((order) =>

            order.id === id

              ? {
                  ...order,
                  returnRequested: true,
                }

              : order

          )

        );

        successToast(
          "Return request sent."
        );

      } catch (error) {

        console.log(error);

        errorToast(
          "Failed to send request."
        );

      } finally {

        setProcessingId("");

      }

    };



  if (!user) {

    return (

      <div className="text-center py-20">

        Please login first.

      </div>

    );

  }



  if (loading) {

    return (

      <div className="text-center py-20">

        Loading Orders...

      </div>

    );

  }



  return (

    <div className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold mb-8">

        My Orders

      </h1>



      {

        orders.length === 0

          ?

          (

            <div className="bg-white shadow rounded-3xl p-10 text-center">

              <h2 className="text-2xl font-bold">

                No Orders Found

              </h2>

              <p className="text-gray-500 mt-3">

                You have not placed any order yet.

              </p>

            </div>

          )

          :

          (

            <div className="space-y-8">

              {

                orders.map((order) => (

                  <div

                    key={order.id}

                    className="bg-white rounded-3xl shadow-lg p-6"

                  >

                    <div className="flex justify-between items-start border-b pb-5">

                      <div>

                        <h2 className="font-bold text-lg">

                          Order ID

                        </h2>

                        <p className="text-sm text-gray-500 break-all">

                          {order.id}

                        </p>

                      </div>

                      <span

                        className={`px-4 py-2 rounded-full text-sm font-semibold ${statusStyle(order.status)}`}

                      >

                        {order.status}

                      </span>

                    </div>

                                        <div className="mt-6">

                      <h3 className="font-bold text-xl mb-4">

                        Products

                      </h3>

                      <div className="space-y-4">

                        {

                          order.items?.map(

                            (item, index) => (

                              <div

                                key={index}

                                className="flex items-center justify-between border-b pb-4"

                              >

                                <div className="flex items-center gap-4">

                                  <img

                                    src={
                                      item.image ||
                                      "https://via.placeholder.com/80"
                                    }

                                    alt={item.name}

                                    className="w-20 h-20 rounded-xl object-cover"

                                  />

                                  <div>

                                    <h4 className="font-bold">

                                      {item.name}

                                    </h4>

                                    <p className="text-gray-500">

                                      Quantity: {item.quantity || 1}

                                    </p>

                                  </div>
                                  
                                  <button

  onClick={() =>
    navigate(
      `/product/${item.id}`
    )
  }

  className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-lg text-sm"

>

  View Product

</button>

                                </div>

                                <p className="font-bold">

                                  ৳

                                  {

                                    item.price *

                                    (item.quantity || 1)

                                  }

                                </p>

                              </div>

                            )

                          )

                        }

                      </div>

                    </div>



                    <div className="mt-6 space-y-3">

                      <div className="flex justify-between">

                        <span>Total</span>

                        <span className="font-bold">

                          ৳ {order.total}

                        </span>

                      </div>



                      <div className="flex justify-between gap-5">

                        <span>Address</span>

                        <span className="text-gray-600 text-right">

                          {order.address}

                        </span>

                      </div>



                      <div className="flex justify-between">

                        <span>Date</span>

                        <span>

                          {

                            new Date(

                              order.createdAt

                            ).toLocaleString()

                          }

                        </span>

                      </div>

                    </div>



                    <div className="mt-6 flex gap-4">

                                            {

                        (order.status === "Pending" ||

                         order.status === "Processing") && (

                          <button

                            onClick={() =>

                              handleCancelRequest(order.id)

                            }

                            disabled={

                              processingId === order.id ||

                              order.cancelRequested

                            }

                            className="bg-red-600 text-white px-5 py-2 rounded-xl disabled:opacity-50"

                          >

                            {

                              order.cancelRequested

                                ? "Cancel Requested"

                                : processingId === order.id

                                ? "Sending..."

                                : "Cancel Order"

                            }

                          </button>

                        )

                      }



                      {

                        order.status === "Delivered" && (

                          <button

                            onClick={() =>

                              handleReturnRequest(order.id)

                            }

                            disabled={

                              processingId === order.id ||

                              order.returnRequested

                            }

                            className="bg-blue-600 text-white px-5 py-2 rounded-xl disabled:opacity-50"

                          >

                            {

                              order.returnRequested

                                ? "Return Requested"

                                : processingId === order.id

                                ? "Sending..."

                                : "Return Order"

                            }

                          </button>

                        )

                      }

                    </div>

                  </div>

                ))

              }

            </div>

          )

      }

    </div>

  );

}

