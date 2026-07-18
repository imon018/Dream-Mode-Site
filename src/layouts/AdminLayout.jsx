import Header from "../components/Header";
import { Outlet } from "react-router-dom";


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
lg:p-8
"
>

<Outlet />


</main>


</div>

);

}
