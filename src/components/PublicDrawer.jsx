import {
  Link,
} from "react-router-dom";


import {
  FiX,
} from "react-icons/fi";


import useAuth from "../hooks/useAuth";

import useCart from "../hooks/useCart";

import {
  useSettings
} from "../context/SettingsContext";





export default function PublicDrawer({

  open,

  setOpen,

}) {


const {
  user
}=useAuth();


const {
  cartCount
}=useCart();


const {
  settings
}=useSettings();






const closeDrawer=()=>{

  setOpen(false);

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






{/* HEADER */}


<div

className="
bg-[#071F57]
text-white
p-6
"

>


<div

className="
flex
items-center
justify-between
"

>


<div

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
object-contain
"

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
text-xs
text-white/70
"

>

Premium Fashion

</p>


</div>


</div>





<button

onClick={closeDrawer}

>

<FiX size={28}/>

</button>



</div>


</div>










{/* MENU */}


<div
className="
flex-1
py-4
pb-32
overflow-y-auto
"
>





<Link

to="/"

onClick={closeDrawer}

className="
block
px-6
py-4
text-lg
hover:bg-slate-50
"

>

Home

</Link>







<Link

to="/shop"

onClick={closeDrawer}

className="
block
px-6
py-4
text-lg
hover:bg-slate-50
"

>

Shop

</Link>







<Link

to="/cart"

onClick={closeDrawer}

className="
flex
items-center
justify-between
px-6
py-4
text-lg
hover:bg-slate-50
"

>


<span>
Cart
</span>



<span

className="
bg-[#071F57]
text-white
text-xs
min-w-[22px]
h-[22px]
rounded-full
flex
items-center
justify-center
"

>

{cartCount}

</span>


</Link>






<div

className="
border-t
my-4
"

></div>








{
!user

?

<>


<Link

to="/login"

onClick={closeDrawer}

className="
block
px-6
py-4
text-lg
hover:bg-slate-50
"

>

Login

</Link>





<div

className="
px-6
mt-4
"

>


<Link

to="/register"

onClick={closeDrawer}

className="
w-full
flex
justify-center
rounded-xl
bg-[#071F57]
text-white
py-3
font-semibold
"

>

Join Now

</Link>


</div>


</>


:


<>


<Link

to="/profile"

onClick={closeDrawer}

className="
block
px-6
py-4
text-lg
hover:bg-slate-50
"

>

My Profile

</Link>



{
user.role==="admin" &&


<Link

to="/admin"

onClick={closeDrawer}

className="
block
px-6
py-4
text-lg
hover:bg-slate-50
"

>

Dashboard

</Link>

}



</>


}






</div>









{/* FOOTER CARD */}


<div
className="
border-t
p-6
pb-32
shrink-0
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

alt="logo"

className="
w-14
h-14
mx-auto
mb-3
object-contain
"

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

onClick={closeDrawer}

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






</div>



</>

);


}
