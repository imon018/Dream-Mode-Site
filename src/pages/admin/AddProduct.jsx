import { useState } from "react";

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



const input =
document.getElementById(
"product-image"
);


if(input)
input.value="";



}

catch(error){

console.log(error);


errorToast(
error.message ||
"Failed to add product."
);


}


};




return(


<div className="
min-h-screen
bg-[#FAF7F2]
p-4
md:p-6
">


<div className="
max-w-3xl
mx-auto
">


{/* HEADER */}


<div className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
mb-4
">


<h1 className="
text-xl
md:text-2xl
font-black
">

Add Product

</h1>


<p className="
text-sm
text-gray-500
mt-1
">

Create new product for your store

</p>


</div>





{/* FORM CARD */}


<form

onSubmit={handleSubmit}

className="
bg-white
border
border-gray-100
rounded-lg
p-5
shadow-sm
space-y-3
"


>


<input

className="
w-full
h-11
px-3
rounded-lg
border
border-gray-200
outline-none
text-sm
focus:border-amber-400
"

placeholder="Product Name"


value={name}

onChange={
e=>setName(e.target.value)
}


/>



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
focus:border-amber-400
"

placeholder="Product Description"


value={description}

onChange={
e=>setDescription(
e.target.value
)
}


/>



<div className="
grid
grid-cols-2
gap-3
">


<input

type="number"

className="
h-11
px-3
rounded-lg
border
border-gray-200
outline-none
text-sm
"

placeholder="Price"


value={price}

onChange={
e=>setPrice(e.target.value)
}


/>



<input

type="number"

className="
h-11
px-3
rounded-lg
border
border-gray-200
outline-none
text-sm
"

placeholder="Stock"


value={stock}

onChange={
e=>setStock(e.target.value)
}


/>


</div>  


{/* HERO BANNER TOGGLE */}


<div className="
flex
items-center
justify-between
border
border-gray-100
rounded-lg
p-3
bg-gray-50
">


<div>

<p className="
text-sm
font-bold
">

Hero Banner Product

</p>


<p className="
text-xs
text-gray-500
mt-1
">

Show this product on homepage banner

</p>

</div>




<label className="
relative
inline-flex
items-center
cursor-pointer
">


<input

type="checkbox"

className="sr-only"

checked={heroBanner}

onChange={
e=>setHeroBanner(
e.target.checked
)
}

/>



<div className={`
w-11
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

`}>



<div className={`
w-5
h-5
bg-white
rounded-full
mt-0.5
transition


${
heroBanner

?

"translate-x-5"

:

"translate-x-0.5"

}

`}

>

</div>


</div>


</label>


</div>








{/* IMAGE UPLOAD */}



<div className="
border
border-dashed
border-gray-300
rounded-lg
p-4
">


<p className="
text-sm
font-bold
mb-2
">

Product Images

</p>


<label

htmlFor="product-image"

className="
h-28
rounded-lg
bg-gray-50
border
border-gray-200
flex
items-center
justify-center
cursor-pointer
text-sm
text-gray-500
hover:bg-gray-100
"


>


Choose Images


</label>



<input

id="product-image"

type="file"

multiple

accept="image/*"

className="
hidden
"

onChange={
e=>
setImages(
Array.from(
e.target.files
)
)
}


/>





{

images.length>0 &&

<p className="
text-xs
text-gray-500
mt-3
">

{images.length} image selected

</p>

}



</div>







{/* BUTTON */}



<Button

type="submit"

className="
w-full
h-11
rounded-lg
bg-amber-500
text-white
font-bold
"

>

Save Product

</Button>





</form>


</div>


</div>


);

}
