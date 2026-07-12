import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiSearch,
  FiChevronDown,
  FiEye,
  FiTrash2,
  FiPackage,
  FiClock,
  FiTruck,
  FiCheckCircle,
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



export default function Orders(){


const navigate = useNavigate();



const [orders,setOrders] =
useState([]);


const [loading,setLoading] =
useState(true);



const [search,setSearch] =
useState("");



const [statusFilter,setStatusFilter] =
useState("all");



const [filterOpen,setFilterOpen] =
useState(false);





useEffect(()=>{

loadOrders();

},[]);






const loadOrders = async()=>{


try{


const data =
await getAllOrders();


setOrders(data);



}
catch(error){

console.log(error);

}
finally{

setLoading(false);

}


};








const handleStatusChange =
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



}
catch(error){

console.log(error);

}


};









const handleDeleteOrder =
async(id)=>{


const confirmDelete =
window.confirm(
"Delete this order permanently?"
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
"Order deleted successfully."
);



}
catch(error){


console.log(error);



errorToast(
"Failed to delete order."
);


}



};









const filteredOrders =

orders.filter(order=>{


const matchSearch =


order.customerName
?.toLowerCase()
.includes(
search.toLowerCase()
)


||

order.email
?.toLowerCase()
.includes(
search.toLowerCase()
)

;



const matchStatus =

statusFilter==="all"

?

true

:

order.status===statusFilter;



return (

matchSearch &&
matchStatus

);


});









const totalOrders =
orders.length;



const pendingOrders =
orders.filter(
o=>o.status==="Pending"
).length;




const processingOrders =
orders.filter(
o=>o.status==="Processing"
).length;




const deliveredOrders =
orders.filter(
o=>o.status==="Delivered"
).length;








if(loading){


return(


<div className="
min-h-[60vh]
flex
items-center
justify-center
text-xl
font-bold
">


Loading Orders...


</div>


);


}






return(


<div className="
space-y-6
">


{/* HEADER */}


<div>


<h1 className="
text-3xl
font-black
text-slate-800
">

Order Management

</h1>


<p className="
text-gray-500
mt-1
">

Manage customer orders

</p>


</div>






{/* STATS */}


<div className="
grid
grid-cols-2
lg:grid-cols-4
gap-3
">



<div className="
bg-white
rounded-3xl
p-4
shadow-sm
">

<div className="
w-10
h-10
rounded-xl
bg-blue-50
text-blue-600
flex
items-center
justify-center
">

<FiPackage size={22}/>

</div>


<p className="
text-xs
text-gray-500
mt-3
">

Total Orders

</p>


<h2 className="
text-2xl
font-black
">

{totalOrders}

</h2>


</div>





<div className="
bg-white
rounded-3xl
p-4
">

<div className="
w-10
h-10
rounded-xl
bg-yellow-50
text-yellow-600
flex
items-center
justify-center
">

<FiClock size={22}/>

</div>


<p className="
text-xs
text-gray-500
mt-3
">

Pending

</p>


<h2 className="
text-2xl
font-black
">

{pendingOrders}

</h2>


</div>





<div className="
bg-white
rounded-3xl
p-4
">

<div className="
w-10
h-10
rounded-xl
bg-orange-50
text-orange-600
flex
items-center
justify-center
">

<FiTruck size={22}/>

</div>


<p className="
text-xs
text-gray-500
mt-3
">

Processing

</p>


<h2 className="
text-2xl
font-black
">

{processingOrders}

</h2>


</div>






<div className="
bg-white
rounded-3xl
p-4
">

<div className="
w-10
h-10
rounded-xl
bg-green-50
text-green-600
flex
items-center
justify-center
">

<FiCheckCircle size={22}/>

</div>


<p className="
text-xs
text-gray-500
mt-3
">

Delivered

</p>


<h2 className="
text-2xl
font-black
">

{deliveredOrders}

</h2>


</div>


</div>





{/* SEARCH */}


<div className="
relative
">


<FiSearch

className="
absolute
left-4
top-4
text-gray-400
"

/>


<input

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

placeholder="
Search order/customer...
"

className="
w-full
bg-white
rounded-2xl
py-4
pl-12
pr-4
border
border-gray-200
outline-none
"

/>


</div>






{/* FILTER */}


<div className="
relative
">


<button

onClick={()=>
setFilterOpen(!filterOpen)
}

className="
w-full
bg-white
rounded-2xl
px-5
py-4
border
border-gray-200
flex
items-center
justify-between
"

>


<span>

{
statusFilter==="all"
?
"All Orders"
:
statusFilter
}

</span>


<FiChevronDown/>


</button>



{
filterOpen &&

<div className="
absolute
top-14
left-0
right-0
bg-white
rounded-2xl
shadow-xl
border
z-30
overflow-hidden
">


{
[
"all",
"Pending",
"Processing",
"Shipped",
"Delivered",
"Cancelled"

].map(status=>(


<button

key={status}

onClick={()=>{

setStatusFilter(status);
setFilterOpen(false);

}}

className="
w-full
text-left
px-5
py-3
hover:bg-amber-50
"

>

{
status==="all"
?
"All Orders"
:
status
}

</button>


))

}


</div>


}



</div>

  {/* ORDERS LIST */}

{
filteredOrders.length === 0 ?

(

<div className="
bg-white
rounded-3xl
p-10
text-center
text-gray-500
">

No Orders Found

</div>

)

:

(


<>


{/* =====================
        MOBILE VIEW
===================== */}


<div className="
lg:hidden
space-y-4
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
"


>


<div className="
flex
justify-between
items-start
mb-5
">


<div>


<h3 className="
font-black
text-slate-800
">

#{order.id.slice(0,8)}

</h3>


<p className="
text-sm
text-gray-500
">

{order.customerName}

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

Customer

</span>


<span className="
font-semibold
">

{order.customerName}

</span>


</div>





<div className="
flex
justify-between
">


<span className="
text-gray-500
">

Items

</span>


<span className="
font-bold
">

{
order.items?.length || 0
}

</span>


</div>






<div className="
flex
justify-between
">

<span className="
text-gray-500
">

Total

</span>


<span className="
font-black
text-blue-700
">

৳ {order.total}

</span>


</div>


</div>









<div className="
mt-5
grid
grid-cols-3
gap-2
">


<button

onClick={()=>
navigate(`/admin/orders/${order.id}`)
}

className="
h-11
rounded-xl
bg-blue-50
text-blue-600
flex
items-center
justify-center
"

>

<FiEye size={18}/>

</button>





<select

value={
order.status || "Pending"
}

onChange={(e)=>

handleStatusChange(
order.id,
e.target.value
)

}

className="
rounded-xl
border
px-2
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

onClick={()=>
handleDeleteOrder(order.id)
}

className="
h-11
rounded-xl
bg-red-500
text-white
flex
items-center
justify-center
"

>

<FiTrash2 size={18}/>

</button>



</div>





</div>


))

}


</div>









{/* =====================
        DESKTOP VIEW
===================== */}



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
border-b
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
border-b
hover:bg-gray-50
"

>



<td className="
px-6
py-5
font-bold
">

#{order.id.slice(0,8)}

</td>





<td className="
px-6
py-5
">


<p className="
font-semibold
">

{order.customerName}

</p>


<p className="
text-sm
text-gray-500
">

{order.email}

</p>


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

handleStatusChange(
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

onClick={() =>
navigate(`/admin/orders/${order.id}`)
}

className="
w-10
h-10
rounded-xl
bg-blue-50
text-blue-600
flex
items-center
justify-center
hover:bg-blue-100
"

>


<FiEye/>


</button>







<button

onClick={() =>
handleDeleteOrder(order.id)
}

className="
w-10
h-10
rounded-xl
bg-red-500
text-white
flex
items-center
justify-center
hover:bg-red-600
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
