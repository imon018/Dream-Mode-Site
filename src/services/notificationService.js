import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";


import {
  db,
} from "../firebase/firestore";





const notificationRef =
collection(
  db,
  "notifications"
);









// ==============================
// SEND NOTIFICATION
// ==============================

export const sendNotification =
async(data)=>{


  try{


    await addDoc(

      notificationRef,

      {

        title:
          data.title || "Notification",


        message:
          data.message || "",


        userId:
          data.userId || "all",


        type:
          data.type || "general",


        isRead:false,


        createdAt:
          serverTimestamp(),


      }

    );


  }
  catch(error){


    console.log(
      "Notification send error:",
      error
    );


    throw error;


  }


};









// ==============================
// GET USER NOTIFICATIONS
// ==============================

export const getUserNotifications =
(
  userId,
  role
)=>{


  const ids =


  role === "admin"

  ?

  [
    userId,
    "admin",
    "all"
  ]

  :

  [
    userId,
    "all"
  ];





  return query(

    notificationRef,


    where(
      "userId",
      "in",
      ids
    ),


    orderBy(
      "createdAt",
      "desc"
    )

  );


};









// ==============================
// MARK ONE READ
// ==============================

export const markNotificationAsRead =
async(id)=>{


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


};









// ==============================
// MARK ALL READ
// ==============================

export const markAllNotificationsAsRead =
async(
  userId,
  role
)=>{


  const ids =


  role === "admin"

  ?

  [
    userId,
    "admin",
    "all"
  ]

  :

  [
    userId,
    "all"
  ];






  const q =

  query(

    notificationRef,


    where(

      "userId",

      "in",

      ids

    )

  );






  const snapshot =

  await getDocs(q);






  const batch =

  writeBatch(db);







  snapshot.forEach((item)=>{


    batch.update(

      doc(

        db,

        "notifications",

        item.id

      ),

      {

        isRead:true

      }

    );


  });






  await batch.commit();


};









// ==============================
// DELETE ONE
// ==============================

export const deleteNotification =
async(id)=>{


  await deleteDoc(

    doc(

      db,

      "notifications",

      id

    )

  );


};









// ==============================
// DELETE ALL
// ==============================

export const deleteAllNotifications =
async(
  userId,
  role
)=>{


  const ids =


  role === "admin"

  ?

  [
    userId,
    "admin",
    "all"
  ]

  :

  [
    userId,
    "all"
  ];






  const q =

  query(

    notificationRef,


    where(

      "userId",

      "in",

      ids

    )

  );






  const snapshot =

  await getDocs(q);






  const batch =

  writeBatch(db);







  snapshot.forEach((item)=>{


    batch.delete(

      doc(

        db,

        "notifications",

        item.id

      )

    );


  });






  await batch.commit();


};
