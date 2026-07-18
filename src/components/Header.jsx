// src/components/Header.jsx

import {
  useState,
} from "react";


import {
  Link,
  useNavigate,
} from "react-router-dom";


import {
  FiMenu,
  FiShoppingBag,
  FiUser,
  FiSearch,
  FiLogOut,
} from "react-icons/fi";


import useAuth from "../hooks/useAuth";

import useCart from "../hooks/useCart";


import AdminDrawer from "./admin/AdminDrawer";

import UserDrawer from "./user/UserDrawer";


import {
  logout,
} from "../services/authService";


import {
  useSettings,
} from "../context/SettingsContext";





export default function Header(){



const {
  user
}=useAuth();



const {
  cartCount
}=useCart();



const {
 settings
}=useSettings();



const navigate = useNavigate();



const isAdmin =
user?.role === "admin";



const [
 mobileOpen,
 setMobileOpen
]=useState(false);





const handleLogout = async()=>{


 await logout();


 navigate("/login");


 setMobileOpen(false);


};







return (

<>





{/* ================= TOP BAR ================= */}



<div

className="
h-8
bg-[#071F57]
overflow-hidden
flex
items-center
text-white
text-[12px]
font-medium
"

>


<div

className="
marquee
whitespace-nowrap
"

>


🚚 Inside Dhaka Delivery ৳80


&nbsp;&nbsp;&nbsp;


🚚 Outside Dhaka Delivery ৳120


&nbsp;&nbsp;&nbsp;


⭐ Premium Quality


&nbsp;&nbsp;&nbsp;


💳 Cash On Delivery


&nbsp;&nbsp;&nbsp;


🔥 Dream Mode Premium Collection


</div>


</div>









{/* ================= HEADER ================= */}



<header

className="
sticky
top-8
z-50
bg-white
border-b
border-slate-100
shadow-md
"

>


<div

className="
container-box
"

>


<div

className="
h-[72px]
flex
items-center
justify-between
"

>






{/* LEFT */}



<div

className="
flex
items-center
gap-3
"

>


<button

className="
lg:hidden
"

onClick={()=>setMobileOpen(true)}

>


<FiMenu

size={28}

className="
text-[#071F57]
"

/>


</button>








<Link

to="/"

className="
flex
items-center
gap-3
"

>



<img

src={
settings.logoUrl ||
"/logo.png"
}

alt="logo"

className="
w-10
h-10
md:w-12
md:h-12
object-contain
"

/>






<div

className="
ml-4
flex
flex-col
leading-none
"

>


<h2

className="
text-[30px]
md:text-[42px]
font-bold
text-[#1A1A1A]
whitespace-nowrap
"

style={{

fontFamily:"'Lobster', cursive"

}}

>


{
settings.storeName ||
"DREAM MODE"
}


</h2>





<p

className="
text-[7px]
md:text-[11px]
mt-1
text-[#D4AF37]
font-medium
tracking-[1.5px]
uppercase
"

>


Dress Your Dream, Live Your Style


</p>


</div>



</Link>



</div>







{/* DESKTOP MENU */}



<nav

className="
hidden
lg:flex
items-center
gap-8
font-medium
"

>


<Link

to="/"

className="
hover:text-[#071F57]
"

>

Home

</Link>





<Link

to="/shop"

className="
hover:text-[#071F57]
"

>

Shop

</Link>



</nav>








{/* RIGHT */}



<div

className="
flex
items-center
gap-4
"

>


<button

onClick={()=>navigate("/shop")}

className="
hover:scale-110
transition
"

>


<FiSearch

size={22}

className="
text-[#071F57]
"

/>


</button>






<Link

to="/cart"

className="
relative
"

>


<FiShoppingBag

size={24}

className="
text-[#071F57]
"

/>



{
cartCount>0 &&

<span

className="
absolute
-top-2
-right-2
bg-[#071F57]
text-white
text-[10px]
h-[18px]
min-w-[18px]
rounded-full
flex
items-center
justify-center
"

>

{cartCount}

</span>

}



</Link>

  {/* ================= LOGIN / USER ================= */}



{
!user ? (


<div

className="
hidden
lg:flex
items-center
gap-3
"

>


<Link

to="/login"

className="
px-5
py-2.5
rounded-full
border
border-[#071F57]
text-[#071F57]
font-medium
hover:bg-[#071F57]
hover:text-white
transition
"

>

Login

</Link>





<Link

to="/register"

className="
px-6
py-2.5
rounded-full
bg-[#071F57]
text-white
font-medium
hover:bg-[#0A2E82]
transition
"

>

Join Now

</Link>



</div>



)

:

(


<div

className="
hidden
lg:flex
items-center
gap-4
"

>




{

isAdmin &&


<Link

to="/admin"

className="
font-medium
hover:text-[#071F57]
"

>

Dashboard

</Link>


}





<Link

to="/profile"

className="
flex
items-center
gap-2
hover:text-[#071F57]
"

>


<FiUser size={20}/>


Profile


</Link>







<button

onClick={handleLogout}

className="
flex
items-center
gap-2
text-red-600
font-medium
"

>


<FiLogOut size={18}/>


Logout


</button>




</div>


)

}



</div>






</div>


</div>


</header>









{/* ================= MOBILE DRAWER ================= */}



{

isAdmin

?


<AdminDrawer

open={mobileOpen}

setOpen={setMobileOpen}

/>


:


<UserDrawer

open={mobileOpen}

setOpen={setMobileOpen}

/>


}






</>

);


}
