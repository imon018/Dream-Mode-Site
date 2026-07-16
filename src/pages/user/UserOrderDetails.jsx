import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  FiPackage,
  FiMapPin,
  FiPhone,
  FiCreditCard,
  FiShoppingBag,
  FiTruck,
  FiCheck,
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

export default function UserOrderDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showCancelModal,setShowCancelModal] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [user]);

  async function loadOrder() {

    try {

      if (!user) return;

      const orders = await getUserOrders(user.email);

      const found = orders.find(
        item => item.id === id
      );

      setOrder(found);

    }

    catch (error) {

      console.log(error);

    }

    finally {

      setLoading(false);

    }

  }

  const steps = [

    {
      name: "Order Placed",
      icon: <FiPackage />,
    },

    {
      name: "Processing",
      icon: <FiPackage />,
    },

    {
      name: "Shipped",
      icon: <FiTruck />,
    },

    {
      name: "Delivered",
      icon: <FiCheck />,
    },

  ];

  function currentStep() {

    if (!order) return 0;

    switch (order.status) {

      case "Processing":
        return 1;

      case "Shipped":
        return 2;

      case "Delivered":
        return 3;

      default:
        return 0;

    }

  }

  async function cancelOrder() {

    try {

      await requestCancelOrder(order.id);

      successToast("Cancel request sent");

      loadOrder();

    }

    catch(error){

  console.log(error);

  errorToast(
    error.message || "Request failed"
  );

}

  }

  async function returnOrder() {

    try {

      await requestReturnOrder(order.id);

      successToast("Return request sent");

      loadOrder();

    }

    catch {

      errorToast("Request failed");

    }

  }

  if (loading)
    return (

      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      font-bold
      ">

        Loading Order...

      </div>

    );

  if (!order)
    return (

      <div className="
      min-h-screen
      flex
      flex-col
      gap-4
      items-center
      justify-center
      ">

        <h2 className="
        font-bold
        text-xl
        ">
          Order Not Found
        </h2>

      </div>

    );

  return (

    <div
  className="
  min-h-screen
  bg-[#FCFAF5]
  px-4
  py-5
  "
>

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
onClick={()=>{
setShowCancelModal(false)
}}
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


{/* HEADER */}

<div
className="
max-w-xl
mx-auto
space-y-4
"
>


    <div className="text-center">

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
              className="text-amber-500"
            />

            <h2
              className="
              font-black
              text-xl
              "
            >
              #{order.id.slice(0, 8)}
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

      <h3
        className="
        font-bold
        mb-8
        "
      >
        Order Tracking
      </h3>

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
              width: `${(currentStep() / 3) * 100}%`,
            }}
          />

        </div>

        {steps.map((step, index) => (

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
                index <= currentStep()
                  ? "bg-amber-500 text-white"
                  : "bg-gray-200 text-gray-500"
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

        ))}

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

৳ {(item.price || 0) * (item.quantity || 1)}

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

<span
className="
text-gray-500
"
>

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

<FiMapPin className="text-amber-500" />

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

<FiPhone size={15} />

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

<FiCreditCard className="text-green-600" />

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

<p className="font-semibold text-sm">
{order.paymentMethod || "Cash On Delivery"}
</p>

<p className="text-xs text-gray-500 mt-1">
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
(order.status === "Pending" ||
order.status === "Processing" ||
order.status === "Delivered")
?
"grid grid-cols-2 gap-3"
:
""
}
>

{(
order.status === "Pending" ||
order.status === "Processing"
) && (

<button

onClick={() => setShowCancelModal(true)}

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

)}

{order.status === "Delivered" && (

<button
onClick={returnOrder}
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

)}

<button

onClick={() => {

  if(order.items?.length === 1){

    navigate(
      `/product/${order.items[0].productId || order.items[0].id}`
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

</div>

</div>

);

}
