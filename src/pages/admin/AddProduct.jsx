import {
  useState
} from "react";


import {
  FiBox,
  FiUploadCloud,
  FiDollarSign,
  FiFileText,
} from "react-icons/fi";


import toast from "react-hot-toast";


import Button from "../../components/ui/Button";


import {
  uploadSingleImage
} from "../../services/uploadService";


import {
  addProductToDB
} from "../../services/firestoreProductService";


import {
  serverTimestamp
} from "firebase/firestore";




export default function AddProduct(){


const [product,setProduct] = useState({

name:"",

description:"",

price:"",

imageUrl:"",

imagePublicId:""

});



const [
imageFile,
setImageFile
]=useState(null);



const [
preview,
setPreview
]=useState("");



const [
loading,
setLoading
]=useState(false);






const handleChange=(e)=>{


setProduct({

...product,

[e.target.name]:e.target.value

});


};






const handleImageChange=(e)=>{


const file=e.target.files[0];


if(file){


setImageFile(file);


setPreview(
URL.createObjectURL(file)
);


}


};








const handleSubmit=async(e)=>{


e.preventDefault();


try{


setLoading(true);



let imageData={};



if(imageFile){


const uploaded =
await uploadSingleImage(imageFile);



imageData={

imageUrl:
uploaded.imageUrl,


imagePublicId:
uploaded.publicId

};


}



await addProductToDB({

name:product.name,

description:
product.description,


price:Number(product.price),


...imageData,


createdAt:
serverTimestamp()


});




toast.success(
"Product added successfully!"
);



setProduct({

name:"",

description:"",

price:"",

imageUrl:"",

imagePublicId:""

});


setPreview("");

setImageFile(null);



}

catch(error){


console.log(error);


toast.error(
"Failed to add product"
);


}

finally{


setLoading(false);


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

Create new product

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

<FiBox/>

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






{/* NAME */}



<div>


<label

className="
block
font-bold
text-sm
mb-2
text-[#172033]
"

>

Product Name

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

<FiBox size={16}/>

</div>




<input


name="name"


value={product.name}


onChange={handleChange}


placeholder="Product name"


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
mb-2
text-[#172033]
"

>

Description

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


name="description"


value={product.description}


onChange={handleChange}


placeholder="Product description"


className="
w-full
pl-12
pt-3
pr-3
rounded-lg
border
border-gray-200
outline-none
resize-none
text-sm
focus:border-amber-400
"

/>



</div>


</div>









{/* PRICE */}



<div>


<label

className="
block
font-bold
text-sm
mb-2
text-[#172033]
"

>

Price

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

<FiDollarSign size={16}/>

</div>





<input


type="number"


name="price"


value={product.price}


onChange={handleChange}


placeholder="Product price"


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

/>



</div>


</div>




  {/* IMAGE */}




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

Product Image

</label>





<label

htmlFor="image"

className="
h-36
rounded-xl
border
border-dashed
border-gray-300
bg-[#FAF7F2]
flex
flex-col
items-center
justify-center
cursor-pointer
overflow-hidden
"

>



{

preview ?


<img

src={preview}

className="
w-28
h-28
object-cover
rounded-xl
"

/>



:


<>


<FiUploadCloud

className="
text-amber-500
text-3xl
mb-2
"

/>


<p

className="
text-sm
font-semibold
"

>

Upload Product Image

</p>


<p

className="
text-xs
text-gray-400
"

>

PNG JPG WEBP

</p>


</>


}



</label>




<input

id="image"

type="file"

accept="image/*"

className="hidden"

onChange={handleImageChange}

/>



</div>



{/* BUTTON */}



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
text-sm
shadow
"

>


{
loading
?
"Saving..."
:
"Add Product"
}



</Button>







</form>



</div>



</div>



);


}
