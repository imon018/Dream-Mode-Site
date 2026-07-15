import {
  db
} from "../firebase/firestore";


import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";





// =========================
// CREATE NOTIFICATION
// =========================

export async function createNotification(data){

  try{

    await addDoc(

      collection(
        db,
        "notifications"
      ),

      {

        ...data,

        read:false,

        createdAt:
        serverTimestamp()

      }

    );


  }

  catch(error){

    console.log(
      "Notification Error:",
      error
    );

    throw error;

  }

}








// =========================
// GET USER NOTIFICATIONS
// =========================


export async function getUserNotifications(userId){


  const q=query(

    collection(
      db,
      "notifications"
    ),


    where(
      "userId",
      "==",
      userId
    ),


    orderBy(
      "createdAt",
      "desc"
    )

  );



  const snapshot =
  await getDocs(q);



  return snapshot.docs.map(
    doc=>({

      id:doc.id,

      ...doc.data()

    })
  );


}








// =========================
// GET ADMIN NOTIFICATIONS
// =========================


export async function getAdminNotifications(){


 const q=query(

    collection(
      db,
      "notifications"
    ),


    where(
      "receiverId",
      "==",
      "ADMIN"
    ),


    orderBy(
      "createdAt",
      "desc"
    )

 );


 const snapshot =
 await getDocs(q);



 return snapshot.docs.map(
  doc=>({

    id:doc.id,

    ...doc.data()

  })
 );


}









// =========================
// REALTIME USER LISTENER
// =========================


export function listenUserNotifications(
userId,
callback
){


const q=query(

collection(
db,
"notifications"
),


where(
"userId",
"==",
userId
),


orderBy(
"createdAt",
"desc"
)

);



return onSnapshot(

q,

(snapshot)=>{


const data =
snapshot.docs.map(
doc=>({

id:doc.id,

...doc.data()

})
);


callback(data);


}


);


}









// =========================
// REALTIME ADMIN LISTENER
// =========================


export function listenAdminNotifications(
callback
){


const q=query(

collection(
db,
"notifications"
),


where(
"receiverId",
"==",
"ADMIN"
),


orderBy(
"createdAt",
"desc"
)

);



return onSnapshot(

q,

(snapshot)=>{


const data =
snapshot.docs.map(
doc=>({

id:doc.id,

...doc.data()

})
);


callback(data);


}


);


}









// =========================
// MARK AS READ
// =========================


export async function markNotificationRead(
id
){


await updateDoc(

doc(
db,
"notifications",
id
),

{

read:true

}

);


}









// =========================
// MARK ALL READ
// =========================


export async function markAllNotificationsRead(
notifications
){


const updates =
notifications.map(

(item)=>

updateDoc(

doc(
db,
"notifications",
item.id
),

{

read:true

}

)

);



await Promise.all(updates);


}









// =========================
// DELETE NOTIFICATION
// =========================


export async function deleteNotification(
id
){


await deleteDoc(

doc(
db,
"notifications",
id
)

);


}



// =========================
// SEND ADMIN NOTIFICATION
// =========================

export async function sendAdminNotification(data){

  await addDoc(

    collection(
      db,
      "notifications"
    ),

    {

      ...data,

      receiverId:"ADMIN",

      read:false,

      createdAt:
      serverTimestamp()

    }

  );

}





// =========================
// DELETE ALL USER NOTIFICATIONS
// =========================


export async function deleteAllNotifications(
notifications
){


const deletes =
notifications.map(

(item)=>

deleteDoc(

doc(
db,
"notifications",
item.id

)

)

);



await Promise.all(deletes);


}
