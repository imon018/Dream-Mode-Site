import {
  useNavigate,
} from "react-router-dom";


import useAuth from "../../hooks/useAuth";


import UserDrawerHeader from "./UserDrawerHeader";

import UserDrawerMenu from "./UserDrawerMenu";




export default function UserDrawer({

  open,

  setOpen,

}){


const navigate = useNavigate();


const {
 logout
}=useAuth();




const closeDrawer = ()=>{

 setOpen(false);

};




const handleLogout = async()=>{


 await logout();


 navigate("/login");


 closeDrawer();


};





return (

<>


{/* OVERLAY */}

{
open &&

<div

className="
fixed
inset-0
bg-black/40
backdrop-blur-sm
z-[60]
lg:hidden
"

onClick={closeDrawer}

></div>

}






{/* DRAWER */}


<div

className={`
fixed
top-0
left-0

h-screen

w-[320px]

bg-white

z-[70]

shadow-2xl

transition-transform
duration-300

flex
flex-col


${
open

?

"translate-x-0"

:

"-translate-x-full"

}

`}

>


<UserDrawerHeader

closeDrawer={closeDrawer}

onNotificationClick={()=>{

navigate("/profile/notifications");

}}

/>



<UserDrawerMenu

closeDrawer={closeDrawer}

onLogout={handleLogout}

/>



</div>


</>


);


}
