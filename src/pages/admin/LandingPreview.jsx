import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiEdit3,
  FiMonitor,
  FiSmartphone,
} from "react-icons/fi";

import Button from "../../components/ui/Button";


export default function LandingPreview(){

const navigate = useNavigate();


const [landing,setLanding] = useState(null);

const [view,setView] = useState("mobile");

const [quantity,setQuantity] = useState(1);



useEffect(()=>{

const data =

sessionStorage.getItem(
"landingPreviewData"
);


if(data){

setLanding(
JSON.parse(data)
);

}


},[]);



if(!landing){

return (

<div
className="
min-h-screen
flex
items-center
justify-center
bg-gray-100
"
>

<div
className="
bg-white
rounded-xl
p-8
shadow
"
>

<h2
className="
text-xl
font-bold
"
>

Preview Data পাওয়া যায়নি

</h2>

</div>

</div>

);

}




const discount =

landing.offerPrice > 0 && landing.price > 0

?

Math.round(

(

(landing.price - landing.offerPrice)

/

landing.price

)

*100

)

:

0;





return (

<div
className="
min-h-screen
bg-[#FAF7F2]
p-4
lg:p-8
"
>


<div
className="
max-w-7xl
mx-auto
space-y-6
"
>




{/* HEADER */}

<div
className="
bg-white
rounded-xl
border
border-amber-200
p-5
shadow-sm
"
>


<div
className="
flex
flex-col
lg:flex-row
justify-between
gap-5
"
>



<div>

<h1
className="
text-3xl
font-black
"
>

Preview Landing Page

</h1>


<div
className="
flex
items-center
gap-2
mt-4
font-bold
text-lg
"
>

<FiArrowLeft/>

Preview - {landing.title}


</div>


</div>






<div
className="
flex
gap-3
"
>


<Button

type="button"

className="
bg-slate-900
text-white
rounded-xl
flex
items-center
gap-2
"
>

<FiEdit3/>

Edit

</Button>




<Button

type="button"

className="
bg-amber-500
text-white
rounded-xl
"
>

Publish

</Button>


</div>


</div>






{/* VIEW BUTTON */}

<div
className="
mt-6
flex
justify-center
"
>


<div
className="
bg-gray-100
rounded-xl
p-1
flex
"
>



<button

onClick={()=>setView("mobile")}

className={`
px-5
py-3
rounded-lg
flex
items-center
gap-2
font-semibold

${
view==="mobile"

?

"bg-white shadow text-amber-600"

:

"text-gray-500"

}

`}

>


<FiSmartphone/>

Mobile View


</button>





<button

onClick={()=>setView("desktop")}

className={`
px-5
py-3
rounded-lg
flex
items-center
gap-2
font-semibold

${
view==="desktop"

?

"bg-white shadow text-amber-600"

:

"text-gray-500"

}

`}

>


<FiMonitor/>

Desktop View


</button>


</div>


</div>


</div>






{/* PREVIEW DEVICE */}

<div
className={`
mx-auto
bg-white
shadow-xl
overflow-hidden

${
view==="mobile"

?

"max-w-sm rounded-[35px] border-[8px] border-black"

:

"w-full rounded-xl border"

}

`}
>


<div
className="
p-5
"
>





{/* HERO IMAGE */}

<div
className="
relative
"
>

<img

src={
landing.heroImages?.[0]
}

alt="product"

className="
w-full
rounded-2xl
object-cover
"
/>


{
discount > 0 && (

<div
className="
absolute
top-3
right-3
bg-red-500
text-white
px-4
py-2
rounded-full
font-bold
"
>

{discount}% OFF

</div>

)

}


</div>





{/* HERO TITLE */}

<h2
className="
text-2xl
font-black
mt-6
"
>

{landing.heroTitle}

</h2>





{/* PRODUCT NAME */}

<h3
className="
text-xl
font-bold
text-amber-600
mt-3
"
>

{landing.title}

</h3>





{/* HERO DESCRIPTION */}

<p
className="
mt-4
text-gray-600
leading-7
"
>

{landing.heroDescription}

</p>


// =========================
// PRICE SECTION
// =========================


<div
className="
mt-6
flex
items-center
gap-4
"
>


{

landing.offerPrice > 0

?

<>

<span
className="
text-3xl
font-black
text-red-500
"
>

৳{landing.offerPrice}

</span>


<span
className="
text-lg
text-gray-400
line-through
"
>

৳{landing.price}

</span>


</>


:

(

<span
className="
text-3xl
font-black
text-red-500
"
>

৳{landing.price}

</span>

)

}


</div>






{/* QUANTITY */}


<div
className="
mt-6
border
rounded-xl
p-4
flex
items-center
justify-between
"
>


<span
className="
font-bold
"
>

পরিমাণ

</span>


<div
className="
flex
items-center
gap-4
"
>


<button

onClick={()=>{

if(quantity>1)

setQuantity(quantity-1)

}}

className="
w-9
h-9
rounded-lg
bg-gray-200
font-bold
"

>

-

</button>



<span
className="
font-bold
"
>

{quantity}

</span>




<button

onClick={()=>setQuantity(quantity+1)}

className="
w-9
h-9
rounded-lg
bg-amber-500
text-white
font-bold
"

>

+

</button>



</div>


</div>









{/* ORDER FORM */}


<div
className="
mt-8
bg-gray-50
rounded-2xl
p-5
"
>


<h3
className="
text-xl
font-black
mb-5
"
>

অর্ডার করুন

</h3>




<input

placeholder="আপনার নাম"

className="
w-full
border
rounded-lg
p-3
mb-3
"

/>




<input

placeholder="মোবাইল নাম্বার"

className="
w-full
border
rounded-lg
p-3
mb-3
"

/>




<input

placeholder="ঠিকানা"

className="
w-full
border
rounded-lg
p-3
mb-3
"

/>




<input

placeholder="থানা"

className="
w-full
border
rounded-lg
p-3
mb-3
"

/>




<input

placeholder="জেলা"

className="
w-full
border
rounded-lg
p-3
mb-3
"

/>





<textarea

placeholder="অতিরিক্ত নোট"

rows="3"

className="
w-full
border
rounded-lg
p-3
"

></textarea>





<button

className="
mt-5
w-full
bg-amber-500
text-white
py-4
rounded-xl
font-black
text-lg
"
>

অর্ডার করুন এখনই

</button>



</div>







{/* PRODUCT DESCRIPTION */}


<div
className="
mt-8
"
>


<h2
className="
text-2xl
font-black
mb-3
"
>

পণ্যের বিবরণ

</h2>


<p
className="
text-gray-600
leading-8
whitespace-pre-line
"
>

{landing.description}

</p>


</div>







{/* OUR PROMISE */}


<div
className="
mt-8
bg-amber-50
rounded-2xl
p-5
"
>


<h2
className="
text-2xl
font-black
mb-4
"
>

আমাদের প্রতিশ্রুতি

</h2>



<ul
className="
space-y-3
text-gray-700
"
>


<li>

✓ উচ্চমানের পণ্য নিশ্চিত করা

</li>


<li>

✓ দ্রুত ডেলিভারি সুবিধা

</li>


<li>

✓ নিরাপদ ও সহজ অর্ডার ব্যবস্থা

</li>


<li>

✓ গ্রাহকের সন্তুষ্টি আমাদের লক্ষ্য

</li>


</ul>



</div>







</div>


</div>


</div>


</div>


);


}
