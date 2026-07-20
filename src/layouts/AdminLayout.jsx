import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import MobileBottomNav from "../components/MobileBottomNav";


export default function AdminLayout(){

return(

<div
className="
min-h-screen
bg-[#F8F5EF]
"
>


<Header />


<main
className="
p-4
pb-24
md:pb-4
lg:p-8
"
>

<Outlet />

</main>


<MobileBottomNav />


</div>

);

}
