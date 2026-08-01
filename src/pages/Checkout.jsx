import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  trackInitiateCheckout,
  trackPurchase,
} from "../utils/facebookPixel";

import {
  FiUser,
  FiPhone,
  FiHome,
  FiMap,
  FiMapPin,
  FiFileText,
  FiCreditCard,
  FiChevronDown,
  FiChevronUp,
  FiTruck,
  FiPlus,
  FiMinus,
} from "react-icons/fi";

import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import { getEffectivePrice } from "../utils/helpers";

import Button from "../components/ui/Button";

import {
  createOrder,
} from "../services/orderService";

import {
  successToast,
  errorToast,
} from "../components/ui/Toast";



const BKASH_NUMBER = "01628464209";
const NAGAD_NUMBER = "01628464209";



export default function Checkout(){


  const {
    cart,
    clearCart,
    updateQuantity,
  } = useCart();



  const {
    user,
  } = useAuth();



  const navigate =
    useNavigate();



  // ---------- ORDER FORM ----------

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    thana: "",
    district: "",
    notes: "",
  });



  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };



  // ---------- DELIVERY CHARGE ----------

  const [deliveryCharge, setDeliveryCharge] = useState(80);



  // ---------- PAYMENT METHOD ----------

  const [paymentOpen, setPaymentOpen] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [bkashNumber, setBkashNumber] = useState("");
  const [bkashTransactionId, setBkashTransactionId] = useState("");

  const [nagadNumber, setNagadNumber] = useState("");
  const [nagadTransactionId, setNagadTransactionId] = useState("");



  const [
    loading,
    setLoading
  ] = useState(false);

  const [orderClicked, setOrderClicked] = useState(false);





  useEffect(()=>{

    if(user){

      setFormData(prev=>({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      }));

    }

  },[user]);



  const subtotal =
    cart.reduce(
      (sum,item)=>
      sum +
      getEffectivePrice(item) *
      (item.quantity || 1),
      0
    );



  const total =
    subtotal + deliveryCharge;



useEffect(() => {
  if (cart.length === 0) return;

  trackInitiateCheckout(total, cart);
}, [cart, total]);




  const handleOrder =
  async()=>{


    if(loading)
      return;


    setOrderClicked(true);




    if(cart.length === 0){

      errorToast(
        "Cart is empty"
      );

      return;

    }





    if(
      !formData.name ||
      !formData.phone ||
      !formData.address
    ){

      errorToast(
        "Please fill required information"
      );

      return;

    }




    if(
      paymentMethod === "bKash" &&
      (!bkashNumber || !bkashTransactionId)
    ){

      errorToast(
        "Please provide your bKash number and transaction ID"
      );

      return;

    }



    if(
      paymentMethod === "Nagad" &&
      (!nagadNumber || !nagadTransactionId)
    ){

      errorToast(
        "Please provide your Nagad number and transaction ID"
      );

      return;

    }




    try{


      setLoading(true);



      const orderId =
      await createOrder({

        ...(user ? { userId:user.uid } : {}),

        customerName:formData.name,

        phone:formData.phone,

        address:formData.address,

        thana:formData.thana,

        district:formData.district,

        notes:formData.notes,

        deliveryCharge,

        items:cart,

        subtotal,

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

        createdAt:
        new Date()
        .toISOString(),

      });




      successToast(
        "Order placed successfully"
      );

      trackPurchase({
        id: orderId,
        items: cart,
        total,
      });

      clearCart();



      navigate(
        "/order-success",
        {
          state:{
            orderId
          }
        }
      );



    }

    catch(error){

      errorToast(
        error.message ||
        "Order failed"
      );

    }

    finally{

      setLoading(false);

    }


  };




  return (

<div
className="
min-h-screen
bg-[#FCFAF5]
px-4
md:px-8
py-12
"
>



<div
className="
max-w-3xl
mx-auto
"
>




{/* HEADER */}


<div
className="
text-center
mb-10
"
>


<div
className="
inline-flex
px-5
py-2
rounded-full
border
border-amber-500
text-amber-600
font-bold
bg-white
shadow-sm
"
>

Checkout

</div>



<h1
className="
mt-5
text-4xl
md:text-6xl
font-black
text-black
"
>

Complete Your Order

</h1>


<p
className="
mt-3
text-gray-500
"
>
Premium shopping experience
</p>


</div>






{/* ORDER FORM */}


<div
className="
bg-gray-50
px-5
pt-5
pb-5
"
>


<h2
className="
text-2xl
font-black
text-center
mb-5
"
>
Order Information
</h2>




<div className="relative mb-3">

<FiUser
className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"
/>

<input

name="name"

value={formData.name}

onChange={handleChange}

placeholder="Full Name *"

className="
w-full
pl-10
pr-4
py-3
border
border-gray-300
rounded-lg
focus:outline-none
focus:border-amber-500
focus:ring-2
focus:ring-amber-500/20
bg-white
"
/>

</div>




<div className="relative mb-3">

<FiPhone
className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"
/>

<input

name="phone"

value={formData.phone}

onChange={handleChange}

placeholder="Phone Number *"

className="
w-full
pl-10
pr-4
py-3
border
border-gray-300
rounded-lg
focus:outline-none
focus:border-amber-500
focus:ring-2
focus:ring-amber-500/20
bg-white
"
/>

</div>




<div className="relative mb-3">

<FiHome
className="
absolute
left-3
top-4
text-gray-400
"
/>

<textarea

name="address"

value={formData.address}

onChange={handleChange}

placeholder="Shipping Address *"

rows="3"

className="
w-full
pl-10
pr-4
py-3
border
border-gray-300
rounded-lg
resize-none
focus:outline-none
focus:border-amber-500
focus:ring-2
focus:ring-amber-500/20
bg-white
"
/>

</div>




<div className="relative mb-3">

<FiMap
className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"
/>

<input

name="thana"

value={formData.thana}

onChange={handleChange}

placeholder="Thana / Upazila"

className="
w-full
pl-10
pr-4
py-3
border
border-gray-300
rounded-lg
focus:outline-none
focus:border-amber-500
focus:ring-2
focus:ring-amber-500/20
bg-white
"
/>

</div>




<div className="relative mb-3">

<FiMapPin
className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"
/>

<input

name="district"

value={formData.district}

onChange={handleChange}

placeholder="District"

className="
w-full
pl-10
pr-4
py-3
border
border-gray-300
rounded-lg
focus:outline-none
focus:border-amber-500
focus:ring-2
focus:ring-amber-500/20
bg-white
"
/>

</div>




<div className="relative">

<FiFileText
className="
absolute
left-3
top-4
text-gray-400
"
/>

<textarea

name="notes"

value={formData.notes}

onChange={handleChange}

placeholder="Additional Notes (optional)"

rows="3"

className="
w-full
pl-10
pr-4
py-3
border
border-gray-300
rounded-lg
resize-none
focus:outline-none
focus:border-amber-500
focus:ring-2
focus:ring-amber-500/20
bg-white
"
/>

</div>


</div>



<div
className="
border-t
border-gray-200
"
></div>




{/* DELIVERY CHARGE */}


<div
className="
bg-gray-50
px-5
py-5
"
>

<div
className="
bg-white
border
border-gray-200
rounded-lg
p-5
"
>

<h2
className="
text-xl
font-bold
mb-4
"
>
Delivery Charge
</h2>

<select

value={deliveryCharge}

onChange={(e)=>
setDeliveryCharge(
Number(e.target.value)
)
}

className="
w-full
border
border-gray-300
rounded-lg
px-4
py-3
outline-none
focus:border-amber-500
"

>

<option value={80}>
Dhaka City - ৳80
</option>

<option value={100}>
Dhaka Sub Area - ৳100
</option>

<option value={120}>
Outside Dhaka - ৳120
</option>

</select>

</div>

</div>



<div
className="
border-t
border-gray-200
"
></div>




{/* ORDER SUMMARY */}


<div
className="
bg-gray-50
px-5
py-5
"
>

<div
className="
bg-white
border
border-gray-200
rounded-lg
p-5
"
>

<h2
className="
text-xl
font-bold
mb-4
"
>

Order Summary

</h2>



<div
className="
space-y-4
"
>


{
cart.map(item=>(


<div
key={item.id}
className="
flex
gap-4
items-center
border-b
border-gray-100
pb-4
"
>


<img

src={item.image}

className="
w-16
h-16
rounded-lg
object-cover
"

/>



<div
className="
flex-1
"
>

<h3
className="
font-bold
text-sm
"
>
{item.name}
</h3>


<div
className="
flex
items-center
gap-1
mt-1
"
>

<span
className="
text-xs
text-gray-500
"
>
Quantity:
</span>

<button

type="button"

onClick={()=>
updateQuantity(
item.id,
Math.max(1, (item.quantity || 1) - 1)
)
}

disabled={(item.quantity || 1) <= 1}

className="
w-5
h-5
flex
items-center
justify-center
rounded-md
border
border-gray-300
text-gray-600
disabled:opacity-40
disabled:cursor-not-allowed
hover:border-amber-500
hover:text-amber-600
transition
"

>
<FiMinus size={10} />
</button>

<span
className="
w-5
text-center
text-xs
font-bold
"
>
{item.quantity}
</span>

<button

type="button"

onClick={()=>
updateQuantity(
item.id,
(item.quantity || 1) + 1
)
}

className="
w-5
h-5
flex
items-center
justify-center
rounded-md
border
border-gray-300
text-gray-600
hover:border-amber-500
hover:text-amber-600
transition
"

>
<FiPlus size={10} />
</button>

</div>


</div>


<p
className="
font-black
"
>
৳{getEffectivePrice(item) * item.quantity}
</p>


</div>


))
}


</div>




<div
className="
mt-5
space-y-3
"
>


<div
className="
flex
justify-between
"
>

<span>
Sub Total
</span>

<span>
৳{subtotal}
</span>


</div>




<div
className="
flex
justify-between
"
>

<span>
Delivery Charge
</span>

<span>
৳{deliveryCharge}
</span>


</div>



<hr className="border-gray-200" />



<div
className="
flex
justify-between
text-lg
font-black
"
>

<span>
Total
</span>


<span
className="
text-amber-600
"
>
৳{total}
</span>


</div>


</div>


</div>

</div>



<div
className="
border-t
border-gray-200
"
></div>




{/* PAYMENT METHOD */}


<div
className="
bg-gray-50
px-5
py-5
"
>

<div
className="
bg-white
border
border-gray-200
rounded-lg
p-5
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
text-xl
font-bold
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

<p className="font-bold">
bKash Payment
</p>

<p className="text-sm text-gray-500">
Pay securely using bKash
</p>

</div>


</div>




{
paymentMethod === "bKash" && (

<div
className="
p-5
rounded-lg
bg-gray-50
border
border-gray-200
"
>

<p
className="
font-bold
text-green-600
mb-4
"
>
You need to send us ৳ {total}
</p>


<p className="text-sm text-gray-600 mb-1">
Account Type: <span className="font-semibold text-gray-800">Personal</span>
</p>

<p className="text-sm text-gray-600 mb-4">
Account Number: <span className="font-semibold text-gray-800">{BKASH_NUMBER}</span>
</p>


<hr className="border-gray-200 mb-4" />


<label className="block text-sm text-gray-600 mb-1">
Your bKash Account Number
</label>

<input

value={bkashNumber}

onChange={e=>setBkashNumber(e.target.value)}

placeholder="01XXXXXXXXX"

className="
w-full
mb-4
px-4
py-3
border
border-gray-300
rounded-lg
focus:outline-none
focus:border-amber-500
bg-white
"
/>


<label className="block text-sm text-gray-600 mb-1">
Your bKash Transaction ID
</label>

<input

value={bkashTransactionId}

onChange={e=>setBkashTransactionId(e.target.value)}

placeholder="Ex: 2M7A5"

className="
w-full
px-4
py-3
border
border-gray-300
rounded-lg
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

<p className="font-bold">
Nagad Payment
</p>

<p className="text-sm text-gray-500">
Pay securely using Nagad
</p>

</div>


</div>




{
paymentMethod === "Nagad" && (

<div
className="
p-5
rounded-lg
bg-gray-50
border
border-gray-200
"
>

<p
className="
font-bold
text-green-600
mb-4
"
>
You need to send us ৳ {total}
</p>


<p className="text-sm text-gray-600 mb-1">
Account Type: <span className="font-semibold text-gray-800">Personal</span>
</p>

<p className="text-sm text-gray-600 mb-4">
Account Number: <span className="font-semibold text-gray-800">{NAGAD_NUMBER}</span>
</p>


<hr className="border-gray-200 mb-4" />


<label className="block text-sm text-gray-600 mb-1">
Your Nagad Account Number
</label>

<input

value={nagadNumber}

onChange={e=>setNagadNumber(e.target.value)}

placeholder="01XXXXXXXXX"

className="
w-full
mb-4
px-4
py-3
border
border-gray-300
rounded-lg
focus:outline-none
focus:border-amber-500
bg-white
"
/>


<label className="block text-sm text-gray-600 mb-1">
Your Nagad Transaction ID
</label>

<input

value={nagadTransactionId}

onChange={e=>setNagadTransactionId(e.target.value)}

placeholder="Ex: 2M7A5"

className="
w-full
px-4
py-3
border
border-gray-300
rounded-lg
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

<p className="font-bold">
Cash on Delivery (COD)
</p>

<p className="text-sm text-gray-500">
Pay when you receive
</p>

</div>


</div>


</div>

)
}


</div>

</div>



<div
className="
border-t
border-gray-200
"
></div>




{/* OUR PROMISE */}


<div
className="
bg-gray-50
px-5
py-5
"
>

<div
className="
bg-amber-50
border-t
border-amber-100
rounded-lg
px-3
py-3
"
>

<div
className="
flex
items-start
gap-4
"
>

<div className="flex gap-3">

<div
className="
w-8
h-8
rounded-lg
bg-amber-100
flex
items-center
justify-center
shrink-0
text-sm
"
>
🛡️
</div>

<div className="flex-1">

<h2
className="
text-base
font-black
text-amber-600
whitespace-nowrap
"
>
Our Promise
</h2>

<p
className="
mt-1
text-sm
text-gray-600
leading-5
"
>
We guarantee original products and fast delivery.
Your satisfaction is our top priority.
</p>

</div>

</div>

</div>

</div>

</div>




{/* COMPLETE ORDER BUTTON */}


<Button

onClick={handleOrder}

disabled={loading}

className={`
w-full
mt-6
h-14
rounded-2xl
${orderClicked ? "bg-green-600" : "bg-black"}
transition-colors
border
border-amber-500
text-white
text-lg
font-bold
`}

>

{
loading
?
"Processing..."
:
"Complete Order"
}


</Button>




</div>


</div>

  );

}
