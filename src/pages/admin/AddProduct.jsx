import {
  useState
} from "react";


import {
  FiTag,
  FiFileText,
} from "react-icons/fi";


import Button from "../../components/ui/Button";


import {
  addProductToDB,
} from "../../services/firestoreProductService";


import {
  uploadImages,
} from "../../services/uploadService";


import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";





export default function AddProduct(){


const [name,setName]=useState("");

const [description,setDescription]=useState("");

const [price,setPrice]=useState("");

const [stock,setStock]=useState("");

const [images,setImages]=useState([]);

const [heroBanner,setHeroBanner]=useState(false);







const handleSubmit=async(e)=>{


e.preventDefault();


if(
!name ||
!description ||
!price ||
!stock ||
images.length===0
){

errorToast(
"Please fill all fields."
);

return;

}



try{


const uploadedImages =
await uploadImages(images);



await addProductToDB({

name,

description,

price:Number(price),

stock:Number(stock),


image:
uploadedImages[0].imageUrl,


images:
uploadedImages.map(
img=>img.imageUrl
),


publicIds:
uploadedImages.map(
img=>img.publicId
),


heroBanner,


createdAt:new Date(),

});



successToast(
"Product added successfully!"
);


setName("");
setDescription("");
setPrice("");
setStock("");
setImages([]);
setHeroBanner(false);



}

catch(error){

console.log(error);


errorToast(
error.message ||
"Failed to add product"
);


}


};









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





{/* HEADER */}


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

Add Product

</h1>


<p
className="
text-sm
text-gray-500
mt-1
"
>

Fill product information

</p>


</div>



<div
className="
w-11
h-11
rounded-xl
bg-[#FFF7E8]
flex
items-center
justify-center
text-amber-500
text-xl
"
>

🛍️

</div>



</div>







<form

onSubmit={handleSubmit}

className="
bg-white
rounded-xl
p-5
md:p-6
shadow-sm
border
border-gray-100
space-y-5
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

<span
className="
text-amber-500
ml-1
"
>
*
</span>


</label>



<div
className="
relative
"
>


<div
className="
absolute
left-3
top-1/2
-translate-y-1/2
w-8
h-8
rounded-lg
bg-[#FFF7E8]
flex
items-center
justify-center
text-amber-500
"
>

<FiTag size={16}/>

</div>




<input

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
focus:border-amber-400
"

placeholder="Enter product name"


value={name}


onChange={
e=>setName(
e.target.value
)
}


/>


</div>


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

Product Description


<span
className="
text-amber-500
ml-1
"
>
*
</span>


</label>





<div
className="
relative
"
>


<div
className="
absolute
left-3
top-3
w-8
h-8
rounded-lg
bg-[#FFF7E8]
flex
items-center
justify-center
text-amber-500
"
>

<FiFileText size={16}/>

</div>




<textarea


rows="4"


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
resize-none
focus:border-amber-400
"


placeholder="Write about your product..."


value={description}


onChange={
e=>setDescription(
e.target.value
)
}


/>



</div>


</div>





{/* CONTINUE PART 2 */}


  {/* PRICE + STOCK */}

<div
className="
grid
grid-cols-1
md:grid-cols-2
gap-4
"
>


{/* PRICE */}

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
w-8
h-8
rounded-lg
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

className="
w-full
h-12
pl-12
pr-3
rounded-xl
border
border-gray-200
outline-none
focus:border-amber-400
text-sm
"

placeholder="Enter price"

value={price}

onChange={(e)=>
setPrice(e.target.value)
}

/>


</div>


</div>





{/* STOCK */}

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

Stock Quantity

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
w-8
h-8
rounded-lg
bg-[#FFF7E8]
flex
items-center
justify-center
text-amber-500
"
>

📦

</div>


<input

type="number"

className="
w-full
h-12
pl-12
pr-3
rounded-xl
border
border-gray-200
outline-none
focus:border-amber-400
text-sm
"

placeholder="Enter stock"

value={stock}

onChange={(e)=>
setStock(e.target.value)
}

/>


</div>


</div>



</div>







{/* HERO BANNER */}


<div
className="
bg-[#FFF9ED]
rounded-xl
p-4
flex
items-center
justify-between
border
border-[#FDECC8]
"
>


<div
className="
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
bg-white
flex
items-center
justify-center
text-amber-500
"
>

⭐

</div>



<div>


<h3
className="
font-bold
text-sm
text-[#172033]
"
>

Use this product as Hero Banner

</h3>


<p
className="
text-xs
text-gray-500
mt-1
"
>

Show on homepage banner

</p>


</div>


</div>




<label
className="
cursor-pointer
"
>


<input

type="checkbox"

className="sr-only"

checked={heroBanner}

onChange={(e)=>
setHeroBanner(e.target.checked)
}

/>



<div
className={`
w-12
h-6
rounded-full
transition
${
heroBanner
?
"bg-amber-500"
:
"bg-gray-300"
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
heroBanner
?
"translate-x-6"
:
"translate-x-1"
}
`}
>


</div>


</div>


</label>


</div>








{/* IMAGE UPLOAD */}


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

Product Images

<span className="text-amber-500 ml-1">
*
</span>

</label>



<div
className="
border
border-gray-200
rounded-xl
p-4
"
>


<p
className="
text-xs
text-gray-500
mb-3
"
>

Add up to 5 images

</p>




<label

htmlFor="product-image"

className="
h-32
rounded-xl
border-dashed
border
border-gray-300
bg-[#FAF7F2]
flex
flex-col
items-center
justify-center
cursor-pointer
"

>


<div
className="
text-amber-500
text-2xl
"
>

☁️

</div>


<p
className="
text-sm
font-semibold
"
>

Upload Images

</p>


<p
className="
text-xs
text-gray-400
"
>

PNG JPG WEBP

</p>


</label>




<input

id="product-image"

type="file"

multiple

accept="image/*"

className="hidden"

onChange={(e)=>
setImages(
Array.from(e.target.files)
)
}

/>




{
images.length>0 &&

<div
className="
flex
gap-2
mt-3
flex-wrap
"
>

{

images.map((img,index)=>(

<div

key={index}

className="
w-16
h-16
rounded-lg
overflow-hidden
border
"

>


<img

src={
URL.createObjectURL(img)
}

className="
w-full
h-full
object-cover
"

/>


</div>


))

}

</div>

}


</div>


</div>







{/* BUTTON */}

<Button

type="submit"

className="
w-full
h-12
rounded-xl
bg-amber-500
text-white
font-bold
text-sm
shadow
"

>

💾 Save Product

</Button>





</form>


</div>


</div>


);

}
