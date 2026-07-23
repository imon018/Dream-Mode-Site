// src/pages/PublicLandingPage.jsx

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";


import {
  FiUser,
  FiPhone,
  FiHome,
  FiMapPin,
  FiFileText,
  FiTruck,
  FiShoppingBag,
} from "react-icons/fi";


import {
  getLandingPageBySlug,
} from "../services/landingPageService";


import {
  createOrder,
} from "../services/orderService";


import {
  errorToast,
  successToast,
} from "../components/ui/Toast";





export default function PublicLandingPage(){


const {
  slug
}=useParams();



const navigate =
useNavigate();





const [landing,setLanding]=useState(null);


const [loading,setLoading]=useState(true);


const [orderLoading,setOrderLoading]=useState(false);



const [quantity,setQuantity]=useState(1);



const [form,setForm]=useState({

name:"",

phone:"",

address:"",

city:"",

note:"",

});






useEffect(()=>{


const loadLanding =
async()=>{


try{


const data =
await getLandingPageBySlug(slug);



setLanding(data);



}
catch(error){

console.log(error);

}



finally{

setLoading(false);

}


};



loadLanding();



},[slug]);







if(loading){


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

Loading...

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
bg-[#FAF7F2]
"
>

<h2 className="text-xl font-bold">

Landing Page Not Found

</h2>


</div>

);


}







const price =
landing.offerPrice > 0
?
landing.offerPrice
:
landing.price;





const subtotal =
price * quantity;







const deliveryCharge =
landing.deliveryCharge || 0;



const total =
subtotal + deliveryCharge;









const updateForm=(key,value)=>{


setForm(prev=>({

...prev,

[key]:value

}));


};








const handleOrder =
async()=>{


if(orderLoading)
return;



if(
!form.name ||
!form.phone ||
!form.address
){


errorToast(
"Please fill required information"
);


return;


}





try{


setOrderLoading(true);



const orderId =
await createOrder({



customerName:
form.name,



phone:
form.phone,



address:
form.address,



email:"",



userId:null,



items:[

{

productId:
landing.productId,


name:
landing.title,


image:
landing.heroImages?.[0] || "",


price,


quantity,


}

],




subtotal,


deliveryCharge,


total,



status:
"Pending",



landingPageId:
landing.id,



landingSlug:
slug,



note:
form.note,



createdAt:
new Date()
.toISOString(),



});







successToast(
"Order placed successfully"
);





navigate(
`/landing/order-success/${orderId}`
);





}
catch(error){


console.log(error);


errorToast(
error.message ||
"Order failed"
);


}
finally{


setOrderLoading(false);


}



};









return (


<div
className="
min-h-screen
bg-[#FAF7F2]
px-4
py-8
"
>


<div
className="
max-w-xl
mx-auto
bg-white
rounded-2xl
shadow-xl
overflow-hidden
"
>





{/* IMAGE */}


<img

src={
landing.heroImages?.[0] || ""
}

alt={landing.title}

className="
w-full
object-cover
"
/>






<div
className="
p-5
"
>




<h1
className="
text-3xl
font-black
text-gray-900
"
>

{landing.title}

</h1>





<p
className="
mt-3
text-gray-600
leading-7
whitespace-pre-line
"
>

{landing.heroDescription}

</p>







<div
className="
mt-5
flex
items-center
gap-3
"
>


<span
className="
text-3xl
font-black
text-purple-700
"
>

৳{price}

</span>


{
landing.price > price && (

<span
className="
line-through
text-gray-400
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
mt-5
flex
justify-between
items-center
border
rounded-xl
p-3
"
>


<span
className="
font-bold
"
>

Quantity

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
w-8
h-8
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
"
>

{quantity}

</span>



<button

onClick={()=>setQuantity(quantity+1)}

className="
w-8
h-8
rounded-lg
bg-purple-700
text-white
font-bold
"
>

+

</button>



</div>


</div>









{/* FORM */}



<h2
className="
mt-8
text-xl
font-black
"
>

অর্ডার করুন

</h2>






<div className="mt-4 space-y-3">





<div className="relative">

<FiUser
className="
absolute
left-3
top-4
text-gray-400
"
/>


<input

placeholder="আপনার নাম"

value={form.name}

onChange={
e=>updateForm(
"name",
e.target.value
)
}

className="
w-full
pl-10
p-3
border
rounded-xl
"
/>


</div>







<div className="relative">


<FiPhone
className="
absolute
left-3
top-4
text-gray-400
"
/>


<input

placeholder="ফোন নাম্বার"

value={form.phone}

onChange={
e=>updateForm(
"phone",
e.target.value
)
}

className="
w-full
pl-10
p-3
border
rounded-xl
"
/>


</div>







<div className="relative">


<FiHome
className="
absolute
left-3
top-4
text-gray-400
"
/>



<textarea

placeholder="ঠিকানা"

value={form.address}

onChange={
e=>updateForm(
"address",
e.target.value
)
}

className="
w-full
pl-10
p-3
border
rounded-xl
"
/>



</div>







<input

placeholder="থানা / জেলা"

value={form.city}

onChange={
e=>updateForm(
"city",
e.target.value
)
}

className="
w-full
p-3
border
rounded-xl
"
/>






<textarea

placeholder="অতিরিক্ত নোট"

value={form.note}

onChange={
e=>updateForm(
"note",
e.target.value
)
}

className="
w-full
p-3
border
rounded-xl
"
/>





</div>









{/* TOTAL */}



<div
className="
mt-6
space-y-2
bg-gray-50
rounded-xl
p-4
"
>


<div className="flex justify-between">

<span>
Subtotal
</span>

<b>
৳{subtotal}
</b>

</div>



<div className="flex justify-between">

<span>
Delivery
</span>

<b>
৳{deliveryCharge}
</b>

</div>



<div
className="
border-t
pt-3
flex
justify-between
text-xl
font-black
"
>

<span>
Total
</span>

<span className="text-purple-700">

৳{total}

</span>


</div>


</div>









<button

onClick={handleOrder}

disabled={orderLoading}

className="
mt-6
w-full
bg-purple-700
text-white
py-4
rounded-xl
font-black
text-lg
flex
items-center
justify-center
gap-2
"
>


<FiShoppingBag/>

{

orderLoading
?

"Processing..."

:

"অর্ডার করুন এখনই"

}



</button>






<div
className="
mt-5
flex
items-center
justify-center
gap-2
text-gray-500
"
>

<FiTruck/>

Cash On Delivery Available

</div>






</div>


</div>


</div>


);

}
