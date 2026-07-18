import {
  useState,
} from "react";

import {
  Outlet,
} from "react-router-dom";


import AdminDrawer from "../components/admin/AdminDrawer";



export default function AdminLayout(){


const [
  drawerOpen,
  setDrawerOpen
] = useState(false);



return (

<div

className="
min-h-screen
bg-[#F8F5EF]
"

>


{/* MOBILE DRAWER */}

<AdminDrawer

open={drawerOpen}

setOpen={setDrawerOpen}

/>





<main

className="
p-4
lg:p-8
"

>



<Outlet />


</main>


</div>

  
);


}
