import {
  FiUsers,
  FiShoppingCart,
  FiBox,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle
} from "react-icons/fi";


import {
  Line,
  Bar
} from "react-chartjs-2";


import { useSettings } from "../../../context/SettingsContext";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);



export default function DesktopDashboard({data}){


const {
  stats,
  orders,
  products
}=data;


const {
  settings,
} = useSettings();


const cards=[

{
title:"Revenue",
value:`৳ ${stats.revenue}`,
icon:<FiDollarSign/>
},


{
title:"Orders",
value:stats.orders,
icon:<FiShoppingCart/>
},


{
title:"Customers",
value:stats.users,
icon:<FiUsers/>
},


{
title:"Products",
value:stats.products,
icon:<FiBox/>
},


];






const revenueData={


labels:[

"Jan",
"Feb",
"Mar",
"Apr",
"May",
"Jun"

],


datasets:[

{

label:"Revenue",

data:[

stats.revenue*.2,

stats.revenue*.35,

stats.revenue*.5,

stats.revenue*.65,

stats.revenue*.8,

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

"Users"

],



datasets:[

{

label:"Overview",

data:[

stats.products,

stats.orders,

stats.users

],


backgroundColor:"#F59E0B",

borderRadius:12

}


]


};








const recentOrders=

[...orders]

.sort(

(a,b)=>

new Date(b.createdAt)

-

new Date(a.createdAt)

)

.slice(0,6);






return (



<div

className="

w-full

min-h-screen

bg-[#FAF7F2]

p-8

"

>





{/* TOP HEADER */}



<div

className="

bg-white

rounded-[32px]

p-8

border

border-gray-100

shadow-sm

mb-8

"

>


<div

className="

flex

justify-between

items-center

"

>


<div>


<p

className="

text-amber-500

font-semibold

"

>

{settings.storeName || ""} Analytics

</p>



<h1

className="

text-4xl

font-bold

mt-2

"

>

Welcome Back, Admin

</h1>



<p

className="

text-gray-500

mt-2

"

>

Manage your store performance and growth.

</p>


</div>




<div

className="

bg-amber-50

rounded-3xl

p-6

"

>


<FiTrendingUp

className="

text-amber-500

text-3xl

"

/>


</div>


</div>


</div>









{/* STAT CARDS */}


<div

className="

grid

grid-cols-4

gap-6

mb-8

"

>


{

cards.map(card=>(


<div

key={card.title}

className="

bg-white

rounded-[30px]

p-6

border

border-gray-100

shadow-sm

hover:shadow-md

transition

"

>


<div

className="

flex

justify-between

"

>


<div>

<p

className="

text-gray-500

text-sm

"

>

{card.title}

</p>


<h2

className="

text-3xl

font-bold

mt-3

"

>

{card.value}

</h2>


</div>



<div

className="

w-14

h-14

rounded-2xl

bg-amber-100

flex

items-center

justify-center

text-amber-500

text-2xl

"

>

{card.icon}

</div>


</div>



</div>


))


}


</div>









{/* CHART AREA */}



<div

className="

grid

grid-cols-2

gap-8

mb-8

"

>



<div

className="

bg-white

rounded-[32px]

p-7

border

border-gray-100

"

>

<h2

className="

text-xl

font-bold

mb-6

"

>

Revenue Overview

</h2>


<Line

data={revenueData}

/>


</div>







<div

className="

bg-white

rounded-[32px]

p-7

border

border-gray-100

"

>

<h2

className="

text-xl

font-bold

mb-6

"

>

Store Overview

</h2>



<Bar

data={overviewData}

/>


</div>



</div>








{/* BOTTOM SECTION */}



<div

className="

grid

grid-cols-3

gap-8

"

>





{/* ORDERS */}


<div

className="

col-span-2

bg-white

rounded-[32px]

p-7

border

border-gray-100

"

>


<h2

className="

text-2xl

font-bold

mb-6

"

>

Recent Orders

</h2>



<table

className="

w-full

"

>


<thead>


<tr

className="

border-b

text-left

text-gray-500

"

>


<th className="py-4">
Customer
</th>


<th>
Status
</th>


<th>
Amount
</th>


<th>
Date
</th>


</tr>


</thead>



<tbody>


{

recentOrders.map(order=>(


<tr

key={order.id}

className="

border-b

"

>


<td className="py-4 font-medium">

{order.customerName}

</td>


<td>

<span

className="

bg-amber-50

text-amber-600

px-3

py-1

rounded-full

text-sm

"

>

{order.status}

</span>

</td>


<td>

৳ {order.total}

</td>



<td>

{

new Date(
order.createdAt
)
.toLocaleDateString()

}

</td>


</tr>



))


}


</tbody>



</table>


</div>







{/* ALERT */}



<div

className="

bg-white

rounded-[32px]

p-7

border

border-gray-100

"

>


<h2

className="

text-xl

font-bold

mb-5

"

>

Inventory Alert

</h2>



<div

className="

bg-red-50

rounded-2xl

p-5

"

>


<FiAlertCircle

className="

text-red-500

text-3xl

mb-3

"

/>


<p

className="

font-semibold

"

>

Low Stock Products

</p>



<p

className="

text-gray-500

text-sm

mt-2

"

>

Check products inventory.

</p>


</div>



</div>






</div>







</div>



);


}
