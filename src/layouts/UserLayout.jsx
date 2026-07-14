import {
  useState,
} from "react";


import {
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";


import {
  FiUser,
  FiActivity,
  FiShoppingBag,
  FiHeart,
  FiLock,
  FiTrash2,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
} from "react-icons/fi";



import {
  logout,
} from "../services/authService";


import {
  useSettings,
} from "../context/SettingsContext";


import {
  useNotifications,
} from "../context/NotificationContext";





export default function UserLayout(){



const [
 sidebarOpen,
 setSidebarOpen,
]=useState(false);



const navigate = useNavigate();




const {
 settings
}=useSettings();




const {
 unreadCount,
}=useNotifications();






const menu=[


{
 name:"My Profile",
 path:"/profile",
 icon:<FiUser/>,
},


{
 name:"Account Information",
 path:"/profile/account",
 icon:<FiUser/>,
},


{
 name:"Recent Activities",
 path:"/profile/activity",
 icon:<FiActivity/>,
},


{
 name:"My Orders",
 path:"/profile/orders",
 icon:<FiShoppingBag/>,
},


{
 name:"Wishlist",
 path:"/profile/wishlist",
 icon:<FiHeart/>,
},


{
 name:"Notifications",
 path:"/profile/notifications",
 icon:<FiBell/>,
},


{
 name:"Change Password",
 path:"/profile/security/password",
 icon:<FiLock/>,
},


{
 name:"Delete Account",
 path:"/profile/security/delete",
 icon:<FiTrash2/>,
},


];






return (


<div className="
min-h-screen
bg-gray-100
flex
">






{/* MOBILE MENU BUTTON */}


<button

onClick={()=>setSidebarOpen(true)}

className="
lg:hidden
fixed
top-4
left-4
z-50
bg-slate-900
text-white
p-3
rounded-xl
"

>

<FiMenu size={22}/>

</button>








{/* OVERLAY */}


{
sidebarOpen &&

<div

onClick={()=>setSidebarOpen(false)}

className="
fixed
inset-0
bg-black/50
z-40
lg:hidden
"

></div>

}









{/* SIDEBAR */}


<aside

className={`
fixed
lg:static

top-0
left-0

h-screen

w-72

bg-slate-900

text-white

z-50

transition-transform
duration-300


${
sidebarOpen

?

"translate-x-0"

:

"-translate-x-full lg:translate-x-0"

}

`}

>





{/* CLOSE MOBILE */}


<div className="
lg:hidden
flex
justify-end
p-4
">


<button

onClick={()=>setSidebarOpen(false)}

>

<FiX size={26}/>


</button>


</div>









{/* HEADER */}


<div

className="
relative
p-6
border-b
border-slate-700
"

>


{/* NOTIFICATION BELL */}


<button

onClick={()=>navigate("/profile/notifications")}

className="
absolute
top-5
right-5

w-10
h-10

rounded-xl

flex
items-center
justify-center

hover:bg-slate-800

transition
"

>


<FiBell size={23}/>





{
unreadCount > 0 &&

<span

className="
absolute
-top-1
-right-1

bg-red-500

text-white

text-xs

font-bold

min-w-[20px]

h-5

rounded-full

flex
items-center
justify-center
"

>

{
unreadCount > 99
?
"99+"
:
unreadCount
}


</span>

}



</button>







<h1 className="
text-2xl
font-bold
">


{
settings?.storeName ||
"Dream Mode"
}


</h1>



<p className="
text-gray-400
text-sm
">

My Account

</p>


</div>









{/* MENU */}


<nav

className="
p-4
space-y-2
overflow-y-auto
pb-24
"

>


{
menu.map((item)=>(


<NavLink


key={item.path}


to={item.path}


onClick={()=>setSidebarOpen(false)}


className={({isActive})=>

`

flex
items-center
gap-3

px-4
py-3

rounded-xl

transition


${
isActive

?

"bg-blue-600"

:

"hover:bg-slate-800"

}

`

}


>


{item.icon}


<span>

{item.name}

</span>



</NavLink>


))

}


</nav>









{/* LOGOUT */}


<div

className="
absolute
bottom-0
left-0

w-full

p-4

border-t

border-slate-700
"

>


<button


onClick={logout}


className="
w-full

flex
items-center
justify-center

gap-2

bg-red-600

py-3

rounded-xl
"


>


<FiLogOut/>


Logout


</button>



</div>





</aside>









{/* MAIN CONTENT */}


<main

className="
flex-1
p-8
"

>


<Outlet/>


</main>






</div>


);


}
