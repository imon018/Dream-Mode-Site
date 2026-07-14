import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { onSnapshot } from "firebase/firestore";

import { useAuth } from "./AuthContext";

import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../services/notificationService";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const q = getUserNotifications(currentUser.uid);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotifications(data);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length;

  const markAsRead = async (id) => {
    await markNotificationAsRead(id);
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;
    await markAllNotificationsAsRead(currentUser.uid);
  };

  const removeNotification = async (id) => {
    await deleteNotification(id);
  };

  const removeAllNotifications = async () => {
    if (!currentUser) return;
    await deleteAllNotifications(currentUser.uid);
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
};

export const useNotifications = () =>
  useContext(NotificationContext);
