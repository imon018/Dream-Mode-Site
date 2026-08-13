import {
  useEffect,
  useState,
  useRef,
} from "react";


import {
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";


import {
  FiArrowLeft,
  FiMoreVertical,
  FiPhone,
  FiMail,
  FiMapPin,
  FiTrash2,
  FiPackage,
  FiCreditCard,
  FiChevronRight,
  FiX,
  FiEdit2,
  FiSave,
  FiXCircle,
} from "react-icons/fi";


import {
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  updateOrder,
  deleteOrder,
} from "../../services/orderService";


import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";

import { getEffectivePrice } from "../../utils/helpers";

import { useSettings } from "../../context/SettingsContext";





export default function OrderDetails(){


const {id}=useParams();

const navigate=useNavigate();

const [searchParams]=useSearchParams();

const { settings } = useSettings();

const menuRef = useRef(null);

const [order,setOrder]=useState(null);

const [loading,setLoading]=useState(true);

const [menuOpen,setMenuOpen]=useState(false);

const [deleteModal,setDeleteModal]=useState(false);

const [deleting, setDeleting] = useState(false);

const [showProductsModal, setShowProductsModal] = useState(false);

// অর্ডারে কাস্টমারের ছবি সেট না থাকলে, বা অ্যাডমিন নিজে
// AddOrder.jsx দিয়ে অর্ডারটা যোগ করে থাকলে, স্টোরের লোগো
// দেখানো হবে কাস্টমারের ছবির জায়গায়। addedByAdmin ফ্ল্যাগটা এই
// ফিক্সের আগের অর্ডারগুলাতে নেই, তাই orderSource
// ("Messenger"/"WhatsApp") — যেটা শুধু AddOrder.jsx-ই সেট করে,
// কাস্টমারের নিজের চেকআউটে না — সেটাকেও একই সিগনাল হিসেবে ধরা
// হচ্ছে, পুরনো ডেটা মাইগ্রেট না করেই।
const storeLogo = settings?.logoUrl || "/logo.png";

const isAdminAddedOrder = !!(order?.addedByAdmin || order?.orderSource);

const customerAvatar =
  isAdminAddedOrder
    ? storeLogo
    : (order?.customerPhoto || storeLogo);

// =========================
// ADMIN EDIT MODE
// =========================

const [editMode,setEditMode]=useState(false);

const [saving,setSaving]=useState(false);

const [form,setForm]=useState(null);


function startEdit(){

  setForm({

    customerName: order.customerName || "",
    phone: order.phone || "",
    email: order.email || "",
    address: order.address || "",
    thana: order.thana || "",
    district: order.district || "",
    notes: order.notes || "",
    discount: order.discount || 0,
    deliveryCharge: order.deliveryCharge || 0,

    items: (order.items || []).map(item=>({ ...item })),

    paymentDetails: {
      accountNumber: order.paymentDetails?.accountNumber || "",
      transactionId: order.paymentDetails?.transactionId || "",
    },

  });

  setEditMode(true);

}


function cancelEdit(){

  setForm(null);

  setEditMode(false);

}


function updateFormItem(index,key,value){

  setForm(prev=>({

    ...prev,

    items: prev.items.map((item,i)=>

      i===index
        ? { ...item, [key]: value }
        : item

    ),

  }));

}


function removeFormItem(index){

  setForm(prev=>({

    ...prev,

    items: prev.items.filter((_,i)=>i!==index),

  }));

}


const formSubtotal =
  form
    ? form.items.reduce(
        (sum,item)=>
          sum + (Number(item.price)||0) * (Number(item.quantity)||0),
        0
      )
    : 0;


const formTotal =
  form
    ? Math.max(0, formSubtotal - (Number(form.discount)||0)) + (Number(form.deliveryCharge)||0)
    : 0;


async function saveEdit(){

  if(!form.customerName || !form.phone || !form.address){

    errorToast("Name, phone and address are required.");

    return;

  }

  setSaving(true);

  try{

    const updateData = {

      customerName: form.customerName,
      phone: form.phone,
      email: form.email,
      address: form.address,
      thana: form.thana,
      district: form.district,
      notes: form.notes,

      discount: Number(form.discount)||0,
      deliveryCharge: Number(form.deliveryCharge)||0,

      items: form.items.map(item=>({
        ...item,
        price: Number(item.price)||0,
        quantity: Math.max(1, Number(item.quantity)||1),
      })),

      subtotal: formSubtotal,
      total: formTotal,

    };

    if(order.paymentMethod === "bKash" || order.paymentMethod === "Nagad"){

      updateData.paymentDetails = form.paymentDetails;

    }

    await updateOrder(id, updateData);

    setOrder(prev=>({ ...prev, ...updateData }));

    successToast("Order updated successfully");

    setEditMode(false);

    setForm(null);

  }

  catch(error){


    errorToast("Update failed");

  }

  finally{

    setSaving(false);

  }

}


useEffect(()=>{

loadOrder();

},[id]);


// ?edit=1 দিয়ে সরাসরি এডিট মোডে ঢোকার জন্য (Orders.jsx-এর
// তিন-ডট মেনু থেকে "Edit"-এ ক্লিক করলে)
useEffect(()=>{

  if(order && searchParams.get("edit")==="1" && !editMode){

    startEdit();

  }

// eslint-disable-next-line react-hooks/exhaustive-deps
},[order]);


useEffect(()=>{

function handleClickOutside(event){

if(
menuRef.current &&
!menuRef.current.contains(event.target)
){

setMenuOpen(false);

}

}

document.addEventListener(
"mousedown",
handleClickOutside
);

document.addEventListener(
"touchstart",
handleClickOutside
);

return ()=>{

document.removeEventListener(
"mousedown",
handleClickOutside
);

document.removeEventListener(
"touchstart",
handleClickOutside
);

};

},[]);



async function loadOrder(){

try{


const data=await getAllOrders();


const found=data.find(
(item)=>item.id===id
);


setOrder(found);


}

catch (error) {
    console.error(error);
  }

finally{

setLoading(false);

}

}







async function changeStatus(status){

try{


await updateOrderStatus(
id,
status
);



setOrder(prev=>({

...prev,
status

}));


successToast(
"Status updated"
);


}

catch(error){


errorToast(
"Update failed"
);


}

}



async function changePaymentStatus(status){

try{


await updatePaymentStatus(
id,
status
);



setOrder(prev=>({

...prev,

paymentStatus:
status

}));


successToast(
"Payment status updated"
);


}

catch(error){


errorToast(
"Payment update failed"
);

}

}



async function removeOrder(){

setDeleting(true);

try{

await deleteOrder(id);

successToast("Order deleted");

navigate("/admin/orders");

}

catch(error){


errorToast("Delete failed");

}

finally{

setDeleting(false);

}

}







if(loading){

return(

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

}






if(!order){

return(

<div className="
min-h-screen
flex
items-center
justify-center
flex-col
gap-4
">


<h2 className="
font-bold
text-xl
">

Order Not Found

</h2>


<button

onClick={()=>navigate(-1)}

className="
px-4
py-2
bg-black
text-white
rounded-lg
"

>

Back

</button>


</div>

);

}







return(

<div className="
bg-[#faf9f6]
min-h-screen
p-4
space-y-3
">





{/* HEADER */}

<div
className="
relative
flex
items-center
justify-center
mb-2
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

<div
ref={menuRef}
className="
absolute
right-0
">


<button

onClick={()=>setMenuOpen(!menuOpen)}

className="
w-9
h-9
rounded-lg
flex
items-center
justify-center
"

>

<FiMoreVertical/>

</button>



{
menuOpen &&

<div className="
absolute
right-0
top-10
w-32
bg-white
border
border-gray-100
rounded-lg
shadow-lg
z-50
">


<button

onClick={()=>{
setMenuOpen(false);
startEdit();
}}

className="
w-full
flex
items-center
gap-2
px-3
py-2
text-sm
text-slate-700
"

>

<FiEdit2/>

Edit

</button>

<button

onClick={()=>{
setMenuOpen(false);
setDeleteModal(true);
}}

className="
w-full
flex
items-center
gap-2
px-3
py-2
text-sm
text-red-600
"

>

<FiTrash2/>

Delete

</button>


</div>

}


</div>



</div>







{/* ORDER CARD */}


<div className="
bg-white
border
border-gray-100
rounded-lg
p-4
shadow-sm
">


<div className="
flex
justify-between
items-start
">


<div>


<h2 className="
text-2xl
font-black
text-slate-900
">

#{order.id?.slice(0,10)}

</h2>


<p className="
text-xs
text-gray-500
mt-1
">

{
new Date(order.createdAt)
.toLocaleString()
}

</p>


</div>







<span className={`

text-xs
font-bold
px-3
py-1.5
rounded-full


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

`}>

{order.status}

</span>



</div>







<hr className="
my-4
border-gray-100
"/>

  </div>




{/* =========================
    CUSTOMER
========================= */}

<div
  className="
  bg-white
  border
  border-gray-100
  rounded-lg
  p-4
  shadow-sm
"
>

  <h3
    className="
    font-bold
    text-sm
    mb-3
  "
  >
    Customer
  </h3>

  <div
    className="
    flex
    justify-between
    items-center
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
        src={customerAvatar}
        onError={(e)=>{ e.currentTarget.src = storeLogo; }}
        className="
        w-12
        h-12
        rounded-full
        object-cover
        "
      />

      {
        editMode
        ?
        (
          <div className="flex-1 space-y-2">

            <input
              value={form.customerName}
              onChange={(e)=>setForm(prev=>({ ...prev, customerName: e.target.value }))}
              placeholder="Customer name"
              className="w-full h-9 px-2 rounded-md border border-gray-200 text-sm font-bold outline-none focus:border-amber-400"
            />

            <input
              value={form.email}
              onChange={(e)=>setForm(prev=>({ ...prev, email: e.target.value }))}
              placeholder="Email"
              className="w-full h-9 px-2 rounded-md border border-gray-200 text-xs outline-none focus:border-amber-400"
            />

            <input
              value={form.phone}
              onChange={(e)=>setForm(prev=>({ ...prev, phone: e.target.value }))}
              placeholder="Phone"
              className="w-full h-9 px-2 rounded-md border border-gray-200 text-xs outline-none focus:border-amber-400"
            />

          </div>
        )
        :
        (
          <div>

            <p
              className="
              font-bold
              text-sm
            "
            >
              {order.customerName}
            </p>

            <p
              className="
              text-xs
              text-gray-500
            "
            >
              {order.email}
            </p>

            <p
              className="
              text-xs
              text-gray-500
              mt-1
            "
            >
              {order.phone}
            </p>

            {
              (order.orderSource==="Messenger" || order.orderSource==="WhatsApp") && (

                <p
                  className="
                  text-xs
                  font-bold
                  text-amber-600
                  mt-1
                "
                >
                  {
                    order.orderSource==="Messenger"
                    ?
                    "Messenger Order"
                    :
                    "WhatsApp Order"
                  }
                </p>

              )
            }

          </div>
        )
      }

    </div>

    <div
      className="
      flex
      gap-2
    "
    >

      <a
        href={`tel:${order.phone}`}
        className="
        w-9
        h-9
        rounded-lg
        border
        border-gray-100
        bg-gray-50
        flex
        items-center
        justify-center
        "
      >
        <FiPhone size={16}/>
      </a>

      <a
        href={`mailto:${order.email}`}
        className="
        w-9
        h-9
        rounded-lg
        border
        border-gray-100
        bg-gray-50
        flex
        items-center
        justify-center
        "
      >
        <FiMail size={16}/>
      </a>

    </div>

  </div>

</div>


  {/* SHIPPING ADDRESS */}

<div className="
bg-white
border
border-gray-100
rounded-lg
p-4
shadow-sm
">


<h3 className="
font-bold
text-sm
mb-3
">

Shipping Address

</h3>



<div className="
flex
gap-3
text-sm
text-gray-700
">


<FiMapPin
className="
mt-1
text-gray-500
"
/>



{
  editMode
  ?
  (
    <div className="space-y-2 text-sm text-gray-700 flex-1">

      <div>
        <label className="text-xs font-bold text-gray-500">Address</label>
        <input
          value={form.address}
          onChange={(e)=>setForm(prev=>({ ...prev, address: e.target.value }))}
          className="w-full h-9 mt-1 px-2 rounded-md border border-gray-200 text-sm outline-none focus:border-amber-400"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500">Thana</label>
        <input
          value={form.thana}
          onChange={(e)=>setForm(prev=>({ ...prev, thana: e.target.value }))}
          className="w-full h-9 mt-1 px-2 rounded-md border border-gray-200 text-sm outline-none focus:border-amber-400"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500">District</label>
        <input
          value={form.district}
          onChange={(e)=>setForm(prev=>({ ...prev, district: e.target.value }))}
          className="w-full h-9 mt-1 px-2 rounded-md border border-gray-200 text-sm outline-none focus:border-amber-400"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e)=>setForm(prev=>({ ...prev, notes: e.target.value }))}
          rows={2}
          className="w-full mt-1 px-2 py-1.5 rounded-md border border-gray-200 text-sm outline-none focus:border-amber-400"
        />
      </div>

    </div>
  )
  :
  (
    <div className="space-y-2 text-sm text-gray-700">

      <p>
        <strong>Address:</strong> {order.address || "-"}
      </p>

      <p>
        <strong>Thana:</strong> {order.thana || "-"}
      </p>

      <p>
        <strong>District:</strong> {order.district || "-"}
      </p>

      <p>
        <strong>Notes:</strong> {order.notes || "-"}
      </p>

    </div>
  )
}


</div>


</div>








{/* PAYMENT DETAILS */}

{
  order.paymentDetails &&
  (order.paymentMethod === "bKash" || order.paymentMethod === "Nagad") &&

  <div className="
  bg-white
  border
  border-gray-100
  rounded-lg
  p-4
  shadow-sm
  ">


  <h3 className="
  font-bold
  text-sm
  mb-3
  ">

  Payment Details

  </h3>



  <div className="
  flex
  gap-3
  text-sm
  text-gray-700
  ">


  <FiCreditCard
  className="
  mt-1
  text-gray-500
  "
  />



  {
    editMode
    ?
    (
      <div className="space-y-2 text-sm text-gray-700 flex-1">

        <p>
          <strong>Payment with:</strong> {order.paymentMethod}
        </p>

        <div>
          <label className="text-xs font-bold text-gray-500">{order.paymentMethod} Number</label>
          <input
            value={form.paymentDetails.accountNumber}
            onChange={(e)=>setForm(prev=>({
              ...prev,
              paymentDetails: { ...prev.paymentDetails, accountNumber: e.target.value },
            }))}
            className="w-full h-9 mt-1 px-2 rounded-md border border-gray-200 text-sm outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500">Transaction ID</label>
          <input
            value={form.paymentDetails.transactionId}
            onChange={(e)=>setForm(prev=>({
              ...prev,
              paymentDetails: { ...prev.paymentDetails, transactionId: e.target.value },
            }))}
            className="w-full h-9 mt-1 px-2 rounded-md border border-gray-200 text-sm outline-none focus:border-amber-400"
          />
        </div>

      </div>
    )
    :
    (
      <div className="space-y-2 text-sm text-gray-700">

        <p>
          <strong>Payment with:</strong> {order.paymentMethod}
        </p>

        <p>
          <strong>{order.paymentMethod} Number:</strong> {order.paymentDetails.accountNumber || "-"}
        </p>

        <p>
          <strong>Transaction ID:</strong> {order.paymentDetails.transactionId || "-"}
        </p>

      </div>
    )
  }


  </div>


  </div>
}



{/* PRODUCTS */}


<div className="
bg-white
border
border-gray-100
rounded-lg
p-4
shadow-sm
">



<div
className="
flex
items-center
justify-between
mb-4
"
>

  <div
  className="
  flex
  items-center
  gap-2
  "
  >

    <FiPackage className="text-blue-600"/>

    <h3
    className="
    font-bold
    text-sm
    "
    >
      Products
    </h3>

  </div>

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







<div className="
space-y-3
">


{

(editMode ? form.items : order.items)?.map(

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
pb-3
gap-3
"


>



<div className="
flex
items-center
gap-3
">


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
bg-gray-50
"

/>




<div>


<h4 className="
text-sm
font-bold
">

{item.name}

</h4>



<p className="
text-xs
text-gray-500
mt-1
">

{
item.size &&
`Size: ${item.size}`
}


{
item.color &&
` / Color: ${item.color}`
}


</p>

{
  editMode
  ?
  (
    <div className="flex items-center gap-2 mt-1">

      <input
        type="number"
        min="1"
        value={item.quantity}
        onChange={(e)=>updateFormItem(index,"quantity",e.target.value===""?"":Number(e.target.value))}
        className="w-14 h-8 px-2 rounded-md border border-gray-200 text-xs outline-none focus:border-amber-400"
      />

      <input
        type="number"
        min="0"
        value={item.price}
        onChange={(e)=>updateFormItem(index,"price",e.target.value===""?"":Number(e.target.value))}
        className="w-20 h-8 px-2 rounded-md border border-gray-200 text-xs outline-none focus:border-amber-400"
      />

      <button
        type="button"
        onClick={()=>removeFormItem(index)}
        className="w-8 h-8 rounded-md bg-red-50 text-red-500 flex items-center justify-center"
      >
        <FiTrash2 size={13}/>
      </button>

    </div>
  )
  :
  (
    <p className="
    text-xs
    text-gray-500
    ">

    Qty: {item.quantity}

    </p>
  )
}


</div>



</div>



<div
className="
text-right
"
>

  <p
  className="
  font-bold
  text-sm
  "
  >
    ৳ {(editMode ? (Number(item.price)||0) : getEffectivePrice(item)) * (Number(item.quantity)||0)}
  </p>

</div>



</div>


)

)


}

{
  editMode && form.items.length===0 && (
    <p className="text-xs text-gray-400 text-center py-2">
      No products left in this order.
    </p>
  )
}



</div>


</div>









{/* ORDER SUMMARY */}



<div className="
bg-white
border
border-gray-100
rounded-lg
p-4
shadow-sm
">



<h3 className="
font-bold
text-sm
mb-4
">

Order Summary

</h3>




<div className="
space-y-3
text-sm
">



<div className="
flex
justify-between
">

<span className="
text-gray-500
">

Subtotal

</span>


<span className="
font-semibold
">

৳ {editMode ? formSubtotal : (order.subtotal || order.total)}

</span>


</div>







<div className="
flex
justify-between
items-center
">


<span className="
text-gray-500
">

Shipping

</span>

{
  editMode
  ?
  (
    <input
      type="number"
      min="0"
      value={form.deliveryCharge}
      onChange={(e)=>setForm(prev=>({ ...prev, deliveryCharge: e.target.value===""?"":Number(e.target.value) }))}
      className="w-24 h-8 px-2 rounded-md border border-gray-200 text-sm text-right outline-none focus:border-amber-400"
    />
  )
  :
  (
    <span className="
    font-semibold
    ">

    ৳ {order.deliveryCharge || 0}

    </span>
  )
}


</div>







<div className="
flex
justify-between
items-center
">


<span className="
text-gray-500
">

Discount

</span>

{
  editMode
  ?
  (
    <input
      type="number"
      min="0"
      value={form.discount}
      onChange={(e)=>setForm(prev=>({ ...prev, discount: e.target.value===""?"":Number(e.target.value) }))}
      className="w-24 h-8 px-2 rounded-md border border-gray-200 text-sm text-right outline-none focus:border-amber-400"
    />
  )
  :
  (
    <span className="
    font-semibold
    text-red-500
    ">

    -৳ {order.discount || 0}

    </span>
  )
}


</div>






<hr className="
border-gray-100
"/>






<div className="
flex
justify-between
font-black
text-base
">


<span>

Total Amount

</span>


<span>

৳ {editMode ? formTotal : order.total}

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

<select

value={
order.paymentStatus || "Pending"
}

onChange={(e)=>
changePaymentStatus(
e.target.value
)
}

className={`
px-3
py-1.5
rounded-lg
text-xs
font-bold
outline-none

${
order.paymentStatus === "Paid"

?

"bg-green-100 text-green-700"

:

"bg-yellow-100 text-yellow-700"

}

`}

>


<option>
Pending
</option>


<option>
Paid
</option>


</select>

</div>

</div>

  
  {/* =========================
    UPDATE STATUS
========================= */}



<div className="
bg-white
border
border-gray-100
rounded-lg
p-4
shadow-sm
">


<h3 className="
font-bold
text-sm
mb-3
">

Update Order Status

</h3>



<select

value={
order.status || "Pending"
}

onChange={(e)=>
changeStatus(
e.target.value
)
}

className={`
w-full
h-11
px-3
rounded-lg
text-sm
font-bold
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



</div>







{/* EDIT / DELETE BUTTONS */}

{
  editMode
  ?
  (
    <div className="grid grid-cols-2 gap-3">

      <button

      onClick={cancelEdit}

      disabled={saving}

      className="
      h-11
      rounded-lg
      border
      border-gray-300
      text-gray-600
      font-bold
      text-sm
      flex
      items-center
      justify-center
      gap-2
      disabled:opacity-50
      "

      >

      <FiXCircle/>

      Cancel

      </button>

      <button

      onClick={saveEdit}

      disabled={saving}

      className="
      h-11
      rounded-lg
      bg-amber-500
      text-white
      font-bold
      text-sm
      flex
      items-center
      justify-center
      gap-2
      disabled:opacity-50
      "

      >

      <FiSave/>

      {saving ? "Saving..." : "Save Changes"}

      </button>

    </div>
  )
  :
  (
    <div className="grid grid-cols-2 gap-3">

      <button

      onClick={startEdit}

      className="
      h-11
      rounded-lg
      bg-slate-800
      text-white
      font-bold
      text-sm
      flex
      items-center
      justify-center
      gap-2
      "

      >

      <FiEdit2/>

      Edit Order

      </button>

      <button

      onClick={()=>setDeleteModal(true)}

      className="
      h-11
      rounded-lg
      bg-red-500
      text-white
      font-bold
      text-sm
      flex
      items-center
      justify-center
      gap-2
      "

      >


      <FiTrash2/>

      Delete Order

      </button>

    </div>
  )
}



{
deleteModal && (

<div
className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
z-[999]
"
>

<div
className="
bg-white
rounded-xl
p-6
w-[90%]
max-w-sm
shadow-xl
"
>

<h2
className="
text-lg
font-bold
text-center
"
>
Delete Order
</h2>

<p
className="
text-sm
text-gray-500
text-center
mt-3
"
>
Are you sure you want to delete this order?
</p>

<div
className="
flex
gap-3
mt-6
"
>

<button

onClick={()=>setDeleteModal(false)}

className="
flex-1
h-11
rounded-lg
border
border-gray-300
font-semibold
"
>

No

</button>

<button

disabled={deleting}

onClick={async()=>{

setDeleteModal(false);

await removeOrder();

}}

className="
flex-1
h-11
rounded-lg
bg-red-600
text-white
font-semibold
disabled:opacity-50
"

>

{deleting ? "Deleting..." : "Yes"}

</button>

</div>

</div>

</div>

)
}




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
                navigate(`/product/${item.id}`);
              }}
              className="w-full flex items-center justify-between border rounded-xl p-3"
            >

              <div className="flex items-center gap-3">

                <img
                  src={item.image}
                  className="w-14 h-14 rounded-lg object-cover"
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

              <FiChevronRight/>

            </button>

          ))}

        </div>

      </div>

    </div>

  </div>
)}


  

</div>

);


}
