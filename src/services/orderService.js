import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";


import {
  db
} from "../firebase/firestore";


import {
  createAdminNotification,
  createUserNotification,
} from "../utils/notificationHelper";





const orderRef =
collection(
  db,
  "orders"
);








// =================================
// CREATE ORDER (CUSTOMER)
// =================================


export const createOrder =
async(order)=>{


  const docRef =
  await addDoc(
    orderRef,
    order
  );





  // User Notification

  if(order.userId){


    await createUserNotification({

      userId:
      order.userId,


      title:
      "🛒 Order Placed",


      message:
      "Your order has been placed successfully.",


      type:
      "order",

    });


  }






  // Admin Notification


  await createAdminNotification({

    title:
    "📦 New Order Received",


    message:
    `${order.customerName || "Customer"} placed a new order.`,


    type:
    "order",

  });






  return docRef.id;


};









// =================================
// GET USER ORDERS
// =================================


export const getUserOrders =
async(email)=>{


  const q =
  query(

    orderRef,

    where(
      "email",
      "==",
      email
    )

  );



  const snapshot =
  await getDocs(q);



  return snapshot.docs.map(

    (item)=>({

      id:item.id,

      ...item.data(),

    })

  );


};









// =================================
// GET ALL ORDERS ADMIN
// =================================


export const getAllOrders =
async()=>{


  const snapshot =
  await getDocs(
    orderRef
  );



  return snapshot.docs.map(

    (item)=>(

      {

        id:item.id,

        ...item.data(),

      }

    )

  );


};









// =================================
// UPDATE ORDER STATUS
// =================================


export const updateOrderStatus =
async(
  id,
  status
)=>{


  const orderDoc =
  doc(
    db,
    "orders",
    id
  );





  // Get Order Data

  const orderSnapshot =
  await getDoc(
    orderDoc
  );



  if(
    !orderSnapshot.exists()
  ){

    throw new Error(
      "Order not found"
    );

  }




  const order =
  orderSnapshot.data();






  await updateDoc(

    orderDoc,

    {

      status,

    }

  );








  let title =
  "";

  let message =
  "";





  switch(status){


    case "Confirmed":

      title =
      "✅ Order Confirmed";


      message =
      "Your order has been confirmed.";

      break;





    case "Shipped":

      title =
      "🚚 Order Shipped";


      message =
      "Your order is on the way.";

      break;





    case "Delivered":

      title =
      "🎉 Order Delivered";


      message =
      "Your order has been delivered successfully.";

      break;





    case "Cancelled":

      title =
      "❌ Order Cancelled";


      message =
      "Your order has been cancelled.";

      break;





    default:

      title =
      "📦 Order Updated";


      message =
      `Your order status changed to ${status}.`;



  }







  // Customer Notification


  if(order.userId){


    await createUserNotification({

      userId:
      order.userId,


      title,


      message,


      type:
      "order",

    });


  }





};









// =================================
// ADMIN ADD ORDER
// =================================


export const addOrderByAdmin =
async(order)=>{


  const docRef =
  await addDoc(

    orderRef,

    order

  );




  // Customer notification


  if(order.userId){


    await createUserNotification({

      userId:
      order.userId,


      title:
      "🛒 Order Created",


      message:
      "An order has been created for you.",


      type:
      "order",

    });


  }






  return docRef.id;


};









// =================================
// DELETE ORDER
// =================================


export const deleteOrder =
async(id)=>{


  await deleteDoc(

    doc(
      db,
      "orders",
      id
    )

  );


};









// =================================
// CANCEL REQUEST
// =================================


export const requestCancelOrder =
async(id)=>{


  await updateDoc(

    doc(
      db,
      "orders",
      id
    ),

    {

      cancelRequested:true,

    }

  );


};









// =================================
// RETURN REQUEST
// =================================


export const requestReturnOrder =
async(id)=>{


  await updateDoc(

    doc(
      db,
      "orders",
      id
    ),

    {

      returnRequested:true,

    }

  );


};
