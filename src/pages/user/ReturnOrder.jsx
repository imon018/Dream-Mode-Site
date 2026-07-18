import {
  useEffect,
  useState,
} from "react";



import {
  useParams,
  useNavigate,
} from "react-router-dom";


import {
  FiPackage,
  FiUploadCloud,
  FiArrowLeft,
} from "react-icons/fi";


import {
  getUserOrders,
  requestReturnOrder,
} from "../../services/orderService";


import useAuth from "../../hooks/useAuth";


import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";


import {
  uploadImages
} from "../../services/uploadService";


export default function ReturnOrder(){



const {
  id
}=useParams();



const navigate =
useNavigate();




const {
 user
}=useAuth();





const [order,setOrder] =
useState(null);



const [loading,setLoading] =
useState(true);


  const [submitting,setSubmitting] =
useState(false);





// =========================
// RETURN ITEMS
// =========================


const [returnItems,setReturnItems] =
useState([]);





// =========================
// RETURN FORM
// =========================


const [reason,setReason] =
useState("");


const [description,setDescription] =
useState("");



const [images,setImages] =
useState([]);




const [returnType,setReturnType] =
useState("");



const [refundMethod,setRefundMethod] =
useState("");



const [refundNumber,setRefundNumber] =
useState("");





// =========================
// PICKUP ADDRESS
// =========================


const [sameAsDelivery,setSameAsDelivery] =
useState(false);



const [pickupAddress,setPickupAddress] =
useState({

name:"",

phone:"",

address:"",

postOffice:"",

thana:"",

district:"",

});






// =========================
// POLICY
// =========================


const [policy,setPolicy] =
useState({

return:false,

refund:false,

terms:false

});









const reasons=[


"Product damaged",

"Wrong product received",

"Size issue",

"Quality issue",

"Color mismatch",

"Other",


];









useEffect(()=>{


loadOrder();


},[user]);









async function loadOrder(){


try{


if(!user)
return;




const orders =
await getUserOrders(
user.email
);




const found =
orders.find(
item=>item.id===id
);





setOrder(found);






if(found?.items){


setReturnItems(

found.items.map(item=>({

...item,

returnQuantity:
item.quantity || 1

}))

);


}



}

catch(error){


console.log(error);


errorToast(
"Failed to load order"
);


}

finally{


setLoading(false);


}


}










// =========================
// QUANTITY CONTROL
// =========================


function increaseQty(index){


setReturnItems(prev=>


prev.map((item,i)=>{


if(i===index){


return {


...item,


returnQuantity:

Math.min(

item.returnQuantity + 1,

item.quantity || 1

)


};


}



return item;


})


);


}









function decreaseQty(index){


setReturnItems(prev=>


prev.map((item,i)=>{


if(i===index){


return {


...item,


returnQuantity:

Math.max(

1,

item.returnQuantity - 1

)


};


}



return item;


})


);


}









function removeReturnItem(index){


setReturnItems(prev=>

prev.filter(

(_,i)=>
i!==index

)

);


}









// =========================
// IMAGE SELECT
// =========================



function handleImage(e){

const files =
Array.from(e.target.files);


setImages(prev=>[
...prev,
...files
]);


}

function removeImage(index){

setImages(prev=>
prev.filter(
(_,i)=>i!==index
)
);

}







// =========================
// SAME DELIVERY ADDRESS
// =========================


function handleSameAddress(e){

const checked =
e.target.checked;


setSameAsDelivery(
checked
);



if(checked){


setPickupAddress({

name:

order.customerName ||
user?.name ||
"",



phone:

order.phone ||
user?.phone ||
"",



address:

order.address ||
user?.address ||
"",



postOffice:

user?.postOffice ||
"",



thana:

user?.thana ||
"",



district:

user?.district ||
"",


});


}

else{


setPickupAddress({

name:"",

phone:"",

address:"",

postOffice:"",

thana:"",

district:"",

});


}


}









function updatePickup(field,value){


setPickupAddress(prev=>({

...prev,

[field]:value


}));


}









function handlePolicy(name){


setPolicy(prev=>({

...prev,

[name]:

!prev[name]


}));


}









const allPolicyAccepted =

policy.return &&

policy.refund &&

policy.terms;






if(loading)


return (

<div

className="
min-h-screen
flex
items-center
justify-center
font-bold
"

>

Loading...

</div>

);








if(!order)


return (

<div

className="
min-h-screen
flex
items-center
justify-center
font-bold
"

>

Order Not Found

</div>

);






if(order.status !== "Delivered"){


errorToast(
"Only delivered orders can be returned"
);


navigate(-1);


return null;


}

return (

<div

className="
min-h-screen
bg-[#FCFAF5]
px-4
py-5
"

>


<div

className="
max-w-xl
mx-auto
space-y-4
"

>



{/* HEADER */}

<div
className="
relative
flex
items-center
justify-center
py-2
"
>

<button

onClick={()=>navigate(-1)}

className="
absolute
left-0
w-10
h-10
rounded-full
bg-white
border
border-gray-100
shadow-sm
flex
items-center
justify-center
"

>

<FiArrowLeft size={22}/>

</button>

  
<h1

className="
font-black
text-xl
"

>

Return Order

</h1>



<p

className="
text-xs
text-gray-500
mt-1
"

>

Request product return

</p>


</div>







{/* ORDER CARD */}


<div

className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
"

>


<div

className="
flex
items-center
gap-3
"

>


<FiPackage

size={35}

className="
text-amber-500
"

/>



<div>


<h2

className="
font-bold
"

>

Order #{order.id.slice(0,8)}

</h2>



<p

className="
text-xs
text-gray-500
"

>

Delivered Order

</p>


</div>


</div>


</div>









{/* PRODUCTS */}


<div

className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
"

>


<h3

className="
font-bold
mb-4
"

>

Products

</h3>





<div

className="
space-y-4
"

>


{

returnItems.map(

(item,index)=>(


<div

key={item.id || index}

className="
relative
border
border-gray-100
rounded-lg
p-4
flex
justify-between
items-center
"

>



{/* REMOVE BUTTON */}

<button

onClick={()=>removeReturnItem(index)}

className="
absolute
right-2
top-2
w-6
h-6
rounded-full
bg-red-100
text-red-600
font-bold
"

>

×

</button>







<div

className="
flex
gap-3
items-center
"

>


<img

src={

item.image ||

"https://via.placeholder.com/80"

}


className="
w-20
h-20
rounded-lg
object-cover
"

/>





<div>


<h4

className="
font-bold
text-sm
"

>

{item.name}

</h4>



<p

className="
text-xs
text-gray-500
mt-1
"

>

৳ {item.price}

</p>




<div

className="
flex
items-center
gap-3
mt-3
"

>


<button

onClick={()=>decreaseQty(index)}

className="
w-7
h-7
rounded-md
bg-gray-100
font-bold
"

>

-

</button>




<span

className="
font-bold
text-sm
"

>

{item.returnQuantity}

</span>





<button

onClick={()=>increaseQty(index)}

className="
w-7
h-7
rounded-md
bg-gray-100
font-bold
"

>

+

</button>



</div>



</div>



</div>







<p

className="
font-black
text-sm
"

>

৳

{

item.price *

item.returnQuantity

}

</p>




</div>


)

)


}


</div>



</div>









{/* RETURN REASON */}


<div

className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
"

>


<h3

className="
font-bold
mb-4
"

>

Why are you returning?

</h3>




<div

className="
space-y-3
"

>


{

reasons.map(

(item)=>(


<label

key={item}

className="
flex
items-center
gap-3
border
border-gray-100
rounded-lg
p-3
cursor-pointer
"

>


<input

type="radio"

name="reason"

value={item}

checked={
reason===item
}


onChange={

e=>

setReason(
e.target.value
)

}


className="
accent-amber-500
"

/>



<span

className="
text-sm
font-semibold
"

>

{item}

</span>



</label>


)


)


}


</div>


</div>









{/* DESCRIPTION */}



<div

className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
"

>


<h3

className="
font-bold
mb-3
"

>

Explain your problem

</h3>





<textarea


value={description}


onChange={

e=>

setDescription(
e.target.value
)

}



placeholder="
Write your return reason...
"


rows="5"


className="
w-full
border
border-gray-200
rounded-lg
p-3
text-sm
outline-none
"




/>



</div>









{/* PICKUP ADDRESS */}



{

!sameAsDelivery &&


<div

className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
"

>


<h3

className="
font-bold
mb-4
"

>

Pickup Address

</h3>






<input

className="
w-full
border
rounded-lg
p-3
mb-3
text-sm
"

placeholder="Name"

value={
pickupAddress.name
}


onChange={

e=>

updatePickup(
"name",
e.target.value
)

}


/>




<input

className="
w-full
border
rounded-lg
p-3
mb-3
text-sm
"

placeholder="Phone Number"

value={
pickupAddress.phone
}


onChange={

e=>

updatePickup(
"phone",
e.target.value
)

}


/>





<textarea

className="
w-full
border
rounded-lg
p-3
mb-3
text-sm
"

placeholder="Address"

value={
pickupAddress.address
}


onChange={

e=>

updatePickup(
"address",
e.target.value
)

}


/>





<input

className="
w-full
border
rounded-lg
p-3
mb-3
text-sm
"

placeholder="Post Office"

value={
pickupAddress.postOffice
}


onChange={

e=>

updatePickup(
"postOffice",
e.target.value
)

}


/>






<input

className="
w-full
border
rounded-lg
p-3
mb-3
text-sm
"

placeholder="Thana"

value={
pickupAddress.thana
}


onChange={

e=>

updatePickup(
"thana",
e.target.value
)

}


/>






<input

className="
w-full
border
rounded-lg
p-3
text-sm
"

placeholder="District"

value={
pickupAddress.district
}


onChange={

e=>

updatePickup(
"district",
e.target.value
)

}


/>




</div>


}









{/* SAME ADDRESS */}



<div

className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
"

>


<label

className="
flex
items-center
gap-3
text-sm
font-semibold
cursor-pointer
"

>


<input

type="checkbox"

checked={sameAsDelivery}

onChange={handleSameAddress}

/>



<span>

Same as Delivery Address

</span>



</label>



</div>


  {/* =========================
// PRODUCT PHOTOS
// ========================= */}


<div

className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
"

>


<h3

className="
font-bold
mb-3
"

>

Product Photos

<span

className="
text-xs
text-gray-400
font-normal
"

>

(Optional)

</span>

</h3>





<label

className="
h-28
border-2
border-dashed
border-gray-200
rounded-lg
flex
flex-col
items-center
justify-center
cursor-pointer
"

>


<FiUploadCloud

size={28}

className="
text-amber-500
"

/>



<p

className="
text-xs
text-gray-500
mt-2
"

>

Add product image

</p>



<input

type="file"

multiple

accept="image/*"

onChange={handleImage}

className="
hidden
"

/>



</label>




{

images.length > 0 &&


<div

className="
grid
grid-cols-3
gap-3
mt-4
"

>


{

images.map((image,index)=>(


<div

key={index}

className="
relative
"

>


<img

src={
URL.createObjectURL(image)
}

alt="preview"

className="
w-full
h-24
rounded-lg
object-cover
border
"

/>




<button

type="button"

onClick={()=>removeImage(index)}

className="
absolute
-top-2
-right-2
w-6
h-6
rounded-full
bg-red-500
text-white
font-bold
flex
items-center
justify-center
shadow
"

>

×

</button>



</div>


))


}


</div>


}

</div>









  {/* =========================
// RETURN TYPE
// ========================= */}


<div

className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
"

>


<h3

className="
font-bold
mb-4
"

>

Return Type

</h3>





<div

className="
grid
grid-cols-2
gap-3
"

>


<label

className={`

border

rounded-lg

p-4

text-center

cursor-pointer


${
returnType==="Refund"

?

"border-amber-500 bg-amber-50"

:

"border-gray-100"

}

`}

>


<input

type="radio"

name="returnType"

value="Refund"

checked={
returnType==="Refund"
}

onChange={

e=>

setReturnType(
e.target.value
)

}

className="
hidden
"

/>


<p className="
font-bold
">

Refund

</p>


<p className="
text-xs
text-gray-500
">

Get money back

</p>


</label>








<label

className={`

border

rounded-lg

p-4

text-center

cursor-pointer


${
returnType==="Exchange"

?

"border-amber-500 bg-amber-50"

:

"border-gray-100"

}

`}

>


<input

type="radio"

name="returnType"

value="Exchange"

checked={
returnType==="Exchange"
}

onChange={

e=>

setReturnType(
e.target.value
)

}

className="
hidden
"

/>


<p className="
font-bold
">

Exchange

</p>


<p className="
text-xs
text-gray-500
">

Get another product

</p>


</label>



</div>



</div>










  {/* =========================
// REFUND METHOD
// ========================= */}



{

returnType==="Refund" &&


<div

className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
"

>


<h3

className="
font-bold
mb-4
"

>

Refund Method

</h3>





<select

value={refundMethod}

onChange={

e=>

setRefundMethod(
e.target.value
)

}

className="
w-full
h-12
border
rounded-lg
px-3
text-sm
"

>


<option value="">

Select Refund Method

</option>


<option value="bKash">

bKash

</option>



<option value="Nagad">

Nagad

</option>



</select>







{

refundMethod &&


<input

type="tel"

value={refundNumber}

onChange={

e=>

setRefundNumber(
e.target.value
)

}

placeholder={`${refundMethod} Number`}

className="
mt-3
w-full
h-12
border
rounded-lg
px-3
text-sm
"

/>



}



</div>



}









  {/* =========================
// POLICY
// ========================= */}


<div

className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
space-y-4
"

>


<label

className="
flex
gap-3
items-center
text-sm
"

>


<input

type="checkbox"

checked={policy.return}

onChange={()=>handlePolicy("return")}

/>


<span>

I agree to

<a

href="/page/returnpolicy"

className="
text-amber-600
font-bold
ml-1
"

>

Return Policy

</a>

</span>


</label>







<label

className="
flex
gap-3
items-center
text-sm
"

>


<input

type="checkbox"

checked={policy.refund}

onChange={()=>handlePolicy("refund")}

/>


<span>

I agree to

<a

href="/page/refundpolicy"

className="
text-amber-600
font-bold
ml-1
"

>

Refund Policy

</a>

</span>


</label>







<label

className="
flex
gap-3
items-center
text-sm
"

>


<input

type="checkbox"

checked={policy.terms}

onChange={()=>handlePolicy("terms")}

/>


<span>

I agree to

<a

href="/page/terms"

className="
text-amber-600
font-bold
ml-1
"

>

Terms & Conditions

</a>

</span>


</label>



</div>









  {/* =========================
// SUBMIT
// ========================= */}



<button


onClick={async()=>{





if(returnItems.length===0){

errorToast(
"Select at least one product"
);

return;

}





if(!reason){

errorToast(
"Please select return reason"
);

return;

}





if(!description){

errorToast(
"Please explain your problem"
);

return;

}





if(!returnType){

errorToast(
"Select return type"
);

return;

}





if(
!pickupAddress.name ||
!pickupAddress.phone ||
!pickupAddress.address
){

errorToast(
"Please complete pickup address"
);

return;

}





if(
returnType==="Refund"
&&
(
!refundMethod ||
!refundNumber
)

){

errorToast(
"Complete refund information"
);

return;

}





if(!allPolicyAccepted){

errorToast(
"Accept all policies"
);

return;

}



try{

  setSubmitting(true);

let uploadedImages = [];


if(images.length > 0){

uploadedImages =
await uploadImages(images);

}

const data={


items:returnItems.map(item=>({


id:item.id,

name:item.name,

image:item.image,

price:item.price,

quantity:item.returnQuantity


})),


reason,


description,


images: uploadedImages,


returnType,


refundMethod,


refundNumber,



pickupAddress:

sameAsDelivery

?

{

name:
order.customerName || user?.name || "",

phone:
order.phone || user?.phone || "",

address:
order.address || user?.address || "",

postOffice:
user?.postOffice || "",

thana:
user?.thana || "",

district:
user?.district || "",

}

:

pickupAddress,



};



await requestReturnOrder(
  order.id,
  data
);


successToast(
"Return request submitted"
);



navigate(
"/profile/orders"
);



}

catch(error){


console.log(error);


errorToast(
"Request failed"
);


}

  finally{

setSubmitting(false);

}



}}


className="
h-12
w-full
rounded-lg
bg-black
text-white
font-bold
"

>

{

submitting

?

"Submitting..."

:

"Submit Return Request"

}


</button>








</div>

</div>


);

}
