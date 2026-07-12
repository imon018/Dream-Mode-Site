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
  FiChevronDown,
  FiCalendar,
  FiMoreVertical,
  FiEye,
  FiTrash2
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



const [filterOpen,setFilterOpen] =
useState("");



const [statusFilter,setStatusFilter] =
useState("All Status");



const [paymentFilter,setPaymentFilter] =
useState("Payment");



const [dateFilter,setDateFilter] =
useState("");





useEffect(()=>{

loadOrders();

},[]);







const loadOrders = async()=>{


try{


const data =
await getAllOrders();


setOrders(data || []);



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


const confirmDelete =
window.confirm(
"Delete this order?"
);



if(!confirmDelete)
return;



try{


await deleteOrder(id);



setOrders(prev=>

prev.filter(
order=>order.id!==id
)

);



successToast(
"Order deleted successfully"
);



}catch(error){


errorToast(
"Delete failed"
);


}


};









const filteredOrders =

orders.filter(order=>{



const searchText =
search.toLowerCase();




const searchMatch =

order.customerName
?.toLowerCase()
.includes(searchText)

||

order.email
?.toLowerCase()
.includes(searchText)

||

order.id
?.toLowerCase()
.includes(searchText);







const statusMatch =

statusFilter==="All Status"

?

true

:

order.status===statusFilter;







const paymentMatch =

paymentFilter==="Payment"

?

true

:

order.paymentMethod===paymentFilter;








const dateMatch =

dateFilter===""

?

true

:

new Date(order.createdAt)
.toISOString()
.slice(0,10)

===dateFilter;








return(

searchMatch &&
statusMatch &&
paymentMatch &&
dateMatch

);


});









const totalOrders =
orders.length;



const pendingOrders =
orders.filter(
order=>order.status==="Pending"
).length;



const processingOrders =
orders.filter(
order=>order.status==="Processing"
).length;



const deliveredOrders =
orders.filter(
order=>order.status==="Delivered"
).length;







if(loading){


return(

<div className="
min-h-screen
flex
items-center
justify-center
font-bold
text-gray-600
">

Loading Orders...

</div>

);


}

return(

<div className="
space-y-4
bg-[#faf9f6]
min-h-screen
p-3
lg:p-6
">


{/* HEADER */}

<div>

<h1 className="
text-2xl
font-black
text-slate-900
">

Orders

</h1>


<p className="
text-xs
text-gray-500
mt-1
">

Dashboard › Orders

</p>


</div>





{/* STATS */}

<div className="
grid
grid-cols-2
lg:grid-cols-4
gap-2
">


<StatCard

icon={<FiShoppingBag size={18}/>}

title="Total Orders"

value={totalOrders}

color="orange"

/>



<StatCard

icon={<FiClock size={18}/>}

title="Pending"

value={pendingOrders}

color="yellow"

/>



<StatCard

icon={<FiTruck size={18}/>}

title="Processing"

value={processingOrders}

color="blue"

/>



<StatCard

icon={<FiCheckCircle size={18}/>}

title="Delivered"

value={deliveredOrders}

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
left-4
top-1/2
-translate-y-1/2
text-gray-400
"

/>


<input

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

placeholder="Search order ID or customer..."

className="
w-full
h-12
bg-white
border
border-gray-200
rounded-xl
pl-11
pr-4
text-sm
outline-none
shadow-sm
focus:ring-2
focus:ring-blue-100
"

/>


</div>








{/* FILTER */}

<div className="
grid
grid-cols-3
gap-2
">



<DropdownFilter

title={statusFilter}

open={
filterOpen==="status"
}

onClick={()=>setFilterOpen(
filterOpen==="status"
?
""
:
"status"
)}

>

{

[
"All Status",
"Pending",
"Processing",
"Delivered",
"Cancelled"

].map(item=>(

<button

key={item}

onClick={()=>{

setStatusFilter(item);
setFilterOpen("");

}}

className="
w-full
text-left
px-3
py-2
text-xs
hover:bg-gray-50
"

>

{item}

</button>

))

}

</DropdownFilter>







<DropdownFilter

title={paymentFilter}

open={
filterOpen==="payment"
}

onClick={()=>setFilterOpen(
filterOpen==="payment"
?
""
:
"payment"
)}

>

{

[
"Payment",
"bKash",
"Nagad",
"Bank",
"Cash on Delivery"

].map(item=>(

<button

key={item}

onClick={()=>{

setPaymentFilter(item);
setFilterOpen("");

}}

className="
w-full
text-left
px-3
py-2
text-xs
hover:bg-gray-50
"

>

{item}

</button>

))

}


</DropdownFilter>








<div className="
h-11
bg-white
border
border-gray-200
rounded-xl
flex
items-center
px-3
gap-2
">


<FiCalendar size={15}/>


<input

type="date"

value={dateFilter}

onChange={(e)=>
setDateFilter(e.target.value)
}

className="
w-full
outline-none
text-xs
"

/>


</div>



</div>








{/* MOBILE CARD */}

<div className="
lg:hidden
space-y-2
">


{
filteredOrders.map(order=>(


<div

key={order.id}

className="
bg-white
rounded-2xl
border
border-gray-100
p-4
shadow-sm
"


>


{/* HEADER */}

<div className="
flex
justify-between
items-start
">


<div>

<h3 className="
font-black
text-sm
text-slate-900
">

#{order.id?.slice(0,8)}

</h3>


<p className="
text-xs
text-gray-400
mt-1
">

{
new Date(order.createdAt)
.toLocaleDateString()
}

</p>


</div>





<div className="
flex
flex-col
items-end
gap-2
">


<button

onClick={()=>setMenuOpen(
menuOpen===order.id
?
null
:
order.id
)}

className="
w-8
h-8
rounded-lg
border
bg-gray-50
flex
items-center
justify-center
"

>

<FiMoreVertical size={15}/>

</button>



<p className="
font-black
text-base
text-slate-900
">

৳ {order.total}

</p>



</div>


</div>








{/* CUSTOMER */}


<div className="
mt-4
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

`https://ui-avatars.com/api/?name=${encodeURIComponent(
order.customerName || "User"
)}`
}

className="
w-10
h-10
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


</div>


</div>





<p className="
text-xs
text-gray-500
font-semibold
">

{
order.items?.length || 0
}
 Items

</p>



</div>









{/* FOOTER */}


<div className="
mt-4
flex
justify-between
items-center
">


<select

value={order.status || "Pending"}

onChange={(e)=>
changeStatus(
order.id,
e.target.value
)
}

className={`

text-xs
font-bold
px-3
py-2
rounded-lg
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
w-9
h-9
rounded-lg
bg-blue-50
text-blue-600
flex
items-center
justify-center
"

>

<FiEye size={16}/>

</button>


</div>








{
menuOpen===order.id &&

<div className="
absolute
bg-white
border
rounded-lg
shadow-lg
right-5
mt-[-40px]
w-28
z-50
">


<button

onClick={()=>removeOrder(order.id)}

className="
px-3
py-2
text-xs
text-red-600
"

>

Delete

</button>


</div>

}



</div>


))


}


</div>




	{/* DESKTOP TABLE */}

<div className="
hidden
lg:block
bg-white
rounded-xl
border
border-gray-100
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
px-5
py-3
text-left
text-xs
text-gray-500
">

Order ID

</th>


<th className="
px-5
py-3
text-left
text-xs
text-gray-500
">

Customer

</th>


<th className="
px-5
py-3
text-left
text-xs
text-gray-500
">

Date

</th>


<th className="
px-5
py-3
text-left
text-xs
text-gray-500
">

Items

</th>


<th className="
px-5
py-3
text-left
text-xs
text-gray-500
">

Amount

</th>


<th className="
px-5
py-3
text-left
text-xs
text-gray-500
">

Status

</th>


<th className="
px-5
py-3
text-left
text-xs
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
px-5
py-4
text-sm
font-bold
">

#{order.id?.slice(0,8)}

</td>






<td className="
px-5
py-4
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
w-8
h-8
rounded-full
object-cover
"

/>


<div>


<p className="
text-sm
font-semibold
">

{order.customerName}

</p>


<p className="
text-xs
text-gray-500
">

{order.email}

</p>


</div>


</div>


</td>







<td className="
px-5
py-4
text-xs
text-gray-500
">

{
new Date(order.createdAt)
.toLocaleDateString()
}

</td>







<td className="
px-5
py-4
text-sm
">

{
order.items?.length || 0
}

</td>






<td className="
px-5
py-4
font-bold
text-blue-600
">

৳ {order.total}

</td>







<td className="
px-5
py-4
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

className={`

text-xs
font-bold
px-3
py-2
rounded-lg
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
Delivered
</option>

<option>
Cancelled
</option>


</select>


</td>








<td className="
px-5
py-4
">


<div className="
flex
gap-2
relative
">


<button

onClick={()=>navigate(
`/admin/orders/${order.id}`
)}

className="
w-8
h-8
rounded-lg
bg-blue-50
text-blue-600
flex
items-center
justify-center
"

>

<FiEye size={15}/>

</button>







<button

onClick={()=>setMenuOpen(
menuOpen===order.id
?
null
:
order.id
)}

className="
w-8
h-8
rounded-lg
bg-gray-50
border
flex
items-center
justify-center
"

>

<FiMoreVertical size={15}/>

</button>





{

menuOpen===order.id &&


<div className="
absolute
right-0
top-10
w-28
bg-white
border
rounded-lg
shadow-lg
z-50
">


<button

onClick={()=>removeOrder(order.id)}

className="
w-full
px-3
py-2
text-xs
text-red-600
text-left
hover:bg-red-50
"

>

Delete

</button>


</div>


}



</div>


</td>





</tr>


))


}


</tbody>


</table>


</div>





</div>

);


}








// ======================
// STAT CARD
// ======================


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
"bg-green-50 text-green-500"

};



return(

<div className="
bg-white
border
border-gray-100
rounded-xl
px-3
py-3
flex
items-center
gap-3
">


<div className={`
w-9
h-9
rounded-lg
flex
items-center
justify-center
${colors[color]}
`}>

{icon}

</div>



<div>

<p className="
text-[11px]
text-gray-500
">

{title}

</p>


<h2 className="
text-lg
font-black
text-slate-900
">

{value}

</h2>


</div>


</div>


)

}







// ======================
// DROPDOWN FILTER
// ======================


function DropdownFilter({
title,
open,
onClick,
children
}){


return(

<div className="
relative
">


<button

onClick={onClick}

className="
w-full
h-11
bg-white
border
border-gray-200
rounded-xl
px-3
flex
items-center
justify-between
text-xs
font-semibold
text-slate-700
"

>

{title}

<FiChevronDown size={14}/>


</button>





{

open &&


<div className="
absolute
top-12
left-0
right-0
bg-white
border
rounded-xl
shadow-lg
z-50
overflow-hidden
">

{children}

</div>


}



</div>


)

}
