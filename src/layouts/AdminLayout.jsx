import {
  useState,
} from "react";


import {
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";


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
  FiAlertTriangle,
  FiBell,
  FiSend,
} from "react-icons/fi";


import useAuth from "../hooks/useAuth";


import {
  logout,
} from "../services/authService";


import {
  useSettings,
} from "../context/SettingsContext";





export default function AdminLayout(){


  const navigate = useNavigate();



  const {
    user,
  } = useAuth();



  const {
    settings,
  } = useSettings();





  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);



  const [
    collapsed,
    setCollapsed,
  ] = useState(false);



  const [
    uploadsOpen,
    setUploadsOpen,
  ] = useState(true);



  const [
    bannerOpen,
    setBannerOpen,
  ] = useState(true);



  const [
    showLogoutWarning,
    setShowLogoutWarning,
  ] = useState(false);







  const handleLogoutClick = ()=>{


    if(settings?.maintenanceMode){

      setShowLogoutWarning(true);

      return;

    }


    logout();

  };





  const confirmLogout = ()=>{

    logout();

  };







  const menu = [

    {
      name:"Dashboard",
      icon:<FiGrid size={20}/>,
      path:"/admin",
    },


    {
      name:"Home",
      icon:<FiHome size={20}/>,
      path:"/",
    },


    {
      name:"Admin Profile",
      icon:<FiUser size={20}/>,
      path:"/admin/profile",
    },


    {
      name:"Users Panel",
      icon:<FiUsers size={20}/>,
      path:"/admin/users",
    },


    {
      name:"Products",
      icon:<FiBox size={20}/>,
      path:"/admin/products",
    },


    {
      name:"Orders",
      icon:<FiShoppingCart size={20}/>,
      path:"/admin/orders",
    },


    {
      name:"Notifications",
      icon:<FiBell size={20}/>,
      path:"/admin/notifications",
    },


    {
      name:"Send Notification",
      icon:<FiSend size={20}/>,
      path:"/admin/send-notification",
    },


  ];







return (


<div
className="
min-h-screen
flex
bg-[#F8F5EF]
"
>



{/* MOBILE OVERLAY */}

{
sidebarOpen && (

<div

className="
fixed
inset-0
bg-black/40
z-40
lg:hidden
"

onClick={()=>
setSidebarOpen(false)
}

/>

)
}







{/* MOBILE MENU BUTTON */}

<button

onClick={()=>
setSidebarOpen(true)
}

className="
lg:hidden
fixed
top-4
left-4
z-50
bg-amber-500
text-white
p-3
rounded-xl
shadow-lg
"

>

<FiMenu size={24}/>


</button>







{/* SIDEBAR */}


<aside


className={`
fixed
top-0
left-0

h-dvh

flex
flex-col

bg-white

border-r
border-amber-100

shadow-xl

transition-all
duration-300

z-50


${collapsed ? "lg:w-24" : "lg:w-72"}

w-72


${
sidebarOpen
?
"translate-x-0"
:
"-translate-x-full lg:translate-x-0"
}

`}


>





{/* MOBILE CLOSE */}

<div

className="
lg:hidden
flex
justify-end
px-4
pt-4
"

>

<button

onClick={()=>
setSidebarOpen(false)
}

>

<FiX size={28}/>


</button>


</div>








{/* HEADER */}

<div

className="
relative
shrink-0
px-6
py-4
border-b
border-amber-100
"

>



{/* NOTIFICATION BUTTON */}

<button

onClick={()=>
navigate("/admin/notifications")
}

className="
absolute
top-5
right-5

w-11
h-11

rounded-xl

flex
items-center
justify-center

hover:bg-amber-50

transition
"

>

<FiBell
size={24}
className="text-slate-700"
/>


<span

className="
absolute
top-2
right-2

w-3
h-3

rounded-full

bg-red-500
"

/>


</button>





<h1

className="
text-2xl
font-bold
text-amber-600
"

>

{settings?.storeName || "Dream Mode"}


</h1>



<p

className="
text-sm
text-gray-500
"

>

Admin Panel


</p>





<div

className="
mt-5
flex
items-center
gap-4
"

>


<img

src={
user?.photoURL ||
"https://ui-avatars.com/api/?name=Admin"
}

alt="Admin"

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

<h3

className="
font-bold
text-slate-800
"

>

{user?.name || "Administrator"}

</h3>



<p

className="
text-sm
text-gray-500
truncate
max-w-[150px]
"

>

{user?.email}


</p>


</div>


</div>


</div>
