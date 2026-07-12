import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";


import {
  FiSearch,
  FiShoppingBag,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiEye,
  FiTrash2,
  FiMoreVertical
} from "react-icons/fi";


import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from "../../services/orderService";


import {
  successToast,
  errorToast
} from "../../components/ui/Toast";



export default function Orders(){


const navigate = useNavigate();



const [orders,setOrders] =
useState([]);


const [loading,setLoading] =
useState(true);



const [search,setSearch] =
useState("");



const [menuOpen,setMenuOpen] =
useState(null);



const [statusFilter,setStatusFilter] =
useState("All Status");



useEffect(()=>{

loadOrders();

},[]);





const loadOrders = async()=>{

try{

const data =
await getAllOrders();


setOrders(data);


}catch(error){

console.log(error);

}

finally{

setLoading(false);

}

};






const changeStatus =
async(id,status)=>{


try{


await updateOrderStatus(
id,
status
);


setOrders(prev=>

prev.map(order=>

order.id===id

?
{
...order,
status
}

:
order

)

);



}catch(error){

console.log(error);

}



};







const removeOrder =
async(id)=>{


const confirm =
window.confirm(
"Delete this order?"
);


if(!confirm)
return;



try{


await deleteOrder(id);



setOrders(prev=>

prev.filter(
o=>o.id!==id
)

);



successToast(
"Order deleted"
);



}catch(error){


errorToast(
"Delete failed"
);


}



};








const filteredOrders =

orders.filter(order=>{


const searchMatch =

order.customerName
?.toLowerCase()
.includes(
search.toLowerCase()
)

||

order.id
?.toLowerCase()
.includes(
search.toLowerCase()
);



const statusMatch =

statusFilter==="All Status"

?

true

:

order.status===statusFilter;



return (
searchMatch &&
statusMatch
);


});







const total =
orders.length;


const pending =
orders.filter(
o=>o.status==="Pending"
).length;



const processing =
orders.filter(
o=>o.status==="Processing"
).length;



const delivered =
orders.filter(
o=>o.status==="Delivered"
).length;







if(loading){

return(

<div className="
min-h-screen
flex
items-center
justify-center
font-bold
">

Loading Orders...

</div>

)

}






return (

<div className="
space-y-8
">


{/* TITLE */}

<div>


<h1 className="
text-3xl
font-black
text-slate-800
">

Orders

</h1>


<p className="
text-gray-500
">

Dashboard  › Orders

</p>


</div>





{/* STATS */}


<div className="
grid
grid-cols-2
lg:grid-cols-4
gap-4
">



<StatCard

icon={<FiShoppingBag/>}

title="Total Orders"

value={total}

color="orange"

/>




<StatCard

icon={<FiClock/>}

title="Pending"

value={pending}

color="yellow"

/>





<StatCard

icon={<FiTruck/>}

title="Processing"

value={processing}

color="blue"

/>





<StatCard

icon={<FiCheckCircle/>}

title="Delivered"

value={delivered}

color="green"

/>



</div>






{/* SEARCH */}



<div className="
relative
">


<FiSearch

className="
absolute
left-5
top-5
text-gray-400
"

/>


<input

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

placeholder="
Search order ID / customer...
"

className="
w-full
bg-white
rounded-2xl
py-5
pl-14
border
border-gray-200
outline-none
shadow-sm
"

/>


</div>







{/* FILTER */}


<div className="
grid
grid-cols-3
gap-3
">


{

[
"All Status",
"Payment",
"Date"

].map(item=>(


<button

key={item}

className="
bg-white
rounded-2xl
py-4
px-4
border
border-gray-200
flex
justify-between
items-center
text-sm
"

>

{item}

<span>
⌄
</span>


</button>


))

}



</div>

  {/* =========================
        MOBILE ORDER CARD
========================= */}


<div className="
lg:hidden
space-y-5
">


{
filteredOrders.map(order=>(


<div

key={order.id}

className="
bg-white
rounded-3xl
p-5
shadow-sm
border
border-gray-100
relative
"


>


{/* TOP */}


<div className="
flex
justify-between
items-start
">


<div className="
flex
items-center
gap-3
">


<img

src={
order.customerPhoto ||
`https://ui-avatars.com/api/?name=${encodeURIComponent(
order.customerName || "User"
)}`
}

className="
w-12
h-12
rounded-full
object-cover
"

/>



<div>


<h3 className="
font-bold
text-slate-800
">

{
order.customerName ||
"Customer"
}

</h3>


<p className="
text-xs
text-gray-500
">

{
order.email
}

</p>


</div>



</div>





<div className="relative">


<button

onClick={()=>setMenuOpen(
menuOpen===order.id
?
null
:
order.id
)}

className="
w-9
h-9
rounded-xl
bg-gray-50
flex
items-center
justify-center
"

>

<FiMoreVertical/>

</button>




{
menuOpen===order.id &&

<div

className="
absolute
right-0
top-11
w-40
bg-white
rounded-xl
shadow-xl
border
z-30
overflow-hidden
"

>


<button

onClick={()=>navigate(
`/admin/orders/${order.id}`
)}

className="
w-full
px-4
py-3
text-left
text-sm
hover:bg-blue-50
flex
gap-2
items-center
"

>

<FiEye/>

View Details

</button>




<button

onClick={()=>
removeOrder(order.id)
}

className="
w-full
px-4
py-3
text-left
text-sm
text-red-600
hover:bg-red-50
flex
gap-2
items-center
"

>

<FiTrash2/>

Delete

</button>



</div>

}



</div>


</div>








{/* ORDER INFO */}


<div className="
mt-5
flex
justify-between
items-center
">


<div>


<p className="
font-black
text-slate-800
">

#
{
order.id.slice(0,8)
}

</p>


<p className="
text-xs
text-gray-500
">

{
new Date(
order.createdAt
).toLocaleDateString()
}

</p>


</div>






<span

className={`
px-3
py-1
rounded-full
text-xs
font-bold

${
order.status==="Delivered"

?
"bg-green-100 text-green-700"

:

order.status==="Cancelled"

?

"bg-red-100 text-red-700"

:

order.status==="Processing"

?

"bg-orange-100 text-orange-700"

:

"bg-yellow-100 text-yellow-700"

}

`}

>

{
order.status || "Pending"
}

</span>



</div>







{/* PRICE */}


<div className="
mt-5
flex
justify-between
items-center
">


<div>


<p className="
text-sm
text-gray-500
">

Items

</p>


<p className="
font-bold
">

{
order.items?.length || 0
}

Products

</p>


</div>





<div className="
text-right
">


<p className="
text-sm
text-gray-500
">

Total

</p>


<p className="
font-black
text-blue-700
text-xl
">

৳ {order.total}

</p>


</div>


</div>







{/* ACTION */}



<div className="
mt-5
flex
gap-3
">


<select

value={
order.status || "Pending"
}

onChange={(e)=>
changeStatus(
order.id,
e.target.value
)
}

className="
flex-1
border
rounded-xl
px-3
py-3
text-sm
"

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





<button

onClick={()=>navigate(
`/admin/orders/${order.id}`
)}

className="
w-12
h-12
rounded-xl
bg-blue-50
text-blue-600
flex
items-center
justify-center
"

>

<FiEye/>

</button>



</div>





</div>


))

}


</div>









{/* =========================
        DESKTOP TABLE
========================= */}



<div className="
hidden
lg:block
bg-white
rounded-3xl
shadow-sm
overflow-hidden
">


<table className="
w-full
">


<thead className="
bg-gray-50
">


<tr>


<th className="
px-6
py-4
text-left
text-sm
text-gray-500
">

Order

</th>


<th className="
px-6
py-4
text-left
text-sm
text-gray-500
">

Customer

</th>


<th className="
px-6
py-4
text-left
text-sm
text-gray-500
">

Items

</th>


<th className="
px-6
py-4
text-left
text-sm
text-gray-500
">

Amount

</th>


<th className="
px-6
py-4
text-left
text-sm
text-gray-500
">

Status

</th>


<th className="
px-6
py-4
text-left
text-sm
text-gray-500
">

Action

</th>


</tr>


</thead>





<tbody>


{

filteredOrders.map(order=>(


<tr

key={order.id}

className="
border-t
hover:bg-gray-50
"

>


<td className="
px-6
py-5
font-bold
">

#
{
order.id.slice(0,8)
}

</td>





<td className="
px-6
py-5
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
w-10
h-10
rounded-full
"

/>


<div>

<p className="
font-semibold
">

{
order.customerName
}

</p>


<p className="
text-xs
text-gray-500
">

{
order.email
}

</p>


</div>


</div>


</td>







<td className="
px-6
py-5
">

{
order.items?.length || 0
}

</td>




<td className="
px-6
py-5
font-black
text-blue-700
">

৳ {order.total}

</td>






<td className="
px-6
py-5
">


<select

value={
order.status || "Pending"
}

onChange={(e)=>
changeStatus(
order.id,
e.target.value
)
}

className="
border
rounded-xl
px-3
py-2
"

>


<option>Pending</option>
<option>Processing</option>
<option>Shipped</option>
<option>Delivered</option>
<option>Cancelled</option>


</select>


</td>





<td className="
px-6
py-5
">


<div className="
flex
gap-2
">


<button

onClick={()=>navigate(
`/admin/orders/${order.id}`
)}

className="
w-10
h-10
rounded-xl
bg-blue-50
text-blue-600
flex
items-center
justify-center
"

>

<FiEye/>

</button>





<button

onClick={()=>removeOrder(order.id)}

className="
w-10
h-10
rounded-xl
bg-red-500
text-white
flex
items-center
justify-center
"

>

<FiTrash2/>

</button>



</div>


</td>




</tr>


))

}


</tbody>


</table>


</div>


</>
)

}


</div>

);

}







// ===============================
// STAT CARD COMPONENT
// ===============================


function StatCard({
icon,
title,
value,
color
}){


const colors={

orange:
"bg-orange-50 text-orange-500",

yellow:
"bg-yellow-50 text-yellow-500",

blue:
"bg-blue-50 text-blue-500",

green:
"bg-green-50 text-green-500",

};


return(

<div className="
bg-white
rounded-3xl
p-4
shadow-sm
">


<div className={`
w-10
h-10
rounded-xl
flex
items-center
justify-center
${colors[color]}
`}>

{icon}

</div>


<p className="
text-xs
text-gray-500
mt-3
">

{title}

</p>


<h2 className="
text-2xl
font-black
">

{value}

</h2>


</div>

)


}
