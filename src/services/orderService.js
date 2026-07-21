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



  if(order.userId){


    await createUserNotification({

  userId: order.userId,

  title: "🛒 Order Placed",

  message: "Your order has been placed successfully.",

  type: "order",

  actionUrl: `/profile/orders/${docRef.id}`,

  priority: "medium",

});


  }





  await createAdminNotification({

  title: "📦 New Order Received",

  message: `${order.customerName || "Customer"} placed a new order.`,

  type: "order",

  actionUrl: `/admin/orders/${docRef.id}`,

  priority: "high",

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

    item=>({

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



const orders =
await Promise.all(

snapshot.docs.map(

async(item)=>{


const order =
{

id:item.id,

...item.data(),

};





let customerPhoto =
"";





if(order.userId){


try{


const userRef =
doc(
db,
"users",
order.userId
);



const userSnap =
await getDoc(
userRef
);



if(userSnap.exists()){


customerPhoto =
userSnap.data().photoURL || "";


}



}

catch(error){


console.log(
"Failed to load customer photo:",
error
);


}


}





return {


...order,

customerPhoto,


};


}

)

);



return orders;


};









// =================================
// UPDATE PAYMENT STATUS (ADMIN)
// =================================


export const updatePaymentStatus =
async(
id,
paymentStatus
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

paymentStatus,

}

);



};









// =================================
// UPDATE ORDER STATUS (ADMIN)
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



const orderSnapshot =
await getDoc(
orderDoc
);



if(!orderSnapshot.exists()){

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



if(order.userId){


await createUserNotification({

  userId: order.userId,

  title,

  message,

  type: "order",

  actionUrl: `/profile/orders/${id}`,

  priority:
    status === "Delivered"
      ? "high"
      : "medium",

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



if(order.userId){


await createUserNotification({

  userId: order.userId,

  title: "🛒 Order Created",

  message: "An order has been created for you.",

  type: "order",

  actionUrl: `/profile/orders/${docRef.id}`,

  priority: "medium",

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
// USER CANCEL ORDER DIRECT
// =================================


export const requestCancelOrder =
async(id)=>{


const orderDoc =
doc(
db,
"orders",
id
);



const snapshot =
await getDoc(
orderDoc
);



if(!snapshot.exists()){

throw new Error(
"Order not found"
);

}



const order =
snapshot.data();





await updateDoc(

orderDoc,

{

status:
"Cancelled",

cancelRequested:
false,

}

);







if(order.userId){


await createUserNotification({

  userId: order.userId,

  title: "❌ Order Cancelled",

  message: "Your order has been cancelled successfully.",

  type: "order",

  actionUrl: `/profile/orders/${id}`,

  priority: "medium",

});


}








await createAdminNotification({

  title: "❌ Order Cancelled",

  message: `${order.customerName || "Customer"} cancelled order #${id.slice(0,8)}.`,

  type: "order",

  actionUrl: `/admin/orders/${id}`,

  priority: "high",

});



};









// =================================
// USER RETURN REQUEST
// =================================


export const requestReturnOrder =
async(
  id,
  returnData
)=>{


const orderDoc =
doc(
db,
"orders",
id
);




const snapshot =
await getDoc(
orderDoc
);




if(!snapshot.exists()){


throw new Error(
"Order not found"
);


}





const order =
snapshot.data();






await updateDoc(

orderDoc,

{


returnRequested:true,


returnRequest:{


...returnData,


status:"Submitted",


createdAt:
new Date()
.toISOString()



}



}

);



await createAdminNotification({
  title: "🔄 Return Request",
  message: `${order.customerName || "Customer"} requested return for order #${id.slice(0,8)}.`,
  type: "order",
  actionUrl: `/admin/return-orders/${id}`,
  priority: "high",
});






if(order.userId){


await createUserNotification({

  userId: order.userId,

  title: "🔄 Return Request Submitted",

  message: "Your return request has been submitted successfully.",

  type: "order",

  actionUrl: `/profile/returns/${id}`,

  priority: "medium",

});


}

};



// =================================
// GET RETURN ORDERS ADMIN
// =================================

export const getReturnOrders =
async()=>{


const snapshot =
await getDocs(orderRef);



const orders =
await Promise.all(

snapshot.docs.map(

async(item)=>{


const order = {

id:item.id,

...item.data(),

};



let customerPhoto = "";



if(order.userId){


try{


const userSnap =
await getDoc(

doc(
db,
"users",
order.userId
)

);



if(userSnap.exists()){


customerPhoto =
userSnap.data().photoURL || "";


}



}

catch(error){

console.log(
"Photo load error:",
error
);

}


}



return {

...order,

customerPhoto,

};


}

)

);



return orders.filter(order=>

order.returnRequested === true

);


};





// =================================
// UPDATE RETURN STATUS ADMIN
// =================================

export const updateReturnStatus =
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

"returnRequest.status":
status

}

);


  const snapshot = await getDoc(orderDoc);

const order = snapshot.data();

if (order.userId) {
  await createUserNotification({
    userId: order.userId,
    title: "🔄 Return Status Updated",
    message: `Your return request is now ${status}.`,
    type: "return",
    actionUrl: `/profile/returns/${id}`,
    priority: "medium",
  });
}
  

};


// =================================
// GET USER RETURN ORDERS
// =================================

export const getUserReturnOrders =
async (email) => {

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

  return snapshot.docs
    .map(item => ({
      id: item.id,
      ...item.data(),
    }))
    .filter(
      order =>
        order.returnRequested === true
    );

};


// =================================
// GET USER RETURN DETAILS
// =================================

export const getUserReturnDetails =
async(id)=>{


const orderDoc =
doc(
db,
"orders",
id
);



const snapshot =
await getDoc(orderDoc);



if(!snapshot.exists()){

throw new Error(
"Return not found"
);

}



return {

id:snapshot.id,

...snapshot.data(),

};


};


// =================================
// UPDATE RETURN REQUEST USER
// =================================

export const updateReturnRequest =
async(
id,
returnData
)=>{


const orderDoc =
doc(
db,
"orders",
id
);



const snapshot =
await getDoc(
orderDoc
);



if(!snapshot.exists()){

throw new Error(
"Order not found"
);

}



const order =
snapshot.data();



if(
order.returnRequest?.status !== "Submitted"
){

throw new Error(
"Return request cannot be edited"
);

}



const oldReturnRequest =
order.returnRequest || {};





await updateDoc(

orderDoc,

{

returnRequest:

{

...oldReturnRequest,

...returnData,

status:"Submitted",

updatedAt:
new Date().toISOString()


}

}

);


};
