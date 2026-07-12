import { 
  useEffect, 
  useState 
} from "react";


import {
  useParams,
  useNavigate,
} from "react-router-dom";


import {
  FiArrowLeft,
  FiMoreVertical,
  FiPhone,
  FiMail,
  FiMapPin,
  FiTrash2,
  FiPackage,
} from "react-icons/fi";


import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../services/orderService";


import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";





export default function OrderDetails(){


const {id}=useParams();

const navigate=useNavigate();



const [order,setOrder]=useState(null);

const [loading,setLoading]=useState(true);

const [menuOpen,setMenuOpen]=useState(false);





useEffect(()=>{

loadOrder();

},[id]);






async function loadOrder(){

try{


const data=await getAllOrders();


const found=data.find(
(item)=>item.id===id
);


setOrder(found);


}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}

}







async function changeStatus(status){

try{


await updateOrderStatus(
id,
status
);



setOrder(prev=>({

...prev,
status

}));


successToast(
"Status updated"
);


}

catch(error){

console.log(error);

errorToast(
"Update failed"
);


}

}







async function removeOrder(){


const ok=window.confirm(
"Delete this order?"
);


if(!ok)
return;



try{


await deleteOrder(id);


successToast(
"Order deleted"
);


navigate("/admin/orders");


}

catch(error){

errorToast(
"Delete failed"
);

}


}







if(loading){

return(

<div className="
min-h-screen
flex
items-center
justify-center
font-bold
">

Loading Order...

</div>

);

}






if(!order){

return(

<div className="
min-h-screen
flex
items-center
justify-center
flex-col
gap-4
">


<h2 className="
font-bold
text-xl
">

Order Not Found

</h2>


<button

onClick={()=>navigate(-1)}

className="
px-4
py-2
bg-black
text-white
rounded-lg
"

>

Back

</button>


</div>

);

}







return(

<div className="
bg-[#faf9f6]
min-h-screen
p-4
space-y-3
">





{/* HEADER */}

<div className="
flex
items-center
justify-between
mb-2
">


<button

onClick={()=>navigate(-1)}

className="
w-9
h-9
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




<h1 className="
font-bold
text-lg
">

Order Details

</h1>






<div className="
relative
">


<button

onClick={()=>setMenuOpen(!menuOpen)}

className="
w-9
h-9
rounded-lg
flex
items-center
justify-center
"

>

<FiMoreVertical/>

</button>



{
menuOpen &&

<div className="
absolute
right-0
top-10
w-32
bg-white
border
border-gray-100
rounded-lg
shadow-lg
z-50
">


<button

onClick={removeOrder}

className="
w-full
flex
items-center
gap-2
px-3
py-2
text-sm
text-red-600
"

>

<FiTrash2/>

Delete

</button>


</div>

}


</div>



</div>







{/* ORDER CARD */}


<div className="
bg-white
border
border-gray-100
rounded-lg
p-4
shadow-sm
">


<div className="
flex
justify-between
items-start
">


<div>


<h2 className="
text-2xl
font-black
text-slate-900
">

#{order.id?.slice(0,10)}

</h2>


<p className="
text-xs
text-gray-500
mt-1
">

{
new Date(order.createdAt)
.toLocaleString()
}

</p>


</div>







<span className={`

text-xs
font-bold
px-3
py-1.5
rounded-full


${
order.status==="Delivered"

?
"bg-green-100 text-green-700"

:

order.status==="Processing"

?
"bg-blue-100 text-blue-700"

:

order.status==="Cancelled"

?
"bg-red-100 text-red-700"

:

"bg-yellow-100 text-yellow-700"

}

`}>

{order.status}

</span>



</div>







<hr className="
my-4
border-gray-100
"/>







{/* CUSTOMER */}

<h3 className="
font-bold
text-sm
mb-3
">

Customer

</h3>



<div className="
flex
justify-between
items-center
">


<div className="
flex
items-center
gap-3
">


<img

src={
order.customerPhoto ||
`https://ui-avatars.com/api/?name=${order.customerName}`
}

className="
w-12
h-12
rounded-full
object-cover
"

/>


<div>


<p className="
font-bold
text-sm
">

{order.customerName}

</p>


<p className="
text-xs
text-gray-500
">

{order.email}

</p>


<p className="
text-xs
text-gray-600
mt-1
">

{order.phone}

</p>


</div>


</div>







<div className="
flex
gap-2
">


<a

href={`tel:${order.phone}`}

className="
w-9
h-9
rounded-full
bg-gray-50
border
flex
items-center
justify-center
"

>

<FiPhone size={16}/>

</a>



<a

href={`mailto:${order.email}`}

className="
w-9
h-9
rounded-full
bg-gray-50
border
flex
items-center
justify-center
"

>

<FiMail size={16}/>

</a>


</div>


</div>

  {/* SHIPPING ADDRESS */}

<div className="
bg-white
border
border-gray-100
rounded-lg
p-4
shadow-sm
">


<h3 className="
font-bold
text-sm
mb-3
">

Shipping Address

</h3>



<div className="
flex
gap-3
text-sm
text-gray-700
">


<FiMapPin
className="
mt-1
text-gray-500
"
/>



<p>

{
order.address ||
"No address available"
}

</p>



</div>


</div>









{/* PRODUCTS */}


<div className="
bg-white
border
border-gray-100
rounded-lg
p-4
shadow-sm
">



<div className="
flex
items-center
gap-2
mb-4
">


<FiPackage
className="
text-blue-600
"
/>


<h3 className="
font-bold
text-sm
">

Products

</h3>


</div>







<div className="
space-y-3
">


{

order.items?.map(

(item,index)=>(


<div

key={
item.id || index
}

className="
flex
items-center
justify-between
border-b
border-gray-100
pb-3
"


>



<div className="
flex
items-center
gap-3
">


<img

src={
item.image ||
"https://via.placeholder.com/60"
}

className="
w-14
h-14
rounded-lg
object-cover
bg-gray-50
"

/>




<div>


<h4 className="
text-sm
font-bold
">

{item.name}

</h4>



<p className="
text-xs
text-gray-500
mt-1
">

{
item.size &&
`Size: ${item.size}`
}


{
item.color &&
` / Color: ${item.color}`
}


</p>


<p className="
text-xs
text-gray-500
">

Qty: {item.quantity}

</p>


</div>



</div>







<div className="
text-right
">


<p className="
font-bold
text-sm
">

৳ {item.price * item.quantity}

</p>



</div>




</div>


)

)


}



</div>


</div>









{/* ORDER SUMMARY */}



<div className="
bg-white
border
border-gray-100
rounded-lg
p-4
shadow-sm
">



<h3 className="
font-bold
text-sm
mb-4
">

Order Summary

</h3>




<div className="
space-y-3
text-sm
">



<div className="
flex
justify-between
">

<span className="
text-gray-500
">

Subtotal

</span>


<span className="
font-semibold
">

৳ {order.subtotal || order.total}

</span>


</div>







<div className="
flex
justify-between
">


<span className="
text-gray-500
">

Shipping

</span>


<span className="
font-semibold
">

৳ {order.shipping || 0}

</span>


</div>







<div className="
flex
justify-between
">


<span className="
text-gray-500
">

Discount

</span>


<span className="
font-semibold
text-red-500
">

-৳ {order.discount || 0}

</span>


</div>






<hr className="
border-gray-100
"/>






<div className="
flex
justify-between
font-black
text-base
">


<span>

Total Amount

</span>


<span>

৳ {order.total}

</span>


</div>





</div>


</div>








{/* PAYMENT METHOD */}



<div className="
bg-white
border
border-gray-100
rounded-lg
p-4
shadow-sm
">



<h3 className="
font-bold
text-sm
mb-3
">

Payment Method

</h3>




<div className="
flex
items-center
justify-between
">


<div className="
flex
items-center
gap-3
">


<div className="
w-9
h-9
rounded-lg
bg-green-50
flex
items-center
justify-center
text-green-600
">

💳

</div>



<p className="
text-sm
font-semibold
">

{
order.paymentMethod ||
"Cash on Delivery"
}

</p>



</div>







<span className="
text-xs
font-bold
px-3
py-1.5
rounded-full
bg-green-100
text-green-700
">

Paid

</span>



</div>



</div>

  // =========================
// UPDATE STATUS
// =========================


<div className="
bg-white
border
border-gray-100
rounded-lg
p-4
shadow-sm
">


<h3 className="
font-bold
text-sm
mb-3
">

Update Order Status

</h3>



<select

value={
order.status || "Pending"
}

onChange={(e)=>
changeStatus(
e.target.value
)
}

className={`
w-full
h-11
px-3
rounded-lg
text-sm
font-bold
outline-none


${
order.status==="Delivered"

?

"bg-green-100 text-green-700"

:

order.status==="Processing"

?

"bg-blue-100 text-blue-700"

:

order.status==="Cancelled"

?

"bg-red-100 text-red-700"

:

"bg-yellow-100 text-yellow-700"

}

`}

>


<option>
Pending
</option>


<option>
Processing
</option>


<option>
Shipped
</option>


<option>
Delivered
</option>


<option>
Cancelled
</option>



</select>



</div>







{/* DELETE BUTTON */}



<button

onClick={removeOrder}

className="
w-full
h-11
rounded-lg
bg-red-500
text-white
font-bold
text-sm
flex
items-center
justify-center
gap-2
"

>


<FiTrash2/>

Delete Order

</button>







</div>

);


}
