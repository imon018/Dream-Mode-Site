import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
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

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    let unsubscribe = () => {};

    const onData = (data) => {
      setNotifications(data || []);
      setLoading(false);
    };

    if (user.role === "admin") {
      unsubscribe = listenAdminNotifications(onData);
    } else {
      unsubscribe = listenUserNotifications(user.uid, onData);
    }

    return () => unsubscribe();
  }, [user]);

  /* =====================================
      COUNTERS
  ===================================== */

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const readCount = useMemo(
    () => notifications.filter((n) => n.isRead).length,
    [notifications]
  );

  /* =====================================
      ACTIONS
  ===================================== */

  const markAsRead = useCallback(async (id) => {
    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsRead(notifications);
    } catch (err) {
      console.error(err);
    }
  }, [notifications]);

  const removeNotification = useCallback(async (id) => {
    try {
      await deleteNotification(id);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const removeAllNotifications = useCallback(async () => {
    try {
      await deleteAllNotifications(notifications);
    } catch (err) {
      console.error(err);
    }
  }, [notifications]);

  /* =====================================
      FILTERS
  ===================================== */

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.isRead),
    [notifications]
  );

  const readNotifications = useMemo(
    () => notifications.filter((n) => n.isRead),
    [notifications]
  );

  const highPriorityNotifications = useMemo(
    () => notifications.filter((n) => n.priority === "high"),
    [notifications]
  );

  const orderNotifications = useMemo(
    () => notifications.filter((n) => n.type === "order"),
    [notifications]
  );

  return (
    <NotificationContext.Provider
      value={{
        loading,

        notifications,

        unreadNotifications,

        readNotifications,

        orderNotifications,

        highPriorityNotifications,

        unreadCount,

        readCount,

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

export function useNotifications() {
  return useContext(NotificationContext);
}
