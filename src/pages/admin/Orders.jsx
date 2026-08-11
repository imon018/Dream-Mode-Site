import {
  useEffect,
  useState,
  useRef,
  lazy,
  Suspense
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useReactToPrint
} from "react-to-print";


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
  FiPrinter,
  FiDownload,
  FiTrash2,
  FiX,
  FiPlus,
  FiEdit2
} from "react-icons/fi";


import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  sendToSteadfast,
  updateOrderCourier
} from "../../services/orderService";

import { sendOrderToCourrierfast } from "../../services/courrierfastService";

import { useSettings } from "../../context/SettingsContext";


import {
  successToast,
  errorToast
} from "../../components/ui/Toast";

const Invoice58mm = lazy(() => import("../../components/invoice/Invoice58mm"));
const generateInvoicePdf = (order) =>
  import("../../components/invoice/generateInvoicePdf")
    .then((mod) => mod.generateInvoicePdf(order));





export default function Orders(){


const navigate = useNavigate();

const { settings } = useSettings();

// অর্ডারে কাস্টমারের ছবি সেট না থাকলে, বা অ্যাডমিন নিজে
// AddOrder.jsx দিয়ে অর্ডারটা যোগ করে থাকলে (এক্ষেত্রে কোনো
// কাস্টমার প্রোফাইল ছবিই নেই), কাস্টমারের বদলে স্টোরের লোগো
// দেখানো হবে।
const storeLogo = settings?.logoUrl || "/logo.png";

// addedByAdmin ফ্ল্যাগটা এই ফিক্সের আগে তৈরি হওয়া অর্ডারগুলাতে নেই।
// কিন্তু orderSource ("Messenger"/"WhatsApp") ফিল্ডটা শুধু
// AddOrder.jsx-ই সেট করে — কাস্টমারের নিজের চেকআউটে এটা কখনো সেট
// হয় না। তাই এটাকেও "অ্যাডমিন-যোগ করা অর্ডার" চেনার সিগনাল হিসেবে
// ব্যবহার করা হচ্ছে, পুরনো ডেটা মাইগ্রেট না করেই।
const isAdminAddedOrder = (order) =>
  !!(order.addedByAdmin || order.orderSource);

const getOrderAvatar = (order) =>
  isAdminAddedOrder(order)
    ? storeLogo
    : (order.customerPhoto || storeLogo);

const [deleteId,setDeleteId] = useState(null);

// কোন কুরিয়ারে (Steadfast/Courrierfast) পাঠাবে সেটা জিজ্ঞেস করার জন্য —
// "Processing"-এ নেওয়া অর্ডারটা এখানে সাময়িকভাবে রাখা হয়
const [courierPrompt, setCourierPrompt] = useState(null);
// null = কিছু পাঠানো হচ্ছে না, নাহলে "Steadfast" / "Courrierfast" —
// যেই বাটনে ক্লিক করা হয়েছে শুধু সেটাতেই "পাঠানো হচ্ছে..." দেখানোর জন্য
const [sendingCourier, setSendingCourier] = useState(null);

const [page, setPage] = useState(1);

const ordersPerPage = 10;



const [orders,setOrders] =
useState([]);



const [loading,setLoading] =
useState(true);



const [search,setSearch] =
useState("");



const [menuOpen,setMenuOpen] =
useState(null);



// Invoice preview (View) and direct Print, triggered right from the
// three-dot menu — no navigation to OrderDetails.jsx needed for
// either. Download PDF needs no state at all since generateInvoicePdf
// is fully self-contained (draws the PDF directly, no DOM involved).

const [viewOrder,setViewOrder] = useState(null);

const [printOrder,setPrintOrder] = useState(null);

const printRef = useRef(null);

const triggerPrint = useReactToPrint({
  contentRef: printRef,
  documentTitle: `Invoice-${printOrder?.id || "Order"}`,
  onAfterPrint: () => setPrintOrder(null),
});

useEffect(() => {

  if (!printOrder) return;

  // Wait one tick so the hidden Invoice58mm below has actually
  // rendered with the newly-set printOrder before printing it.
  const t = setTimeout(() => {
    triggerPrint();
  }, 100);

  return () => clearTimeout(t);

}, [printOrder]);



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




useEffect(() => {
  setPage(1);
}, [
  search,
  statusFilter,
  paymentFilter,
  dateFilter
]);




// FIX: previously this used a single shared `ref` for BOTH the
// mobile card menu container AND the desktop table menu container.
// Because both are always mounted in the DOM (just hidden with
// CSS classes like `lg:hidden` / `hidden lg:block`), the ref ended
// up pointing at whichever one rendered last — usually the desktop
// version. So on mobile, `menuRef.current` did NOT point at the
// menu that was actually open, `contains(e.target)` returned
// false on every click (even clicks on the menu buttons), and
// `setMenuOpen(null)` fired before the button's own onClick could
// run. That's why View/Print/Download/Delete looked "dead".
//
// Fix: use a data-attribute + `closest()` check instead of a ref.
// This works correctly no matter how many menu containers exist
// in the DOM at once.

	
useEffect(() => {

  const handleClickOutside = (e) => {

    if (!e.target.closest("[data-menu-container]")) {
      setMenuOpen(null);
    }

  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {

    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

  };

}, []);
	


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



	if (status === "Processing") {
  const order = orders.find((o) => o.id === id);

  if (order) {
    // আগে সরাসরি Steadfast-এ পাঠিয়ে দিত — এখন কোন কুরিয়ারে
    // পাঠাবে সেটা অ্যাডমিনকে জিজ্ঞেস করা হয় (মডাল দেখানো হবে)
    setCourierPrompt(order);
  }
}


	



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




// =================================
// কুরিয়ার বেছে নেওয়ার পর সেই কুরিয়ারে পার্সেল পাঠানো
// (courierPrompt মডাল থেকে "Steadfast" বা "Courrierfast" চাপলে এটা চলে)
// =================================

const sendOrderToCourier = async (order, courierName) => {

  setSendingCourier(courierName);

  try {

    // পেমেন্ট মেথড bKash/Nagad-এ আগে থেকেই পুরো টাকা পেইড হলে
    // (paymentStatus === "Paid") কুরিয়ারকে বলা হচ্ছে কিছুই কালেক্ট
    // করতে হবে না — নাহলে ডেলিভারি ম্যান কাস্টমারের কাছ থেকে আবার
    // পুরো টাকা চেয়ে বসবে (ডাবল চার্জ)।
    const codAmount =
      order.paymentStatus === "Paid" ? 0 : order.total;

    let result;

    if (courierName === "Steadfast") {

      result = await sendToSteadfast({
        invoice: order.id,
        recipient_name: order.customerName,
        recipient_phone: order.phone,
        recipient_address:
          `${order.address}, ${order.thana}, ${order.district}`,
        cod_amount: codAmount,
        note: order.notes || "",
      });

    } else if (courierName === "Courrierfast") {

      result = await sendOrderToCourrierfast(order);

    }

    console.log(`${courierName} Response:`, result);

    // Courrierfast ভ্যালিডেশন ফেইল হলে "Validation Error" ছাড়া কিছুই
    // দেখা যাচ্ছিল না — আসল কারণটা কোন key-তে আছে সেটা এখনো অজানা,
    // তাই এখানে যত সম্ভব সব জায়গায় (errors/error/data.errors ইত্যাদি)
    // খোঁজা হচ্ছে, আর কিছুই না পেলে পুরো রেসপন্সটাই দেখানো হচ্ছে —
    // যাতে পরের বার এররটা এলে পুরো কারণটা বোঝা যায়।
    if (result?.success === false || result?.status === false || result?.errors) {
      const errorSource =
        result?.errors || result?.error || result?.data?.errors;

      const fieldErrors = errorSource
        ? typeof errorSource === "string"
          ? errorSource
          : Object.values(errorSource).flat().join(", ")
        : "";

      const fallback = fieldErrors
        ? ""
        : JSON.stringify(result);

      throw new Error(
        [result?.message, fieldErrors, fallback]
          .filter(Boolean)
          .join(" — ") || `${courierName} এ পাঠাতে ব্যর্থ`
      );
    }

    successToast(`${courierName}-এ অর্ডার পাঠানো হয়েছে`);

    // পরে দেখার সুবিধার জন্য অর্ডারে কুরিয়ারের নামটা সেভ রাখা হচ্ছে
    try {
      await updateOrderCourier(order.id, courierName);
    } catch (e) {
      console.log(e);
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id ? { ...o, courierName } : o
      )
    );

  } catch (err) {
    console.error(err);
    errorToast(err.message);
  } finally {
    setSendingCourier(null);
    setCourierPrompt(null);
  }

};









const removeOrder = async()=>{


try{


await deleteOrder(deleteId);



setOrders(prev=>

prev.filter(
order=>order.id!==deleteId
)

);



successToast(
"Order deleted successfully"
);



setDeleteId(null);



}

catch(error){


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

paymentFilter==="Cash on Delivery"

?

order.paymentMethod==="COD"

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




const totalPages = Math.max(
  1,
  Math.ceil(filteredOrders.length / ordersPerPage)
);

const currentOrders = filteredOrders.slice(
  (page - 1) * ordersPerPage,
  page * ordersPerPage
);
	




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

<div
className="
flex
items-center
justify-between
mb-4
"
>

<h1
className="
text-2xl
font-black
text-slate-900
"
>

Orders

</h1>

<button
onClick={()=>navigate("/admin/add-order")}
className="
w-9
h-9
rounded-lg
bg-amber-500
text-white
flex
items-center
justify-center
"
>

<FiPlus size={18}/>

</button>

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








	{/* ==========================
        MOBILE ORDER CARD
========================== */}

<div className="
lg:hidden
space-y-3
">

{
currentOrders.map(order=>(

<div
key={order.id}
className="
bg-white
border
border-gray-100
rounded-lg
px-3
py-3
shadow-sm
relative
"
>


{/* TOP ROW */}

<div className="
flex
justify-between
items-center
">

<p className="
font-bold
text-sm
text-slate-900
">

#{order.id?.slice(0,8)}

</p>


<p className="
text-xs
text-gray-500
">

{
new Date(order.createdAt)
.toLocaleDateString()
}

</p>


</div>







{/* CUSTOMER ROW */}

<div className="
mt-2
flex
justify-between
items-center
">


<div className="
flex
items-center
gap-2
">


<img

src={getOrderAvatar(order)}

onError={(e) => {
  e.currentTarget.src = storeLogo;
}}

className="
w-9
h-9
rounded-full
object-cover
"

/>


<div>


<p className="
text-sm
font-semibold
text-slate-800
">

{
order.customerName || "Customer"
}

</p>


<p className="
text-[11px]
text-gray-500
">

{
order.email
}

</p>


</div>


</div>






<div className="
text-right
">


<p className="
text-sm
font-black
text-slate-900
">

৳ {order.total}

</p>


<p className="
text-[11px]
text-gray-500
">

{
order.items?.length || 0
}
 Items

</p>


</div>


</div>








{/* BOTTOM ROW */}

<div className="
mt-3
flex
justify-between
items-center
">


{/* STATUS */}

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

text-[11px]
font-bold
px-3
py-1
rounded-full
outline-none
border-none


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







{/* ACTION */}

<div
data-menu-container
className="
flex
items-center
gap-1
relative
"
>


<button

onClick={()=>navigate(
`/admin/orders/${order.id}`
)}

className="
w-8
h-8
rounded-md
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

onClick={(e)=>{

e.stopPropagation();

setMenuOpen(

menuOpen===order.id

?

null

:

order.id

);

}}

className="
w-8
h-8
rounded-md
bg-gray-100
flex
items-center
justify-center
"

>

<FiMoreVertical size={16}/>

</button>

{
menuOpen===order.id && (

<div

onClick={(e)=>e.stopPropagation()}

className="
absolute
right-0
bottom-10
min-w-[180px]
bg-white
border
border-gray-100
shadow-lg
rounded-md
overflow-hidden
z-50
"

>

<button

onClick={()=>{
setMenuOpen(null);
navigate(`/admin/orders/${order.id}?edit=1`);
}}

className="
w-full
text-left
px-3
py-2
text-xs
hover:bg-gray-50
flex
items-center
gap-2
"

>

<FiEdit2 size={14}/>

<span>Edit</span>

</button>

<button

onClick={()=>{
setMenuOpen(null);
setViewOrder(order);
}}

className="
w-full
text-left
px-3
py-2
text-xs
hover:bg-gray-50
flex
items-center
gap-2
"

>

<FiEye size={14}/>

<span>View</span>

</button>
<button

onClick={()=>{
setMenuOpen(null);
setCourierPrompt(order);
}}

className="
w-full
text-left
px-3
py-2
text-xs
hover:bg-gray-50
flex
items-center
gap-2
"

>

<FiTruck size={14}/>

<span>কুরিয়ারে পাঠান</span>

</button>


<button

onClick={()=>{
setMenuOpen(null);
setPrintOrder(order);
}}

className="
w-full
text-left
px-3
py-2
text-xs
hover:bg-gray-50
flex
items-center
gap-2
"

>

<FiPrinter size={14}/>

<span>Print</span>

</button>

<button

onClick={()=>{
setMenuOpen(null);
generateInvoicePdf(order);
}}

className="
w-full
text-left
px-3
py-2
text-xs
hover:bg-gray-50
flex
items-center
gap-2
"

>

<FiDownload size={14}/>

<span>Download PDF</span>

</button>

<button

onClick={()=>{
setMenuOpen(null);
setDeleteId(order.id);
}}

className="
w-full
text-left
px-3
py-2
text-xs
text-red-600
hover:bg-red-50
flex
items-center
gap-2
"

>

<FiTrash2 size={14}/>

<span>Delete</span>

</button>

</div>

)}

</div>
	

</div>



</div>





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

currentOrders.map(order=>(


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
  src={getOrderAvatar(order)}
  alt={order.customerName || "Customer"}
  className="
    w-8
    h-8
    rounded-full
    object-cover
  "
  onError={(e) => {
    e.currentTarget.src = storeLogo;
  }}
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
px-5
py-4
">


<div
data-menu-container
className="
flex
gap-2
relative
"
>

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

onClick={(e)=>{

e.stopPropagation();

setMenuOpen(

menuOpen===order.id

?

null

:

order.id

);

}}

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

menuOpen===order.id && (

<div

onClick={(e)=>e.stopPropagation()}

className="
absolute
right-0
top-10
min-w-[180px]
bg-white
border
rounded-lg
shadow-lg
z-50
overflow-hidden
"

>

<button

onClick={()=>{
setMenuOpen(null);
navigate(`/admin/orders/${order.id}?edit=1`);
}}

className="
w-full
text-left
px-3
py-2
text-xs
hover:bg-gray-50
flex
items-center
gap-2
"

>

<FiEdit2 size={14}/>

<span>Edit</span>

</button>

<button

onClick={()=>{
setMenuOpen(null);
setViewOrder(order);
}}

className="
w-full
text-left
px-3
py-2
text-xs
hover:bg-gray-50
flex
items-center
gap-2
"

>

<FiEye size={14}/>

<span>View</span>

</button>
<button

onClick={()=>{
setMenuOpen(null);
setCourierPrompt(order);
}}

className="
w-full
text-left
px-3
py-2
text-xs
hover:bg-gray-50
flex
items-center
gap-2
"

>

<FiTruck size={14}/>

<span>কুরিয়ারে পাঠান</span>

</button>


<button

onClick={()=>{
setMenuOpen(null);
setPrintOrder(order);
}}

className="
w-full
text-left
px-3
py-2
text-xs
hover:bg-gray-50
flex
items-center
gap-2
"

>

<FiPrinter size={14}/>

<span>Print</span>

</button>

<button

onClick={()=>{
setMenuOpen(null);
generateInvoicePdf(order);
}}

className="
w-full
text-left
px-3
py-2
text-xs
hover:bg-gray-50
flex
items-center
gap-2
"

>

<FiDownload size={14}/>

<span>Download PDF</span>

</button>

<button

onClick={()=>{
setMenuOpen(null);
setDeleteId(order.id);
}}

className="
w-full
text-left
px-3
py-2
text-xs
text-red-600
hover:bg-red-50
flex
items-center
gap-2
"

>

<FiTrash2 size={14}/>

<span>Delete</span>

</button>

</div>

)

}

</div>


</td>





</tr>


))


}


</tbody>


</table>


</div>








	{totalPages > 1 && (

<div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

<button
disabled={page===1}
onClick={()=>setPage(page-1)}
className="px-4 py-2 rounded-lg border disabled:opacity-40"
>
Previous
</button>

{[...Array(totalPages)].map((_, index) => {

const pageNumber = index + 1;

const showPage =
pageNumber === 1 ||
pageNumber === totalPages ||
Math.abs(pageNumber - page) <= 1;

const showDots =
(pageNumber === 2 && page > 4) ||
(pageNumber === totalPages - 1 && page < totalPages - 3);

if (showDots) {
return (
<span key={pageNumber} className="px-2">
...
</span>
);
}

if (!showPage) return null;

return (
<button
key={pageNumber}
onClick={() => setPage(pageNumber)}
className={`w-10 h-10 rounded-lg font-bold ${
page === pageNumber
? "bg-amber-500 text-white"
: "bg-white border border-gray-200"
}`}
>
{pageNumber}
</button>
);

})}

<button
disabled={page===totalPages}
onClick={()=>setPage(page+1)}
className="px-4 py-2 rounded-lg border disabled:opacity-40"
>
Next
</button>

</div>

)}





	


{
courierPrompt && (

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
w-[320px]
shadow-xl
"
>

<h3
className="
font-black
text-lg
text-slate-900
"
>
কুরিয়ার বেছে নিন
</h3>

<p
className="
text-sm
text-gray-500
mt-2
"
>
অর্ডার #{courierPrompt.id} — কোন কুরিয়ারে পার্সেলটা পাঠাবেন?
{courierPrompt.paymentStatus === "Paid" && (
  <span className="block mt-1 text-emerald-600 font-semibold">
    পেমেন্ট আগে থেকেই পেইড — cod_amount 0 যাবে।
  </span>
)}
</p>

<div className="flex flex-col gap-2 mt-4">

<button
disabled={!!sendingCourier}
onClick={() =>
  sendOrderToCourier(courierPrompt, "Steadfast")
}
className="
w-full
py-2.5
rounded-lg
bg-blue-600
text-white
font-bold
disabled:opacity-50
"
>
{sendingCourier === "Steadfast" ? "পাঠানো হচ্ছে..." : "Steadfast-এ পাঠান"}
</button>

<button
disabled={!!sendingCourier}
onClick={() =>
  sendOrderToCourier(courierPrompt, "Courrierfast")
}
className="
w-full
py-2.5
rounded-lg
bg-orange-500
text-white
font-bold
disabled:opacity-50
"
>
{sendingCourier === "Courrierfast" ? "পাঠানো হচ্ছে..." : "Courrierfast-এ পাঠান"}
</button>

<button
disabled={!!sendingCourier}
onClick={() => setCourierPrompt(null)}
className="
w-full
py-2
rounded-lg
bg-gray-100
text-gray-600
font-semibold
disabled:opacity-50
"
>
বাতিল করুন
</button>

</div>

</div>

</div>

)
}




{
deleteId && (

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
w-[300px]
shadow-xl
"

>


<h3

className="
font-black
text-lg
text-slate-900
"

>
Delete Order?
</h3>



<p

className="
text-sm
text-gray-500
mt-2
"

>
Are you sure you want to delete?
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
bg-gray-200
font-bold
text-sm
"

>
No
</button>





<button

onClick={removeOrder}

className="
flex-1
h-10
rounded-lg
bg-red-500
text-white
font-bold
text-sm
"

>
Yes
</button>



</div>


</div>


</div>

)
}


{/* Hidden node used only to feed react-to-print when Print is
    clicked from the three-dot menu — never shown on screen. */}

<div
aria-hidden="true"
style={{
position: "absolute",
top: 0,
left: 0,
overflow: "hidden",
width: 0,
height: 0,
}}
>

<div ref={printRef}>

{printOrder && (
<Suspense fallback={null}>
<Invoice58mm order={printOrder}/>
</Suspense>
)}

</div>

</div>


{/* View: invoice preview modal, opened directly from the
    three-dot menu — no navigation to OrderDetails.jsx. */}

{
viewOrder && (

<div

className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
z-[100]
p-4
"

>


<div

className="
bg-white
rounded-xl
shadow-xl
max-h-[90vh]
overflow-y-auto
relative
"

>

<button

onClick={()=>setViewOrder(null)}

className="
sticky
top-2
float-right
mr-2
w-8
h-8
rounded-full
bg-white
border
border-gray-200
shadow
flex
items-center
justify-center
z-10
"

>

<FiX size={16}/>

</button>

<div className="clear-both">

<Suspense fallback={<div className="p-6 text-sm text-gray-400">Loading…</div>}>
<Invoice58mm order={viewOrder}/>
</Suspense>

</div>

<div

className="
flex
gap-2
p-3
border-t
"

>

<button

onClick={()=>{
setViewOrder(null);
setPrintOrder(viewOrder);
}}

className="
flex-1
h-10
rounded-lg
bg-amber-500
text-white
font-bold
text-sm
flex
items-center
justify-center
gap-2
"

>

<FiPrinter size={14}/>

Print

</button>

<button

onClick={()=>{
generateInvoicePdf(viewOrder);
}}

className="
flex-1
h-10
rounded-lg
bg-emerald-600
text-white
font-bold
text-sm
flex
items-center
justify-center
gap-2
"

>

<FiDownload size={14}/>

PDF

</button>

</div>

</div>


</div>

)
}


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
