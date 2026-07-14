import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";


import {
  db,
} from "../firebase/firestore";





const notificationRef =
collection(
  db,
  "notifications"
);



// =================================
// Send Notification To All Users
// =================================

export const sendNotificationToAllUsers = async ({
  users,
  title,
  message,
  type = "system",
}) => {

  const promises = users.map((user) =>
    sendNotification({

      receiverId: user.id,

      title,

      message,

      type,

    })
  );


  await Promise.all(promises);

};


// =================================
// Send Notification
// =================================


export const sendNotification = async({

  receiverId,

  title,

  message,

  type="system",

})=>{


  await addDoc(

    notificationRef,

    {

      receiverId,

      title,

      message,

      type,

      isRead:false,

      createdAt:
      serverTimestamp(),

    }

  );


};









// =================================
// Get User Notifications
// =================================


export const getUserNotifications = (
  userId
)=>{


  return query(

    notificationRef,

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


};









// =================================
// Get Admin Notifications
// =================================


export const getAdminNotifications = ()=>{


  return query(

    notificationRef,

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


};









// =================================
// Mark Notification Read
// =================================


export const markNotificationAsRead =
async(id)=>{


  const notificationDoc =
  doc(
    db,
    "notifications",
    id
  );



  await updateDoc(

    notificationDoc,

    {

      isRead:true

    }

  );


};









// =================================
// Mark All Read
// =================================


export const markAllNotificationsAsRead =
async(userId)=>{


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



  const updates =
  snapshot.docs.map(

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


};









// =================================
// Delete Notification
// =================================


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









// =================================
// Delete All Notifications
// =================================


export const deleteAllNotifications =
async(userId)=>{


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



  const deletes =
  snapshot.docs.map(

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


};
