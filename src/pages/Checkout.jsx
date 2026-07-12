import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";

import Button from "../components/ui/Button";

import {
  createOrder,
} from "../services/orderService";

import {
  successToast,
  errorToast,
} from "../components/ui/Toast";



export default function Checkout(){


  const {
    cart,
    clearCart,
  } = useCart();



  const {
    user,
  } = useAuth();



  const navigate =
    useNavigate();



  const [name,setName] =
    useState("");

  const [email,setEmail] =
    useState("");

  const [phone,setPhone] =
    useState("");

  const [address,setAddress] =
    useState("");

  const [
    deliveryArea,
    setDeliveryArea
  ] = useState("");



  const [
    loading,
    setLoading
  ] = useState(false);





  useEffect(()=>{

    if(user){

      setName(
        user.name || ""
      );

      setEmail(
        user.email || ""
      );

      setPhone(
        user.phone || ""
      );

      setAddress(
        user.address || ""
      );

    }

  },[user]);







  const subtotal =
    cart.reduce(
      (sum,item)=>
      sum +
      item.price *
      (item.quantity || 1),
      0
    );





  const deliveryCharge =
    deliveryArea === "Dhaka City"
    ?
    80

    :

    deliveryArea === "Dhaka Sub Area"
    ?
    100

    :

    deliveryArea === "Outside Dhaka"
    ?
    120

    :

    0;





  const total =
    subtotal + deliveryCharge;







  const handleOrder =
  async()=>{


    if(loading)
      return;



    if(!user){

      errorToast(
        "Login required"
      );

      navigate("/login");

      return;

    }




    if(cart.length === 0){

      errorToast(
        "Cart is empty"
      );

      return;

    }





    if(
      !name ||
      !phone ||
      !address
    ){

      errorToast(
        "Please fill required information"
      );

      return;

    }





    if(!deliveryArea){

      errorToast(
        "Select delivery area"
      );

      return;

    }




    try{


      setLoading(true);



      const orderId =
      await createOrder({

        userId:user.uid,

        customerName:name,

        email:
        email || "",

        phone,

        address,

        deliveryArea,

        deliveryCharge,

        items:cart,

        subtotal,

        total,

        status:"Pending",

        createdAt:
        new Date()
        .toISOString(),

      });





      successToast(
        "Order placed successfully"
      );



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
max-w-7xl
mx-auto
"
>




{/* HEADER */}


<div
className="
text-center
mb-12
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

🔒 Secure Checkout

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








<div
className="
grid
lg:grid-cols-2
gap-8
"
>





{/* CUSTOMER INFO */}



<div
className="
bg-white
rounded-[32px]
border
border-amber-500/20
shadow-xl
p-6
md:p-8
"
>


<h2
className="
text-2xl
font-black
mb-6
"
>
Customer Information
</h2>




<input
className="
checkout-input
"
placeholder="Full Name *"
value={name}
onChange={
e=>setName(e.target.value)
}
/>



<input
className="
checkout-input
"
placeholder="Email (Optional)"
value={email}
onChange={
e=>setEmail(e.target.value)
}
/>




<input
className="
checkout-input
"
placeholder="Phone Number *"
value={phone}
onChange={
e=>setPhone(e.target.value)
}
/>




<textarea
className="
checkout-input
h-32
"
placeholder="Shipping Address *"
value={address}
onChange={
e=>setAddress(e.target.value)
}
/>





<select
className="
checkout-input
"
value={deliveryArea}
onChange={
e=>setDeliveryArea(e.target.value)
}
>


<option value="">
Select Delivery Area
</option>


<option value="Dhaka City">
Dhaka City - ৳80
</option>


<option value="Dhaka Sub Area">
Dhaka Sub Area - ৳100
</option>


<option value="Outside Dhaka">
Outside Dhaka - ৳120
</option>


</select>




</div>









{/* SUMMARY */}




<div
className="
bg-white
rounded-[32px]
border
border-amber-500/20
shadow-xl
p-6
md:p-8
"
>


<h2
className="
text-2xl
font-black
mb-6
"
>

Order Summary

</h2>





<div
className="
space-y-5
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
pb-4
"
>


<img

src={item.image}

className="
w-20
h-20
rounded-2xl
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
"
>
{item.name}
</h3>


<p
className="
text-sm
text-gray-500
"
>
Qty: {item.quantity}
</p>


<p
className="
font-black
mt-1
"
>
৳ {item.price * item.quantity}
</p>


</div>


</div>


))
}




</div>







<div
className="
mt-8
space-y-4
"
>


<div
className="
flex
justify-between
"
>

<span>
Subtotal
</span>

<b>
৳ {subtotal}
</b>


</div>




<div
className="
flex
justify-between
"
>

<span>
Delivery
</span>

<b>
৳ {deliveryCharge}
</b>


</div>





<div
className="
border-t
pt-5
flex
justify-between
text-xl
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
৳ {total}
</span>


</div>


</div>






<div
className="
mt-8
space-y-3
"
>


<div
className="
p-4
rounded-2xl
bg-[#FCFAF5]
border
border-amber-500/20
font-semibold
"
>
🚚 Fast Delivery
</div>



<div
className="
p-4
rounded-2xl
bg-[#FCFAF5]
border
border-amber-500/20
font-semibold
"
>
💵 Cash On Delivery
</div>



<div
className="
p-4
rounded-2xl
bg-[#FCFAF5]
border
border-amber-500/20
font-semibold
"
>
✨ Premium Quality
</div>



</div>






<Button

onClick={handleOrder}

disabled={loading}

className="
w-full
mt-8
h-14
rounded-2xl
bg-black
border
border-amber-500
text-white
text-lg
font-bold
"

>

{
loading
?
"Processing..."
:
"Complete Order 🚀"
}


</Button>



</div>






</div>



</div>


</div>

  );

}
