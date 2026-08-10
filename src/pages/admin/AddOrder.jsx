import {
  useEffect,
  useMemo,
  useState
} from "react";


import {
  useNavigate
} from "react-router-dom";


import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiMap,
  FiFileText,
  FiShoppingBag,
  FiSearch,
  FiX,
  FiPlus,
  FiMinus,
  FiTag,
  FiTruck,
  FiCreditCard,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";


import Button from "../../components/ui/Button";


import {
  getProductsFromDB
} from "../../services/firestoreProductService";


import {
  addOrderByAdmin
} from "../../services/orderService";


import {
  successToast,
  errorToast
} from "../../components/ui/Toast";


import useAuth from "../../hooks/useAuth";

import { getEffectivePrice } from "../../utils/helpers";


const BKASH_NUMBER = "01628464209";
const NAGAD_NUMBER = "01628464209";




export default function AddOrder(){


const navigate = useNavigate();

const { user } = useAuth();


// ---------- ORDER SOURCE ----------
// This is only used internally so the admin can tell where the
// order came from. It is never sent to the customer invoice or
// to the Steadfast courier API.

const [orderSource,setOrderSource]=useState("Messenger");


// ---------- CUSTOMER INFO ----------

const [customerName,setCustomerName]=useState("");

const [phone,setPhone]=useState("");

const [address,setAddress]=useState("");

const [thana,setThana]=useState("");

const [district,setDistrict]=useState("");

const [notes,setNotes]=useState("");


// ---------- PRODUCT SEARCH ----------

const [products,setProducts]=useState([]);

const [search,setSearch]=useState("");

const [selectedProducts,setSelectedProducts]=useState([]);


// ---------- DISCOUNT / DELIVERY ----------

const [discount,setDiscount]=useState(0);

const [deliveryCharge,setDeliveryCharge]=useState(80);


// ---------- PAYMENT METHOD ----------

const [paymentOpen,setPaymentOpen]=useState(true);

const [paymentMethod,setPaymentMethod]=useState("COD");

const [bkashNumber,setBkashNumber]=useState("");
const [bkashTransactionId,setBkashTransactionId]=useState("");

const [nagadNumber,setNagadNumber]=useState("");
const [nagadTransactionId,setNagadTransactionId]=useState("");


const [loading,setLoading] = useState(false);




useEffect(()=>{

loadProducts();

},[]);



async function loadProducts(){

try{

const data = await getProductsFromDB();

setProducts(data);

}
catch(error){

console.log(error);

}

}



const filteredProducts = useMemo(()=>{

if(!search.trim()){

return [];

}

return products.filter(product=>

product.name
?.toLowerCase()
.includes(
search.toLowerCase()
)

);

},[
products,
search,
]);




function addProduct(product){

const exists =
selectedProducts.find(
item=>item.id===product.id
);

if(exists){

setSelectedProducts(prev=>
prev.map(item=>
item.id===product.id
?
{ ...item, quantity: item.quantity+1 }
:
item
)
);

setSearch("");

return;

}

setSelectedProducts(prev=>([

...prev,

{

id:product.id,

name:product.name,

image:product.image,

price:getEffectivePrice(product),

quantity:1,

}

]));

setSearch("");

}



function removeProduct(id){

setSelectedProducts(prev=>

prev.filter(
item=>item.id!==id
)

);

}



function increaseQty(id){

setSelectedProducts(prev=>

prev.map(item=>

item.id===id
?
{ ...item, quantity: item.quantity+1 }
:
item

)

);

}



function decreaseQty(id){

setSelectedProducts(prev=>

prev.map(item=>{

if(item.id!==id){

return item;

}

return{

...item,

quantity: Math.max(1, item.quantity-1),

};

})

);

}



function updatePrice(id,value){

setSelectedProducts(prev=>

prev.map(item=>

item.id===id
?
{ ...item, price: value===""?"":Number(value) }
:
item

)

);

}




const subtotal = useMemo(()=>{

return selectedProducts.reduce(
(sum,item)=>
sum + (Number(item.price)||0) * (Number(item.quantity)||0),
0
);

},[selectedProducts]);


const total =
Math.max(
0,
subtotal - (Number(discount)||0)
) + (Number(deliveryCharge)||0);




const handleSubmit=async(e)=>{

e.preventDefault();


if(
!customerName ||
!phone ||
!address ||
selectedProducts.length===0
){

errorToast(
"Please fill all required fields and add at least one product."
);

return;

}


if(
paymentMethod === "bKash" &&
(!bkashNumber || !bkashTransactionId)
){

errorToast(
"Please provide bKash number and transaction ID"
);

return;

}


if(
paymentMethod === "Nagad" &&
(!nagadNumber || !nagadTransactionId)
){

errorToast(
"Please provide Nagad number and transaction ID"
);

return;

}



try{

setLoading(true);

await addOrderByAdmin({

userId: user?.uid || "",

customerName,

// Internal-only field so the admin dashboard can show where
// the order came from. Not used in the customer invoice or
// in the Steadfast courier payload.
orderSource,

phone,

address,

thana,

district,

notes,

items: selectedProducts.map(item=>({

id: item.id,

name: item.name,

price: Number(item.price)||0,

quantity: Number(item.quantity)||1,

})),

subtotal,

discount: Number(discount)||0,

deliveryCharge: Number(deliveryCharge)||0,

total,

paymentMethod,

paymentStatus:
(paymentMethod === "bKash" || paymentMethod === "Nagad")
?
"Paid"
:
"Pending",

paymentDetails:
paymentMethod === "bKash"
?
{
  accountNumber: bkashNumber,
  transactionId: bkashTransactionId,
}
:
paymentMethod === "Nagad"
?
{
  accountNumber: nagadNumber,
  transactionId: nagadTransactionId,
}
:
null,

status:"Pending",

createdAt:new Date().toISOString()

});



successToast(
"Order added successfully."
);


setOrderSource("Messenger");

setCustomerName("");

setPhone("");

setAddress("");

setThana("");

setDistrict("");

setNotes("");

setSelectedProducts([]);

setDiscount(0);

setDeliveryCharge(80);

setPaymentMethod("COD");

setBkashNumber("");

setBkashTransactionId("");

setNagadNumber("");

setNagadTransactionId("");


}
catch(error){

errorToast(
error.message ||
"Failed to add order."
);

}
finally{

setLoading(false);

}


};




const inputClass=`

w-full

h-12

pl-12

pr-3

rounded-lg

border

border-gray-200

outline-none

text-sm

text-gray-700

placeholder:text-gray-400

focus:border-amber-400

`;




return(

<div

className="

min-h-screen

bg-[#FAF7F2]

p-4

md:p-6

"

>


<div

className="

max-w-4xl

mx-auto

"

>




<div

className="

flex

items-center

justify-between

mb-5

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

Add Order

</h1>



<p

className="

text-gray-500

text-sm

mt-1

"

>

Create a new customer order

</p>


</div>



<div

className="

w-10

h-10

rounded-lg

bg-[#FFF7E8]

flex

items-center

justify-center

text-amber-500

"

>

<FiShoppingBag/>

</div>



</div>



<form

onSubmit={handleSubmit}

className="

bg-white

rounded-lg

p-5

md:p-6

shadow-sm

border

border-gray-100

space-y-4

"

>

{/* ORDER SOURCE */}

<div>


<label

className="

block

font-bold

text-sm

text-[#172033]

mb-2

"

>

Order Source

</label>


<div className="grid grid-cols-2 gap-3">

<button

type="button"

onClick={()=>setOrderSource("Messenger")}

className={

orderSource==="Messenger"

?

"h-11 rounded-lg font-bold text-sm bg-amber-500 text-white"

:

"h-11 rounded-lg font-bold text-sm bg-gray-100 text-gray-600"

}

>

Messenger Order

</button>

<button

type="button"

onClick={()=>setOrderSource("WhatsApp")}

className={

orderSource==="WhatsApp"

?

"h-11 rounded-lg font-bold text-sm bg-amber-500 text-white"

:

"h-11 rounded-lg font-bold text-sm bg-gray-100 text-gray-600"

}

>

WhatsApp Order

</button>

</div>


<p

className="

text-xs

text-gray-400

mt-2

"

>

For admin reference only — this will not appear on the customer invoice or the courier label.

</p>


</div>

{/* CUSTOMER NAME */}

<div>


<label

className="

block

font-bold

text-sm

text-[#172033]

mb-2

"

>

Customer Name

<span className="text-amber-500 ml-1">

*

</span>

</label>


<div className="relative">


<div

className="

absolute

left-3

top-1/2

-translate-y-1/2

w-7

h-7

rounded-md

bg-[#FFF7E8]

flex

items-center

justify-center

text-amber-500

"

>

<FiUser size={15}/>

</div>


<input

className={inputClass}

placeholder="Enter customer name"

value={customerName}

onChange={
e=>setCustomerName(
e.target.value
)
}

/>


</div>


</div>




{/* PHONE */}


<div>


<label

className="

block

font-bold

text-sm

text-[#172033]

mb-2

"

>

Phone Number

<span className="text-amber-500 ml-1">

*

</span>

</label>


<div className="relative">


<div

className="

absolute

left-3

top-1/2

-translate-y-1/2

w-7

h-7

rounded-md

bg-[#FFF7E8]

flex

items-center

justify-center

text-amber-500

"

>

<FiPhone size={15}/>

</div>


<input

className={inputClass}

placeholder="Phone number"

value={phone}

onChange={
e=>setPhone(
e.target.value
)
}

/>


</div>


</div>

  {/* ADDRESS  */}


<div>


<label

className="

block

font-bold

text-sm

text-[#172033]

mb-2

"

>

Address

<span className="text-amber-500 ml-1">

*

</span>

</label>


<div className="relative">


<div

className="

absolute

left-3

top-3

w-7

h-7

rounded-md

bg-[#FFF7E8]

flex

items-center

justify-center

text-amber-500

"

>

<FiMapPin size={15}/>

</div>



<textarea


rows="3"


className="

w-full

pl-12

pt-3

pr-3

rounded-lg

border

border-gray-200

outline-none

text-sm

text-gray-700

placeholder:text-gray-400

focus:border-amber-400

resize-none

"


placeholder="Customer address"


value={address}


onChange={
e=>setAddress(
e.target.value
)
}


/>


</div>


</div>


{/* THANA + DISTRICT */}

<div

className="

grid

grid-cols-1

md:grid-cols-2

gap-4

"

>

<div>

<label

className="

block

font-bold

text-sm

text-[#172033]

mb-2

"

>

Thana / Upazila

</label>

<div className="relative">

<div

className="

absolute

left-3

top-1/2

-translate-y-1/2

w-7

h-7

rounded-md

bg-[#FFF7E8]

flex

items-center

justify-center

text-amber-500

"

>

<FiMap size={15}/>

</div>

<input

className={inputClass}

placeholder="Thana / Upazila"

value={thana}

onChange={
e=>setThana(
e.target.value
)
}

/>

</div>

</div>


<div>

<label

className="

block

font-bold

text-sm

text-[#172033]

mb-2

"

>

District

</label>

<div className="relative">

<div

className="

absolute

left-3

top-1/2

-translate-y-1/2

w-7

h-7

rounded-md

bg-[#FFF7E8]

flex

items-center

justify-center

text-amber-500

"

>

<FiMapPin size={15}/>

</div>

<input

className={inputClass}

placeholder="District"

value={district}

onChange={
e=>setDistrict(
e.target.value
)
}

/>

</div>

</div>

</div>


{/* NOTE */}

<div>

<label

className="

block

font-bold

text-sm

text-[#172033]

mb-2

"

>

Note

</label>

<div className="relative">

<div

className="

absolute

left-3

top-3

w-7

h-7

rounded-md

bg-[#FFF7E8]

flex

items-center

justify-center

text-amber-500

"

>

<FiFileText size={15}/>

</div>

<textarea

rows="2"

className="

w-full

pl-12

pt-3

pr-3

rounded-lg

border

border-gray-200

outline-none

text-sm

text-gray-700

placeholder:text-gray-400

focus:border-amber-400

resize-none

"

placeholder="Additional note (optional)"

value={notes}

onChange={
e=>setNotes(
e.target.value
)
}

/>

</div>

</div>




{/* PRODUCT SEARCH */}


<div>


<label

className="

block

font-bold

text-sm

text-[#172033]

mb-2

"

>

Product

<span className="text-amber-500 ml-1">

*

</span>

</label>


<div className="relative">

<div

className="

absolute

left-3

top-1/2

-translate-y-1/2

w-7

h-7

rounded-md

bg-[#FFF7E8]

flex

items-center

justify-center

text-amber-500

"

>

<FiSearch size={15}/>

</div>

<input

className={inputClass}

placeholder="Search product to add..."

value={search}

onChange={
e=>setSearch(
e.target.value
)
}

/>

</div>


{
filteredProducts.length>0 && (

<div

className="

mt-2

border

border-gray-200

rounded-lg

overflow-hidden

max-h-64

overflow-y-auto

"

>

{

filteredProducts.map(product=>(

<button

key={product.id}

type="button"

onClick={()=>addProduct(product)}

className="

w-full

flex

items-center

gap-3

p-3

border-b

border-gray-100

last:border-b-0

hover:bg-gray-50

text-left

"

>

<img

src={product.image}

className="

w-10

h-10

rounded-md

object-cover

bg-gray-100

"

/>

<div className="flex-1">

<p className="font-bold text-sm">

{product.name}

</p>

<p className="text-xs text-gray-500">

৳ {getEffectivePrice(product)}

</p>

</div>

</button>

))

}

</div>

)
}


{/* SELECTED PRODUCTS */}

<div className="mt-4 space-y-3">

{

selectedProducts.length===0
?
<div

className="

text-sm

text-gray-400

border

border-dashed

border-gray-200

rounded-lg

p-4

text-center

"

>

No product added yet

</div>
:

selectedProducts.map(item=>(

<div

key={item.id}

className="

border

border-gray-200

rounded-lg

p-3

"

>

<div className="flex gap-3">

<img

src={item.image}

className="

w-14

h-14

rounded-md

object-cover

bg-gray-100

"

/>

<div className="flex-1">

<div

className="

flex

items-start

justify-between

gap-2

"

>

<p className="font-bold text-sm">

{item.name}

</p>

<button

type="button"

onClick={()=>removeProduct(item.id)}

className="text-red-500"

>

<FiX size={16}/>

</button>

</div>


<div

className="

flex

items-center

gap-3

mt-3

flex-wrap

"

>

{/* QUANTITY */}

<div

className="

flex

items-center

gap-2

bg-gray-50

border

border-gray-200

rounded-lg

px-2

h-9

"

>

<button

type="button"

onClick={()=>decreaseQty(item.id)}

className="

w-6

h-6

rounded-md

bg-white

border

border-gray-200

flex

items-center

justify-center

"

>

<FiMinus size={12}/>

</button>

<span className="font-bold text-sm w-4 text-center">

{item.quantity}

</span>

<button

type="button"

onClick={()=>increaseQty(item.id)}

className="

w-6

h-6

rounded-md

bg-white

border

border-gray-200

flex

items-center

justify-center

"

>

<FiPlus size={12}/>

</button>

</div>


{/* PRICE */}

<div

className="

flex

items-center

gap-1

bg-gray-50

border

border-gray-200

rounded-lg

px-2

h-9

"

>

<span className="text-xs font-bold text-gray-500">

৳

</span>

<input

type="number"

value={item.price}

onChange={
e=>updatePrice(
item.id,
e.target.value
)
}

className="

w-16

bg-transparent

outline-none

text-sm

font-bold

"

/>

</div>

</div>

</div>

</div>

</div>

))

}

</div>


</div>




{/* DISCOUNT + DELIVERY CHARGE */}


<div

className="

grid

grid-cols-1

md:grid-cols-2

gap-4

"

>


<div>

<label

className="

block

font-bold

text-sm

text-[#172033]

mb-2

"

>

Discount (৳)

</label>

<div className="relative">

<div

className="

absolute

left-3

top-1/2

-translate-y-1/2

w-7

h-7

rounded-md

bg-[#FFF7E8]

flex

items-center

justify-center

text-amber-500

"

>

<FiTag size={15}/>

</div>

<input

type="number"

min="0"

className={inputClass}

placeholder="0"

value={discount}

onChange={
e=>setDiscount(
e.target.value
)
}

/>

</div>

</div>


<div>

<label

className="

block

font-bold

text-sm

text-[#172033]

mb-2

"

>

Delivery Charge

</label>

<div className="relative">

<div

className="

absolute

left-3

top-1/2

-translate-y-1/2

w-7

h-7

rounded-md

bg-[#FFF7E8]

flex

items-center

justify-center

text-amber-500

"

>

<FiTruck size={15}/>

</div>

<select

value={deliveryCharge}

onChange={
e=>setDeliveryCharge(
Number(e.target.value)
)
}

className="

w-full

h-12

pl-12

pr-3

rounded-lg

border

border-gray-200

outline-none

text-sm

text-gray-700

focus:border-amber-400

bg-white

"

>

<option value={80}>Dhaka City - ৳80</option>

<option value={120}>Dhaka Sub Area - ৳120</option>

<option value={150}>Outside Dhaka - ৳150</option>

</select>

</div>

</div>


</div>



{/* ORDER SUMMARY */}

<div

className="

bg-gray-50

border

border-gray-200

rounded-lg

p-4

space-y-2

"

>

<div className="flex justify-between text-sm">

<span className="text-gray-500">Subtotal</span>

<span className="font-bold">৳ {subtotal}</span>

</div>

<div className="flex justify-between text-sm">

<span className="text-gray-500">Discount</span>

<span className="font-bold text-red-500">- ৳ {Number(discount)||0}</span>

</div>

<div className="flex justify-between text-sm">

<span className="text-gray-500">Delivery Charge</span>

<span className="font-bold">৳ {Number(deliveryCharge)||0}</span>

</div>

<div

className="

flex

justify-between

text-base

pt-2

border-t

border-gray-200

"

>

<span className="font-black">Total</span>

<span className="font-black text-amber-600">৳ {total}</span>

</div>

</div>




{/* PAYMENT METHOD */}


<div
className="
bg-gray-50
border
border-gray-200
rounded-lg
p-4
"
>


<button

type="button"

onClick={()=>setPaymentOpen(!paymentOpen)}

className="
w-full
flex
items-center
justify-between
"

>

<span
className="
flex
items-center
gap-2
text-base
font-bold
text-[#172033]
"
>

<FiCreditCard />
Payment Method

</span>


{
paymentOpen
?
<FiChevronUp className="text-gray-500" />
:
<FiChevronDown className="text-gray-500" />
}


</button>




{
paymentOpen && (

<div
className="
mt-4
space-y-3
"
>


{/* BKASH */}

<div

onClick={()=>setPaymentMethod("bKash")}

className={`
flex
items-center
gap-3
p-4
rounded-lg
border
cursor-pointer
transition
${
paymentMethod === "bKash"
?
"border-amber-500 bg-amber-50"
:
"border-gray-200 bg-white hover:border-gray-300"
}
`}

>

<span
className={`
w-5
h-5
rounded-full
border-2
flex-shrink-0
flex
items-center
justify-center
${
paymentMethod === "bKash"
?
"border-amber-500"
:
"border-gray-300"
}
`}
>

{
paymentMethod === "bKash" && (
<span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
)
}

</span>


<span
className="
w-10
h-10
rounded-lg
overflow-hidden
flex-shrink-0
bg-white
border
border-gray-100
"
>
<img
src="/payments/bkash-logo.png"
alt="bKash"
className="w-full h-full object-contain"
/>
</span>


<div>

<p className="font-bold text-sm">
bKash Payment
</p>

<p className="text-xs text-gray-500">
Pay securely using bKash
</p>

</div>


</div>




{
paymentMethod === "bKash" && (

<div
className="
p-4
rounded-lg
bg-white
border
border-gray-200
"
>

<p
className="
font-bold
text-green-600
mb-3
text-sm
"
>
You need to send us ৳ {total}
</p>


<p className="text-xs text-gray-600 mb-1">
Account Type: <span className="font-semibold text-gray-800">Personal</span>
</p>

<p className="text-xs text-gray-600 mb-3">
Account Number: <span className="font-semibold text-gray-800">{BKASH_NUMBER}</span>
</p>


<hr className="border-gray-200 mb-3" />


<label className="block text-xs text-gray-600 mb-1">
Customer's bKash Account Number
</label>

<input

value={bkashNumber}

onChange={e=>setBkashNumber(e.target.value)}

placeholder="01XXXXXXXXX"

className="
w-full
mb-3
px-3
py-2.5
border
border-gray-300
rounded-lg
text-sm
focus:outline-none
focus:border-amber-500
bg-white
"
/>


<label className="block text-xs text-gray-600 mb-1">
bKash Transaction ID
</label>

<input

value={bkashTransactionId}

onChange={e=>setBkashTransactionId(e.target.value)}

placeholder="Ex: 2M7A5"

className="
w-full
px-3
py-2.5
border
border-gray-300
rounded-lg
text-sm
focus:outline-none
focus:border-amber-500
bg-white
"
/>


</div>

)
}




{/* NAGAD */}

<div

onClick={()=>setPaymentMethod("Nagad")}

className={`
flex
items-center
gap-3
p-4
rounded-lg
border
cursor-pointer
transition
${
paymentMethod === "Nagad"
?
"border-amber-500 bg-amber-50"
:
"border-gray-200 bg-white hover:border-gray-300"
}
`}

>

<span
className={`
w-5
h-5
rounded-full
border-2
flex-shrink-0
flex
items-center
justify-center
${
paymentMethod === "Nagad"
?
"border-amber-500"
:
"border-gray-300"
}
`}
>

{
paymentMethod === "Nagad" && (
<span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
)
}

</span>


<span
className="
w-10
h-10
rounded-lg
overflow-hidden
flex-shrink-0
bg-white
border
border-gray-100
"
>
<img
src="/payments/nagad-logo.png"
alt="Nagad"
className="w-full h-full object-contain"
/>
</span>


<div>

<p className="font-bold text-sm">
Nagad Payment
</p>

<p className="text-xs text-gray-500">
Pay securely using Nagad
</p>

</div>


</div>




{
paymentMethod === "Nagad" && (

<div
className="
p-4
rounded-lg
bg-white
border
border-gray-200
"
>

<p
className="
font-bold
text-green-600
mb-3
text-sm
"
>
You need to send us ৳ {total}
</p>


<p className="text-xs text-gray-600 mb-1">
Account Type: <span className="font-semibold text-gray-800">Personal</span>
</p>

<p className="text-xs text-gray-600 mb-3">
Account Number: <span className="font-semibold text-gray-800">{NAGAD_NUMBER}</span>
</p>


<hr className="border-gray-200 mb-3" />


<label className="block text-xs text-gray-600 mb-1">
Customer's Nagad Account Number
</label>

<input

value={nagadNumber}

onChange={e=>setNagadNumber(e.target.value)}

placeholder="01XXXXXXXXX"

className="
w-full
mb-3
px-3
py-2.5
border
border-gray-300
rounded-lg
text-sm
focus:outline-none
focus:border-amber-500
bg-white
"
/>


<label className="block text-xs text-gray-600 mb-1">
Nagad Transaction ID
</label>

<input

value={nagadTransactionId}

onChange={e=>setNagadTransactionId(e.target.value)}

placeholder="Ex: 2M7A5"

className="
w-full
px-3
py-2.5
border
border-gray-300
rounded-lg
text-sm
focus:outline-none
focus:border-amber-500
bg-white
"
/>


</div>

)
}




{/* COD */}

<div

onClick={()=>setPaymentMethod("COD")}

className={`
flex
items-center
gap-3
p-4
rounded-lg
border
cursor-pointer
transition
${
paymentMethod === "COD"
?
"border-amber-500 bg-amber-50"
:
"border-gray-200 bg-white hover:border-gray-300"
}
`}

>

<span
className={`
w-5
h-5
rounded-full
border-2
flex-shrink-0
flex
items-center
justify-center
${
paymentMethod === "COD"
?
"border-amber-500"
:
"border-gray-300"
}
`}
>

{
paymentMethod === "COD" && (
<span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
)
}

</span>


<span
className="
w-10
h-10
rounded-lg
bg-gray-100
flex
items-center
justify-center
text-amber-500
flex-shrink-0
"
>
<FiTruck size={20} />
</span>


<div>

<p className="font-bold text-sm">
Cash on Delivery (COD)
</p>

<p className="text-xs text-gray-500">
Pay when you receive
</p>

</div>


</div>


</div>

)
}


</div>




{/* BUTTON */}



<Button

type="submit"

disabled={loading}

className="
w-full

h-12

rounded-lg

bg-gradient-to-r

from-amber-400

to-amber-500

text-white

font-black

text-sm

shadow-md

disabled:opacity-50

"

>

{

loading

?

"Adding..."

:

"🛒 Add Order"

}

</Button>



</form>

</div>


</div>

);


}
