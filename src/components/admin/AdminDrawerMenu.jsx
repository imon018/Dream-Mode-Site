import {
  NavLink,
  useNavigate,
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
  FiChevronDown,
  FiChevronUp,
  FiLogOut,
  FiLock,
} from "react-icons/fi";


import {
  logout,
} from "../../services/authService";





export default function AdminDrawerMenu({
  closeDrawer,
}) {


  const navigate = useNavigate();



  const [
    openMenu,
    setOpenMenu
  ] = useState(null);





  const toggleMenu = (menu)=>{

    setOpenMenu(

      openMenu === menu
      ?
      null
      :
      menu

    );

  };






  const handleLogout = async()=>{

    await logout();

    closeDrawer();

    navigate("/login");

  };








  const menuClass = ({isActive}) => `

  flex
  items-center
  gap-3
  px-5
  py-3
  rounded-xl
  transition

  ${
    isActive
    ?
    "bg-[#071F57] text-white"
    :
    "text-slate-700 hover:bg-slate-100"
  }

  `;








return (

<div

className="
p-4
space-y-2
overflow-y-auto
flex-1
"

>





<NavLink

to="/admin"

end

onClick={closeDrawer}

className={menuClass}

>

<FiGrid/>

<span>
Dashboard
</span>

</NavLink>






<NavLink

to="/"

onClick={closeDrawer}

className={menuClass}

>

<FiHome/>

<span>
Home
</span>

</NavLink>







<NavLink

to="/admin/profile"

onClick={closeDrawer}

className={menuClass}

>

<FiUser/>

<span>
Admin Profile
</span>

</NavLink>







<NavLink

to="/admin/users"

onClick={closeDrawer}

className={menuClass}

>

<FiUsers/>

<span>
Users Panel
</span>

</NavLink>







<NavLink

to="/admin/products"

onClick={closeDrawer}

className={menuClass}

>

<FiBox/>

<span>
Products
</span>

</NavLink>







<NavLink

to="/admin/orders"

onClick={closeDrawer}

className={menuClass}

>

<FiShoppingCart/>

<span>
Orders
</span>

</NavLink>







<NavLink

to="/admin/send-notification"

onClick={closeDrawer}

className={menuClass}

>

<FiSend/>

<span>
Send Notification
</span>

</NavLink>









{/* UPLOADS */}


<div>


<button

onClick={()=>toggleMenu("uploads")}

className="
w-full
flex
items-center
justify-between
px-5
py-3
rounded-xl
text-slate-700
hover:bg-slate-100
"

>


<div

className="
flex
items-center
gap-3
"

>

<FiUpload/>

<span>
Uploads
</span>

</div>



{
openMenu==="uploads"
?
<FiChevronUp/>
:
<FiChevronDown/>
}



</button>





{
openMenu==="uploads" &&


<div

className="
ml-10
mt-2
space-y-2
"

>


<NavLink

to="/admin/add-product"

onClick={closeDrawer}

className={menuClass}

>

Add Product

</NavLink>



<NavLink

to="/admin/add-order"

onClick={closeDrawer}

className={menuClass}

>

Add Order

</NavLink>


</div>


}


</div>









{/* BANNERS */}


<div>


<button

onClick={()=>toggleMenu("banners")}

className="
w-full
flex
items-center
justify-between
px-5
py-3
rounded-xl
text-slate-700
hover:bg-slate-100
"

>


<div

className="
flex
items-center
gap-3
"

>

<FiImage/>

<span>
Banners
</span>

</div>



{
openMenu==="banners"
?
<FiChevronUp/>
:
<FiChevronDown/>
}


</button>





{
openMenu==="banners" &&


<div

className="
ml-10
mt-2
space-y-2
"

>


<NavLink

to="/admin/banners"

onClick={closeDrawer}

className={menuClass}

>

Hero Banners

</NavLink>



<NavLink

to="/admin/shop-hero"

onClick={closeDrawer}

className={menuClass}

>

Shop Hero

</NavLink>



</div>


}



</div>









<NavLink

to="/admin/subscribers"

onClick={closeDrawer}

className={menuClass}

>

<FiUsers/>

<span>
Subscribers
</span>

</NavLink>









{/* SETTINGS */}


<div>


<button

onClick={()=>toggleMenu("settings")}

className="
w-full
flex
items-center
justify-between
px-5
py-3
rounded-xl
text-slate-700
hover:bg-slate-100
"

>


<div

className="
flex
items-center
gap-3
"

>

<FiSettings/>

<span>
Settings
</span>

</div>


{
openMenu==="settings"
?
<FiChevronUp/>
:
<FiChevronDown/>
}



</button>





{
openMenu==="settings" &&


<div

className="
ml-10
mt-2
space-y-2
"

>


<NavLink

to="/admin/settings"

onClick={closeDrawer}

className={menuClass}

>

Website Settings

</NavLink>





<NavLink

to="/admin/change-password"

onClick={closeDrawer}

className={menuClass}

>

<FiLock/>

Change Password

</NavLink>



</div>


}


</div>









<button

onClick={handleLogout}

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
"

>

<FiLogOut/>

Logout

</button>






</div>

);


}
