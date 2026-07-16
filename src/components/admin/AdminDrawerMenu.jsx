import {
  NavLink,
} from "react-router-dom";


import {
  useState,
} from "react";



import {
  FiGrid,
  FiHome,
  FiUser,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiSend,
  FiUpload,
  FiImage,
  FiSettings,
  FiLogOut,
  FiChevronUp,
  FiChevronDown,
  FiPlusCircle,
  FiKey,
  FiRotateCcw,
} from "react-icons/fi";





export default function AdminDrawerMenu({

 closeDrawer,

 onLogout,

}) {



const [
 uploadsOpen,
 setUploadsOpen
]=useState(false);



const [
 bannerOpen,
 setBannerOpen
]=useState(false);



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






{/* DASHBOARD */}


<NavLink

to="/admin"

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

<FiGrid size={20}/>

Dashboard

</NavLink>







{/* HOME */}


<NavLink

to="/"

onClick={closeDrawer}

className={menuItem+" text-slate-700 hover:bg-[#FFF7E8]"}

>

<FiHome size={20}/>

Home

</NavLink>








{/* ADMIN PROFILE */}


<NavLink

to="/admin/profile"

onClick={closeDrawer}

className={({isActive})=>

menuItem +

(isActive

?

" bg-[#071F57] text-white"

:

" text-slate-700 hover:bg-[#FFF7E8]"

)

}

>

<FiUser size={20}/>

Admin Profile

</NavLink>








{/* USERS */}


<NavLink

to="/admin/users"

onClick={closeDrawer}

className={menuItem+" text-slate-700 hover:bg-[#FFF7E8]"}

>

<FiUsers size={20}/>

Users Panel

</NavLink>







{/* PRODUCTS */}


<NavLink

to="/admin/products"

onClick={closeDrawer}

className={menuItem+" text-slate-700 hover:bg-[#FFF7E8]"}

>

<FiBox size={20}/>

Products

</NavLink>








{/* ORDERS */}


<NavLink

to="/admin/orders"

onClick={closeDrawer}

className={menuItem+" text-slate-700 hover:bg-[#FFF7E8]"}

>

<FiShoppingCart size={20}/>

Orders

</NavLink>




{/* RETURN ORDERS */}


<NavLink

to="/admin/return-orders"

onClick={closeDrawer}

className={menuItem+" text-slate-700 hover:bg-[#FFF7E8]"}

>

<FiRotateCcw size={20}/>

Return Orders

</NavLink>



{/* SEND NOTIFICATION */}


<NavLink

to="/admin/send-notification"

onClick={closeDrawer}

className={menuItem+" text-slate-700 hover:bg-[#FFF7E8]"}

>

<FiSend size={20}/>

Send Notification

</NavLink>









{/* UPLOADS */}


<div>


<button

onClick={()=>setUploadsOpen(!uploadsOpen)}

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


<span className="flex items-center gap-3">

<FiUpload size={20}/>

Uploads

</span>



{
uploadsOpen

?

<FiChevronUp/>

:

<FiChevronDown/>

}


</button>







{
uploadsOpen &&


<div

className="
ml-8
mt-2
space-y-2
"

>


<NavLink

to="/admin/add-product"

onClick={closeDrawer}

className="block px-4 py-2 rounded-lg hover:bg-white"

>

<FiPlusCircle className="inline mr-2"/>

Add Product

</NavLink>



<NavLink

to="/admin/add-order"

onClick={closeDrawer}

className="block px-4 py-2 rounded-lg hover:bg-white"

>

<FiPlusCircle className="inline mr-2"/>

Add Order

</NavLink>


</div>


}


</div>









{/* BANNERS */}


<div>


<button

onClick={()=>setBannerOpen(!bannerOpen)}

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


<span className="flex items-center gap-3">

<FiImage size={20}/>

Banners

</span>



{
bannerOpen

?

<FiChevronUp/>

:

<FiChevronDown/>

}


</button>





{
bannerOpen &&


<div

className="
ml-8
mt-2
space-y-2
"

>


<NavLink

to="/admin/banners"

onClick={closeDrawer}

className="block px-4 py-2 rounded-lg hover:bg-white"

>

Hero Banners

</NavLink>




<NavLink

to="/admin/shop-hero"

onClick={closeDrawer}

className="block px-4 py-2 rounded-lg hover:bg-white"

>

Shop Hero

</NavLink>



</div>


}



</div>









{/* SUBSCRIBERS */}


<NavLink

to="/admin/subscribers"

onClick={closeDrawer}

className={menuItem+" text-slate-700 hover:bg-[#FFF7E8]"}

>

<FiUsers size={20}/>

Subscribers

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


<span className="flex items-center gap-3">

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

to="/admin/settings"

onClick={closeDrawer}

className="block px-4 py-2 rounded-lg hover:bg-white"

>

<FiSettings className="inline mr-2"/>

Website Settings

</NavLink>



<NavLink

to="/admin/change-password"

onClick={closeDrawer}

className="block px-4 py-2 rounded-lg hover:bg-white"

>

<FiKey className="inline mr-2"/>

Change Password

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
bg-red-500
text-white
hover:bg-red-600
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
