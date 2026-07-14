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


import { db } from "../firebase/firestore";


import {
  sendNotification,
} from "./notificationService";





const orderRef =
  collection(
    db,
    "orders"
  );







// =========================
// Create Order (Customer)
// =========================

export const createOrder =
async (
  order
) => {


  const docRef =
    await addDoc(
      orderRef,
      {

        ...order,

        createdAt:
          new Date(),

        status:
          order.status || "Pending",

      }
    );





  // =========================
  // Customer Notification
  // =========================


  if(order.userId){


    await sendNotification({

      receiverId:
        order.userId,


      title:
        "Order Placed Successfully 🎉",


      message:
        `Your order #${docRef.id} has been placed successfully.`,


      type:
        "order",


    });


  }






  return docRef.id;


};









// =========================
// Get User Orders
// =========================

export const getUserOrders =
async (
  email
) => {


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

    (doc)=>(

      {

        id:
          doc.id,

        ...doc.data(),

      }

    )

  );


};









// =========================
// Get All Orders (Admin)
// =========================

export const getAllOrders =
async()=>{


  const snapshot =
    await getDocs(
      orderRef
    );



  return snapshot.docs.map(

    (doc)=>(

      {

        id:
          doc.id,

        ...doc.data(),

      }

    )

  );


};









// =========================
// Update Order Status
// =========================

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





  await updateDoc(

    orderDoc,

    {

      status,

    }

  );







  // Get order info

  const orderSnap =
    await getDoc(
      orderDoc
    );





  if(
    orderSnap.exists()
  ){


    const order =
      orderSnap.data();





    if(
      order.userId
    ){



      let message =
      "Your order status has been updated.";





      if(
        status === "Processing"
      ){

        message =
        "Your order is now being processed.";

      }






      if(
        status === "Shipped"
      ){

        message =
        "Your order has been shipped 🚚";

      }






      if(
        status === "Delivered"
      ){

        message =
        "Your order has been delivered successfully 🎉";

      }






      if(
        status === "Cancelled"
      ){

        message =
        "Your order has been cancelled.";

      }







      await sendNotification({

        receiverId:
          order.userId,


        title:
          `Order ${status}`,


        message,


        type:
          "order",


      });



    }



  }




};









// =========================
// Admin Add Order
// =========================

export const addOrderByAdmin =
async(
  order
)=>{


  const docRef =
    await addDoc(

      orderRef,

      {

        ...order,

        createdAt:
          new Date(),

        status:
          order.status || "Pending",

      }

    );



  return docRef.id;


};









// =========================
// Delete Order
// =========================

export const deleteOrder =
async(
  id
)=>{


  const orderDoc =
    doc(
      db,
      "orders",
      id
    );



  await deleteDoc(
    orderDoc
  );


};









// =========================
// Customer Cancel Request
// =========================

export const requestCancelOrder =
async(
  id
)=>{


  const orderDoc =
    doc(
      db,
      "orders",
      id
    );



  await updateDoc(

    orderDoc,

    {

      cancelRequested:
        true,

    }

  );


};









// =========================
// Customer Return Request
// =========================

export const requestReturnOrder =
async(
  id
)=>{


  const orderDoc =
    doc(
      db,
      "orders",
      id
    );



  await updateDoc(

    orderDoc,

    {

      returnRequested:
        true,

    }

  );


};
