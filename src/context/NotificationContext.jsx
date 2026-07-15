import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


import useAuth from "../hooks/useAuth";


import {
  listenUserNotifications,
  listenAdminNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../services/notificationService";



const NotificationContext = createContext();



export function NotificationProvider({
  children
}) {


  const {
    user
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



    let unsubscribe;



    // ================================
    // ADMIN NOTIFICATION
    // ================================


    if(user.role === "admin"){


      unsubscribe =
      listenAdminNotifications(
        (data)=>{

          setNotifications(data);

          setLoading(false);

        }
      );


    }



    // ================================
    // USER NOTIFICATION
    // ================================


    else{


      unsubscribe =
      listenUserNotifications(

        user.uid,

        (data)=>{

          setNotifications(data);

          setLoading(false);

        }

      );


    }





    return ()=>{


      if(unsubscribe){

        unsubscribe();

      }


    };



  },[user]);







  const unreadCount =
notifications.filter(
(item)=>!item.isRead
).length;







  const markAsRead = async(id)=>{


    await markNotificationRead(id);


  };







  const markAllAsRead = async()=>{


    await markAllNotificationsRead(
      notifications
    );


  };







  const removeNotification = async(id)=>{


    await deleteNotification(id);


  };







  const removeAllNotifications = async()=>{


    await deleteAllNotifications(
      notifications
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






export const useNotifications = () =>
useContext(NotificationContext);
