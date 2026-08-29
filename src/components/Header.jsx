import {
  useState,
  useRef,
  useEffect
} from "react";

import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";


import {
  FiMenu,
  FiShoppingBag,
  FiShoppingCart,
  FiHeart,
  FiSearch,
  FiBell,
  FiHome,
  FiLogIn,
  FiUserPlus,
  FiX,
  FiDownload,
  FiChevronDown,
  FiUser,
  FiUsers,
  FiBox,
  FiTag,
  FiLayout,
  FiSend,
  FiPlusCircle,
  FiImage,
  FiSettings,
  FiKey,
  FiRotateCcw,
  FiLogOut,
  FiActivity,
  FiRefreshCw,
  FiLock,
  FiTrash2,
} from "react-icons/fi";


import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";


import {
  useNotifications
} from "../context/NotificationContext";


import AdminDrawerHeader from "./admin/AdminDrawerHeader";
import AdminDrawerMenu from "./admin/AdminDrawerMenu";


import UserDrawerHeader from "./user/UserDrawerHeader";
import UserDrawerMenu from "./user/UserDrawerMenu";


import NotificationDropdown from "./NotificationDropdown";


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
  wishlist
}=useWishlist();


const wishlistCount =
wishlist?.length || 0;




const firstName =
user
?
(user.name || user.displayName || "User")
.trim()
.split(" ")[0]
:
"";




const {
 settings
}=useSettings();




const {
 unreadCount
}=useNotifications();


const [showInstallDialog, setShowInstallDialog] = useState(false);




const navigate = useNavigate();


const location = useLocation();




const isPanel =
location.pathname.startsWith("/profile") ||
location.pathname.startsWith("/admin");




const isAdmin =
user?.role === "admin";





const [
 mobileOpen,
 setMobileOpen
]=useState(false);





const [
 searchOpen,
 setSearchOpen
]=useState(false);


const searchRef = useRef(null);


const [
 notifOpen,
 setNotifOpen
]=useState(false);

const notifRef = useRef(null);


const [
 adminMenuOpen,
 setAdminMenuOpen
]=useState(false);

const adminMenuRef = useRef(null);


const [
 profileMenuOpen,
 setProfileMenuOpen
]=useState(false);

const profileMenuRef = useRef(null);


const [
 search,
 setSearch
]=useState("");






const handleLogout = async()=>{


 await logout();


 navigate("/login");


 setMobileOpen(false);

 setAdminMenuOpen(false);

 setProfileMenuOpen(false);


};






  const handleInstallClick = () => {

  setShowInstallDialog(false);

  // Directly download the signed release APK so Android's own
  // install-confirmation dialog takes over from there - this works
  // in any mobile browser, unlike the PWA beforeinstallprompt flow
  // which only fires under narrow, browser-specific conditions.
  const link = document.createElement("a");
  link.href = "/downloads/Dream-Mode.apk";
  link.download = "Dream-Mode.apk";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



  


const handleSearch = (e)=>{


e.preventDefault();



const keyword =
search.trim();



if(!keyword)
return;



navigate(
`/shop?search=${encodeURIComponent(keyword)}`
);



setSearchOpen(false);


};


useEffect(()=>{


const handleClickOutside = (e)=>{


if(
searchRef.current &&
!searchRef.current.contains(e.target)
){

setSearchOpen(false);

setSearch("");

}


if(
notifRef.current &&
!notifRef.current.contains(e.target)
){

setNotifOpen(false);

}


if(
adminMenuRef.current &&
!adminMenuRef.current.contains(e.target)
){

setAdminMenuOpen(false);

}


if(
profileMenuRef.current &&
!profileMenuRef.current.contains(e.target)
){

setProfileMenuOpen(false);

}

};



document.addEventListener(
"mousedown",
handleClickOutside
);



return ()=>{


document.removeEventListener(
"mousedown",
handleClickOutside
);


};


},[]);


return (

<>

  {/* ================= TOP BAR ================= */}

{!isPanel && (

<div
className="
h-8
lg:h-10
bg-[#071F57]
overflow-hidden
flex
items-center
text-white
text-[12px]
lg:text-[13px]
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

🚚 Outside Dhaka Delivery ৳150

&nbsp;&nbsp;&nbsp;

⭐ Premium Quality

&nbsp;&nbsp;&nbsp;

💳 Cash On Delivery

&nbsp;&nbsp;&nbsp;

🔥  {settings.storeName || ""} New Collection 🔥

</div>

</div>

)}





{/* ================= HEADER ================= */}

<header
className={`
sticky
${isPanel ? "top-0" : "top-8"}
z-50
bg-white
border-b
border-slate-100
shadow-md
`}
>

<div className="container-box">


<div
className="
h-[72px]
lg:h-[96px]
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
gap-1
relative
"
>


<button
className="md:hidden"
onClick={()=>setMobileOpen(true)}
>

<FiMenu
size={28}
className="text-[#071F57]"
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
src={settings.logoUrl || "/logo.png"}
alt="logo"
className="
w-10
h-10
md:w-12
md:h-12
lg:w-14
lg:h-14
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
lg:text-[46px]
font-bold
text-[#1A1A1A]
whitespace-nowrap
"
style={{
fontFamily:"'Lobster', cursive"
}}
>

{
settings.storeName || ""
}

</h2>



<p
className="
text-[7px]
md:text-[11px]
lg:text-[12px]
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
md:flex
items-center
gap-8
lg:gap-10
font-medium
"
>


<Link
to="/"
className="
relative
py-2
lg:text-[15px]
transition-colors
hover:text-[#D4AF37]
after:content-['']
after:absolute
after:left-0
after:-bottom-1
after:h-[2px]
after:w-0
after:bg-[#D4AF37]
after:transition-all
hover:after:w-full
"
>
Home
</Link>


<Link
to="/shop"
className="
relative
py-2
lg:text-[15px]
transition-colors
hover:text-[#D4AF37]
after:content-['']
after:absolute
after:left-0
after:-bottom-1
after:h-[2px]
after:w-0
after:bg-[#D4AF37]
after:transition-all
hover:after:w-full
"
>
Shop
</Link>


<Link
to="/about"
className="
hidden
lg:inline-flex
relative
py-2
lg:text-[15px]
transition-colors
hover:text-[#D4AF37]
after:content-['']
after:absolute
after:left-0
after:-bottom-1
after:h-[2px]
after:w-0
after:bg-[#D4AF37]
after:transition-all
hover:after:w-full
"
>
About
</Link>


<Link
to="/contact"
className="
hidden
lg:inline-flex
relative
py-2
lg:text-[15px]
transition-colors
hover:text-[#D4AF37]
after:content-['']
after:absolute
after:left-0
after:-bottom-1
after:h-[2px]
after:w-0
after:bg-[#D4AF37]
after:transition-all
hover:after:w-full
"
>
Contact
</Link>


<Link
to="/faqs"
className="
hidden
lg:inline-flex
relative
py-2
lg:text-[15px]
transition-colors
hover:text-[#D4AF37]
after:content-['']
after:absolute
after:left-0
after:-bottom-1
after:h-[2px]
after:w-0
after:bg-[#D4AF37]
after:transition-all
hover:after:w-full
"
>
FAQs
</Link>


<Link
to="/cart"
aria-label="Cart"
className="
relative
flex
items-center
transition-transform
hover:scale-110
hover:text-[#D4AF37]
"
>

<FiShoppingCart size={22} className="lg:w-6 lg:h-6"/>

{
cartCount > 0 && (

<span
className="
absolute
-top-2
-right-3
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
user && (

<Link
to="/profile/wishlist"
aria-label="Wishlist"
className="
relative
flex
items-center
transition-transform
hover:scale-110
hover:text-[#D4AF37]
"
>

<FiHeart size={22} className="lg:w-6 lg:h-6"/>

{
wishlistCount > 0 && (

<span
className="
absolute
-top-2
-right-3
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

{wishlistCount}

</span>

)
}

</Link>

)
}


</nav>





{/* RIGHT */}

<div
className="
flex
items-center
gap-4
lg:gap-6
"
>


  {/* SEARCH */}

<div
ref={searchRef}
className="
relative
flex
items-center
gap-1
"
>


<form
onSubmit={handleSearch}
className={`
absolute
right-9
top-1/2
-translate-y-1/2
transition-all
duration-300
ease-in-out
origin-right
overflow-hidden

${
searchOpen
?
"w-[240px] lg:w-[320px] opacity-100 scale-x-100"
:
"w-0 opacity-0 scale-x-95 pointer-events-none"
}

`}
>


<FiSearch

size={18}

className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"

/>




<input

autoFocus={searchOpen}

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

placeholder="Search products..."

className="
w-full
h-10
bg-[#FAF7F2]
border
border-gray-200
rounded-full
pl-10
pr-10
text-sm
outline-none
focus:border-[#D4AF37]
"

/>




<button

type="button"

onClick={()=>{

setSearchOpen(false);

setSearch("");

}}

className="
absolute
right-3
top-1/2
-translate-y-1/2
text-gray-500
"

>

<FiX size={18}/>

</button>



</form>






<button

onClick={()=>setSearchOpen(true)}

className="
relative
z-10
transition-transform
hover:scale-110
"

>

<FiSearch

size={22}

className="text-[#071F57] lg:w-6 lg:h-6"

/>

</button>



</div>










{/* NOTIFICATION */}


{
user && (

<div
ref={notifRef}
className="relative"
>

<button

onClick={()=>{


if(!user){

navigate("/login");

return;

}



setNotifOpen(prev => !prev);


}}

className="
relative
transition-transform
hover:scale-110
"

>

<FiBell

size={24}

className="text-[#071F57] lg:w-[26px] lg:h-[26px]"

/>



{

unreadCount > 0 && (

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

{unreadCount}

</span>


)

}


</button>

{
notifOpen && (
<NotificationDropdown
close={()=>setNotifOpen(false)}
notificationPath={isAdmin ? "/admin/notifications" : "/profile/notifications"}
/>
)
}

</div>

)
}






{
!user ? (

<div
className="
hidden
md:flex
items-center
gap-3
"
>


<Link
to="/login"
className="
flex
items-center
gap-2
px-5
lg:px-6
py-2.5
lg:py-3
rounded-full
border
border-[#071F57]
text-[#071F57]
transition-colors
hover:bg-[#071F57]
hover:text-white
"
>

<FiLogIn size={18}/>

Login

</Link>


<Link
to="/register"
className="
flex
items-center
gap-2
px-6
lg:px-7
py-2.5
lg:py-3
rounded-full
bg-[#071F57]
text-white
transition-colors
hover:bg-[#0a2d7a]
"
>

<FiUserPlus size={18}/>

Register

</Link>


</div>

)

:

(

<div
className="
hidden
md:flex
items-center
gap-4
"
>


{
isAdmin &&

<Link
to="/admin"
>

Dashboard

</Link>

}



{
isAdmin ? (

<div
ref={adminMenuRef}
className="relative"
>

<button

onClick={()=>setAdminMenuOpen(prev=>!prev)}

className="
flex
flex-col
items-center
gap-1
"

>

{
user?.photoURL

?

<img

src={user.photoURL}

className="
w-9
h-9
rounded-full
object-cover
border
border-[#071F57]/30
"

/>

:

<div
className="
w-9
h-9
rounded-full
bg-[#071F57]
text-white
flex
items-center
justify-center
text-sm
font-bold
"
>

{
(firstName || "U")
.charAt(0)
.toUpperCase()
}

</div>

}

<span
className="
flex
items-center
gap-0.5
text-xs
font-semibold
text-[#071F57]
leading-none
"
>

{firstName}

<FiChevronDown
size={12}
className={`
transition-transform
${adminMenuOpen ? "rotate-180" : ""}
`}
/>

</span>

</button>




{
adminMenuOpen && (

<div

className="
absolute
right-0
top-full
mt-3
w-72
max-h-[70vh]
overflow-y-auto
bg-white
rounded-2xl
shadow-2xl
border
border-slate-100
py-3
z-50
"

>

{[
{ to:"/admin/profile", label:"Admin Profile", icon:FiUser },
{ to:"/admin/users", label:"Users Panel", icon:FiUsers },
{ to:"/admin/products", label:"Products", icon:FiBox },
{ to:"/admin/categories", label:"Categories", icon:FiTag },
{ to:"/admin/landing", label:"Landing Pages", icon:FiLayout },
{ to:"/admin/orders", label:"Orders", icon:FiShoppingCart },
{ to:"/admin/return-orders", label:"Return Orders", icon:FiRotateCcw },
{ to:"/admin/send-notification", label:"Send Notification", icon:FiSend },
{ to:"/admin/add-product", label:"Add Product", icon:FiPlusCircle },
{ to:"/admin/add-order", label:"Add Order", icon:FiPlusCircle },
{ to:"/admin/banners", label:"Hero Banners", icon:FiImage },
{ to:"/admin/shop-hero", label:"Shop Hero", icon:FiImage },
{ to:"/admin/subscribers", label:"Subscribers", icon:FiUsers },
{ to:"/admin/settings", label:"Website Settings", icon:FiSettings },
{ to:"/admin/change-password", label:"Change Password", icon:FiKey },
].map((item)=>(

<Link

key={item.to}

to={item.to}

onClick={()=>setAdminMenuOpen(false)}

className="
flex
items-center
gap-3
px-5
py-2.5
text-sm
text-slate-700
hover:bg-[#FFF7E8]
hover:text-[#071F57]
"

>

<item.icon size={17}/>

{item.label}

</Link>

))}

<div className="border-t border-slate-100 mt-2 pt-2">

<button

onClick={handleLogout}

className="
w-full
flex
items-center
gap-3
px-5
py-2.5
text-sm
text-red-600
hover:bg-red-50
"

>

<FiLogOut size={17}/>

Logout

</button>

</div>

</div>

)
}

</div>

) : (

<div
ref={profileMenuRef}
className="relative"
>

<button

onClick={()=>setProfileMenuOpen(prev=>!prev)}

className="
flex
flex-col
items-center
gap-1
"

>

{
user?.photoURL

?

<img

src={user.photoURL}

className="
w-9
h-9
rounded-full
object-cover
border
border-[#071F57]/30
"

/>

:

<div
className="
w-9
h-9
rounded-full
bg-[#071F57]
text-white
flex
items-center
justify-center
text-sm
font-bold
"
>

{
(firstName || "U")
.charAt(0)
.toUpperCase()
}

</div>

}

<span
className="
flex
items-center
gap-0.5
text-xs
font-semibold
text-[#071F57]
leading-none
"
>

{firstName}

<FiChevronDown
size={12}
className={`
transition-transform
${profileMenuOpen ? "rotate-180" : ""}
`}
/>

</span>

</button>




{
profileMenuOpen && (

<div

className="
absolute
right-0
top-full
mt-3
w-64
lg:w-72
max-h-[70vh]
overflow-y-auto
bg-white
rounded-2xl
shadow-2xl
border
border-slate-100
py-3
z-50
"

>

{[
{ to:"/profile", label:"My Profile", icon:FiUser },
{ to:"/profile/account", label:"Account Information", icon:FiUser },
{ to:"/profile/activity", label:"Recent Activities", icon:FiActivity },
{ to:"/profile/orders", label:"My Orders", icon:FiShoppingBag },
{ to:"/profile/returns", label:"My Returns", icon:FiRefreshCw },
{ to:"/profile/wishlist", label:"Wishlist", icon:FiHeart },
{ to:"/profile/notifications", label:"Notifications", icon:FiBell },
{ to:"/profile/security/password", label:"Change Password", icon:FiLock },
{ to:"/profile/security/delete", label:"Delete Account", icon:FiTrash2 },
].map((item)=>(

<Link

key={item.to}

to={item.to}

onClick={()=>setProfileMenuOpen(false)}

className="
flex
items-center
gap-3
px-5
py-2.5
text-sm
text-slate-700
hover:bg-[#FFF7E8]
hover:text-[#071F57]
"

>

<item.icon size={17}/>

{item.label}

</Link>

))}

<div className="border-t border-slate-100 mt-2 pt-2">

<button

onClick={handleLogout}

className="
w-full
flex
items-center
gap-3
px-5
py-2.5
text-sm
text-red-600
hover:bg-red-50
"

>

<FiLogOut size={17}/>

Logout

</button>

</div>

</div>

)
}

</div>

)
}


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
transition-transform
duration-300
flex
flex-col
${mobileOpen ? "translate-x-0" : "-translate-x-full"}
${isAdmin || user ? "bg-[#FAF7F2]" : "bg-white"}
`}

>


<div
className="
flex-1
overflow-y-auto
flex
flex-col
"
>


{/* ================= GUEST ================= */}


{!user && (

<>


{/* GUEST DRAWER HEADER */}

<div

className="
bg-[#071F57]
text-white
px-6
py-5
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

className="
w-12
h-12
object-contain
"

alt="logo"

/>



<div>

<h2
className="
text-xl
font-bold
"
>

{
settings.storeName ||
""
}

</h2>



<p
className="
text-sm
text-white/70
"
>

Premium Fashion

</p>


</div>



<button

onClick={()=>setMobileOpen(false)}

className="
ml-auto
text-3xl
"

>

×


</button>


</div>





{/* GUEST MENU */}


<div
className="
flex-1
py-4
"
>


<Link
to="/"
onClick={()=>setMobileOpen(false)}
className="
flex
items-center
gap-3
px-6
py-4
text-lg
"
>

<FiHome size={20}/>

<span>
Home
</span>

</Link>




<Link
to="/shop"
onClick={()=>setMobileOpen(false)}
className="
flex
items-center
gap-3
px-6
py-4
text-lg
"
>

<FiShoppingBag size={20}/>

<span>
Shop
</span>

</Link>




<Link
to="/cart"
onClick={()=>setMobileOpen(false)}
className="
flex
items-center
justify-between
px-6
py-4
text-lg
"
>

<div
className="
flex
items-center
gap-3
"
>

<FiShoppingBag size={20}/>

<span>
Cart
</span>

</div>


<span>
{cartCount}
</span>


</Link>




  <button

onClick={() => setShowInstallDialog(true)}

className="
flex
items-center
gap-3
px-6
py-4
text-lg
w-full
text-left
"

>

<FiDownload size={20}/>

<span>App</span>

</button>



  




<Link
to="/login"
onClick={()=>setMobileOpen(false)}
className="
flex
items-center
gap-3
px-6
py-4
text-lg
"
>

<FiLogIn size={20}/>

<span>
Login
</span>

</Link>





<Link

to="/register"

onClick={()=>setMobileOpen(false)}

className="
mx-6
mt-3
flex
items-center
justify-center
gap-2
rounded-xl
bg-[#071F57]
text-white
py-3
"

>

<FiUserPlus size={18}/>

<span>
Register Now
</span>


</Link>


</div>






{/* GUEST FOOTER */}

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

src={
settings.logoUrl ||
"/logo.png"
}

className="
w-14
h-14
mx-auto
mb-3
object-contain
"

alt="logo"

/>




<h3
className="
text-xl
font-bold
"
>

{
settings.storeName ||
""
}

</h3>




<p
className="
text-xs
text-white/70
mt-2
"
>

Dress Your Dream,
Live Your Style

</p>




<Link

to="/shop"

onClick={()=>setMobileOpen(false)}

className="
mt-5
flex
items-center
justify-center
py-3
rounded-xl
bg-white
text-[#071F57]
font-semibold
"

>

Shop Now


</Link>


</div>


</div>



</>

)}






{/* ================= ADMIN ================= */}


{
user && isAdmin && (

<>

<AdminDrawerHeader

closeDrawer={()=>setMobileOpen(false)}

onNotificationClick={()=>{

navigate("/admin/notifications");

setMobileOpen(false);

}}

/>



<AdminDrawerMenu

closeDrawer={()=>setMobileOpen(false)}

onLogout={handleLogout}

/>


</>

)

}






{/* ================= USER ================= */}


{
user && !isAdmin && (

<>

<UserDrawerHeader

closeDrawer={()=>setMobileOpen(false)}

onNotificationClick={()=>{

navigate("/profile/notifications");

setMobileOpen(false);

}}

/>



<UserDrawerMenu

closeDrawer={()=>setMobileOpen(false)}

onLogout={handleLogout}

/>


</>

)

}



</div>


</div>





  {
showInstallDialog && (

<div
className="
fixed
inset-0
bg-black/40
z-[100]
flex
items-center
justify-center
p-5
"
>

<div
className="
bg-white
rounded-2xl
p-6
w-full
max-w-sm
"
>

<h3 className="text-xl font-bold">

Downloading Dream Mode App?

</h3>

<div className="flex gap-3 mt-6">

<button

onClick={() => setShowInstallDialog(false)}

className="
flex-1
border
py-3
rounded-xl
"

>

No

</button>

<button

onClick={handleInstallClick}

className="
flex-1
bg-[#071F57]
text-white
py-3
rounded-xl
"

>

Yes

</button>

</div>

</div>

</div>

)
}




{/* OVERLAY */}


{
mobileOpen && (

<div

onClick={()=>setMobileOpen(false)}

className="
fixed
inset-0
bg-black/40
backdrop-blur-sm
z-[60]
"

/>

)

}





</>

);

}
