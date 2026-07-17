import {
  useEffect,
  useState
} from "react";


import {
  useParams,
} from "react-router-dom";


import {
  FiMail,
  FiPhone,
} from "react-icons/fi";


import {
  getUserById
} from "../../services/adminService";


import {
  getUserOrders
} from "../../services/orderService";




export default function UserDetails(){


const { id } = useParams();



const [user,setUser] =
useState(null);


const [orders,setOrders] =
useState([]);


const [loading,setLoading] =
useState(true);





useEffect(()=>{

loadData();

},[]);





async function loadData(){


try{


setLoading(true);



const userData =
await getUserById(id);



setUser(userData);



if(userData?.email){


const orderData =
await getUserOrders(
userData.email
);


setOrders(orderData || []);


}


}
catch(error){

console.log(error);

}
finally{

setLoading(false);

}


}








const totalOrders =
orders.length;



const delivered =
orders.filter(
order=>order.status==="Delivered"
).length;



const processing =
orders.filter(
order=>order.status==="Processing"
).length;



const pending =
orders.filter(
order=>order.status==="Pending"
).length;



const cancelled =
orders.filter(
order=>order.status==="Cancelled"
).length;



const totalSpent =
orders.reduce(
(sum,order)=>
sum + Number(order.total || 0),
0
);








if(loading){

return(

<div
className="
min-h-screen
bg-[#FAF7F2]
flex
items-center
justify-center
font-bold
text-gray-500
"
>

Loading...

</div>

)

}







return(

<div
className="
min-h-screen
bg-[#FAF7F2]
p-4
md:p-8
"
>


<div
className="
max-w-5xl
mx-auto
"
>





<div
className="
mb-6
"
>



<div>

<h1
className="
text-2xl
font-black
text-[#172033]
"
>
User Details
</h1>


<p
className="
text-sm
text-gray-500
"
>
Dashboard › Users
</p>


</div>


</div>






<div
className="
bg-white
rounded-xl
p-5
md:p-6
shadow-sm
border
border-gray-100
mb-5
"
>


<div
className="
flex
items-center
gap-4
"
>


<img

src={
user?.photoURL ||
`https://ui-avatars.com/api/?name=${encodeURIComponent(
user?.name || "User"
)}`
}

className="
w-20
h-20
rounded-full
object-cover
border
"
/>



<div>

<h2
className="
text-xl
font-black
text-[#172033]
"
>

{user?.name || "User"}

</h2>


<p
className="
text-sm
text-gray-500
"
>

{user?.email}

</p>


<span
className="
inline-block
mt-2
px-3
py-1
rounded-lg
text-xs
bg-[#FFF7E8]
text-amber-600
font-semibold
"
>

{user?.role || "User"}

</span>


</div>


</div>






<div
className="
grid
md:grid-cols-2
gap-4
mt-6
"
>


<div
className="
flex
items-center
gap-3
bg-[#FAF7F2]
rounded-xl
p-3
"
>

<FiMail className="text-amber-500"/>

<div>

<p className="text-xs text-gray-500">
Email
</p>

<p className="text-sm font-semibold">
{user?.email}
</p>

</div>

</div>




<div
className="
flex
items-center
gap-3
bg-[#FAF7F2]
rounded-xl
p-3
"
>

<FiPhone className="text-amber-500"/>

<div>

<p className="text-xs text-gray-500">
Phone
</p>


<p className="text-sm font-semibold">
{user?.phone || "Not added"}
</p>


</div>

</div>



</div>


</div>

  {/* ORDER SUMMARY */}


<div
className="
bg-white
rounded-xl
p-5
md:p-6
shadow-sm
border
border-gray-100
mb-5
"
>


<h2
className="
font-black
text-lg
mb-4
text-[#172033]
"
>

Order Summary

</h2>




<div
className="
grid
grid-cols-2
md:grid-cols-3
gap-3
"
>


{
[
["Total Orders",totalOrders],
["Delivered",delivered],
["Processing",processing],
["Pending",pending],
["Cancelled",cancelled],
["Total Spent",`৳${totalSpent}`]
]
.map(
(item,index)=>(


<div

key={index}

className="
bg-[#FAF7F2]
rounded-xl
p-4
"

>


<p
className="
text-xs
text-gray-500
"
>

{item[0]}

</p>


<h3
className="
text-xl
font-black
mt-1
text-[#172033]
"
>

{item[1]}

</h3>


</div>


)

)

}


</div>


</div>








{/* RECENT ORDERS */}


<div
className="
bg-white
rounded-xl
p-5
md:p-6
shadow-sm
border
border-gray-100
"
>


<h2
className="
font-black
text-lg
mb-4
text-[#172033]
"
>

Recent Orders

</h2>





<div
className="
space-y-3
"
>


{

orders
.slice(0,5)
.map(
(order)=>(


<div

key={order.id}

className="
flex
items-center
justify-between
gap-3
bg-[#FAF7F2]
rounded-xl
p-3
"
>


{/* PRODUCT INFO */}


<div
className="
flex
items-center
gap-3
min-w-0
"
>


<img

src={

order.items?.[0]?.image ||

order.items?.[0]?.productImage ||

"https://via.placeholder.com/80"

}

className="
w-14
h-14
rounded-xl
object-cover
border
border-gray-100
"

/>



<div
className="
min-w-0
"
>


<h3
className="
font-bold
text-sm
text-[#172033]
truncate
"
>


{

order.items?.[0]?.name ||

order.items?.[0]?.productName ||

"Product"

}


</h3>




<p
className="
text-xs
text-gray-500
"
>

#

{order.id?.slice(0,10)}

</p>


</div>


</div>








{/* PRICE + STATUS */}


<div
className="
text-right
shrink-0
"
>


<p
className="
font-black
text-sm
text-[#172033]
"
>

৳{order.total || 0}

</p>



<span
className="
text-xs
font-semibold
text-amber-600
"
>

{order.status}

</span>


</div>



</div>


)

)

}


{
orders.length===0 &&

<p
className="
text-center
text-sm
text-gray-500
py-5
"
>

No Orders Found

</p>

}



</div>



</div>







</div>

</div>

);

}
