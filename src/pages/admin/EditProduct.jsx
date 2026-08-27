import {
  useEffect,
  useState,
} from "react";


import {
  useNavigate,
  useParams,
} from "react-router-dom";


import {
  FiUploadCloud,
  FiArrowUp,
  FiArrowDown,
  FiArrowLeft,
  FiTrash2,
} from "react-icons/fi";


import {
  uploadImages,
} from "../../services/uploadService";


import Button from "../../components/ui/Button";

import { getCategories } from "../../services/categoryService";

import {
  getProductById,
  updateProductInDB,
} from "../../services/firestoreProductService";






export default function EditProduct(){


const {
  id
}=useParams();



const navigate =
useNavigate();





const [
loading,
setLoading
]=useState(true);



const [
saving,
setSaving
]=useState(false);



const [
name,
setName
]=useState("");



const [
productTitle,
setProductTitle
]=useState("");



const [
category,
setCategory
]=useState("");


const [
categories,
setCategories
]=useState([]);



const [
description,
setDescription
]=useState("");



const [
price,
setPrice
]=useState("");



const [
offerPrice,
setOfferPrice
]=useState("");



const [
stock,
setStock
]=useState("");




const [
_image,
setImage
]=useState("");



const [
images,
setImages
]=useState([]);




const [
newImages,
setNewImages
]=useState([]);



const [
themeColor,
setThemeColor
]=useState("#7e22ce");



const [
useGradient,
setUseGradient
]=useState(false);



const [
themeColorTo,
setThemeColorTo
]=useState("#f59e0b");



const [
gradientDirection,
setGradientDirection
]=useState("to right");






useEffect(()=>{

loadProduct();

// eslint-disable-next-line react-hooks/exhaustive-deps
},[id]);




  useEffect(()=>{

async function loadCategories(){

const data = await getCategories();

setCategories(data);

}

loadCategories();

},[]);
  



async function loadProduct(){


try{


const product =
await getProductById(id);



if(!product){

alert("Product not found");

navigate("/admin/products");

return;

}



setName(
product.name || ""
);



setProductTitle(
product.title || ""
);



setCategory(
product.category || ""
);



setDescription(
product.description || ""
);



setPrice(
product.price || ""
);



setOfferPrice(
product.offerPrice || ""
);



setStock(
product.stock || ""
);



setImage(
product.image || ""
);



setImages(
product.images || []
);



setThemeColor(
product.themeColor || "#7e22ce"
);



setUseGradient(
product.themeMode === "gradient"
);



setThemeColorTo(
product.themeColorTo || "#f59e0b"
);



setGradientDirection(
product.themeGradientDirection || "to right"
);



}

catch (error) {
    console.error(error);
  }


finally{

setLoading(false);

}


}









function handleCoverImage(index){


const updated =
[
...images
];



const selected =
updated[index];



updated.splice(
index,
1
);



updated.unshift(
selected
);



setImages(updated);


setImage(
updated[0]
);


}









function removeImage(index){


const updated =
images.filter(
(_,i)=>
i!==index
);



setImages(updated);



setImage(
updated[0] || ""
);


}









function moveImageUp(index){


if(index===0)
return;



const updated =
[
...images
];



[
updated[index-1],
updated[index]
]=
[
updated[index],
updated[index-1]
];



setImages(updated);


setImage(
updated[0]
);


}








function moveImageDown(index){


if(index===images.length-1)
return;



const updated =
[
...images
];



[
updated[index],
updated[index+1]
]=
[
updated[index+1],
updated[index]
];



setImages(updated);


setImage(
updated[0]
);


}






async function handleSubmit(e){


e.preventDefault();



try{


setSaving(true);



let finalImages =
[
...images
];





if(newImages.length > 0){


const uploaded =
await uploadImages(
newImages
);



finalImages=[
...finalImages,
...uploaded.map(
img=>img.imageUrl
)
];


}






await updateProductInDB(
id,
{


name,


title:productTitle,


category,


description,


price:Number(price),


offerPrice:
offerPrice
? Number(offerPrice)
: 0,


stock:Number(stock),



image:
finalImages[0] || "",



images:
finalImages,


themeColor,


themeMode:
useGradient ? "gradient" : "solid",


themeColorTo:
useGradient ? themeColorTo : "",


themeGradientDirection:
gradientDirection,


}

);





alert(
"Product updated successfully"
);



navigate(
"/admin/products"
);



}

catch(_error){



alert(
"Update failed"
);


}

finally{

setSaving(false);

}


}









if(loading){


return(

<div

className="
min-h-screen
bg-[#FAF7F2]
flex
items-center
justify-center
font-bold
text-gray-500
"

>

Loading...

</div>

);


}








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




{/* HEADER */}

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


<h1

className="
text-2xl
font-black
text-[#172033]
text-center
whitespace-nowrap
"

>

Edit Product

</h1>


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



<input

className="
w-full
h-12
px-3
rounded-lg
border
border-gray-200
outline-none
text-sm
text-gray-700
focus:border-amber-400
"

placeholder="Product name"

value={name}

onChange={(e)=>
setName(e.target.value)
}

/>


</div>




{/* PRODUCT TITLE */}


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

Product Title

</label>



<input

className="
w-full
h-12
px-3
rounded-lg
border
border-gray-200
outline-none
text-sm
text-gray-700
focus:border-amber-400
"

placeholder="Short title shown below product name"

value={productTitle}

onChange={(e)=>
setProductTitle(e.target.value)
}

/>


</div>




{/* CATEGORY */}


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

Category

<span className="text-amber-500 ml-1">
*
</span>

</label>



<select

value={category}

onChange={(e)=>
setCategory(e.target.value)
}

className="
w-full
h-12
px-3
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

<option value="">
Select Category
</option>


{
categories.map((item)=>(

<option
key={item.id}
value={item.name}
>

{item.name}

</option>

))
}


</select>


</div>








{/* DESCRIPTION */}


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

Description

</label>


<textarea

rows="4"

className="
w-full
p-3
rounded-lg
border
border-gray-200
outline-none
text-sm
text-gray-700
focus:border-amber-400
resize-none
"

placeholder="Product description"

value={description}

onChange={(e)=>
setDescription(e.target.value)
}

/>

<p className="text-xs text-gray-400 mt-1">
প্রতিটা পয়েন্ট আলাদা টিক-মার্ক হিসেবে দেখাতে দুইটা লাইনের মাঝে
একটা খালি লাইন রাখুন (Enter দুইবার চাপুন)। শুধু একবার Enter দিলে
লাইনটা আগের পয়েন্টের সাথেই জোড়া লেগে যাবে।
</p>


</div>









{/* PRICE + STOCK */}



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

</label>


<input

type="number"

className="
w-full
h-12
px-3
rounded-lg
border
border-gray-200
outline-none
text-sm
text-gray-700
focus:border-amber-400
"

value={price}

onChange={(e)=>
setPrice(e.target.value)
}

/>


</div>



{/* OFFER PRICE */}


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

Offer Price (৳)

</label>



<input

type="number"

className="
w-full
h-12
px-3
rounded-lg
border
border-gray-200
outline-none
text-sm
text-gray-700
focus:border-amber-400
"

placeholder="Leave empty if no offer"

value={offerPrice}

onChange={(e)=>
setOfferPrice(e.target.value)
}

/>


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

Stock

</label>


<input

type="number"

className="
w-full
h-12
px-3
rounded-lg
border
border-gray-200
outline-none
text-sm
text-gray-700
focus:border-amber-400
"

value={stock}

onChange={(e)=>
setStock(e.target.value)
}

/>


</div>


</div>




{/* THEME COLOR */}


<div
className="
bg-[#FFF9ED]
border
border-[#FDECC8]
rounded-lg
p-4
"
>

<h3 className="font-bold text-sm text-[#172033]">
Product Theme Color
</h3>

<p className="text-xs text-gray-500 mt-1 mb-3">
Product Details পেজে দাম, টাইটেল ও accent element এর কালার হিসেবে এটা ব্যবহার হবে। ইচ্ছেমতো যেকোনো কালার দিন, অথবা দুইটা কালার মিক্স (গ্রেডিয়েন্ট) করুন।
</p>

{/* LIVE PREVIEW */}

<div
style={
useGradient
? {
backgroundImage:
`linear-gradient(${gradientDirection}, ${themeColor}, ${themeColorTo})`,
}
: { backgroundColor: themeColor }
}
className="
h-12
rounded-lg
mb-4
flex
items-center
justify-center
text-white
text-xs
font-bold
"
>
Preview
</div>

{/* COLOR 1 */}

<div
className="
flex
items-center
gap-3
"
>

<input
type="color"
value={themeColor}
onChange={(e)=>setThemeColor(e.target.value)}
className="
w-12
h-12
rounded-lg
border
border-gray-200
cursor-pointer
bg-white
p-1
shrink-0
"
/>

<input
type="text"
value={themeColor}
onChange={(e)=>setThemeColor(e.target.value)}
placeholder="#7e22ce"
className="
flex-1
h-12
rounded-lg
border
border-gray-200
px-4
outline-none
focus:border-amber-400
font-mono
text-sm
"
/>

</div>

{/* GRADIENT / MIX TOGGLE */}

<label
className="
flex
items-center
justify-between
mt-4
cursor-pointer
"
>

<span className="text-sm font-bold text-[#172033]">
দুইটা কালার মিক্স করুন (Gradient)
</span>

<input
type="checkbox"
className="hidden"
checked={useGradient}
onChange={(e)=>setUseGradient(e.target.checked)}
/>

<div
className={`
w-12
h-6
rounded-full
transition
${
useGradient
? "bg-amber-500"
: "bg-gray-300"
}
`}
>

<div
className={`
w-5
h-5
bg-white
rounded-full
mt-[2px]
shadow
transition
${
useGradient
? "translate-x-6"
: "translate-x-1"
}
`}
/>

</div>

</label>

{
useGradient && (

<div className="mt-4 space-y-3">

<div
className="
flex
items-center
gap-3
"
>

<input
type="color"
value={themeColorTo}
onChange={(e)=>setThemeColorTo(e.target.value)}
className="
w-12
h-12
rounded-lg
border
border-gray-200
cursor-pointer
bg-white
p-1
shrink-0
"
/>

<input
type="text"
value={themeColorTo}
onChange={(e)=>setThemeColorTo(e.target.value)}
placeholder="#f59e0b"
className="
flex-1
h-12
rounded-lg
border
border-gray-200
px-4
outline-none
focus:border-amber-400
font-mono
text-sm
"
/>

</div>

<select
value={gradientDirection}
onChange={(e)=>setGradientDirection(e.target.value)}
className="
w-full
h-12
rounded-lg
border
border-gray-200
px-4
outline-none
focus:border-amber-400
text-sm
bg-white
"
>

<option value="to right">বামে → ডানে</option>
<option value="to left">ডানে → বামে</option>
<option value="to bottom">উপরে → নিচে</option>
<option value="to top">নিচে → উপরে</option>
<option value="to bottom right">তির্যক (↘)</option>
<option value="to bottom left">তির্যক (↙)</option>

</select>

</div>

)
}

<p className="text-xs text-gray-500 mt-4 mb-2">
দ্রুত বেছে নিতে (ঐচ্ছিক):
</p>

<div
className="
flex
items-center
gap-2
flex-wrap
"
>

{[
"#7e22ce",
"#f59e0b",
"#111827",
"#1d4ed8",
"#e11d48",
"#059669",
"#db2777",
"#0891b2",
"#ea580c",
"#4338ca",
].map((color)=>(

<button
key={color}
type="button"
onClick={()=>setThemeColor(color)}
style={{ backgroundColor: color }}
className={`
w-8
h-8
rounded-full
border-2
transition
${
themeColor.toLowerCase()===color
? "border-[#172033] scale-110"
: "border-white"
}
`}
/>

))}

</div>

</div>




{/* UPLOAD NEW IMAGES */}

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

Add More Images

</label>




<div

className="
relative
"

>




<label

className="
w-full
h-30
border-2
border-dashed
border-amber-400
rounded-lg
flex
flex-col
items-center
justify-center
cursor-pointer
bg-[#FFFDF8]
"

>


<FiUploadCloud

size={40}

className="
text-amber-500
mb-3
"

/>



<p

className="
text-lg
font-black
text-[#172033]
"

>

Click to Upload Images

</p>



<p

className="
text-sm
text-gray-400
mt-1
"

>

JPG • PNG • WEBP (Multiple)

</p>



<input

type="file"

multiple

accept="image/*"

hidden

onChange={(e)=>{

setNewImages(
Array.from(e.target.files)
);

}}

/>


</label>



</div>









{/* NEW IMAGE PREVIEW */}



{
newImages.length > 0 &&

<div

className="
grid
grid-cols-2
md:grid-cols-4
gap-4
mt-4
"

>


{
newImages.map(
(file,index)=>(


<div

key={index}

className="
relative
"

>


<img

src={
URL.createObjectURL(file)
}

className="
h-32
w-full
object-cover
rounded-lg
border
border-gray-100
"

/>



<button

type="button"

onClick={()=>{

setNewImages(
newImages.filter(
(_,i)=>i!==index
)
);

}}

className="
absolute
top-2
right-2
w-7
h-7
rounded-full
bg-red-500
text-white
flex
items-center
justify-center
"

>

<FiTrash2 size={14}/>

</button>


</div>


)

)

}


</div>

}


</div>









{/* OLD IMAGES */}


{
images.length > 0 &&

<div>


<h3

className="
font-bold
text-[#172033]
mb-3
"

>

Product Images

</h3>





<div

className="
grid
grid-cols-2
md:grid-cols-4
gap-4
"

>


{
images.map(
(img,index)=>(


<div

key={index}

className="
border
border-gray-100
rounded-lg
p-2
"

>


<img

src={img}

className="
w-full
h-32
object-cover
rounded-lg
"

/>






<div

className="
mt-3
space-y-2
"

>


<button

type="button"

onClick={()=>
handleCoverImage(index)
}

className="
w-full
py-2
rounded-lg
bg-blue-500
text-white
text-sm
font-semibold
"

>

Set Cover

</button>





<button

type="button"

onClick={()=>
moveImageUp(index)
}

className="
w-full
py-2
rounded-lg
bg-gray-700
text-white
text-sm
font-semibold
flex
items-center
justify-center
gap-2
"

>

<FiArrowUp/>

Move Up

</button>






<button

type="button"

onClick={()=>
moveImageDown(index)
}

className="
w-full
py-2
rounded-lg
bg-gray-700
text-white
text-sm
font-semibold
flex
items-center
justify-center
gap-2
"

>

<FiArrowDown/>

Move Down

</button>






<button

type="button"

onClick={()=>
removeImage(index)
}

className="
w-full
py-2
rounded-lg
bg-red-500
text-white
text-sm
font-semibold
flex
items-center
justify-center
gap-2
"

>

<FiTrash2/>

Remove

</button>


</div>


</div>


)

)

}


</div>


</div>

}








{/* BUTTONS */}



<div

className="
flex
gap-3
"

>


<Button

type="submit"

disabled={saving}

className="
flex-1
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
saving
?
"Saving..."
:
"Save"
}


</Button>





<Button

type="button"

onClick={()=>
navigate("/admin/products")
}

className="
flex-1
h-12
rounded-lg
bg-gray-700
text-white
"

>

Cancel

</Button>



</div>





</form>


</div>


</div>


);

}
