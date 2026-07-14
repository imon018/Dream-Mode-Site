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





// ==============================
// SEND NOTIFICATION
// ==============================

export async function sendNotification(data){

  try{


    const notificationRef =
      collection(
        db,
        "notifications"
      );



    await addDoc(
      notificationRef,
      {

        title:data.title,

        message:data.message,

        userId:data.userId || "all",

        type:data.type || "general",

        isRead:false,

        createdAt:
          serverTimestamp(),

      }
    );



  }
  catch(error){

    console.log(
      "Send notification error:",
      error
    );

    throw error;

  }

}









// ==============================
// GET USER NOTIFICATIONS
// ==============================


export function getUserNotifications(userId){


  const ref =
    collection(
      db,
      "notifications"
    );



  return query(

    ref,

    where(
      "userId",
      "in",
      [
        userId,
        "all"
      ]
    ),


    orderBy(
      "createdAt",
      "desc"
    )

  );


}









// ==============================
// MARK SINGLE READ
// ==============================


export async function markNotificationAsRead(id){


  const ref =
    doc(
      db,
      "notifications",
      id
    );



  await updateDoc(
    ref,
    {

      isRead:true

    }
  );


}









// ==============================
// MARK ALL READ
// ==============================


export async function markAllNotificationsAsRead(userId){


  const q =
    query(

      collection(
        db,
        "notifications"
      ),

      where(
        "userId",
        "in",
        [
          userId,
          "all"
        ]
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


}









// ==============================
// DELETE ONE
// ==============================


export async function deleteNotification(id){


  await deleteDoc(

    doc(
      db,
      "notifications",
      id
    )

  );


}









// ==============================
// DELETE ALL
// ==============================


export async function deleteAllNotifications(userId){


  const q =
    query(

      collection(
        db,
        "notifications"
      ),

      where(
        "userId",
        "in",
        [
          userId,
          "all"
        ]
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


}
