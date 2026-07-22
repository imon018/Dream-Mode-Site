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
  FiX,
  FiGift,
} from "react-icons/fi";

import Button from "../../components/ui/Button";



export default function LandingPreview(){


const navigate = useNavigate();



const [landing,setLanding] = useState(null);


const [view,setView] = useState("mobile");


const [quantity,setQuantity] = useState(1);


const [activeImage,setActiveImage] = useState(null);


const [fullscreen,setFullscreen] = useState(false);





useEffect(()=>{


const data = sessionStorage.getItem(
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
rounded-lg
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







const images =

landing.heroImages?.length

?

landing.heroImages

:

landing.heroImage

?

[landing.heroImage]

:

[];







const discount =

landing.offerPrice > 0 &&
landing.price > 0

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







const formattedText = (text)=>{


if(!text)

return "";



return text
.replace(/\\n/g,"\n");


};








return (


<div
className="
min-h-screen
bg-[#FAF7F2]
"
>



<div className="w-full max-w-none">






{/* PREVIEW HEADER */}


<div
className="
bg-white
rounded-lg
border
border-amber-200
shadow-sm
p-6
"
>



<h1
className="
text-4xl
font-black
text-gray-900
"
>

Preview Landing Page

</h1>





<div
className="
flex
items-center
gap-3
mt-5
text-xl
font-bold
"
>


<FiArrowLeft/>

Preview - {landing.title}


</div>





<div
className="
flex
gap-3
mt-6
"
>



<Button

type="button"

onClick={()=>navigate(-1)}

className="
bg-slate-900
text-white
rounded-lg
px-6
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
bg-black
text-white
rounded-lg
px-6
"
>

Publish

</Button>



</div>








{/* VIEW SWITCH */}



<div
className="
mt-8
flex
justify-center
"
>


<div
className="
bg-gray-100
rounded-lg
p-1
flex
"
>



<button

onClick={()=>setView("mobile")}

className={`
px-6
py-3
rounded-lg
flex
gap-2
items-center
font-bold

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
px-6
py-3
rounded-lg
flex
gap-2
items-center
font-bold

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









{/* PREVIEW AREA */}



<div
className="
mt-0
w-full
overflow-hidden
bg-[#FAF7F2]
"
>




<div className="pt-0">






<div
className="
bg-purple-700
text-white
h-10
px-3
flex
items-center
justify-center
gap-2
text-xs
font-semibold
whitespace-nowrap
"
>

<FiGift className="text-base shrink-0"/>

<span>
আজই অর্ডার করুন, ফ্রি ডেলিভারি!
</span>

</div>

  

{/* IMAGE GALLERY */}



<div
className="
relative
"
>



{
images.length > 0 && (


<>


<img

src={

activeImage || images[0]

}

alt="product"

onClick={()=>setFullscreen(true)}

className="
w-full
h-[420px]
object-cover
cursor-pointer
"

/>



{

discount > 0 &&

<div
className="
absolute
top-0
left-0
w-16
bg-indigo-600
text-white
text-center
font-bold
z-20
"
>

<div className="py-3">
<div className="text-2xl">
{discount}%
</div>

<div className="text-base">
OFF
</div>
</div>

<div
className="
w-0
h-0
border-l-[32px]
border-r-[32px]
border-t-[18px]
border-l-transparent
border-r-transparent
border-t-indigo-700
"
/>

</div>

  

}



</>


)

}





</div>



 {/* PRODUCT INFO CARD */}

<div
className="
mt-6
bg-gray-50
rounded-lg
p-5
"
>



{/* THUMBNAILS */}


{

images.length > 1 && (


<div
className="
flex
gap-3
mt-4
overflow-x-auto
pb-2
"
>


{

images.map((img,index)=>(


<img

key={index}

src={img}

alt="thumb"

onClick={()=>setActiveImage(img)}

className={`
w-20
h-20
object-cover
rounded-md
cursor-pointer
border-2

${
(activeImage || images[0])===img

?

"border-amber-500"

:

"border-transparent"

}

`}

/>



))


}



</div>


)

}





 

  {/*  HERO TITLE */}


<h2
className="
text-xl
font-bold
mt-2
text-purple-700
"
>

{formattedText(landing.heroTitle)}

</h2>





{/* PRODUCT NAME */}

<h1
className="
text-3xl
font-black
mt-3
text-gray-900
"
>

{landing.title}

</h1>








{/* HERO DESCRIPTION */}


<div
className="
mt-5
text-gray-600
leading-8
whitespace-pre-line
"
>

{
formattedText(landing.heroDescription)
.split("\n")
.map((line,index)=>(
<div
key={index}
className="
flex
items-start
gap-3
mb-3
"
>

<div
className="
w-5
h-5
rounded-full
bg-purple-600
text-white
flex
items-center
justify-center
text-xs
font-bold
shrink-0
"
>
✓
</div>


<span>
{line}
</span>


</div>
))
}

</div>








{/* PRICE SECTION */}


<div
className="
mt-8
flex
items-center
gap-4
flex-wrap
"
>



{

landing.offerPrice > 0

?

<>


<span
className="
text-2xl
font-black
text-purple-700
"
>

৳{landing.offerPrice}

</span>




<span
className="
text-xl
text-gray-400
font-bold
line-through
"
>

৳{landing.price}

</span>



{

discount > 0 &&

<span
className="
bg-red-100
text-red-600
px-3
py-1
rounded-lg
font-bold
"
>

{discount}% OFF

</span>


}



</>


:


<span
className="
text-4xl
font-black
text-red-500
"
>

৳{landing.price}

</span>



}




</div>









{/* QUANTITY */}



<div
className="
mt-5
border
border-gray-200
rounded-lg
px-4
py-2
flex
justify-between
items-center
"
>


<span
className="
font-black
text-lg
"
>

Quantity

</span>




<div
className="
flex
items-center
gap-5
"
>


<button

onClick={()=>{

if(quantity>1)

setQuantity(quantity-1)

}}

className="
w-6
h-6
rounded-lg
bg-gray-200
font-bold
"
>

-

</button>




<span
className="
font-black
text-xl
"
>

{quantity}

</span>




<button

onClick={()=>setQuantity(quantity+1)}

className="
w-6
h-6
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



</div>


</div>


{/* ORDER FORM */}



<div
className="
mt-10
bg-gray-50
rounded-lg
p-5
"
>



<h2
className="
text-2xl
font-black
mb-5
"
>

অর্ডার করুন

</h2>





<input
placeholder="আপনার নাম"

className="
w-full
border
rounded-lg
p-4
mb-3
"
/>




<input

placeholder="মোবাইল নাম্বার"

className="
w-full
border
rounded-lg
p-4
mb-3
"

/>




<textarea

placeholder="আপনার ঠিকানা"

rows="3"

className="
w-full
border
rounded-lg
p-4
mb-3
"

></textarea>





<select

className="
w-full
border
rounded-lg
p-4
mb-3
"

>

<option>

বিভাগ নির্বাচন করুন

</option>


</select>





<select

className="
w-full
border
rounded-lg
p-4
"

>

<option>

জেলা নির্বাচন করুন

</option>


</select>







<textarea

placeholder="অতিরিক্ত নোট (যদি থাকে)"

rows="3"

className="
mt-3
w-full
border
rounded-lg
p-4
"

></textarea>






</div>










{/* PRODUCT DESCRIPTION */}



<div
className="
mt-10
"
>



<h2
className="
text-3xl
font-black
mb-5
"
>

প্রোডাক্ট ডিটেইলস

</h2>





<div
className="
text-gray-700
leading-8
whitespace-pre-line
"
>

{formattedText(
landing.description
)}

</div>



</div>






{/* OUR PROMISE */}

<div
className="
mt-10
bg-gradient-to-br
from-purple-50
to-white
border
border-purple-100
rounded-lg
p-6
"
>


<div
className="
flex
items-start
gap-4
"
>


<div
className="
w-12
h-12
rounded-lg
bg-purple-100
flex
items-center
justify-center
text-purple-600
text-2xl
font-black
shrink-0
"
>

🛡️

</div>



<div>


<h2
className="
text-xl
font-black
text-purple-700
"
>

আমাদের প্রতিশ্রুতি

</h2>



<p
className="
mt-3
text-gray-600
leading-7
"
>

আমরা অরিজিনাল এবং দ্রুত ডেলিভারি নিশ্চিত করি। আপনার সন্তুষ্টিই আমাদের প্রধান লক্ষ্য

</p>


</div>



</div>


</div>







{/* ORDER BUTTON FULL WIDTH */}


<button

className="
mt-8
w-full
bg-amber-500
text-white
py-5
rounded-lg
font-black
text-xl
"
>

অর্ডার করুন এখনই

</button>




</div>



  
  {/*  MOBILE IMAGE FULLSCREEN */}


{
fullscreen && (

<div
className="
fixed
inset-0
bg-black/90
z-50
flex
items-center
justify-center
p-5
"
>


<button

onClick={()=>setFullscreen(false)}

className="
absolute
top-5
right-5
bg-white
text-black
rounded-full
w-12
h-12
flex
items-center
justify-center
text-xl
"
>

<FiX/>

</button>




<img

src={
activeImage || images[0]
}

alt="fullscreen"

className="
max-h-full
max-w-full
rounded-lg
object-contain
"

/>



</div>

)

}









{/* CLOSE PREVIEW CONTAINER */}


</div>

</div>




);

}
