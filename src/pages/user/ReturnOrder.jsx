import {
  useEffect,
  useState,
} from "react";


import {
  useParams,
  useNavigate,
} from "react-router-dom";


import {
  FiArrowLeft,
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





const [reason,setReason] =
useState("");



const [description,setDescription] =
useState("");



const [images,setImages] =
useState([]);





// refund

const [refundMethod,setRefundMethod] =
useState("");



const [refundNumber,setRefundNumber] =
useState("");





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
text-xl
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
rounded-lg
bg-white
border
border-gray-100
flex
items-center
justify-center
"

>

<FiArrowLeft/>

</button>




<div>

<h1
className="
font-black
text-lg
"
>

Return Order

</h1>



<p
className="
text-xs
text-gray-500
"
>

Request product return

</p>


</div>


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

৳ {
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









{/* IMAGE UPLOAD */}



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
hover:border-amber-400
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

images.length > 0 && (


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


  {/* REFUND METHOD */}


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





<div

className="
space-y-3
"

>





<label

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

name="refundMethod"

value="bKash"

checked={
refundMethod==="bKash"
}

onChange={
e=>setRefundMethod(e.target.value)
}

/>



<span

className="
text-sm
font-semibold
"

>

bKash

</span>



</label>







<label

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

name="refundMethod"

value="Nagad"

checked={
refundMethod==="Nagad"
}

onChange={
e=>setRefundMethod(e.target.value)
}

/>



<span

className="
text-sm
font-semibold
"

>

Nagad

</span>



</label>





</div>







{

refundMethod && (


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









{/* RETURN POLICY */}



<div

className="
bg-amber-50
border
border-amber-100
rounded-lg
p-4
"

>


<h3

className="
font-bold
text-amber-700
text-sm
mb-2
"

>

⚠ Return Policy

</h3>




<p

className="
text-xs
text-amber-700
leading-5
"

>

Product must be unused and returned within the allowed return period.

</p>



</div>









{/* SUBMIT BUTTON */}



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





if(!refundMethod){


errorToast(
"Please select refund method"
);


return;


}





if(!refundNumber){


errorToast(
"Please enter refund number"
);


return;


}





try{


console.log({

orderId:order.id,

reason,

description,

images,

refundMethod,

refundNumber,


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
flex
items-center
justify-center
"

>

Submit Return Request

</button>







</div>

</div>

);

}
