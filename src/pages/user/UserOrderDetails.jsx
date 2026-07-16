import {
  useEffect,
  useState,
} from "react";


import {
  useParams,
  useNavigate,
} from "react-router-dom";


import {
  FiArrowLeft,
  FiPackage,
  FiMapPin,
  FiPhone,
  FiCreditCard,
  FiShoppingBag,
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





export default function UserOrderDetails(){


  const {
    id
  } = useParams();


  const navigate =
  useNavigate();


  const {
    user
  } = useAuth();




  const [
    order,
    setOrder
  ] = useState(null);



  const [
    loading,
    setLoading
  ] = useState(true);





  useEffect(()=>{


    loadOrder();


  },[user]);







  async function loadOrder(){


    try{


      if(!user)
      return;



      const orders =
      await getUserOrders(
        user.email
      );



      const found =
      orders.find(
        item =>
        item.id === id
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









  const trackingSteps = [

    "Order Placed",

    "Processing",

    "Shipped",

    "Delivered",

  ];








  const statusIndex = ()=>{


    if(!order)
    return 0;


    switch(order.status){


      case "Processing":
        return 1;


      case "Shipped":
        return 2;


      case "Delivered":
        return 3;


      default:
        return 0;

    }


  };








  async function cancelOrder(){


    try{


      await requestCancelOrder(
        order.id
      );


      successToast(
        "Cancel request sent"
      );


      loadOrder();


    }
    catch(error){

      errorToast(
        "Request failed"
      );

    }


  }







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









  if(loading){


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


  }







  if(!order){


    return (

      <div
        className="
        min-h-screen
        flex
        flex-col
        gap-4
        items-center
        justify-center
        "
      >

        <h2
          className="
          font-bold
          text-xl
          "
        >
          Order Not Found
        </h2>


        <button

          onClick={()=>
            navigate(-1)
          }

          className="
          bg-black
          text-white
          px-5
          py-2
          rounded-xl
          "
        >

          Back

        </button>


      </div>

    );


  }








return (


<div
className="
min-h-screen
bg-[#FCFAF5]

px-4
pb-28
py-5
"
>



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

onClick={()=>
navigate(-1)
}

className="
absolute
left-0

w-10
h-10

rounded-xl

bg-white

border
border-gray-100

flex
items-center
justify-center
"

>

<FiArrowLeft/>

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
rounded-2xl

border
border-gray-100

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
gap-2
"
>

<FiPackage
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

#
{order.id.slice(0,8)}

</h2>


</div>



<p
className="
text-xs
text-gray-500
mt-2
"
>

{
new Date(
order.createdAt
)
.toLocaleString()
}

</p>



</div>





<span
className="
px-3
py-1

rounded-full

text-xs

font-bold

bg-blue-100

text-blue-700
"
>

{order.status}

</span>


</div>





<div
className="
mt-5

flex

justify-between

items-center

bg-[#FCFAF5]

rounded-xl

p-4
"
>


<div>

<p
className="
text-xs
text-gray-500
"
>
Total Amount
</p>


<h2
className="
text-2xl
font-black
"
>

৳ {order.total}

</h2>

</div>


<FiShoppingBag
size={30}
className="
text-amber-500
"
/>


</div>


</div>









{/* ORDER TRACKING */}


<div
className="
bg-white
rounded-2xl
border
border-gray-100
p-5
shadow-sm
"
>


<h3
className="
font-bold
mb-6
"
>

Order Tracking

</h3>



<div
className="
flex
justify-between
relative
"
>


{

trackingSteps.map(
(step,index)=>(


<div
key={step}

className="
flex
flex-col
items-center
flex-1
"
>


<div
className={`

w-8
h-8

rounded-full

flex
items-center
justify-center

text-xs

font-bold


${
index <= statusIndex()

?
"bg-amber-500 text-white"

:

"bg-gray-200 text-gray-500"

}

`}
>

✓

</div>


<p
className="
text-[10px]
mt-2
text-center
font-semibold
"
>

{step}

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
rounded-2xl

border
border-gray-100

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

Order Items

</h3>





<div
className="
space-y-4
"
>


{
order.items?.map(
(item,index)=>(


<div
key={
item.id || index
}

className="
flex
items-center
justify-between

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

rounded-xl

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

Qty: {item.quantity || 1}

</p>


</div>


</div>





<p
className="
font-black
"
>

৳ {

(item.price || 0)

*

(item.quantity || 1)

}

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

<span
className="
text-gray-500
"
>
Subtotal
</span>


<span
className="
font-semibold
"
>
৳ {order.subtotal || 0}
</span>


</div>





<div
className="
flex
justify-between
"
>

<span
className="
text-gray-500
"
>
Shipping Charge
</span>


<span
className="
font-semibold
"
>
৳ {order.deliveryCharge || 0}
</span>


</div>





<div
className="
flex
justify-between
"
>

<span
className="
text-gray-500
"
>
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

rounded-2xl

border
border-gray-100

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
className="
text-amber-500
"
/>


<h3
className="
font-bold
"
>

Shipping Address

</h3>


</div>





<div
className="
space-y-2
text-sm
"
>


<p
className="
font-bold
"
>

{order.customerName}

</p>



<p>

{order.address || "No Address"}

</p>



<p>

{order.postOffice}

</p>



<p>

{order.thana}

</p>



<p>

{order.district}

</p>



<div
className="
flex
items-center
gap-2
pt-2
"
>

<FiPhone
size={15}
/>


<span>

{order.phone}

</span>


</div>



</div>



</div>










{/* PAYMENT METHOD */}



<div
className="
bg-white

rounded-2xl

border
border-gray-100

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
className="
text-green-600
"
/>


<h3
className="
font-bold
"
>

Payment Method

</h3>


</div>





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
font-semibold
text-sm
"
>

{
order.paymentMethod ||
"Cash On Delivery"
}

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

rounded-full

bg-green-100

text-green-700

text-xs

font-bold
"
>

{
order.paymentStatus ||
"Pending"
}

</span>


</div>



</div>









{/* FIXED BOTTOM BUTTON */}



<div
className="
fixed

bottom-0

left-0

right-0

bg-white

border-t
border-gray-100

p-4

z-50
"
>


<div
className="
max-w-xl

mx-auto

grid

grid-cols-2

gap-3
"
>





{

(
order.status==="Pending" ||
order.status==="Processing"
)

&&

<button

onClick={cancelOrder}

className="
h-12

rounded-xl

border

border-red-500

text-red-600

font-bold

text-sm
"

>

Cancel

</button>


}





{

order.status==="Delivered"

&&

<button

onClick={returnOrder}

className="
h-12

rounded-xl

border

border-red-500

text-red-600

font-bold

text-sm
"

>

Return

</button>


}






<button

onClick={()=>navigate("/shop")}

className="
h-12

rounded-xl

bg-black

border

border-amber-500

text-white

font-bold

text-sm
"

>

Buy Again

</button>





</div>


</div>







</div>

</div>


);

}
