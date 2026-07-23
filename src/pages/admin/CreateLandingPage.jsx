import { useEffect, useMemo, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  FiPackage,
  FiEdit3,
  FiImage,
  FiSettings,
  FiEye,
  FiXCircle,
  FiSearch,
  FiUpload,
  FiCheck,
} from "react-icons/fi";

import Button from "../../components/ui/Button";

import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";

import {
  getProductsFromDB,
} from "../../services/firestoreProductService";

import {
  createLandingPage,
} from "../../services/landingPageService";

import {
  uploadImages,
} from "../../services/uploadService";

import useSettings from "../../hooks/useSettings";

export default function CreateLandingPage() {

const navigate=useNavigate();

const { settings }=useSettings();

const fileInputRef=useRef(null);

const searchRef=useRef(null);

const [loading,setLoading]=useState(false);

const [products,setProducts]=useState([]);

const [selectedProduct,setSelectedProduct]=useState("");

const [productSearch,setProductSearch]=useState("");

const [showDropdown,setShowDropdown]=useState(false);

const [title,setTitle]=useState("");

const [slug,setSlug]=useState("");

const [description,setDescription]=useState("");

const [heroTitle,setHeroTitle]=useState("");

const [heroDescription,setHeroDescription]=useState("");

const [price,setPrice]=useState("");

const [offerPrice,setOfferPrice]=useState("");

const [heroImages,setHeroImages]=
useState([]);

const [uploading,setUploading]=useState(false);

const [status,setStatus]=
useState("published");

const [showCancelModal,setShowCancelModal]=useState(false);

const [facebookPixel,setFacebookPixel]=useState("");

const [googleAnalytics,setGoogleAnalytics]=useState("");

const [successMessage,setSuccessMessage]=useState("");

const [collectName,setCollectName]=useState(true);

const [collectPhone,setCollectPhone]=useState(true);

const [collectAddress,setCollectAddress]=useState(true);

const [collectCity,setCollectCity]=useState(false);

const [collectNotes,setCollectNotes]=useState(false);

const websiteUrl=
settings?.websiteUrl?.trim()
||
window.location.origin;

useEffect(()=>{

loadProducts();

},[]);

useEffect(()=>{

function handleClickOutside(e){

if(
searchRef.current &&
!searchRef.current.contains(e.target)
){

setShowDropdown(false);

}

}

document.addEventListener(
"mousedown",
handleClickOutside
);

return()=>{

document.removeEventListener(
"mousedown",
handleClickOutside
);

};

},[]);



async function loadProducts(){

  try{

    const data=
    await getProductsFromDB();

    setProducts(data);

  }

  catch(error){

    console.log(error);

    errorToast(
      "Failed to load products."
    );

  }

}

const filteredProducts=

products.filter(product=>{

const keyword=

productSearch
.toLowerCase()
.trim();

if(!keyword) return true;

return(

(product.name||"")

.toLowerCase()

.includes(keyword)

);

});

function handleProductSelect(id){

setSelectedProduct(id);

const product=

products.find(

item=>item.id===id

);

if(!product) return;

setProductSearch(
product.name||""
);

setShowDropdown(false);

setTitle(
product.name||""
);

setSlug(

(product.name||"")

.toLowerCase()

.replace(/\s+/g,"-")

.replace(/[^a-z0-9-]/g,"")

);

setDescription(
product.description||""
);

setHeroTitle(
product.name||""
);

setHeroDescription(
product.shortDescription||
product.description||
""
);

setPrice(
product.price||0
);

setOfferPrice(

product.offerPrice||

product.price||

0

);

const images=[];

if(product.image){

images.push(product.image);

}

if(

Array.isArray(product.images)

){

product.images.forEach(img=>{

if(

img &&

!images.includes(img)

){

images.push(img);

}

});

}

setHeroImages(images);

}

async function handleImageUpload(e){

const files=

Array.from(
e.target.files||[]
);

if(!files.length) return;

try{

setUploading(true);

const uploaded=

await uploadImages(files);

setHeroImages(prev=>[

...prev,

...uploaded.map(

item=>item.imageUrl

)

]);

successToast(

"Image uploaded."

);

}

catch(error){

console.log(error);

errorToast(

"Image upload failed."

);

}

finally{

setUploading(false);

}

}

function removeHeroImage(index){

setHeroImages(

prev=>

prev.filter(

(_,i)=>i!==index

)

);

}



const landingData=

useMemo(()=>({

productId:selectedProduct,

title,

slug,

description,

heroTitle,

heroDescription,

heroImages,

price:
price
?
Number(price)
:
null,

offerPrice:Number(
offerPrice
),

status,

views:0,

orders:0,

revenue:0,

facebookPixel,

googleAnalytics,

successMessage,

orderForm:{

collectName,

collectPhone,

collectAddress,

collectCity,

collectNotes,

},

createdAt:new Date(),

}),[

selectedProduct,

title,

slug,

description,

heroTitle,

heroDescription,

heroImages,

price,

offerPrice,

status,

facebookPixel,

googleAnalytics,

successMessage,

collectName,

collectPhone,

collectAddress,

collectCity,

collectNotes,

]);

function handlePreview(){

const previewData={

productId:selectedProduct,

title,

slug,

description,

heroTitle,

heroDescription,

heroImages,

price:
price
?
Number(price)
:
null,

offerPrice:Number(
offerPrice
),

orderForm:{

collectName,

collectPhone,

collectAddress,

collectCity,

collectNotes,

},

status,

createdAt:new Date(),

};


sessionStorage.setItem(
"landingPreviewData",
JSON.stringify(previewData)
);


window.open(
"/admin/landing/preview",
"_blank"
);


}

	

async function handleSubmit(e){

e.preventDefault();

if(

!selectedProduct||

!title||

!slug||

!heroImages.length

){

errorToast(

"Please fill all required fields."

);

return;

}

try{

setLoading(true);

await createLandingPage(

landingData

);

successToast(

"Landing Page Created Successfully."

);

navigate(

"/admin/landing"

);

}

catch(error){

console.log(error);

errorToast(

error.message||

"Failed to create landing page."

);

}

finally{

setLoading(false);

}

}

function handleCancel(){

navigate(

"/admin/landing"

);

}



return(

<div
className="
min-h-screen
bg-[#FAF7F2]
p-4
lg:p-8
"
>

<div
className="
max-w-5xl
mx-auto
space-y-6
"
>

{/* =========================
HEADER
========================= */}

<div
className="
bg-white
rounded-xl
border
border-amber-200
shadow-sm
overflow-hidden
"
>

<div
className="
px-6
py-5
flex
items-center
justify-between
"
>

<div>

<h1
className="
text-2xl
lg:text-3xl
font-black
text-slate-900
"
>

Create Landing Page

</h1>

<p
className="
text-gray-500
mt-1
"
>

Landing Builder

</p>

</div>

<div
className="
w-14
h-14
rounded-xl
bg-amber-500
flex
items-center
justify-center
text-white
"
>

<FiPackage size={28}/>

</div>

</div>

</div>

<form

onSubmit={handleSubmit}

className="space-y-6"

>

{/* =========================
BASIC INFORMATION
========================= */}

<div
className="
bg-white
rounded-xl
border
border-amber-200
shadow-sm
overflow-hidden
"
>

<div
className="
px-5
py-4
bg-amber-50
border-b
border-amber-100
flex
items-center
gap-3
"
>

<div
className="
w-10
h-10
rounded-lg
bg-amber-500
text-white
flex
items-center
justify-center
"
>

<FiEdit3/>

</div>

<div>

<h2
className="
text-lg
font-bold
"
>

Basic Information

</h2>

<p
className="
text-xs
text-gray-500
"
>

Landing Page Basic Setup

</p>

</div>

</div>

<div
className="
p-5
space-y-5
"
>

{/* PAGE NAME */}

<div>

<label
className="
block
font-semibold
mb-2
"
>

Page Name

<span className="text-red-500">

*

</span>

</label>

<input

value={title}

onChange={(e)=>

setTitle(
e.target.value
)

}

placeholder="Page Name"

className="
w-full
h-12
rounded-lg
border
border-amber-200
px-4
outline-none
focus:border-amber-500
focus:ring-4
focus:ring-amber-100
"

/>

</div>

{/* SLUG */}

<div>

<label
className="
block
font-semibold
mb-2
"
>

Slug URL

<span className="text-red-500">

*

</span>

</label>

<div
className="
flex
rounded-lg
overflow-hidden
border
border-amber-200
"
>

<div
className="
w-1/2
px-4
bg-amber-50
flex
items-center
text-sm
text-gray-500
truncate
"
>

{`${websiteUrl}/landing/`}

</div>

<input

value={slug}

onChange={(e)=>

setSlug(
e.target.value
)

}

placeholder="landing-page"

className="
w-1/2
h-12
px-4
outline-none
"

/>

</div>

<p
className="
text-xs
text-gray-500
mt-2
break-all
"
>

Facebook Ad URL:
{websiteUrl}/landing/{slug||"your-page"}

</p>

</div>

{/* PRODUCT SEARCH */}

<div
className="relative"
ref={searchRef}
>

<label
className="
block
font-semibold
mb-2
"
>

Select Product

<span className="text-red-500">

*

</span>

</label>

<div
className="
relative
"
>

<FiSearch
className="
absolute
left-4
top-4
text-gray-400
"
/>

<input

value={productSearch}

onFocus={()=>setShowDropdown(true)}

onChange={(e)=>{

setProductSearch(
e.target.value
);

setShowDropdown(true);

}}

placeholder="Search Product..."

className="
w-full
h-12
pl-11
pr-4
rounded-lg
border
border-amber-200
outline-none
focus:border-amber-500
focus:ring-4
focus:ring-amber-100
"
/>

</div>

{

showDropdown && (

<div
className="
absolute
left-0
right-0
mt-2
bg-white
border
border-amber-200
rounded-xl
shadow-xl
overflow-hidden
z-50
max-h-80
overflow-y-auto
"
>

{

filteredProducts.length===0

?

<div
className="
p-6
text-center
text-gray-400
"
>

No Product Found

</div>

:

filteredProducts.map(product=>(

<button

key={product.id}

type="button"

onClick={()=>handleProductSelect(product.id)}

className="
w-full
flex
items-center
gap-3
p-3
hover:bg-amber-50
transition
border-b
last:border-b-0
"

>

<img

src={
product.image||

product.images?.[0]

}

alt={product.name}

className="
w-14
h-14
rounded-lg
object-cover
border
"

/>

<div
className="
flex-1
text-left
"
>

<h4
className="
font-semibold
line-clamp-1
"
>

{product.name}

</h4>

<p
className="
text-sm
text-amber-600
font-bold
"
>

৳{product.price}

</p>

</div>

{

selectedProduct===product.id && (

<FiCheck
className="
text-green-600
text-xl
"
/>

)

}

</button>

))

}

</div>

)

}

</div>

{/* DESCRIPTION */}

<div>

<label
className="
block
font-semibold
mb-2
"
>

Description

</label>

<textarea

rows={5}

value={description}

onChange={(e)=>

setDescription(
e.target.value
)

}

placeholder="Write landing page description..."

className="
w-full
rounded-lg
border
border-amber-200
p-4
resize-none
outline-none
focus:border-amber-500
focus:ring-4
focus:ring-amber-100
"

/>

</div>

</div>

</div>


  {/* =========================
HERO SECTION
========================= */}

<div
className="
bg-white
rounded-xl
border
border-amber-200
shadow-sm
overflow-hidden
"
>

<div
className="
px-5
py-4
bg-amber-50
border-b
border-amber-100
flex
items-center
gap-3
"
>

<div
className="
w-10
h-10
rounded-lg
bg-amber-500
text-white
flex
items-center
justify-center
"
>

<FiImage size={18}/>

</div>

<div>

<h2
className="
text-lg
font-bold
"
>

Hero Section

</h2>

<p
className="
text-xs
text-gray-500
"
>

Upload Hero Image & Content

</p>

</div>

</div>

<div
className="
p-5
space-y-5
"
>

{/* Upload */}

<div>

<label
className="
block
font-semibold
mb-2
"
>

Hero Images

</label>

<input

ref={fileInputRef}

type="file"

multiple

accept="image/*"

onChange={handleImageUpload}

className="hidden"

/>

<button

type="button"

onClick={()=>fileInputRef.current.click()}

className="
w-full
h-28
border-2
border-dashed
border-amber-300
rounded-xl
bg-amber-50
hover:bg-amber-100
transition
flex
flex-col
items-center
justify-center
gap-2
"

>

<FiUpload
size={26}
className="text-amber-500"
/>

<p
className="
font-semibold
text-gray-700
"
>

{

uploading

?

"Uploading..."

:

"Upload Hero Images"

}

</p>

<span
className="
text-xs
text-gray-500
"
>

PNG / JPG / WEBP

</span>

</button>

</div>

{/* Preview */}

{

heroImages.length>0 && (

<div
className="
grid
grid-cols-2
md:grid-cols-4
gap-4
"
>

{

heroImages.map((image,index)=>(

<div

key={index}

className="
relative
group
rounded-xl
overflow-hidden
border
border-amber-200
"

>

<img

src={image}

alt="Hero"

className="
w-full
h-40
object-cover
"

/>

<button

type="button"

onClick={()=>

removeHeroImage(index)

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
opacity-0
group-hover:opacity-100
transition
"

>

<FiXCircle/>

</button>

</div>

))

}

</div>

)

}

{/* Hero Title */}

<div>

<label
className="
block
font-semibold
mb-2
"
>

Hero Title

</label>

<input

value={heroTitle}

onChange={(e)=>

setHeroTitle(
e.target.value
)

}

placeholder="Amazing Product"

className="
w-full
h-12
rounded-lg
border
border-amber-200
px-4
outline-none
focus:border-amber-500
focus:ring-4
focus:ring-amber-100
"

/>

</div>

{/* Hero Description */}

<div>

<label
className="
block
font-semibold
mb-2
"
>

Hero Description

</label>

<textarea

rows={5}

value={heroDescription}

onChange={(e)=>

setHeroDescription(
e.target.value
)

}

placeholder="Write hero description..."

className="
w-full
rounded-lg
border
border-amber-200
p-4
resize-none
outline-none
focus:border-amber-500
focus:ring-4
focus:ring-amber-100
"

/>

</div>

{/* Pricing */}

<div
className="
grid
md:grid-cols-2
gap-5
"
>

<div>

<label
className="
block
font-semibold
mb-2
"
>

Regular Price

</label>

<input

type="number"

value={price}

onChange={(e)=>

setPrice(
e.target.value
)

}

className="
w-full
h-12
rounded-lg
border
border-amber-200
px-4
outline-none
focus:border-amber-500
focus:ring-4
focus:ring-amber-100
"

/>

</div>

<div>

<label
className="
block
font-semibold
mb-2
"
>

Offer Price

</label>

<input

type="number"

value={offerPrice}

onChange={(e)=>

setOfferPrice(
e.target.value
)

}

className="
w-full
h-12
rounded-lg
border
border-amber-200
px-4
outline-none
focus:border-amber-500
focus:ring-4
focus:ring-amber-100
"

/>

</div>

</div>

</div>

</div>



  {/* =========================
ORDER FORM SETUP
========================= */}

<div
className="
bg-white
rounded-xl
border
border-amber-200
shadow-sm
overflow-hidden
"
>

<div
className="
px-5
py-4
bg-amber-50
border-b
border-amber-100
flex
items-center
gap-3
"
>

<div
className="
w-10
h-10
rounded-lg
bg-amber-500
text-white
flex
items-center
justify-center
font-bold
"
>

📝

</div>

<div>

<h2
className="
text-lg
font-bold
"
>

Order Form Setup

</h2>

<p
className="
text-xs
text-gray-500
"
>

Choose which fields customers must fill.

</p>

</div>

</div>

<div
className="
p-5
space-y-4
"
>

{[
["Customer Name",collectName,setCollectName],
["Phone Number",collectPhone,setCollectPhone],
["Address",collectAddress,setCollectAddress],
["City",collectCity,setCollectCity],
["Order Notes",collectNotes,setCollectNotes],
].map(([label,value,setValue])=>(

<div

key={label}

className="
flex
items-center
justify-between
rounded-lg
border
border-amber-200
p-4
"

>

<div>

<h3
className="font-semibold"
>

{label}

</h3>

<p
className="
text-xs
text-gray-500
mt-1
"
>

Show this field on landing page.

</p>

</div>

<label
className="
relative
inline-flex
cursor-pointer
"
>

<input

type="checkbox"

checked={value}

onChange={(e)=>

setValue(
e.target.checked
)

}

className="sr-only peer"

/>

<div
className="
w-11
h-6
bg-gray-300
rounded-full
peer-checked:bg-amber-500
after:content-['']
after:absolute
after:left-[2px]
after:top-[2px]
after:bg-white
after:w-5
after:h-5
after:rounded-full
after:transition-all
peer-checked:after:translate-x-5
"
/>

</label>

</div>

))}

</div>

</div>

{/* =========================
ADDITIONAL SETTINGS
========================= */}

<div
className="
bg-white
rounded-xl
border
border-amber-200
shadow-sm
overflow-hidden
"
>

<div
className="
px-5
py-4
bg-amber-50
border-b
border-amber-100
flex
items-center
gap-3
"
>

<div
className="
w-10
h-10
rounded-lg
bg-amber-500
text-white
flex
items-center
justify-center
"
>

<FiSettings/>

</div>

<div>

<h2
className="
text-lg
font-bold
"
>

Additional Settings

</h2>

<p
className="
text-xs
text-gray-500
"
>

Tracking & Custom Settings

</p>

</div>

</div>

<div
className="
p-5
space-y-5
"
>

<div>

<label
className="
block
font-semibold
mb-2
"
>

Facebook Pixel ID

</label>

<input

value={facebookPixel}

onChange={(e)=>

setFacebookPixel(
e.target.value
)

}

placeholder="123456789012345"

className="
w-full
h-12
rounded-lg
border
border-amber-200
px-4
outline-none
focus:border-amber-500
focus:ring-4
focus:ring-amber-100
"

/>

</div>

<div>

<label
className="
block
font-semibold
mb-2
"
>

Google Analytics ID

</label>

<input

value={googleAnalytics}

onChange={(e)=>

setGoogleAnalytics(
e.target.value
)

}

placeholder="G-XXXXXXXXXX"

className="
w-full
h-12
rounded-lg
border
border-amber-200
px-4
outline-none
focus:border-amber-500
focus:ring-4
focus:ring-amber-100
"

/>

</div>

<div>

<label
className="
block
font-semibold
mb-2
"
>

Order Success Message

</label>

<textarea

rows={4}

value={successMessage}

onChange={(e)=>

setSuccessMessage(
e.target.value
)

}

placeholder="Thank you. Your order has been placed successfully."

className="
w-full
rounded-lg
border
border-amber-200
p-4
resize-none
outline-none
focus:border-amber-500
focus:ring-4
focus:ring-amber-100
"

/>

</div>

</div>

</div>



  {/* =========================
					Status
========================= */}


<div
className="
bg-white
rounded-xl
border
border-amber-200
shadow-sm
overflow-hidden
"
>

<div
className="
p-5
"
>

<label
className="
block
font-semibold
mb-3
"
>

Status

</label>

<div
className="
grid
grid-cols-2
gap-4
"
>

<button
type="button"
onClick={()=>
setStatus("published")
}
className={`
h-14
rounded-xl
font-bold
${
status==="published"
?
"bg-amber-500 text-white"
:
"border border-amber-200 bg-white text-slate-800"
}
`}
>

Published

</button>

<button
type="button"
onClick={()=>
setStatus("draft")
}
className={`
h-14
rounded-xl
font-bold
${
status==="draft"
?
"bg-amber-500 text-white"
:
"border border-amber-200 bg-white text-slate-800"
}
`}
>

Draft

</button>

</div>

</div>

</div>




{/* =========================
ACTION BUTTONS
========================= */}

<div
className="
grid
gap-3
md:grid-cols-3
"
>

<Button

type="submit"

disabled={
loading||
uploading
}

className="
h-12
rounded-xl
bg-amber-500
hover:bg-amber-600
text-white
font-bold
"

>

{

loading

?

"Creating..."

:

"Create Landing Page"

}

</Button>

<Button

type="button"

onClick={handlePreview}

className="
h-12
rounded-xl
bg-slate-900
hover:bg-slate-800
text-white
font-bold
flex
items-center
justify-center
gap-2
"

>

<FiEye/>

Preview

</Button>

<Button

type="button"

onClick={()=>

setShowCancelModal(true)

}

className="
h-12
rounded-xl
bg-red-500
hover:bg-red-600
text-white
font-bold
flex
items-center
justify-center
gap-2
"

>

<FiXCircle/>

Cancel

</Button>

</div>

</form>



  {/* =========================
    CANCEL MODAL
========================= */}

{
showCancelModal && (

<div
className="
fixed
inset-0
z-50
bg-black/50
backdrop-blur-sm
flex
items-center
justify-center
p-4
"
>

<div
className="
w-full
max-w-md
bg-white
rounded-2xl
shadow-2xl
overflow-hidden
animate-[fadeIn_.2s_ease]
"
>

<div className="p-7">

<div
className="
mx-auto
w-20
h-20
rounded-full
bg-red-100
flex
items-center
justify-center
mb-5
"
>

<FiXCircle
size={42}
className="text-red-500"
/>

</div>

<h2
className="
text-2xl
font-bold
text-center
"
>

Cancel Landing Page

</h2>

<p
className="
mt-3
text-center
text-gray-500
leading-7
"
>

Are you sure you want to cancel?

<br/>

All unsaved changes will be lost.

</p>

<div
className="
grid
grid-cols-2
gap-3
mt-8
"
>

<Button

type="button"

onClick={()=>

setShowCancelModal(false)

}

className="
bg-gray-200
hover:bg-gray-300
text-gray-700
rounded-xl
"

>

No

</Button>

<Button

type="button"

onClick={handleCancel}

className="
bg-red-500
hover:bg-red-600
text-white
rounded-xl
"

>

Yes

</Button>

</div>

</div>

</div>

</div>

)

}

</div>

</div>

);

}
