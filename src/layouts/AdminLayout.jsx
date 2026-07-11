import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBox,
  FiPlusCircle,
  FiUsers,
  FiShoppingCart,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiLogOut,
  FiMenu,
  FiMail,
  FiSend,
  FiX,
} from "react-icons/fi";

import { logout } from "../services/authService";

export default function AdminLayout() {

const [sidebarOpen, setSidebarOpen] = useState(false);
const [collapsed, setCollapsed] = useState(false);

  const menu = [
    {
      name: "Dashboard",
      icon: <FiGrid />,
      path: "/admin",
    },
    {
      name: "Products",
      icon: <FiBox />,
      path: "/admin/products",
    },
    {
  name: "Hero Banners",
  icon: <FiPlusCircle />,
  path: "/admin/banners",
},
    {
  name: "Add Product",
  icon: <FiPlusCircle />,
  path: "/admin/add-product",
},
    {
      name: "Orders",
      icon: <FiShoppingCart />,
      path: "/admin/orders",
    },
    {
  name: "Add Order",
  icon: <FiPlusCircle />,
  path: "/admin/add-order",
},
    {
      name: "Users",
      icon: <FiUsers />,
      path: "/admin/users",
    },
    {
      name: "Analytics",
      icon: <FiBarChart2 />,
      path: "/admin/analytics",
    },
    {
      name: "Settings",
      icon: <FiSettings />,
      path: "/admin/settings",
    },
    {
      name: "Admin Profile",
      icon: <FiUser />,
      path: "/admin/profile",
    },
    {
  name: "Subscribers",
  icon: <FiMail />,
  path: "/admin/subscribers",
},
{
  name: "Newsletter",
  icon: <FiMail />,
  path: "/admin/newsletter",
},
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <button
  onClick={() => setSidebarOpen(true)}
  className="lg:hidden fixed top-4 left-4 z-50 bg-slate-900 text-white p-3 rounded-xl shadow-lg"
>
  <FiMenu size={24} />
</button>

      <button
  onClick={() => setCollapsed(!collapsed)}
  className="hidden lg:flex fixed top-4 left-4 z-40 bg-white border shadow-md p-2 rounded-xl"
>
  <FiMenu size={20} />
</button>

      {sidebarOpen && (
  <div
    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
    onClick={() => setSidebarOpen(false)}
  />
)}

      <aside
  className={`
    fixed lg:static
    top-0 left-0
    h-screen
    ${collapsed ? "lg:w-20" : "lg:w-72"}
w-72
    bg-slate-900
    text-white
    flex
    flex-col
    z-50
    transform
    transition-transform
    duration-300
    ${
      sidebarOpen
        ? "translate-x-0"
        : "-translate-x-full lg:translate-x-0"
    }
  `}
>
        <div className="lg:hidden flex justify-end p-4">

  <button
    onClick={() => setSidebarOpen(false)}
  >
    <FiX size={28} />
  </button>

</div>

        <div className="p-6 border-b border-slate-700">

          {!collapsed && (
  <h1 className="text-2xl font-bold">
    Dream Mode
  </h1>
)}

          {!collapsed && (
  <p className="text-sm text-gray-400">
    Admin Panel
  </p>
)}

        </div>

        <nav className="flex-1 p-4 space-y-2">

          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                }`
              }
            >
              {item.icon}

              {!collapsed && item.name}
            </NavLink>
          ))}

        </nav>

        <div className="p-4 border-t border-slate-700">

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 rounded-xl"
          >
            <FiLogOut />

            Logout

          </button>

        </div>

      </aside>

      <main className="flex-1 p-8">

        <Outlet />

      </main>

    </div>
  );
}
