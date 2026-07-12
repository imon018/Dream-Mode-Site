import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import {
  FiGrid,
  FiHome,
  FiUser,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiUpload,
  FiImage,
  FiMail,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiMenu,
  FiX,
} from "react-icons/fi";

import { logout } from "../services/authService";

export default function AdminLayout() {

  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

  const [uploadOpen, setUploadOpen] = useState(false);

  const [bannerOpen, setBannerOpen] = useState(false);

  const menu = [

    {
      name: "Dashboard",
      icon: <FiGrid />,
      path: "/admin",
    },

    {
      name: "Home",
      icon: <FiHome />,
      path: "/",
    },

    {
      name: "Admin Profile",
      icon: <FiUser />,
      path: "/admin/profile",
    },

    {
      name: "Users Panel",
      icon: <FiUsers />,
      path: "/admin/users",
    },

    {
      divider: true,
    },

    {
      name: "Products",
      icon: <FiBox />,
      path: "/admin/products",
    },

    {
      name: "Orders",
      icon: <FiShoppingCart />,
      path: "/admin/orders",
    },

  ];

<div className="min-h-screen flex bg-warm">

  {/* Overlay */}
  {sidebarOpen && (
    <div
      onClick={() => setSidebarOpen(false)}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
    />
  )}

  {/* Mobile Menu Button */}
  <button
    onClick={() => setSidebarOpen(true)}
    className="lg:hidden fixed top-4 left-4 z-50 bg-gold-gradient text-white p-3 rounded-2xl shadow-gold"
  >
    <FiMenu size={24} />
  </button>

  {/* ================= SIDEBAR ================= */}

  <aside
    className={`
      fixed lg:static top-0 left-0 h-screen
      ${collapsed ? "lg:w-24" : "lg:w-72"}
      w-72
      bg-card
      border-r
      border-border
      flex flex-col
      transition-all duration-300
      z-50
      shadow-luxury
      ${
        sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      }
    `}
  >

    {/* Mobile Close */}
    <div className="lg:hidden flex justify-end p-5">

      <button
        onClick={() => setSidebarOpen(false)}
      >
        <FiX size={28} />
      </button>

    </div>

    {/* Header */}

    <div className="px-6 pb-6 border-b border-border">

      <div className="flex items-center justify-between">

        {!collapsed && (

          <div>

            <h2 className="text-3xl font-bold text-amber-600">

              Dream Mode

            </h2>

            <p className="text-gray-500">

              Admin Panel

            </p>

          </div>

        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:block"
        >
          <FiMenu size={22} />
        </button>

      </div>

      {!collapsed && (

        <div className="mt-6 bg-white rounded-3xl border border-amber-100 p-5 text-center shadow-sm">

          <img
            src={
              user?.photoURL ||
              "https://ui-avatars.com/api/?background=F6C453&color=fff&name=Admin"
            }
            alt="Admin"
            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-amber-100"
          />

          <h3 className="mt-4 text-xl font-bold">

            {user?.name || "Administrator"}

          </h3>

          <p className="text-amber-600 text-sm">

            Administrator

          </p>

          <p className="text-gray-500 text-xs mt-1 break-all">

            {user?.email}

          </p>

        </div>

      )}

    </div>

    {/* Menu */}

    <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-2">

      {menu.map((item) => {

        if (item.divider) {

          return (
            <div
              key={Math.random()}
              className="my-4 border-t border-amber-100"
            />
          );

        }

        return (

          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-2xl
              transition
              ${
                isActive
                  ? "bg-gold-gradient text-white shadow-gold"
                  : "hover:bg-amber-50 text-gray-700"
              }
            `}
          >

            <span className="text-xl">

              {item.icon}

            </span>

            {!collapsed && (

              <span className="font-semibold">

                {item.name}

              </span>

            )}

          </NavLink>

        );

      })}

            {/* Uploads */}

      <button
        onClick={() => setUploadOpen(!uploadOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-amber-50 transition"
      >
        <div className="flex items-center gap-3">
          <FiUpload className="text-xl" />
          {!collapsed && (
            <span className="font-semibold">
              Uploads
            </span>
          )}
        </div>

        {!collapsed &&
          (uploadOpen ? (
            <FiChevronDown />
          ) : (
            <FiChevronRight />
          ))}
      </button>

      {uploadOpen && !collapsed && (
        <div className="ml-8 space-y-2">

          <NavLink
            to="/admin/add-product"
            onClick={() => setSidebarOpen(false)}
            className="block py-2 text-gray-600 hover:text-amber-600"
          >
            Add Product
          </NavLink>

          <NavLink
            to="/admin/add-order"
            onClick={() => setSidebarOpen(false)}
            className="block py-2 text-gray-600 hover:text-amber-600"
          >
            Add Order
          </NavLink>

        </div>
      )}

      {/* Banners */}

      <button
        onClick={() => setBannerOpen(!bannerOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-amber-50 transition"
      >
        <div className="flex items-center gap-3">
          <FiImage className="text-xl" />

          {!collapsed && (
            <span className="font-semibold">
              Banners
            </span>
          )}

        </div>

        {!collapsed &&
          (bannerOpen ? (
            <FiChevronDown />
          ) : (
            <FiChevronRight />
          ))}
      </button>

      {bannerOpen && !collapsed && (

        <div className="ml-8 space-y-2">

          <NavLink
            to="/admin/banners"
            onClick={() => setSidebarOpen(false)}
            className="block py-2 text-gray-600 hover:text-amber-600"
          >
            Home Banner
          </NavLink>

          <NavLink
            to="/admin/shop-hero"
            onClick={() => setSidebarOpen(false)}
            className="block py-2 text-gray-600 hover:text-amber-600"
          >
            Shop Banner
          </NavLink>

        </div>

      )}

      <div className="border-t border-amber-100 my-4"></div>

      <NavLink
        to="/admin/subscribers"
        className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-amber-50"
      >
        <FiMail />
        {!collapsed && "Subscribers"}
      </NavLink>

      <NavLink
        to="/admin/newsletter"
        className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-amber-50"
      >
        <FiMail />
        {!collapsed && "Newsletter"}
      </NavLink>

      <NavLink
        to="/admin/settings"
        className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-amber-50"
      >
        <FiSettings />
        {!collapsed && "Settings"}
      </NavLink>

    </nav>

    {/* Footer */}

    <div className="p-5 border-t border-border">

      <button
        onClick={logout}
        className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl py-3 flex items-center justify-center gap-2 transition"
      >
        <FiLogOut />

        {!collapsed && "Logout"}

      </button>

    </div>

  </aside>

  {/* MAIN */}

  <main
    className="
      flex-1
      min-h-screen
      bg-warm
      overflow-y-auto
      pt-20
      lg:pt-8
      px-5
      lg:px-8
    "
  >

    <Outlet />

  </main>

</div>
