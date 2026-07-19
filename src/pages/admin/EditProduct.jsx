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
category,
setCategory
]=useState("");



const [
description,
setDescription
]=useState("");



const [
price,
setPrice
]=useState("");



const [
stock,
setStock
]=useState("");




const [
image,
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






useEffect(()=>{

loadProduct();

},[id]);






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



setCategory(
product.category || ""
);



setDescription(
product.description || ""
);



setPrice(
product.price || ""
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



}

catch(error){

console.log(error);

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


category,


description,


price:Number(price),


stock:Number(stock),



image:
finalImages[0] || "",



images:
finalImages,


}

);





alert(
"Product updated successfully"
);



navigate(
"/admin/products"
);



}

catch(error){

console.log(error);


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
"

>

Edit Product

</h1>


<div className="w-[75px]">
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

placeholder="Category"

value={category}

onChange={(e)=>
setCategory(e.target.value)
}

/>


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
h-56
border-2
border-dashed
border-amber-400
rounded-3xl
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
