import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  useReactToPrint,
} from "react-to-print";


import {
  FiPackage,
  FiMapPin,
  FiPhone,
  FiArrowLeft,
  FiCreditCard,
  FiShoppingBag,
  FiTruck,
  FiCheck,
  FiChevronRight,
  FiX,
  FiEye,
  FiPrinter,
  FiDownload,
} from "react-icons/fi";


import {
  getUserOrders,
  requestCancelOrder,
  requestReturnOrder,
} from "../../services/orderService";


import useAuth from "../../hooks/useAuth";


import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";

import { getEffectivePrice } from "../../utils/helpers";

import Invoice58mm from "../../components/invoice/Invoice58mm";
import { generateInvoicePdf } from "../../components/invoice/generateInvoicePdf";




export default function UserOrderDetails(){


const {id}=useParams();

const navigate=useNavigate();


const {user}=useAuth();



const [order,setOrder]=useState(null);


const [loading,setLoading]=useState(true);


const [showCancelModal,setShowCancelModal]=useState(false);


const [showProductsModal, setShowProductsModal] = useState(false);

const [showInvoicePreview, setShowInvoicePreview] = useState(false);

const printRef = useRef(null);

const handlePrint = useReactToPrint({
  contentRef: printRef,
  documentTitle: `Invoice-${id || "Order"}`,
});





useEffect(()=>{

loadOrder();

},[user]);






async function loadOrder(){


try{


if(!user) return;


const orders =
await getUserOrders(
user.uid
);



const found =
orders.find(
item=>item.id===id
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



function currentStep() {

  if (!order) return 0;


  switch(order.status) {


    case "Processing":

      return 1;



    case "Shipped":

      return 2;



    case "Delivered":

      return 3;



    case "Cancelled":

      return -1;



    default:

      return 0;


  }

}

  const steps = [

  {
    name:"Order Placed",
    icon:<FiPackage />,
  },


  {
    name:"Processing",
    icon:<FiPackage />,
  },


  {
    name:"Shipped",
    icon:<FiTruck />,
  },


  {
    name:"Delivered",
    icon:<FiCheck />,
  },

];


async function cancelOrder(){


try{


await requestCancelOrder(
order.id
);



successToast(
"Order cancelled successfully"
);



loadOrder();



}

catch(error){


console.log(error);



errorToast(
error.message ||
"Cancel failed"
);


}


}

if(loading)

return (

<div
className="
min-h-screen
flex
items-center
justify-center
font-bold
"
>

Loading Order...

</div>

);






if(!order)

return (

<div
className="
min-h-screen
flex
items-center
justify-center
font-bold
text-xl
"
>

Order Not Found

</div>

);







async function returnOrder(){


try{


await requestReturnOrder(
order.id
);



successToast(
"Return request sent"
);



loadOrder();



}

catch(error){


errorToast(
"Request failed"
);


}


}








return (

<div
className="
min-h-screen
bg-[#FCFAF5]
px-4
py-5
"
>






{/* CANCEL CONFIRM MODAL */}


{

showCancelModal && (


<div
className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
z-50
px-5
"
>


<div
className="
bg-white
rounded-xl
p-6
w-full
max-w-sm
shadow-xl
"
>


<h3
className="
font-bold
text-lg
mb-3
"
>

Are you sure to Cancel this order?

</h3>



<p
className="
text-sm
text-gray-500
mb-6
"
>

This action cannot be undone.

</p>




<div
className="
grid
grid-cols-2
gap-3
"
>


<button

onClick={()=>setShowCancelModal(false)}

className="
h-11
rounded-lg
border
font-bold
"
>

No

</button>





<button

onClick={async()=>{


setShowCancelModal(false);


await cancelOrder();


}}


className="
h-11
rounded-lg
bg-red-600
text-white
font-bold
"
>

Yes

</button>



</div>



</div>


</div>


)

}






<div
className="
max-w-xl
mx-auto
space-y-4
"
>

  {/* HEADER */}

<div
className="
relative
flex
items-center
justify-center
"
>

  <button

onClick={()=>navigate(-1)}

className="
absolute
left-0
w-10
h-10
rounded-full
bg-white
border
border-gray-100
shadow-sm
flex
items-center
justify-center
"

>

<FiArrowLeft size={22}/>

</button>
  
<h1
className="
font-bold
text-lg
"
>
Order Details
</h1>

</div>





{/* ORDER SUMMARY */}


<div
className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
"
>


<div
className="
flex
justify-between
items-start
"
>



<div>


<div
className="
flex
items-center
gap-3
"
>


<FiPackage
size={38}
className="
text-amber-500
"
/>



<h2
className="
font-black
text-xl
"
>

#{order.id.slice(0,8)}

</h2>


</div>




<p
className="
text-xs
text-gray-500
mt-3
"
>

{new Date(order.createdAt).toLocaleString()}

</p>


</div>







{/* STATUS COLOR */}


<span

className={`
px-3
py-1
rounded-lg
text-xs
font-bold

${
order.status === "Delivered"

?

"bg-green-100 text-green-700"


:

order.status === "Shipped"

?

"bg-blue-100 text-blue-700"



:

order.status === "Processing"

?

"bg-yellow-100 text-yellow-700"



:

order.status === "Pending"

?

"bg-orange-100 text-orange-700"



:

order.status === "Cancelled"

?

"bg-red-100 text-red-700"



:

"bg-gray-100 text-gray-700"

}

`}

>

{order.status}

</span>




</div>


</div>







{/* ORDER TRACKING */}


<div
className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
"
>


<div
className="
flex
items-center
justify-between
mb-8
"
>

<h3
className="
font-bold
"
>

Order Tracking

</h3>


<div
className="
flex
items-center
gap-2
"
>

<button

onClick={()=>setShowInvoicePreview(true)}

className="
w-8
h-8
rounded-lg
bg-slate-700
text-white
flex
items-center
justify-center
"

>

<FiEye size={14}/>

</button>

<button

onClick={handlePrint}

className="
w-8
h-8
rounded-lg
bg-amber-500
text-white
flex
items-center
justify-center
"

>

<FiPrinter size={14}/>

</button>

<button

onClick={()=>generateInvoicePdf(order)}

className="
w-8
h-8
rounded-lg
bg-emerald-600
text-white
flex
items-center
justify-center
"

>

<FiDownload size={14}/>

</button>

</div>


</div>





<div
className="
relative
flex
justify-between
items-start
"
>


<div
className="
absolute
top-5
left-8
right-8
h-[2px]
bg-gray-200
"
>


<div

className="
h-full
bg-amber-500
"

style={{

width:
`${(currentStep()/3)*100}%`

}}

/>


</div>





{

steps.map(

(step,index)=>(


<div

key={step.name}

className="
relative
z-10
flex
flex-col
items-center
w-20
"

>


<div

className={`
w-10
h-10
rounded-full
flex
items-center
justify-center
text-sm
font-bold

${
index <= currentStep() && order.status !== "Cancelled"

?

"bg-amber-500 text-white"

:

"bg-gray-200 text-gray-500"

}

`}

>

{step.icon}

</div>



<p
className="
text-[11px]
text-center
font-semibold
mt-3
"
>

{step.name}

</p>



</div>


)

)

}



</div>


</div>

  {/* ORDER ITEMS */}


<div
className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
"
>


<div className="flex items-center justify-between mb-4">

  <h3 className="font-bold">
    Order Items
  </h3>

  <button
    onClick={() => {

  if ((order.items?.length || 0) === 1) {

    navigate(
      `/product/${
        order.items[0].productId || order.items[0].id
      }`
    );

  } else {

    setShowProductsModal(true);

  }

}}
    className="
      text-xs
      font-bold
      text-amber-600
    "
  >
    View &gt;
  </button>

</div>



<div
className="
space-y-4
"
>


{

order.items?.map(

(item,index)=>(


<div

key={item.id || index}

className="
flex
justify-between
items-center
border-b
border-gray-100
pb-4
"

>


<div

className="
flex
items-center
gap-3
"

>


<img

src={
item.image ||
"https://via.placeholder.com/70"
}

className="
w-16
h-16
rounded-lg
object-cover
bg-gray-50
"

/>



<div>

<h4
className="
font-bold
text-sm
"
>

{item.name}

</h4>


<p
className="
text-xs
text-gray-500
mt-1
"
>

Qty : {item.quantity || 1}

</p>


</div>


</div>





<p
className="
font-black
text-sm
"
>

৳ {getEffectivePrice(item) * (item.quantity || 1)}

</p>



</div>


)

)


}



</div>





{/* PRICE DETAILS */}


<div
className="
mt-6
space-y-3
text-sm
"
>


<div
className="
flex
justify-between
"
>

<span className="text-gray-500">

Subtotal

</span>


<span className="font-semibold">

৳ {order.subtotal || 0}

</span>


</div>





<div
className="
flex
justify-between
"
>

<span className="text-gray-500">

Shipping Charge

</span>


<span className="font-semibold">

৳ {order.deliveryCharge || 0}

</span>


</div>





<div
className="
flex
justify-between
"
>

<span className="text-gray-500">

Discount

</span>


<span
className="
font-semibold
text-red-500
"
>

-৳ {order.discount || 0}

</span>


</div>




<hr
className="
border-gray-100
"
/>





<div
className="
flex
justify-between
font-black
text-lg
"
>


<span>

Total Amount

</span>



<span
className="
text-amber-600
"
>

৳ {order.total}

</span>


</div>



</div>


</div>






{/* SHIPPING ADDRESS */}



<div
className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
"
>


<div
className="
flex
items-center
gap-2
mb-4
"
>


<FiMapPin
className="text-amber-500"
/>


<h3 className="font-bold">

Shipping Address

</h3>


</div>





<div
className="
space-y-2
text-sm
"
>


<p className="font-bold">

{order.customerName || user?.name}

</p>



<p>

{order.address || user?.address || "No Address"}

</p>



<p>

{order.postOffice || user?.postOffice}

</p>



<p>

{order.thana || user?.thana}

</p>



<p>

{order.district || user?.district}

</p>





<div
className="
flex
items-center
gap-2
pt-2
"
>


<FiPhone size={15}/>


<span>

{order.phone || user?.phone}

</span>


</div>



</div>


</div>

  {/* PAYMENT METHOD */}


<div
className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
"
>


<div
className="
flex
items-center
gap-2
mb-4
"
>


<FiCreditCard
className="text-green-600"
/>



<h3 className="font-bold">

Payment Method

</h3>


</div>





<div
className="
flex
items-center
justify-between
"
>


<div>


<p
className="
font-semibold
text-sm
"
>

{order.paymentMethod || "Cash On Delivery"}

</p>



<p
className="
text-xs
text-gray-500
mt-1
"
>

Payment Status

</p>



</div>





<span
className="
px-3
py-1.5
rounded-lg
bg-green-100
text-green-700
text-xs
font-bold
"
>

{order.paymentStatus || "Pending"}

</span>



</div>


</div>







{/* ACTIONS */}



<div
className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
"
>


<h3
className="
font-bold
mb-4
"
>

Actions

</h3>





<div
className={

(
order.status === "Pending" ||
order.status === "Processing" ||
order.status === "Delivered"

)

?

"grid grid-cols-2 gap-3"

:

""

}

>





{

(
order.status === "Pending" ||
order.status === "Processing"

)

&&


(


<button

onClick={()=>setShowCancelModal(true)}

className="
h-12
rounded-lg
border
border-red-500
text-red-600
font-bold
"

>

Cancel Order

</button>


)



}




{
order.status === "Delivered"

&&

(

<button

onClick={()=>{

navigate(
`/return-order/${order.id}`
);

}}

className="
h-12
rounded-lg
border
border-red-500
text-red-600
font-bold
"

>

Return Order

</button>

)

}



<button


onClick={()=>{


if(order.items?.length === 1){


navigate(

`/product/${

order.items[0].productId ||
order.items[0].id

}`

);


}

else{


navigate("/shop");


}


}}



className="
h-12
w-full
rounded-lg
bg-black
text-white
font-bold
flex
items-center
justify-center
gap-2
"

>


<FiShoppingBag />


Buy Again


</button>




</div>


</div>





  {showProductsModal && (
  <div className="fixed inset-0 z-[999] bg-black/40 flex items-end">

    <div className="bg-white w-full rounded-t-3xl max-h-[80vh] flex flex-col">

      <div
        className="
          flex-1
          overflow-y-auto
          p-5
          pb-[calc(8rem+env(safe-area-inset-bottom))]
        "
      >

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-lg font-bold">
            Order Products
          </h2>

          <button
            onClick={() => setShowProductsModal(false)}
          >
            <FiX size={22}/>
          </button>

        </div>

        <div className="space-y-3">

          {order.items?.map((item,index)=>(

            <button
              key={item.id || index}
              onClick={()=>{
                setShowProductsModal(false);

                navigate(
                  `/product/${item.productId || item.id}`
                );
              }}
              className="
                w-full
                flex
                items-center
                justify-between
                border
                rounded-xl
                p-3
              "
            >

              <div className="flex items-center gap-3">

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
                  "
                />

                <div className="text-left">

                  <p className="font-bold">
                    {item.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    Qty : {item.quantity}
                  </p>

                </div>

              </div>

              <FiChevronRight size={20}/>

            </button>

          ))}

        </div>

      </div>

    </div>

  </div>
)}


{/* Hidden node used only to feed react-to-print — never shown
    on screen. */}

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

{order && (
<Invoice58mm order={order}/>
)}

</div>

</div>


{/* View: invoice preview modal */}

{
showInvoicePreview && order && (

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

onClick={()=>setShowInvoicePreview(false)}

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

<Invoice58mm order={order}/>

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
setShowInvoicePreview(false);
handlePrint();
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

onClick={()=>generateInvoicePdf(order)}

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

</div>


);

}

