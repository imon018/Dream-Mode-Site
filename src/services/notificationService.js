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
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs
} from "firebase/firestore";




// CREATE NOTIFICATION

export async function createNotification(data){

  await addDoc(

    collection(
      db,
      "notifications"
    ),

    {

      ...data,

      isRead:false,

      createdAt:
      serverTimestamp()

    }

  );

}





// USER REALTIME NOTIFICATION

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
"receiverId",
"in",
[
userId,
"ALL_USERS"
]
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







// ADMIN REALTIME

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


callback(

snapshot.docs.map(

doc=>({

id:doc.id,

...doc.data()

})

)

);


}

);


}








// GET USER

export async function getUserNotifications(
userId
){


const q=query(

collection(
db,
"notifications"
),

where(
"receiverId",
"==",
userId
),

orderBy(
"createdAt",
"desc"
)

);



const snap =
await getDocs(q);



return snap.docs.map(
doc=>({

id:doc.id,

...doc.data()

})

);


}







// GET ADMIN

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



const snap =
await getDocs(q);



return snap.docs.map(
doc=>({

id:doc.id,

...doc.data()

})

);


}







// MARK ONE READ

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

isRead:true

}

);


}








// MARK ALL READ

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

isRead:true

}

)

);



await Promise.all(
updates
);


}








// DELETE ONE

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








// DELETE ALL

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



await Promise.all(
deletes
);


}








// ADMIN SEND

export async function sendAdminNotification(
data
){


return createNotification({

...data,

receiverId:"ADMIN"

});


}








// SEND ALL USERS

export async function sendNotificationToAllUsers(
data
){


return createNotification({

...data,

receiverId:"ALL_USERS"

});


}








// SEND SINGLE USER

export async function sendNotification(
data
){


return createNotification(data);


}
