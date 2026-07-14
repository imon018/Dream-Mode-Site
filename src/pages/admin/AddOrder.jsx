import {
  useState
} from "react";


import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiPackage,
  FiHash,
  FiShoppingBag,
} from "react-icons/fi";


import Button from "../../components/ui/Button";


import {
  addOrderByAdmin,
} from "../../services/orderService";


import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";


import useAuth from "../../hooks/useAuth";





export default function AddOrder(){


const [customerName,setCustomerName]=useState("");

const [email,setEmail]=useState("");

const [phone,setPhone]=useState("");

const [address,setAddress]=useState("");

const [productName,setProductName]=useState("");

const [price,setPrice]=useState("");

const [quantity,setQuantity]=useState(1);

  const { user } = useAuth();





const handleSubmit=async(e)=>{

e.preventDefault();


if(
!customerName ||
!email ||
!phone ||
!address ||
!productName ||
!price
){

errorToast(
"Please fill all fields."
);

return;

}



try{


const total =
Number(price) *
Number(quantity);



await addOrderByAdmin({

userId: user?.uid || "",

customerName,

email,

phone,

address,


items:[

{

id: crypto.randomUUID(),

name: productName,

price: Number(price),

quantity: Number(quantity)

}

],


total,


status:"Pending",


createdAt:new Date().toISOString()

});



successToast(
"Order added successfully."
);



setCustomerName("");

setEmail("");

setPhone("");

setAddress("");

setProductName("");

setPrice("");

setQuantity(1);



}

catch(error){

errorToast(
error.message ||
"Failed to add order."
);

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







{/* EMAIL */}


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

Email

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

<FiMail size={15}/>

</div>



<input

type="email"

className={inputClass}

placeholder="Customer email"

value={email}

onChange={
e=>setEmail(
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







{/* PRODUCT NAME */}


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

Product Name

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

<FiPackage size={15}/>

</div>




<input

className={inputClass}

placeholder="Product name"

value={productName}

onChange={
e=>setProductName(
e.target.value
)
}

/>



</div>


</div>







{/* PRICE + QUANTITY */}



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

Price (৳)

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

font-bold

"

>

৳

</div>



<input

type="number"

className={inputClass}

placeholder="Product price"

value={price}

onChange={
e=>setPrice(
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

Quantity

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

<FiHash size={15}/>

</div>



<input

type="number"

min="1"

className={inputClass}

value={quantity}

onChange={
e=>setQuantity(
e.target.value
)
}

/>



</div>


</div>



</div>







{/* BUTTON */}



<Button

type="submit"

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

"

>

🛒 Add Order

</Button>







</form>



</div>


</div>


);


}
