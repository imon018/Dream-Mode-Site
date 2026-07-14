import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";


import {
  db,
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







// =========================
// Create Order (Customer)
// =========================


export const createOrder = async(
  order
)=>{


  const docRef =
  await addDoc(
    orderRef,
    order
  );





  // Admin Notification


  await createAdminNotification({

    title:
    "🛒 New Order Received",


    message:
    `New order from ${order.name || order.email}. Amount: ৳${order.total || 0}`,


    type:
    "order",

  });





  return docRef.id;


};









// =========================
// Get User Orders
// =========================


export const getUserOrders = async(
  email
)=>{


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
    (doc)=>({

      id:doc.id,

      ...doc.data(),

    })
  );


};









// =========================
// Get All Orders Admin
// =========================


export const getAllOrders = async()=>{


  const snapshot =
  await getDocs(
    orderRef
  );



  return snapshot.docs.map(
    (doc)=>({

      id:doc.id,

      ...doc.data(),

    })
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





  // Get order information


  const snapshot =
  await getDocs(

    query(

      orderRef,

      where(
        "__name__",
        "==",
        id
      )

    )

  );



  if(snapshot.empty){

    return;

  }




  const order =
  snapshot.docs[0].data();






  let title =
  "";


  let message =
  "";





  if(status==="Processing"){


    title =
    "📦 Order Processing";


    message =
    "Your order is being prepared.";

  }





  if(status==="Shipped"){


    title =
    "🚚 Order Shipped";


    message =
    "Your order is on the way.";

  }





  if(status==="Delivered"){


    title =
    "✅ Order Delivered";


    message =
    "Your order has been delivered.";

  }





  if(status==="Cancelled"){


    title =
    "❌ Order Cancelled";


    message =
    "Your order has been cancelled.";

  }





  if(
    title &&
    order.userId
  ){


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

    order

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


  await deleteDoc(

    doc(
      db,
      "orders",
      id
    )

  );


};









// =========================
// Customer Cancel Request
// =========================


export const requestCancelOrder =
async(
  id
)=>{


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









// =========================
// Customer Return Request
// =========================


export const requestReturnOrder =
async(
  id
)=>{


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
