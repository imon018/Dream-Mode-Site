import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";

import {
  FiGrid,
  FiBox,
  FiImage,
  FiPlusCircle,
  FiUsers,
  FiShoppingCart,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiLogOut,
  FiMenu,
  FiMail,
  FiX,
} from "react-icons/fi";

import { logout } from "../services/authService";


export default function AdminLayout() {


  const [sidebarOpen,setSidebarOpen] = useState(false);

  const [collapsed,setCollapsed] = useState(false);



  const menu = [

    {
      name:"Dashboard",
      icon:<FiGrid/>,
      path:"/admin"
    },


    {
      name:"Products",
      icon:<FiBox/>,
      path:"/admin/products"
    },


    {
      name:"Hero Banners",
      icon:<FiImage/>,
      path:"/admin/banners"
    },


    {
      name:"Add Product",
      icon:<FiPlusCircle/>,
      path:"/admin/add-product"
    },


    {
      name:"Orders",
      icon:<FiShoppingCart/>,
      path:"/admin/orders"
    },


    {
      name:"Add Order",
      icon:<FiPlusCircle/>,
      path:"/admin/add-order"
    },


    {
      name:"Users",
      icon:<FiUsers/>,
      path:"/admin/users"
    },


    {
      name:"Analytics",
      icon:<FiBarChart2/>,
      path:"/admin/analytics"
    },


    {
      name:"Settings",
      icon:<FiSettings/>,
      path:"/admin/settings"
    },


    {
      name:"Admin Profile",
      icon:<FiUser/>,
      path:"/admin/profile"
    },


    {
      name:"Subscribers",
      icon:<FiMail/>,
      path:"/admin/subscribers"
    },


    {
      name:"Newsletter",
      icon:<FiMail/>,
      path:"/admin/newsletter"
    },


    {
      name:"Shop Hero",
      icon:<FiImage/>,
      path:"/admin/shop-hero"
    },


  ];




return (


<div className="
min-h-screen
w-full
flex
bg-warm
overflow-hidden
">





{/* MOBILE OVERLAY */}

{
sidebarOpen &&

<div

className="
fixed
inset-0
bg-black/30
backdrop-blur-sm
z-40
lg:hidden
"

onClick={()=>setSidebarOpen(false)}

></div>

}





{/* MOBILE MENU BUTTON */}


<button

onClick={()=>setSidebarOpen(true)}

className="
lg:hidden
fixed
top-4
left-4
z-50

bg-gold-gradient

text-white

p-3

rounded-xl

shadow-gold

"

>

<FiMenu size={24}/>

</button>







{/* SIDEBAR */}


<aside


className={`
fixed
lg:static

top:0
left:0

h-screen


${collapsed 
? "lg:w-24"
: "lg:w-72"
}


w-72


bg-card

border-r

border-border


flex

flex-col


z-50


transition-all

duration-300


shadow-luxury


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
p-4
"

>

<button

onClick={()=>setSidebarOpen(false)}

className="
p-2
rounded-xl

hover:bg-gray-100

"

>

<FiX size={26}/>

</button>


</div>







{/* HEADER */}



<div

className="
h-24
px-6

flex
items-center
justify-between


border-b

border-border

"

>


{

!collapsed &&

<div>

<h1

className="
text-2xl
font-bold

text-amber-600

"

>

Dream Mode

</h1>


<p

className="
text-sm
text-muted

"

>

Admin Panel

</p>


</div>

}





<button

onClick={()=>setCollapsed(!collapsed)}

className="
hidden
lg:block

text-gray-500

hover:text-amber-500

"

>

<FiMenu size={22}/>

</button>



</div>









{/* MENU */}



<nav

className="
flex-1

overflow-y-auto

p-4

space-y-2

"

>


{
menu.map((item)=>(


<NavLink


key={item.path}

to={item.path}


onClick={()=>setSidebarOpen(false)}



className={({isActive})=>`

flex

items-center

gap-3


px-4

py-3


rounded-xl


transition-all

duration-300



${
isActive

?

"bg-gold-gradient text-white shadow-gold"

:

"text-gray-700 hover:bg-amber-50"

}


`}


>



<span className="text-xl">

{item.icon}

</span>



{

!collapsed &&

<span className="
font-medium
">

{item.name}

</span>

}



</NavLink>


))

}


</nav>









{/* LOGOUT */}



<div

className="
p-4

border-t

border-border

"

>


<button


onClick={()=>logout()}


className="

w-full

flex

items-center

justify-center

gap-2


bg-red-500

hover:bg-red-600


text-white


py-3


rounded-xl


transition


"

>


<FiLogOut/>


{

!collapsed && "Logout"

}


</button>


</div>







</aside>









{/* MAIN CONTENT */}



<main

className="

flex-1

min-h-screen


w-full


bg-warm


overflow-y-auto



pt-20

lg:pt-8


px-4

sm:px-6

lg:px-8


"


>


<Outlet/>


</main>







</div>


);


}
