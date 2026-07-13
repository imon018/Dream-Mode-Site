import {
  FiUsers,
  FiShoppingCart,
  FiBox,
  FiDollarSign,
} from "react-icons/fi";

import {
  Line,
  Bar
} from "react-chartjs-2";



export default function MobileDashboard({data}){


const {
stats,
orders
}=data;




const cards=[

{
title:"Total Users",
value:stats.users,
icon:<FiUsers/>
},

{
title:"Total Orders",
value:stats.orders,
icon:<FiShoppingCart/>
},

{
title:"Total Products",
value:stats.products,
icon:<FiBox/>
},

{
title:"Revenue",
value:`৳ ${stats.revenue}`,
icon:<FiDollarSign/>
}

];





const revenueData={

labels:[
"Week 1",
"Week 2",
"Week 3",
"Week 4"
],

datasets:[

{
label:"Revenue",

data:[
stats.revenue*.25,
stats.revenue*.5,
stats.revenue*.75,
stats.revenue
],

borderColor:"#F59E0B",

backgroundColor:
"rgba(245,158,11,.15)",

fill:true,

tension:.4

}

]

};





const overviewData={

labels:[
"Products",
"Orders",
"Users",
"Admins"
],

datasets:[

{
label:"Overview",

data:[
stats.products,
stats.orders,
stats.users,
stats.admins
],

backgroundColor:"#F59E0B"

}

]

};





const recentOrders =
[...orders]
.sort(
(a,b)=>
new Date(b.createdAt)
-
new Date(a.createdAt)
)
.slice(0,5);





return(

<div className="
min-h-screen
bg-[#FAF7F2]
p-4
text-gray-900
space-y-3
">





{/* HEADER */}

<div className="
bg-white
rounded-lg
p-4
border
border-gray-100
shadow-sm
">


<h1 className="
text-xl
font-bold
">

Welcome back, Admin 👋

</h1>


<p className="
text-xs
text-gray-500
mt-1
">

Here's what's happening with your store today.

</p>


</div>








{/* STATS */}

<div className="
grid
grid-cols-2
gap-3
">


{
cards.map(card=>(


<div

key={card.title}

className="
bg-white
rounded-lg
p-3
border
border-gray-100
shadow-sm
"


>


<div className="
w-9
h-9
rounded-lg
bg-amber-100
text-amber-500
flex
items-center
justify-center
text-lg
">

{card.icon}

</div>




<p className="
text-gray-500
text-xs
mt-3
">

{card.title}

</p>



<h2 className="
text-lg
font-black
mt-1
">

{card.value}

</h2>


</div>


))

}


</div>








{/* REVENUE */}

<div className="
bg-white
rounded-lg
p-4
border
border-gray-100
shadow-sm
">


<h2 className="
font-bold
text-sm
mb-3
">

Revenue Overview

</h2>


<Line
data={revenueData}
/>


</div>









{/* OVERVIEW */}

<div className="
bg-white
rounded-lg
p-4
border
border-gray-100
shadow-sm
">


<h2 className="
font-bold
text-sm
mb-3
">

Store Overview

</h2>


<Bar
data={overviewData}
/>


</div>








{/* RECENT ORDERS */}

<div className="
bg-white
rounded-lg
p-4
border
border-gray-100
shadow-sm
">


<div className="
flex
justify-between
items-center
mb-3
">


<h2 className="
font-bold
text-sm
">

Recent Orders

</h2>


<span className="
text-amber-500
text-xs
">

Latest 5

</span>


</div>






<div className="
space-y-2
">


{

recentOrders.length===0

?

<p className="
text-gray-400
text-center
py-6
text-sm
">

No Orders Found

</p>


:

recentOrders.map(order=>(


<div

key={order.id}

className="
bg-[#FAF7F2]
rounded-lg
p-3
border
border-gray-100
"


>


<div className="
flex
justify-between
items-center
">


<h3 className="
font-semibold
text-sm
">

{order.customerName}

</h3>


<span className="
text-xs
text-amber-600
font-semibold
">

{order.status}

</span>


</div>




<div className="
flex
justify-between
mt-2
">


<p className="
font-bold
text-sm
">

৳ {order.total}

</p>



<p className="
text-xs
text-gray-400
">

{
new Date(
order.createdAt
)
.toLocaleDateString()
}

</p>


</div>


</div>


))


}


</div>


</div>






</div>


);


}
