import {
  useEffect,
  useMemo,
  useState,
} from "react";


import { useNavigate } from "react-router-dom";

import {
  FiSearch,
  FiImage,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowLeft,
  FiX,
} from "react-icons/fi";

import Button from "../../components/ui/Button";

import {
  getProductsFromDB,
} from "../../services/firestoreProductService";

import {
  uploadImages,
} from "../../services/uploadService";

import {
  addReturnByAdmin,
} from "../../services/orderService";

import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";

export default function AddReturn() {


  const [customerName,setCustomerName]=useState("");

  const [phone,setPhone]=useState("");

  const [email,setEmail]=useState("");

  const navigate = useNavigate();

  const [products,setProducts]=useState([]);

  const [search,setSearch]=useState("");

  const [selectedProducts,setSelectedProducts]=useState([]);

  const [reason,setReason]=useState("");

  const [description,setDescription]=useState("");

  const [returnType,setReturnType]=useState("Exchange");

  const [refundMethod,setRefundMethod]=useState("");

  const [refundNumber,setRefundNumber]=useState("");

  const [pickupName,setPickupName]=useState("");

  const [pickupPhone,setPickupPhone]=useState("");

  const [pickupAddress,setPickupAddress]=useState("");

  const [pickupPostOffice,setPickupPostOffice]=useState("");

  const [pickupThana,setPickupThana]=useState("");

  const [pickupDistrict,setPickupDistrict]=useState("");

  const [images,setImages]=useState([]);

  const [previewImages,setPreviewImages]=useState([]);

  const [loading,setLoading]=useState(false);



  useEffect(()=>{

    loadProducts();

  },[]);



  async function loadProducts(){

    try{

      const data =
      await getProductsFromDB();

      setProducts(data);

    }

    catch(error){

      console.log(error);

    }

  }



  const filteredProducts =
  useMemo(()=>{

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

      return;

    }



    setSelectedProducts(prev=>([

      ...prev,

      {

        id:product.id,

        name:product.name,

        price:product.price,

        image:product.image,

        quantity:1,

      }

    ]));



    setSearch("");

  }





  function increaseQty(id){

    setSelectedProducts(prev=>

      prev.map(item=>

        item.id===id

        ?

        {

          ...item,

          quantity:

          item.quantity+1,

        }

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

          quantity:

          Math.max(

            1,

            item.quantity-1

          ),

        };

      })

    );

  }





  function removeProduct(id){

    setSelectedProducts(prev=>

      prev.filter(

        item=>item.id!==id

      )

    );

  }



  function handleImageChange(e){

    const files =
    Array.from(e.target.files);

    setImages(prev=>[

      ...prev,

      ...files,

    ]);



    const previews =

    files.map(file=>({

      file,

      url:
      URL.createObjectURL(file),

    }));



    setPreviewImages(prev=>[

      ...prev,

      ...previews,

    ]);



    e.target.value="";
  }





  function removeImage(index){

    URL.revokeObjectURL(

      previewImages[index].url

    );



    setImages(

      images.filter(

        (_,i)=>i!==index

      )

    );



    setPreviewImages(

      previewImages.filter(

        (_,i)=>i!==index

      )

    );

  }






  async function handleSubmit(e){

    e.preventDefault();



    if(

      !customerName ||

      !phone ||

      selectedProducts.length===0 ||

      !reason

    ){

      errorToast(

        "Please fill all required fields."

      );

      return;

    }



    try{

      setLoading(true);



      const uploaded =

      images.length

      ?

      await uploadImages(images)

      :

      [];



      await addReturnByAdmin({

        customerName,

        phone,

        email,



        returnRequested:true,



        returnRequest:{

          status:"Submitted",

          reason,

          description,

          returnType,



          refundMethod,

          refundNumber,



          items:selectedProducts,



          images:

          uploaded.map(

            img=>img.imageUrl

          ),



          pickupAddress:{

            name:pickupName,

            phone:pickupPhone,

            address:pickupAddress,

            postOffice:pickupPostOffice,

            thana:pickupThana,

            district:pickupDistrict,

          },



          createdAt:
          new Date()
          .toISOString(),

        },

      });



      successToast(

        "Return added successfully."

      );



      setCustomerName("");

      setPhone("");

      setEmail("");



      setSelectedProducts([]);



      setReason("");

      setDescription("");



      setReturnType("Exchange");



      setRefundMethod("");

      setRefundNumber("");



      setPickupName("");

      setPickupPhone("");

      setPickupAddress("");

      setPickupPostOffice("");

      setPickupThana("");

      setPickupDistrict("");



      setImages([]);

      setPreviewImages([]);

    }

    catch(error){

      console.log(error);

      errorToast(

        "Failed to save return."

      );

    }

    finally{

      setLoading(false);

    }

  }



  return(



    <div
className="
min-h-screen
bg-[#FAF7F2]
p-4
md:p-8
"
>

<div
className="
max-w-3xl
mx-auto
"
>

<div
className="
mb-5
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

<div className="text-center">

<h1
className="
text-2xl
font-black
text-[#172033]
"
>
Add Return
</h1>

<p
className="
text-sm
text-gray-500
mt-1
"
>
Create a new return request
</p>

</div>

</div>
  

<h1
className="
text-2xl
font-black
text-[#172033]
"
>
Add Return
</h1>

<p
className="
text-sm
text-gray-500
mt-1
"
>
Create a new return request
</p>

</div>

<form

onSubmit={handleSubmit}

className="
bg-white
rounded-lg
border
border-gray-100
shadow-sm
p-5
space-y-5
"

>





{/* =========================
    CUSTOMER INFORMATION
========================= */}

<div
className="
border
rounded-lg
p-5
space-y-4
"
>

<h2
className="
font-black
text-lg
"
>
Customer Information
</h2>

<div>

<label
className="
block
font-semibold
text-sm
mb-2
"
>
Customer Name
</label>

<input

type="text"

value={customerName}

onChange={(e)=>
setCustomerName(
e.target.value
)
}

className="
w-full
h-12
border
rounded-xl
px-4
outline-none
focus:border-amber-400
"

/>

</div>





<div>

<label
className="
block
font-semibold
text-sm
mb-2
"
>
Phone Number
</label>

<input

type="text"

value={phone}

onChange={(e)=>
setPhone(
e.target.value
)
}

className="
w-full
h-12
border
rounded-lg
px-4
outline-none
focus:border-amber-400
"

/>

</div>





<div>

<label
className="
block
font-semibold
text-sm
mb-2
"
>
Email (Optional)
</label>

<input

type="email"

value={email}

onChange={(e)=>
setEmail(
e.target.value
)
}

className="
w-full
h-12
border
rounded-lg
px-4
outline-none
focus:border-amber-400
"

/>

</div>

</div>



  {/* =========================
    SELECT PRODUCT
========================= */}

<div
className="
border
rounded-lg
p-5
space-y-4
"
>

<h2
className="
font-black
text-lg
"
>
Select Product
</h2>

<div className="relative">

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

placeholder="Search Product..."

className="
w-full
h-12
border
rounded-lg
pl-11
pr-4
outline-none
focus:border-amber-400
"

/>

</div>

{
filteredProducts.length>0 && (

<div
className="
border
rounded-lg
overflow-hidden
max-h-72
overflow-y-auto
"
>

{

filteredProducts.map(product=>(

<button

key={product.id}

type="button"

onClick={()=>
addProduct(product)
}

className="
w-full
flex
items-center
justify-between
p-3
border-b
hover:bg-gray-50
"

>

<div className="text-left">

<p className="font-bold">

{product.name}

</p>

<p className="text-sm text-gray-500">

৳ {product.price}

</p>

</div>

</button>

))

}

</div>

)

}



<h2
className="
font-black
mt-2
"
>

Selected Products

</h2>

<div className="space-y-3">

{

selectedProducts.length===0

?

<div
className="
text-sm
text-gray-400
"
>

No Product Selected

</div>

:

selectedProducts.map(product=>(

<div

key={product.id}

className="
border
rounded-lg
p-4
"

>

<div className="flex gap-3">

<img

src={product.image}

className="
w-20
h-20
rounded-lg
object-cover
"

/>

<div className="flex-1">

<div
className="
flex
justify-between
items-start
"
>

<h3
className="
font-bold
"
>

{product.name}

</h3>

<button

type="button"

onClick={()=>
removeProduct(product.id)
}

className="
text-red-500
"

>

<FiX size={18}/>

</button>

</div>

<div
className="
flex
items-center
justify-between
gap-3
mt-4
"
>

<div
className="
flex
items-center
gap-2
"
>

<button

type="button"

onClick={()=>
decreaseQty(product.id)
}

className="
w-7
h-7
rounded-lg
bg-gray-100
flex
items-center
justify-center
text-sm
"

>

<FiMinus/>

</button>

<span
className="
font-bold
min-w-[20px]
text-center
"
>

{product.quantity}

</span>

<button

type="button"

onClick={()=>
increaseQty(product.id)
}

className="
w-7
h-7
rounded-lg
bg-amber-500
text-white
flex
items-center
justify-center
text-sm
"

>

<FiPlus/>

</button>

</div>

<p
className="
text-xl
font-black
text-amber-600
whitespace-nowrap
"
>

৳ {product.price}

</p>

</div>

</div>

</div>

</div>

))

}

</div>

</div>



  {/* =========================
    RETURN INFORMATION
========================= */}

<div
className="
border
rounded-lg
p-5
space-y-4
"
>

<h2
className="
font-black
text-lg
"
>
Return Information
</h2>

<div>

<label
className="
block
font-semibold
text-sm
mb-2
"
>
Reason
</label>

<input

type="text"

value={reason}

onChange={(e)=>
setReason(e.target.value)
}

placeholder="Reason for return"

className="
w-full
h-12
border
rounded-lg
px-4
outline-none
focus:border-amber-400
"

/>

</div>



<div>

<label
className="
block
font-semibold
text-sm
mb-2
"
>
Description
</label>

<textarea

rows={5}

value={description}

onChange={(e)=>
setDescription(e.target.value)
}

placeholder="Describe the problem..."

className="
w-full
border
rounded-lg
p-4
resize-none
outline-none
focus:border-amber-400
"

/>

</div>



<div>

<label
className="
block
font-semibold
text-sm
mb-2
"
>
Return Type
</label>

<select

value={returnType}

onChange={(e)=>
setReturnType(e.target.value)
}

className="
w-full
h-12
border
rounded-lg
px-4
outline-none
focus:border-amber-400
"

>

<option value="Exchange">

Exchange

</option>

<option value="Refund">

Refund

</option>

</select>

</div>



{

returnType==="Refund" && (

<>

<div>

<label
className="
block
font-semibold
text-sm
mb-2
"
>
Refund Method
</label>

<select

value={refundMethod}

onChange={(e)=>
setRefundMethod(e.target.value)
}

className="
w-full
h-12
border
rounded-lg
px-4
outline-none
focus:border-amber-400
"

>

<option value="">

Select Method

</option>

<option value="bKash">

bKash

</option>

<option value="Nagad">

Nagad

</option>

<option value="Rocket">

Rocket

</option>

</select>

</div>



<div>

<label
className="
block
font-semibold
text-sm
mb-2
"
>
Refund Number
</label>

<input

type="text"

value={refundNumber}

onChange={(e)=>
setRefundNumber(e.target.value)
}

placeholder="Enter account number"

className="
w-full
h-12
border
rounded-lg
px-4
outline-none
focus:border-amber-400
"

/>

</div>

</>

)

}

</div>



  {/* =========================
    PICKUP ADDRESS
========================= */}

<div
className="
border
rounded-lg
p-5
space-y-4
"
>

<h2
className="
font-black
text-lg
"
>
Pickup Address
</h2>





<div>

<label
className="
block
font-semibold
text-sm
mb-2
"
>
Pickup Address
</label>

<textarea

rows={3}

value={pickupAddress}

onChange={(e)=>
setPickupAddress(e.target.value)
}

className="
w-full
border
rounded-lg
p-4
resize-none
outline-none
focus:border-amber-400
"

/>

</div>





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
font-semibold
text-sm
mb-2
"
>
Post Office
</label>

<input

type="text"

value={pickupPostOffice}

onChange={(e)=>
setPickupPostOffice(e.target.value)
}

className="
w-full
h-12
border
rounded-lg
px-4
outline-none
focus:border-amber-400
"

/>

</div>





<div>

<label
className="
block
font-semibold
text-sm
mb-2
"
>
Thana
</label>

<input

type="text"

value={pickupThana}

onChange={(e)=>
setPickupThana(e.target.value)
}

className="
w-full
h-12
border
rounded-lg
px-4
outline-none
focus:border-amber-400
"

/>

</div>

</div>





<div>

<label
className="
block
font-semibold
text-sm
mb-2
"
>
District
</label>

<input

type="text"

value={pickupDistrict}

onChange={(e)=>
setPickupDistrict(e.target.value)
}

className="
w-full
h-12
border
rounded-lg
px-4
outline-none
focus:border-amber-400
"

/>

</div>

</div>




  {/* =========================
    PRODUCT IMAGES
========================= */}

<div
className="
border
rounded-lg
p-5
space-y-4
"
>

<h2
className="
font-black
text-lg
"
>
Product Images
</h2>

<label

htmlFor="return-images"

className="
h-44
border-2
border-dashed
border-gray-300
rounded-lg
bg-[#FAF7F2]
flex
flex-col
items-center
justify-center
cursor-pointer
hover:border-amber-400
transition
"

>

<FiImage
className="
text-5xl
text-amber-500
mb-3
"
/>

<p className="font-bold">

Click to Upload Images

</p>

<p className="text-xs text-gray-400 mt-1">

JPG • PNG • WEBP

</p>

</label>

<input

id="return-images"

type="file"

multiple

accept="image/*"

onChange={handleImageChange}

className="hidden"

/>



{

previewImages.length>0 && (

<div>

<h3
className="
font-bold
text-sm
mb-3
"
>

Preview

</h3>

<div
className="
grid
grid-cols-2
sm:grid-cols-3
gap-3
"
>

{

previewImages.map((image,index)=>(

<div

key={index}

className="
relative
rounded-lg
overflow-hidden
border
"

>

<img

src={image.url}

alt=""

className="
w-full
h-32
object-cover
"

/>

<button

type="button"

onClick={()=>
removeImage(index)
}

className="
absolute
top-2
right-2
w-8
h-8
rounded-full
bg-red-500
text-white
flex
items-center
justify-center
"

>

<FiTrash2 size={16}/>

</button>

</div>

))

}

</div>

</div>

)

}



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
"

>

{

loading

?

"Saving..."

:

"Save Return"

}

</Button>

</div>

</form>

</div>

</div>

);

      }
