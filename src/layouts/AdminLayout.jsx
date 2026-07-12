import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";

import {
  FiGrid,
  FiHome,
  FiUser,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiImage,
  FiChevronDown,
  FiChevronRight,
  FiUpload,
  FiMail,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

import useAuth from "../hooks/useAuth";
import { logout } from "../services/authService";

export default function AdminLayout() {

  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

  const [uploadsOpen, setUploadsOpen] = useState(true);

  const [bannerOpen, setBannerOpen] = useState(true);

  const menu = [

    {
      name: "Dashboard",
      icon: <FiGrid size={20} />,
      path: "/admin",
    },

    {
      name: "Home",
      icon: <FiHome size={20} />,
      path: "/",
    },

    {
      name: "Admin Profile",
      icon: <FiUser size={20} />,
      path: "/admin/profile",
    },

    {
      name: "Users Panel",
      icon: <FiUsers size={20} />,
      path: "/admin/users",
    },

    {
      name: "Products",
      icon: <FiBox size={20} />,
      path: "/admin/products",
    },

    {
      name: "Orders",
      icon: <FiShoppingCart size={20} />,
      path: "/admin/orders",
    },

  ];

      return (
    <div className="min-h-screen flex bg-[#F8F5EF]">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-amber-500 text-white p-3 rounded-xl shadow-lg"
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}

      
      <aside
className={`
  fixed
  top-0
  left-0
  h-screen

  flex
  flex-col

  bg-white
  border-r border-amber-100
  shadow-xl

  transition-all duration-300
  z-50

  overflow-hidden
          ${collapsed ? "lg:w-24" : "lg:w-72"}
          w-72
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* Mobile Close */}
        <div className="
lg:hidden
flex
justify-end
px-4
py-1
">

<button onClick={()=>setSidebarOpen(false)}>
<FiX size={28}/>
</button>
 
        </div>

        {/* Logo */}
      <div
className="
shrink-0
px-6
py-2
border-b
border-amber-100
"
>


<h1 className="
text-2xl
font-bold
text-amber-600
">
Dream Mode
</h1>


<p className="
text-sm
text-gray-500
">
Admin Panel
</p>



<div className="
mt-5
flex
items-center
gap-4
">


<img
src={
user?.photoURL ||
"https://ui-avatars.com/api/?name=Admin"
}

className="
w-14
h-14
rounded-full
object-cover
border-4
border-amber-200
"
/>


<div>

<h3 className="
font-bold
text-slate-800
">
{user?.name || "Administrator"}
</h3>


<p className="
text-sm
text-gray-500
truncate
max-w-[150px]
">
{user?.email}
</p>


</div>


</div>


</div>

        {/* Main Menu */}
        
        <nav
className="
h-screen
overflow-y-auto
px-4
py-5
space-y-2
pb-10
"
>

          {menu.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-amber-500 text-white shadow"
                    : "text-slate-700 hover:bg-amber-50"
                }`
              }
            >
              {item.icon}

              {!collapsed && (
                <span className="font-medium">
                  {item.name}
                </span>
              )}
            </NavLink>

          ))}


          {/* Uploads */}
          <div className="pt-3">

            <button
              onClick={() => setUploadsOpen(!uploadsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-amber-50 transition"
            >
              <div className="flex items-center gap-3 text-slate-700">
                <FiUpload size={20} />
                {!collapsed && <span className="font-medium">Uploads</span>}
              </div>

              {!collapsed &&
                (uploadsOpen ? (
                  <FiChevronDown />
                ) : (
                  <FiChevronRight />
                ))}
            </button>

            {uploadsOpen && !collapsed && (
              <div className="ml-8 mt-2 space-y-2">

                <NavLink
                  to="/admin/add-product"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg ${
                      isActive
                        ? "bg-amber-500 text-white"
                        : "hover:bg-amber-50 text-slate-600"
                    }`
                  }
                >
                  Add Product
                </NavLink>

                <NavLink
                  to="/admin/add-order"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg ${
                      isActive
                        ? "bg-amber-500 text-white"
                        : "hover:bg-amber-50 text-slate-600"
                    }`
                  }
                >
                  Add Order
                </NavLink>

              </div>
            )}

          </div>

          {/* Banners */}
          <div>

            <button
              onClick={() => setBannerOpen(!bannerOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-amber-50 transition"
            >
              <div className="flex items-center gap-3 text-slate-700">
                <FiImage size={20} />
                {!collapsed && <span className="font-medium">Banners</span>}
              </div>

              {!collapsed &&
                (bannerOpen ? (
                  <FiChevronDown />
                ) : (
                  <FiChevronRight />
                ))}
            </button>

            {bannerOpen && !collapsed && (
              <div className="ml-8 mt-2 space-y-2">

                <NavLink
                  to="/admin/banners"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg ${
                      isActive
                        ? "bg-amber-500 text-white"
                        : "hover:bg-amber-50 text-slate-600"
                    }`
                  }
                >
                  Home Banner
                </NavLink>

                <NavLink
                  to="/admin/shop-hero"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg ${
                      isActive
                        ? "bg-amber-500 text-white"
                        : "hover:bg-amber-50 text-slate-600"
                    }`
                  }
                >
                  Shop Banner
                </NavLink>

              </div>
            )}

          </div>

          <NavLink
            to="/admin/subscribers"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl ${
                isActive
                  ? "bg-amber-500 text-white"
                  : "hover:bg-amber-50 text-slate-700"
              }`
            }
          >
            <FiUsers size={20} />
            {!collapsed && <span>Subscribers</span>}
          </NavLink>

          <NavLink
  to="/admin/newsletter"
  className={({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl ${
      isActive
        ? "bg-amber-500 text-white"
        : "text-slate-700 hover:bg-amber-50"
    }`
  }
>

<FiMail size={20}/>

{!collapsed && (
<span>
Newsletter
</span>
)}

</NavLink>


{/* Settings */}

<NavLink
to="/admin/settings"
className={({isActive}) =>
`
flex
items-center
gap-3
px-4
py-3
rounded-xl

${
isActive
?
"bg-amber-500 text-white"
:
"text-slate-700 hover:bg-amber-50"
}

`
}
>

<FiSettings size={20}/>

{!collapsed && (
<span>
Settings
</span>
)}

</NavLink>



{/* Logout */}

<button

onClick={logout}

className="
w-full
flex
items-center
gap-3

px-4
py-3

rounded-xl

bg-red-500
hover:bg-red-600

text-white

"

>

<FiLogOut size={20}/>

{!collapsed && (
<span>
Logout
</span>
)}

</button>

