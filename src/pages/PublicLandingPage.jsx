import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  FiHome,
  FiFileText,
  FiMap,
  FiMapPin,
  FiUser,
  FiPhone,
  FiX,
  FiGift,
} from "react-icons/fi";




import {
  getLandingPageBySlug,
  incrementLandingOrders,
} from "../services/landingPageService";

import { createOrder } from "../services/orderService";


export default function PublicLandingPage(){


const { slug } = useParams();

const [landing,setLanding] = useState(null);

const [loading,setLoading] = useState(true);


const [quantity,setQuantity] = useState(1);


const [activeImage,setActiveImage] = useState(null);


const [fullscreen,setFullscreen] = useState(false);


const [formData, setFormData] = useState({
  name: "",
  phone: "",
  address: "",
  thana: "",
  district: "",
  notes: "",
});

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

  async function loadLanding() {
    setLoading(true);

    try {

      const data =
        await getLandingPageBySlug(slug);

      if (!data) {

        setLanding(null);

        return;

      }

      setLanding(data);

      const imgs =
        data.heroImages?.length
          ? data.heroImages
          : data.heroImage
          ? [data.heroImage]
          : [];

      if (imgs.length) {

        setActiveImage(imgs[0]);

      }

    }

    catch (error) {

  console.log(error);

}

finally {

  setLoading(false);

}

}

loadLanding();

}, [slug]);

  

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



if (loading) {

  return (

    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[#FAF7F2]
      "
    >

      <div
        className="
        text-xl
        font-bold
        text-purple-700
        "
      >
        Loading...
      </div>

    </div>

  );

}


  
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

Landing Page পাওয়া যায়নি

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




const handleChange = (e) => {

  const { name, value } = e.target;

  setFormData((prev) => ({

    ...prev,

    [name]: value,

  }));

};
  


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

















{/* PREVIEW AREA */}



<div
className="
mt-0
bg-[#FAF7F2]
w-full
"
>



<div
className="
pt-0
"
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
landing.price > 0 && landing.offerPrice > 0 && landing.offerPrice < landing.price

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
discount > 0 && (

<span
className="
px-4
py-2
rounded-lg
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

)

}

</>


:

landing.price > 0

?

<span
className="
text-4xl
font-black
text-purple-700
"
>
৳{landing.price}
</span>


:

null

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





{
landing.orderForm?.collectName && (

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

name="name"

value={formData.name}

onChange={handleChange}

placeholder="আপনার নাম"
  
className="
w-full
pl-10
pr-4
py-3
border
rounded-lg
focus:border-purple-700
focus:ring-2
focus:ring-purple-700/30
focus:outline-none
"
/>

</div>

)
}




{
landing.orderForm?.collectPhone && (

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

name="phone"

value={formData.phone}

onChange={handleChange}

placeholder="ফোন নাম্বার"
  
className="
w-full
pl-10
pr-4
py-3
border
rounded-lg
focus:border-purple-700
focus:ring-2
focus:ring-purple-700/30
focus:outline-none
"
/>

</div>

)
}




{
landing.orderForm?.collectAddress && (

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

name="address"

value={formData.address}

onChange={handleChange}

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
focus:border-purple-700
focus:ring-2
focus:ring-purple-700/30
focus:outline-none
"
/>

</div>

)
}






{
landing.orderForm?.collectCity && (

<>
  
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

name="thana"

value={formData.thana}

onChange={handleChange}

placeholder="থানা"
  
className="
w-full
pl-10
pr-4
py-3
border
rounded-lg
focus:border-purple-700
focus:ring-2
focus:ring-purple-700/30
focus:outline-none
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

name="district"

value={formData.district}

onChange={handleChange}

placeholder="জেলা"
  
className="
w-full
pl-10
pr-4
py-3
border
rounded-lg
focus:border-purple-700
focus:ring-2
focus:ring-purple-700/30
focus:outline-none
"
/>

</div>

</>

)
}

  



{
landing.orderForm?.collectNotes && (
  
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

name="notes"

value={formData.notes}

onChange={handleChange}

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
focus:border-purple-700
focus:ring-2
focus:ring-purple-700/30
focus:outline-none
"
/>

</div>

)
}






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

onClick={async()=>{


const orderData = {

title:
landing.title,


heroImages:
images,


price:
landing.offerPrice > 0
?
landing.offerPrice
:
landing.price,


regularPrice:
landing.price,


quantity,

slug,

customer: formData,

landingId: landing.id,

deliveryCharge: landing.deliveryCharge || 0,

deliveryZone: landing.deliveryZone || "",

total:
(
(
landing.offerPrice > 0
?
landing.offerPrice
:
landing.price
)
*
quantity
)
+
(
landing.deliveryCharge || 0
),

  };
  



  const orderId = await createOrder({
  landingId: landing.id,
  landingSlug: slug,

  customerName: formData.name,
  phone: formData.phone,
  address: formData.address,
  thana: formData.thana,
  district: formData.district,
  notes: formData.notes,

  productName: landing.title,
  title: landing.title,
  heroImages: images,
  items: [
  {
    productId: landing.productId || "",
    id: landing.productId || "",
    name: landing.title,
    image: images[0] || "",
    quantity,
    price: orderData.price,
  },
],
  slug: slug,
  quantity,

  price: orderData.price,
  regularPrice: orderData.regularPrice,

  deliveryCharge: orderData.deliveryCharge,
  total: orderData.total,

  status: "Pending",
  paymentStatus: "Pending",

  createdAt: new Date().toISOString(),
});

await incrementLandingOrders(
  landing.id,
  orderData.total
);

orderData.orderId = orderId;



window.location.href = `/landing/${slug}/success/${orderId}`;


}}

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

</div>



);

}
