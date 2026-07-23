import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


import {
  FiArrowLeft,
  FiCheckCircle,
  FiPackage,
  FiCalendar,
  FiTruck,
  FiCreditCard,
  FiHash,
  FiShoppingBag,
  FiHome,
  FiFileText,
} from "react-icons/fi";


import Button from "../../components/ui/Button";



export default function LandingOrderSuccessPreview(){


const navigate = useNavigate();



const [order,setOrder] = useState(null);



useEffect(()=>{


const data = sessionStorage.getItem(
"landingOrderSuccessPreviewData"
);



if(data){


const parsed =
JSON.parse(data);



setOrder(parsed);


}



},[]);





if(!order){


return (

<div
className="
min-h-screen
bg-[#FAF7F2]
flex
items-center
justify-center
"
>


<div
className="
bg-white
rounded-lg
shadow
p-8
text-center
"
>


<h2
className="
text-xl
font-bold
text-gray-800
"
>

Order Preview Data পাওয়া যায়নি

</h2>


</div>


</div>

);


}




const orderId =

"DM-" +

Date.now()
.toString()
.slice(-8);





const orderDate =

new Date()
.toLocaleString(

"en-GB",

{

day:"2-digit",

month:"short",

year:"numeric",

hour:"2-digit",

minute:"2-digit",

}

);





return (

<div

className="
min-h-screen
bg-[#FAF7F2]
p-0
"

>


<div

className="
w-full
space-y-4
"

>



{/* HEADER */}


<div

className="
bg-white
rounded-lg
border
border-purple-200
shadow-sm
p-5
"

>


<div
className="
flex
items-center
gap-3
"

>


<button

onClick={()=>navigate(-1)}

className="
w-10
h-10
rounded-full
border
flex
items-center
justify-center
bg-white
"

>

<FiArrowLeft size={20}/>

</button>



<div>

<h1

className="
text-2xl
font-black
text-gray-900
"

>

Order Success Preview

</h1>


<p

className="
text-sm
text-gray-500
"

>

Landing Page Order Confirmation

</p>


</div>



</div>



</div>




  {/* SUCCESS MESSAGE CARD */}


<div
className="
bg-green-50
rounded-lg
border
border-green-200
p-6
text-center
"
>


<div

className="
bg-green-50
p-6
text-center
"

>


<FiCheckCircle

size={60}

className="
mx-auto
text-green-600
"

/>



<h2

className="
text-2xl
font-black
text-gray-900
mt-4
"

>

অর্ডার সফল হয়েছে

</h2>



<p

className="
text-gray-600
mt-2
leading-7
"

>

{
order.successMessage
}

</p>



</div>


</div>





{/* PRODUCT CARD */}


<div

className="
bg-white
rounded-xl
border
border-purple-200
shadow-sm
overflow-hidden
"

>



<div

className="
p-5
"

>



<div

className="
flex
items-center
gap-2
mb-4
"

>


<FiShoppingBag

className="
text-purple-700
"

size={22}

/>



<h2

className="
text-lg
font-black
"

>

Product Details

</h2>



</div>






{

order.heroImages?.length > 0 && (


<img

src={
order.heroImages[0]
}

alt="product"

className="
w-full
h-64
object-cover
rounded-xl
border
"




/>


)

}





<div

className="
mt-5
"

>


<h1

className="
text-2xl
font-black
text-gray-900
"

>

{
order.title
}

</h1>




<div

className="
mt-4
flex
items-center
justify-between
"

>


<div>


<p

className="
text-sm
text-gray-500
"

>

Price

</p>



<p

className="
text-3xl
font-black
text-purple-700
"

>

৳{order.price}

</p>


</div>




<div

className="
text-right
"

>


<p

className="
text-sm
text-gray-500
"

>

Quantity

</p>



<p

className="
text-xl
font-black
"

>

{
order.quantity
}

</p>



</div>




</div>





{

order.regularPrice >

order.price && (


<p

className="
mt-3
text-gray-400
line-through
font-semibold
"

>

Regular Price: ৳{order.regularPrice}

</p>


)

}



</div>



</div>



</div>



  {/* ORDER INFORMATION */}


<div

className="
bg-white
rounded-xl
border
border-purple-200
shadow-sm
p-5
"

>


<div

className="
flex
items-center
gap-2
mb-5
"

>


<FiPackage

size={22}

className="
text-purple-700
"

/>


<h2

className="
text-lg
font-black
"

>

Order Information

</h2>



</div>






<div

className="
space-y-4
"

>



{/* ORDER ID */}


<div

className="
flex
items-center
gap-4
p-4
rounded-xl
bg-gray-50
border
"

>


<div

className="
w-10
h-10
rounded-lg
bg-purple-100
flex
items-center
justify-center
"

>

<FiHash

className="
text-purple-700
"

size={20}

/>

</div>



<div>

<p

className="
text-sm
text-gray-500
"

>

Order ID

</p>


<p

className="
font-bold
text-gray-900
"

>

{orderId}

</p>


</div>



</div>






{/* ORDER DATE */}


<div

className="
flex
items-center
gap-4
p-4
rounded-xl
bg-gray-50
border
"

>


<div

className="
w-10
h-10
rounded-lg
bg-blue-100
flex
items-center
justify-center
"

>

<FiCalendar

className="
text-blue-600
"

size={20}

/>

</div>



<div>

<p

className="
text-sm
text-gray-500
"

>

Order Date

</p>



<p

className="
font-bold
text-gray-900
"

>

{orderDate}

</p>


</div>



</div>







{/* PAYMENT METHOD */}


<div

className="
flex
items-center
gap-4
p-4
rounded-xl
bg-gray-50
border
"

>


<div

className="
w-10
h-10
rounded-lg
bg-green-100
flex
items-center
justify-center
"

>

<FiCreditCard

className="
text-green-600
"

size={20}

/>

</div>



<div>

<p

className="
text-sm
text-gray-500
"

>

Payment Method

</p>



<p

className="
font-bold
text-gray-900
"

>

Cash on Delivery

</p>


</div>



</div>








{/* DELIVERY TIME */}


<div

className="
flex
items-center
gap-4
p-4
rounded-xl
bg-gray-50
border
"

>


<div

className="
w-10
h-10
rounded-lg
bg-orange-100
flex
items-center
justify-center
"

>

<FiTruck

className="
text-orange-600
"

size={20}

/>

</div>



<div>

<p

className="
text-sm
text-gray-500
"

>

Delivery Time

</p>



<p

className="
font-bold
text-gray-900
"

>

2 - 4 কর্মদিবস

</p>


</div>



</div>




</div>



</div>



  {/* =========================
      ORDER SUCCESS FOOTER
========================= */}


<div
className="
bg-white
border-t
border-gray-200
px-5
py-6
text-center
"
>


<div
className="
w-16
h-16
mx-auto
rounded-full
bg-green-100
flex
items-center
justify-center
mb-4
"
>

<FiCheckCircle
size={36}
className="
text-green-600
"
/>

</div>



<h2
className="
text-xl
font-black
text-gray-900
"
>

ধন্যবাদ!

</h2>



<p
className="
mt-2
text-gray-500
leading-7
"
>

আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।

<br/>

আমাদের টিম খুব দ্রুত আপনার সাথে যোগাযোগ করবে।

</p>




{
order.successMessage && (

<p
className="
mt-4
bg-purple-50
border
border-purple-100
rounded-lg
px-4
py-3
text-purple-700
font-semibold
"
>

{order.successMessage}

</p>

)

}





{/* ORDER SUMMARY BUTTON */}

<button

type="button"

className="
mt-6
w-full
bg-purple-700
text-white
py-3
rounded-lg
font-bold
text-lg
flex
items-center
justify-center
gap-2
"

>

<FiFileText/>

অর্ডার সামারি দেখুন

</button>





{/* BACK HOME BUTTON */}


<button

type="button"

onClick={()=>{

navigate("/");

}}

className="
mt-3
w-full
border
border-purple-700
text-purple-700
py-3
rounded-lg
font-bold
text-lg
flex
items-center
justify-center
gap-2
hover:bg-purple-50
transition
"

>

<FiHome/>

হোমে ফিরে যান

</button>




</div>







</div>

</div>


);

}
