import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";


import { db } from "../firebase/firestore";




// Collection

const notificationRef =
  collection(
    db,
    "notifications"
  );





// =================================
// Send Notification (Single User)
// =================================

export const sendNotification = async (
  data
) => {


  await addDoc(
    notificationRef,
    {

      receiverId:
        data.receiverId,

      title:
        data.title,

      message:
        data.message,

      type:
        data.type || "system",

      isRead:
        false,

      senderId:
        data.senderId || "",

      createdAt:
        serverTimestamp(),

    }
  );


};







// =================================
// Send Notification To User
// =================================

export const sendNotificationToUser =
async (
  userId,
  notification
)=>{


  await addDoc(
    notificationRef,
    {

      receiverId:
        userId,


      title:
        notification.title,


      message:
        notification.message,


      type:
        notification.type || "system",


      isRead:
        false,


      senderId:
        notification.senderId || "",


      createdAt:
        serverTimestamp(),

    }
  );


};









// =================================
// Send Notification To All Users
// =================================

export const sendNotificationToAllUsers =
async (
  users,
  notification
)=>{


  const batch =
    writeBatch(db);



  users.forEach(
    (user)=>{


      const notificationDoc =
        doc(
          notificationRef
        );



      batch.set(
        notificationDoc,
        {

          receiverId:
            user.id,


          title:
            notification.title,


          message:
            notification.message,


          type:
            notification.type || "system",


          isRead:
            false,


          senderId:
            notification.senderId || "",


          createdAt:
            serverTimestamp(),


        }
      );



    }
  );



  await batch.commit();


};








// =================================
// Get User Notifications
// =================================

export const getUserNotifications =
(
  userId
)=>{


  return query(

    notificationRef,

    where(
      "receiverId",
      "==",
      userId
    )

  );


};








// =================================
// Mark Notification Read
// =================================

export const markNotificationAsRead =
async(
  id
)=>{


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


};








// =================================
// Mark All Read
// =================================

export const markAllNotificationsAsRead =
async(
  userId
)=>{


  const q =
    query(

      notificationRef,

      where(
        "receiverId",
        "==",
        userId
      )

    );



  const snapshot =
    await getDocs(q);



  const batch =
    writeBatch(db);



  snapshot.docs.forEach(
    (item)=>{


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


    }
  );



  await batch.commit();


};








// =================================
// Delete Notification
// =================================

export const deleteNotification =
async(
  id
)=>{


  await deleteDoc(

    doc(
      db,
      "notifications",
      id
    )

  );


};








// =================================
// Delete All Notifications
// =================================

export const deleteAllNotifications =
async(
  userId
)=>{


  const q =
    query(

      notificationRef,

      where(
        "receiverId",
        "==",
        userId
      )

    );



  const snapshot =
    await getDocs(q);



  const batch =
    writeBatch(db);



  snapshot.docs.forEach(
    (item)=>{


      batch.delete(

        doc(
          db,
          "notifications",
          item.id
        )

      );


    }
  );



  await batch.commit();


};
