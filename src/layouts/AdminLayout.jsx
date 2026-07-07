import { Outlet, NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBox,
  FiUsers,
  FiShoppingCart,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { logout } from "../services/authService";

export default function AdminLayout() {
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
      name: "Orders",
      icon: <FiShoppingCart />,
      path: "/admin/orders",
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
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <aside className="w-72 bg-slate-900 text-white flex flex-col">

        <div className="p-6 border-b border-slate-700">

          <h1 className="text-2xl font-bold">
            Dream Mode
          </h1>

          <p className="text-sm text-gray-400">
            Admin Panel
          </p>

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

              {item.name}
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
