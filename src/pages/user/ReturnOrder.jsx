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
} from "react-icons/fi";


import {
  getUserOrders,
} from "../../services/orderService";


import useAuth from "../../hooks/useAuth";


import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";





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





// return reason

const [reason,setReason] =
useState("");





// description

const [description,setDescription] =
useState("");





// images

const [images,setImages] =
useState([]);





// return type

const [returnType,setReturnType] =
useState("");





// refund

const [refundMethod,setRefundMethod] =
useState("");



const [refundNumber,setRefundNumber] =
useState("");





// policy checkbox

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


if(!user) return;



const orders =
await getUserOrders(
user.email
);



const found =
orders.find(
item=>item.id===id
);



setOrder(found);



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









function handleImage(e){


const files =
Array.from(
e.target.files
);



setImages(files);


}









function handlePolicy(name){


setPolicy(prev=>({

...prev,

[name]:!prev[name]


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
text-center
py-2
"

>


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









{/* PRODUCT CARD */}



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

Product

</h3>





<div

className="
flex
items-center
gap-3
"

>


<img

src={

order.items?.[0]?.image ||

"https://via.placeholder.com/80"

}


className="
w-20
h-20
rounded-lg
object-cover
bg-gray-50
"

/>





<div>


<h4

className="
font-bold
text-sm
"

>

{
order.items?.[0]?.name
}

</h4>




<p

className="
text-xs
text-gray-500
mt-1
"

>

Qty :

{
order.items?.[0]?.quantity || 1
}

</p>





<p

className="
font-black
text-sm
mt-2
"

>

৳

{

(order.items?.[0]?.price || 0)

*

(order.items?.[0]?.quantity || 1)

}

</p>



</div>



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
e=>setReason(e.target.value)
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


  // =========================
// DESCRIPTION
// =========================


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
e=>setDescription(e.target.value)
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
focus:border-amber-500
"


/>



</div>









// =========================
// IMAGE UPLOAD
// =========================



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

(

<p

className="
text-xs
text-gray-500
mt-3
"

>

{images.length} image selected

</p>


)

}



</div>









// =========================
// RETURN TYPE
// =========================



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
cursor-pointer
text-center

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
e=>setReturnType(e.target.value)
}

className="
hidden
"

/>



<p

className="
font-bold
"

>

Refund

</p>



<span

className="
text-xs
text-gray-500
"

>

Get money back

</span>



</label>







<label

className={`
border
rounded-lg
p-4
cursor-pointer
text-center

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
e=>setReturnType(e.target.value)
}

className="
hidden
"

/>



<p

className="
font-bold
"

>

Exchange

</p>




<span

className="
text-xs
text-gray-500
"

>

Get another product

</span>



</label>






</div>



</div>









// =========================
// REFUND METHOD
// =========================



{

returnType==="Refund"

&&


(


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
e=>setRefundMethod(e.target.value)
}


className="
w-full
h-12
border
border-gray-200
rounded-lg
px-3
text-sm
outline-none
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



<option value="Bank Transfer">

Bank Transfer

</option>



</select>







{

refundMethod &&

(


<div

className="
mt-4
"

>


<label

className="
text-sm
font-semibold
"

>

{refundMethod} Number

</label>





<input


type="tel"


value={refundNumber}


onChange={
e=>setRefundNumber(e.target.value)
}


placeholder="01XXXXXXXXX"


className="
mt-2
w-full
h-12
border
border-gray-200
rounded-lg
px-3
text-sm
outline-none
focus:border-amber-500
"


/>



</div>


)

}



</div>


)

}









// =========================
// POLICY CHECKBOX
// =========================



<div

className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
space-y-3
"

>



<label

className="
flex
gap-3
items-center
text-sm
cursor-pointer
"

>


<input

type="checkbox"

checked={policy.return}

onChange={
()=>handlePolicy("return")
}


/>


<span>

I agree to 

<span className="text-amber-600 font-bold">

Return Policy

</span>

</span>



</label>







<label

className="
flex
gap-3
items-center
text-sm
cursor-pointer
"

>


<input

type="checkbox"

checked={policy.refund}

onChange={
()=>handlePolicy("refund")
}


/>


<span>

I agree to 

<span className="text-amber-600 font-bold">

Refund Policy

</span>

</span>



</label>







<label

className="
flex
gap-3
items-center
text-sm
cursor-pointer
"

>


<input

type="checkbox"

checked={policy.terms}

onChange={
()=>handlePolicy("terms")
}


/>


<span>

I agree to 

<span className="text-amber-600 font-bold">

Terms & Conditions

</span>

</span>



</label>




</div>









// =========================
// SUBMIT
// =========================



<button


onClick={async()=>{



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
"Please select return type"
);

return;

}





if(
returnType==="Refund"
&&
!refundMethod
){

errorToast(
"Please select refund method"
);

return;

}





if(
returnType==="Refund"
&&
!refundNumber
){

errorToast(
"Please enter refund number"
);

return;

}





if(!allPolicyAccepted){

errorToast(
"Please accept all policies"
);

return;

}





try{



console.log({

orderId:order.id,

reason,

description,

images,

returnType,

refundMethod,

refundNumber,

policy

});





successToast(
"Return request submitted"
);



navigate("/orders");



}

catch(error){


console.log(error);


errorToast(
"Request failed"
);


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


Submit Return Request


</button>








</div>

</div>

);


}
