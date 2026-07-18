import {
  Outlet
} from "react-router-dom";


import Header from "../components/layout/Header";



export default function PanelLayout(){


return (

<div
className="
min-h-screen
bg-[#FAF7F2]
"
>


{/* ONLY HEADER */}
<Header />



{/* 
Fixed header এর জন্য
content নিচে নামানো
*/}
<main
className="
pt-[90px]
"
>

<Outlet />

</main>



</div>

);


}
