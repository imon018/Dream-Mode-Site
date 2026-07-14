import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


import {
  onSnapshot,
} from "firebase/firestore";


import useAuth from "../hooks/useAuth";


import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../services/notificationService";



const NotificationContext =
createContext();





export function NotificationProvider({
  children
}) {



  const {
    user,
  } = useAuth();





  const [
    notifications,
    setNotifications
  ] = useState([]);





  const [
    loading,
    setLoading
  ] = useState(true);









  useEffect(()=>{


    if(!user){


      setNotifications([]);

      setLoading(false);

      return;


    }






    const q =
    getUserNotifications(
      user.uid,
      user.role
    );







    const unsubscribe =

      onSnapshot(

        q,


        (snapshot)=>{


          const data =

          snapshot.docs.map(
            (doc)=>({

              id:doc.id,

              ...doc.data(),

            })
          );



          setNotifications(
            data
          );


          setLoading(false);



        },



        (error)=>{


          console.log(error);


          setLoading(false);


        }


      );







      return ()=>unsubscribe();




  },[user]);









  const unreadCount =

  notifications.filter(

    item=>

    !item.isRead

  ).length;









  const markAsRead =
  async(id)=>{


    await markNotificationAsRead(
      id
    );


  };









  const markAllAsRead =
  async()=>{


    if(!user)
      return;



    await markAllNotificationsAsRead(

      user.uid,

      user.role

    );


  };









  const removeNotification =
  async(id)=>{


    await deleteNotification(
      id
    );


  };









  const removeAllNotifications =
  async()=>{


    if(!user)
      return;



    await deleteAllNotifications(

      user.uid,

      user.role

    );


  };









  return (

    <NotificationContext.Provider

      value={{

        notifications,

        unreadCount,

        loading,

        markAsRead,

        markAllAsRead,

        removeNotification,

        removeAllNotifications,

      }}

    >

      {children}

    </NotificationContext.Provider>

  );


}









export const useNotifications =
()=>useContext(NotificationContext);
