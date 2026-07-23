import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiEdit3,
  FiMonitor,
  FiHome,
  FiFileText,
  FiSmartphone,
  FiMap,
  FiMapPin,
  FiUser,
  FiPhone,
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




useEffect(() => {

  const data = sessionStorage.getItem("landingPreviewData");

  if (data) {

    const parsed = JSON.parse(data);

    setLanding(parsed);

    const imgs =
      parsed.heroImages?.length
        ? parsed.heroImages
        : parsed.heroImage
        ? [parsed.heroImage]
        : [];

    if (imgs.length) {
      setActiveImage(imgs[0]);
    }

  }

}, []);




// Moved above the early return, and memoized so it doesn't
// produce a brand-new array reference on every render.
const images = useMemo(() => {

  if (!landing) return [];

  return landing.heroImages?.length
    ? landing.heroImages
    : landing.heroImage
    ? [landing.heroImage]
    : [];

}, [landing]);




  useEffect(() => {
  if (images.length <= 1) return;

  const interval = setInterval(() => {
    setActiveImage((prev) => {
      const currentIndex = images.indexOf(prev || images[0]);
      const nextIndex = (currentIndex + 1) % images.length;
      return images[nextIndex];
    });
  }, 3000);

  return () => clearInterval(interval);
}, [images]);




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

Preview Data পাওয়া যায়নি

</h2>


</div>


</div>

);


}






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
p-4
"
>



<h1
className="
text-3xl
font-black
text-gray-900
whitespace-nowrap
"
>
Preview Landing Page
</h1>




<div
className="
flex
items-center
gap-3
mt-4
text-xl
font-bold
"
>


<button

onClick={()=>navigate(-1)}

className="
w-9
h-9
rounded-full
bg-white
border
border-gray-200
shadow-sm
flex
items-center
justify-center
shrink-0
"

>

<FiArrowLeft size={22}/>

</button>


<span>
Preview - {landing.title}
</span>


</div>





<div
className="
flex
justify-center
gap-3
mt-4
"
>



<Button

type="button"

onClick={()=>navigate(-1)}

className="
bg-purple-700
text-white
rounded-lg
px-4
py-2
h-8
flex
items-center
gap-2
text-sm
"
>

<FiEdit3/>

Edit

</Button>




<Button

type="button"

className="
bg-purple-700
text-white
rounded-lg
px-4
py-2
h-8
text-sm
"
>

Publish

</Button>



</div>








{/* VIEW SWITCH */}



<div
className="
mt-4
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
px-3
py-1
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


<FiSmartphone size={18}/>

Mobile View


</button>







<button

onClick={()=>setView("desktop")}

className={`
px-3
py-1
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


<FiMonitor size={18}/>

Desktop View


</button>





</div>


</div>





</div>









{/* PREVIEW AREA */}



<div
className={`
mt-0
overflow-x-auto
overflow-y-hidden
bg-[#FAF7F2]
transition-all
duration-300
mx-auto


${
view === "mobile"

?

"w-full"

:

"w-[1280px] max-w-none mx-auto"

}
`}
>



<div
className={`
pt-0
transition-all
duration-300

${
view === "desktop"

?

"rounded-lg shadow-lg w-[1280px]"

:

""

}

`}
>






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
h-auto
object-contain
cursor-pointer
"

/>



{
discount > 0 && (

<div
className="
absolute
top-3
right-3
z-20
w-12
text-center
"
>

<div
className="
relative
overflow-visible
rounded-t-md
bg-transparent
border
border-amber-300
shadow-none
"
>

<div className="py-2">
<div className="text-lg font-black leading-none text-purple-700">
{discount}%
</div>

<div className="text-[11px] font-bold mt-1 text-purple-700">
OFF
</div>
</div>

{/* Bottom Ribbon */}

  
<div className="relative h-3">

<div
className="
absolute
left-0
right-0
top-0
h-[2px]
bg-amber-300
"
/>

<div
className="
absolute
left-1/2
top-[-1px]
-translate-x-1/2
w-0
h-0
border-l-[24px]
border-r-[24px]
border-t-[14px]
border-l-transparent
border-r-transparent
border-t-amber-300
"
/>

</div>

</div>

</div>

)
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
pb-0
[-ms-overflow-style:none]
[scrollbar-width:none]
[&::-webkit-scrollbar]:hidden
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
text-sm
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
items-center
gap-3
mb-3
"
>

<div
className="
w-4
h-4
rounded-full
bg-purple-700
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
text-base
text-gray-400
font-medium
line-through
"
>
৳{landing.price}
</span>



{

discount > 0 &&

<span
className="
px-4
py-2
rounded-xl
font-bold
text-red-600
bg-white/40
backdrop-blur-md
border
border-white/60
shadow-lg
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
mb-0
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


<div
className="
border-t
border-gray-200
"
></div>



{/* ORDER FORM */}



<div
className="
bg-gray-50
pt-5
px-5
pb-5
"
>



<h2
className="
text-2xl
font-black
text-center
mb-5
"
>
অর্ডার ফর্ম
</h2>





<div className="relative mb-3">

<FiUser
className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"
/>

<input
placeholder="আপনার নাম"
className="
w-full
pl-10
pr-4
py-3
border
rounded-lg
"
/>

</div>




<div className="relative mb-3">

<FiPhone
className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"
/>

<input
placeholder="ফোন নাম্বার"
className="
w-full
pl-10
pr-4
py-3
border
rounded-lg
"
/>

</div>




<div className="relative mb-3">

<FiHome
className="
absolute
left-3
top-4
text-gray-400
"
/>

<textarea
placeholder="আপনার ঠিকানা"
rows="3"
className="
w-full
pl-10
pr-4
py-3
border
rounded-lg
resize-none
"
/>

</div>




<div className="relative mb-3">

<FiMap
className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"
/>

<input
placeholder="থানা"
className="
w-full
pl-10
pr-4
py-3
border
rounded-lg
"
/>

</div>


  

<div className="relative mb-3">

<FiMapPin
className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"
/>

<input
placeholder="জেলা"
className="
w-full
pl-10
pr-4
py-3
border
rounded-lg
"
/>

</div>






<div className="relative mt-3">

<FiFileText
className="
absolute
left-3
top-4
text-gray-400
"
/>

<textarea
placeholder="অতিরিক্ত নোট (যদি থাকে)"
rows="3"
className="
w-full
pl-10
pr-4
py-3
border
rounded-lg
resize-none
"
/>

</div>






</div>










{/* PRODUCT DESCRIPTION */}



<div
className="
border-t
border-gray-200
"
></div>

<div
className="
bg-gray-50
px-5
py-5
"
>



<h2
className="
text-2xl
font-black
text-center
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
bg-white
border
border-gray-200
rounded-lg
p-5
"
>

{formattedText(
landing.description
)}

</div>



  
<div
className="
border-t
border-gray-200
"
/></div>






{/* OUR PROMISE */}

<div
className="
bg-purple-200
backdrop-blur-xl
border-t
border-purple-200
rounded-lg
px-3
py-1
shadow-none
"
>


<div
className="
flex
items-start
gap-4
"
>




<div className="flex gap-3">

<div
className="
w-8
h-8
rounded-lg
bg-purple-100
flex
items-center
justify-center
shrink-0
text-sm
"
>
🛡️
</div>

<div className="flex-1">

<h2
className="
text-base
font-black
text-purple-700
whitespace-nowrap
"
>
আমাদের প্রতিশ্রুতি
</h2>

<p
className="
mt-1
text-sm
text-gray-600
leading-5
"
>
আমরা অরিজিনাল এবং দ্রুত ডেলিভারি নিশ্চিত করি।<br/>
আপনার সন্তুষ্টিই আমাদের প্রধান লক্ষ্য
</p>

</div>

</div>


</div>

</div>





{/* ORDER BUTTON FULL WIDTH */}


<button

className="
mt-2
w-full
bg-purple-700
text-white
py-2.5
rounded-lg
font-bold
text-lg
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
