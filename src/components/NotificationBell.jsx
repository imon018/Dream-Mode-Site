import { useState, useEffect, useRef } from "react";
import { FiBell } from "react-icons/fi";
import { useNotifications } from "../context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell({
  notificationPath = "/profile/notifications",
}) {
  const {
    unreadCount,
    highPriorityNotifications = [],
  } = useNotifications();

  const [open, setOpen] = useState(false);

  const wrapperRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Close on ESC
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKey);

    return () =>
      document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          relative
          p-2
          rounded-xl
          hover:bg-gray-100
          transition-all
          duration-200
        "
        aria-label="Notifications"
      >
        <FiBell
          size={22}
          className={
            unreadCount > 0
              ? "animate-pulse"
              : ""
          }
        />

        {/* Unread Badge */}

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -top-1
              -right-1
              min-w-[18px]
              h-[18px]
              px-1
              rounded-full
              bg-red-500
              text-white
              text-[10px]
              font-semibold
              flex
              items-center
              justify-center
            "
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}

        {/* High Priority Dot */}

        {highPriorityNotifications.length > 0 && (
          <span
            className="
              absolute
              top-0
              left-0
              w-2.5
              h-2.5
              rounded-full
              bg-orange-500
            "
          />
        )}
      </button>

      {open && (
        <NotificationDropdown
          close={() => setOpen(false)}
          notificationPath={notificationPath}
        />
      )}
    </div>
  );
}
