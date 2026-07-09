import { useEffect, useState } from "react";

import useAuth from "../hooks/useAuth";

import {
  getUserOrders,
} from "../services/orderService";

import {
  errorToast,
} from "../components/ui/Toast";



export default function MyOrders() {


  const {
    user
  } = useAuth();



  const [
    orders,
    setOrders
  ] = useState([]);



  const [
    loading,
    setLoading
  ] = useState(true);






  useEffect(()=>{


    const loadOrders =
      async()=>{


        if(!user){

          setLoading(false);

          return;

        }




        try{


          const data =
            await getUserOrders(
              user.email
            );


          setOrders(data);



        }catch(err){


          console.log(err);


          errorToast(
            "Failed to load orders."
          );


        }




        setLoading(false);


      };



    loadOrders();


  },[user]);









  if(!user){

    return (

      <div className="max-w-6xl mx-auto py-20 text-center">

        Please login first.

      </div>

    );

  }







  if(loading){

    return (

      <div className="max-w-6xl mx-auto py-20 text-center">

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

          <div className="bg-white rounded-3xl shadow p-10 text-center">


            <h2 className="text-2xl font-bold">

              No Orders Found

            </h2>



            <p className="text-gray-500 mt-3">

              You haven't placed any order yet.

            </p>


          </div>


        )

        :


        (

          <div className="space-y-8">


          {
            orders.map(order=>(


              <div

                key={order.id}

                className="bg-white rounded-3xl shadow-lg p-6"

              >




                <div className="flex justify-between items-center border-b pb-4">


                  <div>

                    <h2 className="font-bold text-lg">

                      Order ID

                    </h2>


                    <p className="text-sm text-gray-500 break-all">

                      {order.id}

                    </p>


                  </div>





                  <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">

                    {order.status}

                  </span>


                </div>








                <div className="mt-6 space-y-4">


                {
                  order.items?.map(item=>(


                    <div

                      key={item.id}

                      className="flex items-center gap-4 border-b pb-4"

                    >



                      <img

                        src={item.image}

                        alt={item.name}

                        className="w-20 h-20 rounded-xl object-cover"

                      />





                      <div className="flex-1">


                        <h3 className="font-bold">

                          {item.name}

                        </h3>


                        <p className="text-gray-600">

                          Qty: {item.quantity}

                        </p>


                      </div>





                      <p className="font-bold">

                        ৳
                        {
                          item.price *
                          item.quantity

                        }

                      </p>




                    </div>


                  ))

                }


                </div>








                <div className="mt-6 space-y-2">


                  <div className="flex justify-between">

                    <span>
                      Total
                    </span>


                    <span className="font-bold">

                      ৳ {order.total}

                    </span>

                  </div>





                  <div className="flex justify-between">

                    <span>
                      Address
                    </span>


                    <span className="text-gray-600">

                      {order.address}

                    </span>


                  </div>





                  <div className="flex justify-between">

                    <span>
                      Date
                    </span>


                    <span>

                      {new Date(
                        order.createdAt
                      ).toLocaleString()}

                    </span>


                  </div>



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
