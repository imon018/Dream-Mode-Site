import {
  NavLink,
} from "react-router-dom";


import {
  useState,
} from "react";


import {
  FiHome,
  FiShoppingBag,
  FiUser,
  FiShoppingCart,
  FiRefreshCw,
  FiHeart,
  FiSettings,
  FiLock,
  FiTrash2,
  FiLogOut,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";





export default function UserDrawerMenu({

closeDrawer,

onLogout,

}) {



const [
 settingsOpen,
 setSettingsOpen
]=useState(false);






const menuItem = `

flex
items-center
gap-3
px-5
py-3
rounded-xl
transition
font-medium

`;







return (

<nav

className="
flex-1
overflow-y-auto
bg-[#FAF7F2]
px-4
py-5
space-y-2
"

>





{/* HOME */}


<NavLink

to="/"

onClick={closeDrawer}

className={({isActive})=>

menuItem +

(isActive

?

" bg-[#071F57] text-white shadow"

:

" text-slate-700 hover:bg-[#FFF7E8]"

)

}

>


<FiHome size={20}/>


Home


</NavLink>









{/* SHOP */}


<NavLink

to="/shop"

onClick={closeDrawer}

className={menuItem+" text-slate-700 hover:bg-[#FFF7E8]"}

>


<FiShoppingBag size={20}/>


Shop


</NavLink>









{/* PROFILE */}


<NavLink

to="/profile"

end

onClick={closeDrawer}

className={({isActive})=>

menuItem +

(isActive

?

" bg-[#071F57] text-white shadow"

:

" text-slate-700 hover:bg-[#FFF7E8]"

)

}

>


<FiUser size={20}/>


My Profile


</NavLink>









{/* ORDERS */}


<NavLink

to="/profile/orders"

onClick={closeDrawer}

className={menuItem+" text-slate-700 hover:bg-[#FFF7E8]"}

>


<FiShoppingCart size={20}/>


My Orders


</NavLink>









{/* RETURNS */}


<NavLink

to="/profile/returns"

onClick={closeDrawer}

className={menuItem+" text-slate-700 hover:bg-[#FFF7E8]"}

>


<FiRefreshCw size={20}/>


My Returns


</NavLink>









{/* WISHLIST */}


<NavLink

to="/wishlist"

onClick={closeDrawer}

className={menuItem+" text-slate-700 hover:bg-[#FFF7E8]"}

>


<FiHeart size={20}/>


Wishlist


</NavLink>









{/* SETTINGS */}



<div>


<button

onClick={()=>setSettingsOpen(!settingsOpen)}

className="
w-full
flex
items-center
justify-between
px-5
py-3
rounded-xl
hover:bg-[#FFF7E8]
text-slate-700
font-medium
"

>


<span

className="
flex
items-center
gap-3
"

>


<FiSettings size={20}/>


Settings


</span>





{

settingsOpen

?

<FiChevronUp/>

:

<FiChevronDown/>

}



</button>








{

settingsOpen &&


<div

className="
ml-8
mt-2
space-y-2
"

>



<NavLink

to="/profile/security/password"

onClick={closeDrawer}

className="
block
px-4
py-2
rounded-lg
hover:bg-white
text-slate-700
"

>


<FiLock

className="
inline
mr-2
"

/>


Change Password


</NavLink>








<NavLink

to="/profile/security/delete"

onClick={closeDrawer}

className="
block
px-4
py-2
rounded-lg
hover:bg-white
text-slate-700
"

>


<FiTrash2

className="
inline
mr-2
"

/>


Delete Account


</NavLink>






</div>


}



</div>









{/* LOGOUT */}



<button

onClick={onLogout}

className="
w-full
flex
items-center
gap-3
px-5
py-3
rounded-xl
bg-[#A0522D]
hover:bg-[#8B4513]
text-white
font-medium
mt-4
"

>


<FiLogOut size={20}/>


Logout


</button>





</nav>


);


}
