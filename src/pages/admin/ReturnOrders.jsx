import {
  useEffect,
  useState
} from "react";


import {
  useNavigate
} from "react-router-dom";


import {
  FiSearch,
  FiEye,
  FiCalendar,
  FiShoppingBag,
  FiSend,
  FiCheckCircle,
  FiMoreVertical,
  FiTrash2,
  FiDollarSign
} from "react-icons/fi";


import {
  getReturnOrders,
  updateReturnStatus,
  deleteOrder
} from "../../services/orderService";


import {
  successToast,
  errorToast
} from "../../components/ui/Toast";





export default function ReturnOrders(){


const navigate = useNavigate();



const [orders,setOrders] = useState([]);


const [loading,setLoading] = useState(true);


const [search,setSearch] = useState("");


const [menuOpen,setMenuOpen] = useState(null);


const [deleteId,setDeleteId] = useState(null);


const [statusFilter,setStatusFilter] =
useState("All Status");


const [dateFilter,setDateFilter] =
useState("");





const statuses = [

"All Status",
"Submitted",
"Accepted",
"Rejected",
"Picked Up",
"Reviewing",
"Shipped",
"Exchanged",
"Refunded"

];








useEffect(()=>{

loadReturns();

},[]);









async function loadReturns(){


try{


const data =
await getReturnOrders();


setOrders(data || []);


}

catch(error){


console.log(error);


errorToast(
"Failed to load return orders"
);


}

finally{


setLoading(false);


}


}









async function changeStatus(id,status){


try{


await updateReturnStatus(
id,
status
);



setOrders(prev=>

prev.map(order=>{


if(order.id===id){


return {

...order,


returnRequest:{

...order.returnRequest,

status

}

};


}


return order;


})

);



successToast(
"Return status updated"
);



}

catch(error){


console.log(error);


errorToast(
"Status update failed"
);


}


}









async function handleDelete(){


try{


await deleteOrder(
deleteId
);



setOrders(prev=>

prev.filter(
order=>order.id !== deleteId
)

);



successToast(
"Return order deleted"
);



setDeleteId(null);


}

catch(error){


console.log(error);


errorToast(
"Delete failed"
);


}


}









const filteredOrders =

orders.filter(order=>{


const text =
search.toLowerCase();



const searchMatch =

order.customerName
?.toLowerCase()
.includes(text)

||

order.email
?.toLowerCase()
.includes(text)

||

order.id
?.toLowerCase()
.includes(text);



const status =

order.returnRequest?.status ||
"Submitted";



const statusMatch =

statusFilter==="All Status"

?

true

:

status===statusFilter;



const dateMatch =

dateFilter===""

?

true

:

new Date(
order.returnRequest.createdAt
)
.toISOString()
.slice(0,10)
===dateFilter;



return(

searchMatch &&
statusMatch &&
dateMatch

);


});









if(loading){


return(

<div

className="
min-h-screen
flex
items-center
justify-center
font-bold
"

>

Loading Return Orders...

</div>

);


}


return(


<div

className="
space-y-4
bg-[#faf9f6]
min-h-screen
p-3
lg:p-6
"

>





{/* HEADER */}

<div>


<h1

className="
text-2xl
font-black
text-slate-900
"

>

Return Orders

</h1>



<p

className="
text-xs
text-gray-500
mt-1
"

>

Dashboard › Return Orders

</p>


</div>









{/* STATS */}

<div

className="
grid
grid-cols-2
lg:grid-cols-4
gap-2
"

>


<StatCard

icon={<FiShoppingBag size={18}/>}

title="Total Return"

value={orders.length}

color="orange"

/>





<StatCard

icon={<FiSend size={18}/>}

title="Submitted"

value={
orders.filter(
item =>
item.returnRequest?.status==="Submitted"
).length
}

color="yellow"

/>





<StatCard

icon={<FiCheckCircle size={18}/>}

title="Accepted"

value={
orders.filter(
item =>
item.returnRequest?.status==="Accepted"
).length
}

color="blue"

/>





<StatCard

icon={<FiDollarSign size={18}/>}

title="Refunded"

value={
orders.filter(
item =>
item.returnRequest?.status==="Refunded"
).length
}

color="green"

/>


</div>









{/* SEARCH */}

<div

className="
relative
"

>


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

onChange={
e=>setSearch(e.target.value)
}

placeholder="Search return order..."

className="
w-full
h-12
bg-white
border
border-gray-200
rounded-xl
pl-11
pr-4
outline-none
text-sm
"

/>


</div>









{/* FILTER */}

<div

className="
grid
grid-cols-2
gap-2
"

>



<select

value={statusFilter}

onChange={
e=>setStatusFilter(e.target.value)
}

className="
h-11
bg-white
border
rounded-xl
px-3
text-xs
font-semibold
"

>


{

statuses.map(status=>(


<option

key={status}

value={status}

>

{status}

</option>


))


}


</select>









<div

className="
h-11
bg-white
border
rounded-xl
flex
items-center
px-3
gap-2
"

>


<FiCalendar size={14}/>




<input

type="date"

value={dateFilter}

onChange={
e=>setDateFilter(e.target.value)
}

className="
outline-none
text-xs
w-full
"

/>


</div>


</div>









{/* MOBILE RETURN LIST */}

<div className="
lg:hidden
space-y-3
">

{
filteredOrders.map(order=>(

<div
key={order.id}
className="
bg-white
border
border-gray-100
rounded-xl
p-3
shadow-sm
"
>

<div className="
flex
justify-between
items-center
">

<p className="
font-bold
text-sm
">
#{order.id.slice(0,8)}
</p>


<p className="
text-xs
text-gray-500
">
{
new Date(
order.returnRequest?.createdAt
)
.toLocaleDateString()
}
</p>

</div>


<div className="
mt-3
flex
items-center
gap-3
">

<img
src={
order.customerPhoto ||
`https://ui-avatars.com/api/?name=${encodeURIComponent(order.customerName || "User")}`
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
font-semibold
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


<div className="
mt-3
flex
justify-between
items-center
">


<select
value={order.returnRequest?.status || "Submitted"}
onChange={
e=>changeStatus(
order.id,
e.target.value
)
}
className={`
text-xs
font-bold
px-3
py-2
rounded-full
${statusColor(order.returnRequest?.status)}
`}
>

{
statuses.slice(1).map(status=>(

<option key={status}>
{status}
</option>

))
}

</select>



<div className="
flex
gap-2
">


<button
onClick={()=>
navigate(
`/admin/return-orders/${order.id}`
)
}
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



<div className="
relative
">

<button

onClick={()=>
setMenuOpen(
menuOpen===order.id
?
null
:
order.id
)
}

className="
w-8
h-8
rounded-lg
bg-gray-100
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
bg-white
border
rounded-lg
shadow-lg
w-32
z-50
">

<button

onClick={()=>{

setDeleteId(order.id);

setMenuOpen(null);

}}

className="
w-full
px-3
py-2
text-sm
text-red-600
flex
items-center
gap-2
"
>

<FiTrash2 size={14}/>

Delete

</button>

</div>

}


</div>


</div>


</div>


))

}

</div>









                   {/* DESKTOP TABLE */}

<div

className="
hidden
lg:block
bg-white
rounded-xl
border
overflow-hidden
"

>


<table

className="
w-full
"

>


<thead

className="
bg-gray-50
"

>


<tr>


<th className="
px-5
py-3
text-left
text-xs
">

ID

</th>



<th className="
px-5
py-3
text-left
text-xs
">

Customer

</th>



<th className="
px-5
py-3
text-left
text-xs
">

Date

</th>



<th className="
px-5
py-3
text-left
text-xs
">

Return Type

</th>



<th className="
px-5
py-3
text-left
text-xs
">

Status

</th>



<th className="
px-5
py-3
text-left
text-xs
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
"

>


<td

className="
px-5
py-4
font-bold
text-sm
"

>

#{order.id.slice(0,8)}

</td>







<td

className="
px-5
py-4
text-sm
"

>

{order.customerName}

</td>







<td

className="
px-5
py-4
text-xs
"

>

{

new Date(
order.returnRequest.createdAt
)
.toLocaleDateString()

}

</td>







<td

className="
px-5
py-4
text-sm
"

>

{

order.returnRequest.returnType

}

</td>







<td

className="
px-5
py-4
"

>


<select


value={
order.returnRequest?.status || "Submitted"
}


onChange={

e=>

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

${statusColor(
order.returnRequest?.status
)}

`}

>


{

statuses.slice(1).map(status=>(


<option

key={status}

>

{status}

</option>


))


}


</select>


</td>









<td

className="
px-5
py-4
"

>


<div

className="
flex
items-center
gap-2
"

>


<button

onClick={()=>navigate(
`/admin/return-orders/${order.id}`
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








<div

className="
relative
"

>


<button

onClick={()=>setMenuOpen(
menuOpen===order.id
?
null
:
order.id
)

}

className="
w-8
h-8
rounded-lg
bg-gray-100
flex
items-center
justify-center
"

>

<FiMoreVertical size={15}/>

</button>







{

menuOpen===order.id &&


<div

className="
absolute
right-0
top-10
bg-white
border
rounded-lg
shadow-lg
w-32
z-50
"

>


<button

onClick={()=>{

setDeleteId(order.id);

setMenuOpen(null);

}}

className="
w-full
px-3
py-2
text-sm
text-red-600
flex
items-center
gap-2
"

>

<FiTrash2 size={14}/>

Delete

</button>


</div>


}



</div>


</div>


</td>



</tr>


))


}


</tbody>


</table>


</div>









{/* DELETE CONFIRM MODAL */}



{

deleteId &&


<div

className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
z-[100]
"

>


<div

className="
bg-white
rounded-xl
p-5
w-80
text-center
"

>


<h3

className="
font-black
text-lg
"

>

Are you sure?

</h3>



<p

className="
text-sm
text-gray-500
mt-2
"

>

Delete this return order permanently?

</p>







<div

className="
flex
gap-3
mt-5
"

>


<button

onClick={()=>setDeleteId(null)}

className="
flex-1
h-10
rounded-lg
bg-gray-100
font-bold
"

>

No

</button>







<button

onClick={handleDelete}

className="
flex-1
h-10
rounded-lg
bg-red-500
text-white
font-bold
"

>

Yes

</button>


</div>


</div>


</div>


}


  </div>


);

}









function statusColor(status){


switch(status){


case "Accepted":

return "bg-green-100 text-green-700";



case "Rejected":

return "bg-red-100 text-red-700";



case "Picked Up":

return "bg-blue-100 text-blue-700";



case "Reviewing":

return "bg-purple-100 text-purple-700";



case "Shipped":

return "bg-indigo-100 text-indigo-700";



case "Exchanged":

return "bg-orange-100 text-orange-700";



case "Refunded":

return "bg-emerald-100 text-emerald-700";



default:

return "bg-yellow-100 text-yellow-700";


}


}









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


<div

className="
bg-white
border
border-gray-100
rounded-xl
px-3
py-3
flex
items-center
gap-3
"

>


<div

className={`

w-9
h-9
rounded-lg
flex
items-center
justify-center

${colors[color]}

`}

>

{icon}

</div>







<div>


<p

className="
text-[11px]
text-gray-500
"

>

{title}

</p>




<h2

className="
text-lg
font-black
text-slate-900
"

>

{value}

</h2>


</div>


</div>


);


}
