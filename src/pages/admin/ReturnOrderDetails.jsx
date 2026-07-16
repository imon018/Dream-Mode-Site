import {
 useEffect,
 useState
} from "react";


import {
 useParams,
 useNavigate
} from "react-router-dom";


import {
 FiArrowLeft,
 FiPackage,
 FiImage
} from "react-icons/fi";


import {
 getAllOrders,
 updateReturnStatus
} from "../../services/orderService";


import {
 successToast,
 errorToast
} from "../../components/ui/Toast";



export default function ReturnOrderDetails(){


const {
 id
}=useParams();


const navigate =
useNavigate();


const [order,setOrder]=useState(null);

const [loading,setLoading]=useState(true);



useEffect(()=>{

loadOrder();

},[]);





async function loadOrder(){


try{


const orders =
await getAllOrders();



const found =
orders.find(
item=>item.id===id
);



setOrder(found);



}

catch(error){

console.log(error);

errorToast(
"Failed to load return details"
);


}

finally{

setLoading(false);

}


}







async function changeStatus(status){


try{


await updateReturnStatus(
id,
status
);



setOrder(prev=>({

...prev,

returnRequest:{
...prev.returnRequest,
status
}

}));


successToast(
"Status Updated"
);


}

catch(error){

errorToast(
"Update failed"
);


}



}








if(loading)

return (

<div className="
min-h-screen
flex
items-center
justify-center
font-bold
">

Loading...

</div>

);






if(!order)

return (

<div className="
min-h-screen
flex
items-center
justify-center
font-bold
">

Return Order Not Found

</div>

);





const request =
order.returnRequest || {};





return (

<div className="
min-h-screen
bg-[#faf9f6]
p-4
lg:p-6
space-y-4
">


<button

onClick={()=>navigate(-1)}

className="
flex
items-center
gap-2
font-bold
text-sm
"

>

<FiArrowLeft/>

Back

</button>






<h1 className="
text-2xl
font-black
">

Return Order Details

</h1>







{/* CUSTOMER */}

<div className="
bg-white
rounded-xl
border
p-5
space-y-2
">


<h2 className="
font-black
">

Customer

</h2>


<p>
Name: {order.customerName}
</p>


<p>
Phone: {order.phone}
</p>


<p>
Email: {order.email}
</p>


</div>







{/* PRODUCTS */}

<div className="
bg-white
rounded-xl
border
p-5
">


<h2 className="
font-black
mb-4
">

Returned Products

</h2>



<div className="
space-y-3
">


{

request.items?.map((item,index)=>(


<div

key={index}

className="
flex
items-center
gap-3
border
rounded-lg
p-3
"

>


<img

src={item.image}

className="
w-16
h-16
rounded-lg
object-cover
"

/>



<div>

<p className="
font-bold
">

{item.name}

</p>


<p className="
text-sm
">

Qty: {item.quantity}

</p>


<p>

৳ {item.price}

</p>


</div>


</div>


))

}



</div>


</div>










{/* RETURN INFO */}

<div className="
bg-white
rounded-xl
border
p-5
space-y-3
">


<h2 className="
font-black
">

Return Information

</h2>



<p>
Reason:
{request.reason}
</p>



<p>
Description:
{request.description}
</p>



<p>
Type:
{request.returnType}
</p>



{

request.refundMethod &&

<p>

Refund:
{request.refundMethod}

-
{request.refundNumber}

</p>

}



</div>









{/* IMAGES */}

{

request.images?.length>0 &&


<div className="
bg-white
rounded-xl
border
p-5
">


<h2 className="
font-black
mb-3
flex
items-center
gap-2
">

<FiImage/>

Product Photos

</h2>



<div className="
grid
grid-cols-3
gap-3
">


{

request.images.map(

(img,index)=>(


<img

key={index}

src={img}

className="
w-full
h-32
rounded-lg
object-cover
border
"

/>


)

)

}


</div>


</div>


}









{/* PICKUP ADDRESS */}

<div className="
bg-white
rounded-xl
border
p-5
space-y-2
">


<h2 className="
font-black
">

Pickup Address

</h2>



<p>
{request.pickupAddress?.name}
</p>


<p>
{request.pickupAddress?.phone}
</p>


<p>
{request.pickupAddress?.address}
</p>


<p>
{request.pickupAddress?.postOffice}
</p>


<p>
{request.pickupAddress?.thana}
</p>


<p>
{request.pickupAddress?.district}
</p>


</div>









{/* STATUS */}

<div className="
bg-white
rounded-xl
border
p-5
">


<h2 className="
font-black
mb-3
">

Status

</h2>



<select

value={
request.status || "Submitted"
}

onChange={
e=>changeStatus(
e.target.value
)
}

className="
border
rounded-lg
p-3
font-bold
"

>


<option>
Submitted
</option>


<option>
Accepted
</option>


<option>
Rejected
</option>


<option>
Picked Up
</option>


<option>
Reviewing
</option>


<option>
Shipped
</option>


<option>
Exchanged
</option>


<option>
Refunded
</option>



</select>


</div>







</div>

);


}
