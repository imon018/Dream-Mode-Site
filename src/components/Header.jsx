import {
  useState
} from "react";

import {
  Link,
  useNavigate
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


import AdminDrawerHeader from "./admin/AdminDrawerHeader";
import AdminDrawerMenu from "./admin/AdminDrawerMenu";


import UserDrawerHeader from "./user/UserDrawerHeader";
import UserDrawerMenu from "./user/UserDrawerMenu";


import {
  logout
} from "../services/authService";


import {
  useSettings
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


{/* TOP BAR */}


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







{/* HEADER */}



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

fontFamily:
"'Lobster', cursive"

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


Dress Your Dream,
Live Your Style


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
cartCount > 0 && (

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


)

}


</Link>







{
!user ? (


<div

className="
hidden
lg:flex
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
"

>

Dashboard

</Link>

}



<Link

to={
isAdmin
?
"/admin/profile"
:
"/profile"
}

className="
flex
items-center
gap-2
"

>


<FiUser size={20}/>


{
isAdmin
?
"Admin"
:
"Profile"
}


</Link>




<button

onClick={handleLogout}

className="
flex
items-center
gap-2
text-red-600
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

<div
  className={`
fixed
top-0
left-0
h-screen
w-[320px]
z-[70]
shadow-2xl
transition-all
duration-300
flex
flex-col
${mobileOpen ? "translate-x-0" : "-translate-x-full"}
${isAdmin || user ? "bg-[#FAF7F2]" : "bg-white"}
`}
>

  <div className="flex-1 overflow-y-auto">

    {/* ================= GUEST ================= */}

    {!user && (
      <>
        <div className="bg-[#071F57] text-white p-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <img
                src={settings.logoUrl || "/logo.png"}
                className="w-10 h-10 object-contain"
              />

              <div>

                <h2 className="text-xl font-bold">
                  {settings.storeName || "DREAM MODE"}
                </h2>

                <p className="text-xs text-white/70">
                  Premium Fashion
                </p>

              </div>

            </div>

            <button
              onClick={() => setMobileOpen(false)}
            >
              ✕
            </button>

          </div>

        </div>

        <div className="py-4">

          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block px-6 py-4"
          >
            Home
          </Link>

          <Link
            to="/shop"
            onClick={() => setMobileOpen(false)}
            className="block px-6 py-4"
          >
            Shop
          </Link>

          <Link
            to="/cart"
            onClick={() => setMobileOpen(false)}
            className="flex justify-between px-6 py-4"
          >
            Cart
            <span>{cartCount}</span>
          </Link>

          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="block px-6 py-4"
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={() => setMobileOpen(false)}
            className="mx-6 mt-3 flex justify-center rounded-xl bg-[#071F57] text-white py-3"
          >
            Join Now
          </Link>

        </div>
      </>
    )}

    {/* ================= ADMIN ================= */}

    {user && isAdmin && (
      <>
        <AdminDrawerHeader
          closeDrawer={() => setMobileOpen(false)}
          onNotificationClick={() => {
            navigate("/admin/notifications");
            setMobileOpen(false);
          }}
        />

        <AdminDrawerMenu
          closeDrawer={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      </>
    )}

    {/* ================= USER ================= */}

    {user && !isAdmin && (
      <>
        <UserDrawerHeader
          closeDrawer={() => setMobileOpen(false)}
          onNotificationClick={() => {
            navigate("/profile/notifications");
            setMobileOpen(false);
          }}
        />

        <UserDrawerMenu
          closeDrawer={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      </>
    )}

  </div>

  {/* ================= FOOTER ================= */}

  <div
    className="
border-t
border-slate-200
p-6
bg-white
"
  >

    <div
      className="
rounded-2xl
bg-[#071F57]
text-white
p-5
text-center
"
    >

      <img
        src={settings.logoUrl || "/logo.png"}
        className="w-14 h-14 mx-auto mb-3 object-contain"
      />

      <h3 className="text-xl font-bold">
        {settings.storeName || "Dream Mode"}
      </h3>

      <p className="text-xs text-white/70 mt-2">
        Dress Your Dream,
        Live Your Style
      </p>

      <Link
        to="/shop"
        onClick={() => setMobileOpen(false)}
        className="mt-5 flex items-center justify-center py-3 rounded-xl bg-white text-[#071F57] font-semibold"
      >
        Shop Now
      </Link>

    </div>

  </div>

</div>

{/* ================= OVERLAY ================= */}

{mobileOpen && (
  <div
    onClick={() => setMobileOpen(false)}
    className="
fixed
inset-0
bg-black/40
backdrop-blur-sm
z-[60]
"
  />
)}

  </>

);

}
