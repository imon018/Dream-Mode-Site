import { useEffect, useMemo, useRef, useState } from "react";

import { Link } from "react-router-dom";

import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiMoreVertical,
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiSettings,
  FiRefreshCw,
  FiXCircle,
  FiMessageSquare,
} from "react-icons/fi";

import { useNotifications } from "../../context/NotificationContext";

function getIcon(type) {
  switch (type) {
    case "order":
    case "order_status":
      return <FiShoppingBag className="text-blue-500" />;

    case "register":
    case "login":
    case "profile":
      return <FiUser className="text-green-500" />;

    case "settings":
      return <FiSettings className="text-orange-500" />;

    case "return":
      return <FiRefreshCw className="text-yellow-500" />;

    case "cancel":
      return <FiXCircle className="text-red-500" />;

    case "review":
      return <FiMessageSquare className="text-purple-500" />;

    default:
      return <FiBell className="text-amber-500" />;
  }
}

function timeAgo(timestamp) {
  if (!timestamp?.toDate) return "";

  const seconds = Math.floor(
    (Date.now() - timestamp.toDate().getTime()) / 1000
  );

  if (seconds < 60) return "Just now";

  if (seconds < 3600)
    return `${Math.floor(seconds / 60)} min ago`;

  if (seconds < 86400)
    return `${Math.floor(seconds / 3600)} hr ago`;

  if (seconds < 604800)
    return `${Math.floor(seconds / 86400)} day ago`;

  return timestamp.toDate().toLocaleDateString();
}

export default function Notifications() {
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    removeNotification,
    removeAllNotifications,
  } = useNotifications();

  const [openMenu, setOpenMenu] = useState(false);

  const [search, setSearch] = useState("");

  const [tab, setTab] = useState("all");

  const menuRef = useRef(null);

  useEffect(() => {
    function closeMenu(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", closeMenu);

    return () =>
      document.removeEventListener(
        "mousedown",
        closeMenu
      );
  }, []);

  const filteredNotifications = useMemo(() => {
    let data = [...notifications];

    if (tab === "unread") {
      data = data.filter((n) => !n.isRead);
    }

    if (tab === "read") {
      data = data.filter((n) => n.isRead);
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (item) =>
          item.title?.toLowerCase().includes(keyword) ||
          item.message?.toLowerCase().includes(keyword)
      );
    }

    return data;
  }, [notifications, tab, search]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading notifications...
      </div>
    );
  }


  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h1 className="text-2xl font-bold flex items-center gap-2">

            <FiBell />

            Notifications

          </h1>

          <p className="text-sm text-gray-500 mt-1">

            {filteredNotifications.length} notification(s)

          </p>

        </div>

        <div
          className="relative"
          ref={menuRef}
        >

          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center"
          >

            <FiMoreVertical size={22} />

          </button>

          {openMenu && (

            <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl border overflow-hidden z-50">

              <button
                onClick={() => {
                  markAllAsRead();
                  setOpenMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-left"
              >

                <FiCheck className="text-green-600" />

                Mark All Read

              </button>

              <button
                onClick={() => {
                  removeAllNotifications();
                  setOpenMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 text-left"
              >

                <FiTrash2 />

                Delete All

              </button>

            </div>

          )}

        </div>

      </div>

      {/* Search */}

      <div className="relative mb-5">

        <FiSearch className="absolute left-3 top-3 text-gray-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notifications..."
          className="w-full border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-amber-400"
        />

      </div>

      {/* Tabs */}

      <div className="flex gap-2 mb-6 overflow-x-auto">

        {["all", "unread", "read"].map((item) => (

          <button
            key={item}
            onClick={() => setTab(item)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition
            ${
              tab === item
                ? "bg-amber-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >

            {item.charAt(0).toUpperCase() + item.slice(1)}

          </button>

        ))}

      </div>

      {/* Notification List */}

      {filteredNotifications.length === 0 ? (


              <div
          className="
            bg-white
            rounded-2xl
            p-10
            text-center
            shadow
          "
        >
          <FiBell
            size={52}
            className="mx-auto mb-4 text-gray-400"
          />

          <h2 className="text-xl font-semibold">
            No Notifications
          </h2>

          <p className="text-gray-500 mt-2">
            You're all caught up.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {filteredNotifications.map((item) => (

            <Link
  key={item.id}
  to={item.actionUrl || "#"}
  onClick={() => {
    if (!item.isRead) {
      markAsRead(item.id);
    }
  }}
  className={`
    block
    rounded-2xl
    border
    p-4
    transition
    hover:shadow-md
    hover:border-amber-400
    ${
      item.isRead
        ? "bg-white"
        : "bg-amber-50 border-amber-300"
    }
  `}
>
  <div className="flex gap-4">

    

              {/* ICON */}

              <div className="mt-1 text-xl">
                {getIcon(item.type)}
              </div>

              {/* CONTENT */}

              <div className="flex-1">

                <div className="flex items-center gap-2 flex-wrap">

                  <h3 className="font-semibold text-lg">
                    {item.title}
                  </h3>

                  {item.priority === "high" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  )}

                  {item.priority === "medium" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  )}

                  {item.priority === "low" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  )}

                </div>

                <p className="text-gray-600 mt-2">
                  {item.message}
                </p>

                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">

                  <span>
                    {timeAgo(item.createdAt)}
                  </span>

                  <span className="capitalize">
                    {item.type?.replace("_", " ")}
                  </span>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex flex-col gap-2">

                {!item.isRead && (
                  <button
                    onClick={(e) => {
  e.preventDefault();
  e.stopPropagation();
  markAsRead(item.id);
}}
                    title="Mark as Read"
                    className="
                      w-9
                      h-9
                      rounded-lg
                      hover:bg-green-100
                      text-green-600
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FiCheck size={18} />
                  </button>
                )}

                <button
                  onClick={(e) => {
  e.preventDefault();
  e.stopPropagation();
  removeNotification(item.id);
}}
                  title="Delete"
                  className="
                    w-9
                    h-9
                    rounded-lg
                    hover:bg-red-100
                    text-red-600
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FiTrash2 size={18} />
                </button>

              </div>

            </div>

              </Link>

          ))}

        </div>
      )}

    </div>
  );
}

