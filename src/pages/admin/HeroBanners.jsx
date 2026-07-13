import {
  useEffect,
  useState
} from "react";


import {
  FiImage,
  FiType,
  FiPackage,
  FiPhone,
  FiDollarSign,
  FiTag,
  FiTrash2,
} from "react-icons/fi";


import Button from "../../components/ui/Button";


import {
  uploadSingleImage,
} from "../../services/uploadService";


import {
  addBanner,
  getAllBanners,
  deleteBanner,
  canAddBanner,
} from "../../services/firestoreBannerService";


import {
  getProductsFromDB,
} from "../../services/firestoreProductService";


import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";




export default function HeroBanners(){


const [products,setProducts]=useState([]);

const [banners,setBanners]=useState([]);

const [loading,setLoading]=useState(false);


const [title,setTitle]=useState("");

const [subtitle,setSubtitle]=useState("");

const [productId,setProductId]=useState("");

const [productName,setProductName]=useState("");

const [
whatsappNumber,
setWhatsappNumber
]=useState("8801406978619");


const [offerPrice,setOfferPrice]=useState("");

const [regularPrice,setRegularPrice]=useState("");

const [badgeText,setBadgeText]=useState(
"Premium Collection"
);


const [image,setImage]=useState(null);





useEffect(()=>{

loadData();

},[]);





const loadData=async()=>{

try{


const [
productData,
bannerData
]=await Promise.all([

getProductsFromDB(),

getAllBanners(),

]);


setProducts(productData);

setBanners(bannerData);



}

catch(error){

console.log(error);

}

};






const handleProductChange=(e)=>{


const id=e.target.value;


setProductId(id);



const product =
products.find(
item=>item.id===id
);



if(product){

setProductName(
product.name
);

}



};







const resetForm=()=>{


setTitle("");

setSubtitle("");

setProductId("");

setProductName("");

setOfferPrice("");

setRegularPrice("");

setBadgeText(
"Premium Collection"
);


setImage(null);



const fileInput =
document.getElementById(
"hero-banner-image"
);



if(fileInput){

fileInput.value="";

}



};








const handleSubmit=async(e)=>{


e.preventDefault();



if(
!title ||
!subtitle ||
!productId ||
!image
){


errorToast(
"Please fill all required fields."
);


return;


}



try{


setLoading(true);



const allowed =
await canAddBanner();



if(!allowed){


errorToast(
"Maximum 5 banners allowed."
);


return;


}




const uploaded =
await uploadSingleImage(
image
);



await addBanner({


title,

subtitle,


image:
uploaded.imageUrl,


productId,


productName,


whatsappNumber,


offerPrice:
Number(offerPrice)||0,


regularPrice:
Number(regularPrice)||0,


badgeText,


});



successToast(
"Banner Added Successfully"
);



resetForm();


loadData();



}

catch(error){


console.log(error);


errorToast(
"Failed To Add Banner"
);


}

finally{

setLoading(false);

}


};







const handleDelete=async(id)=>{


const confirmDelete =
window.confirm(
"Delete this banner?"
);



if(!confirmDelete)
return;



try{


await deleteBanner(id);


successToast(
"Banner Deleted"
);



loadData();



}

catch{


errorToast(
"Delete Failed"
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

max-w-5xl

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

Hero Banner Manager

</h1>


<p

className="

text-sm

text-gray-500

mt-1

"

>

Manage homepage banners

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

<FiImage/>

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

space-y-5

"

>




<div

className="

grid

grid-cols-1

md:grid-cols-2

gap-4

"

>



{/* TITLE */}

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

Banner Title

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

<FiType size={15}/>

</div>


<input

className={inputClass}

placeholder="Enter banner title"

value={title}

onChange={
e=>setTitle(
e.target.value
)
}

/>


</div>

</div>






{/* SUBTITLE */}


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

Subtitle

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

focus:border-amber-400

"

placeholder="Enter subtitle"

value={subtitle}

onChange={
e=>setSubtitle(
e.target.value
)
}

/>


</div>






{/* PRODUCT */}


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

Select Product

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


<select

value={productId}

onChange={handleProductChange}

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

>


<option value="">

Select Product

</option>


{

products.map(product=>(

<option

key={product.id}

value={product.id}

>

{product.name}

</option>

))

}


</select>


</div>

</div>






{/* WHATSAPP */}


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

WhatsApp Number

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

placeholder="WhatsApp number"

value={whatsappNumber}

onChange={
e=>setWhatsappNumber(
e.target.value
)
}

/>


</div>

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

Offer Price

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

৳

</div>



<input

className={inputClass}

placeholder="Offer price"

value={offerPrice}

onChange={
e=>setOfferPrice(
e.target.value
)
}

/>


</div>


</div>






{/* REGULAR PRICE */}


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

Regular Price

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

focus:border-amber-400

"

placeholder="Regular price"

value={regularPrice}

onChange={
e=>setRegularPrice(
e.target.value
)
}

/>


</div>







{/* BADGE */}


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

Badge Text

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

<FiTag size={15}/>

</div>



<input

className={inputClass}

placeholder="Badge text"

value={badgeText}

onChange={
e=>setBadgeText(
e.target.value
)
}

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

Banner Image

<span className="text-amber-500 ml-1">

*

</span>

</label>


<input

id="hero-banner-image"

type="file"

accept="image/*"

className="

w-full

h-12

border

border-gray-200

rounded-lg

p-2

text-sm

"

onChange={
e=>setImage(
e.target.files[0]
)
}

/>


</div>




</div>





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

"

>

{

loading

?

"Uploading..."

:

"Save Banner"

}


</Button>



</form>







{/* CURRENT BANNERS */}


<div className="mt-8">


<h2

className="

text-xl

font-black

text-[#172033]

mb-4

"

>

Current Banners ({banners.length}/5)

</h2>



<div

className="

grid

grid-cols-1

md:grid-cols-2

gap-5

"

>


{

banners.map(banner=>(


<div

key={banner.id}

className="

bg-white

rounded-lg

border

border-gray-100

shadow-sm

overflow-hidden

"

>


<img

src={banner.image}

alt=""

className="

w-full

h-48

object-cover

"

/>



<div className="p-4">


<h3

className="

font-black

text-lg

text-[#172033]

"

>

{banner.title}

</h3>



<p className="text-sm text-gray-500 mt-1">

{banner.subtitle}

</p>



<p className="text-sm mt-3">

Product: {banner.productName}

</p>



<button

onClick={()=>
handleDelete(
banner.id
)
}

className="

mt-4

flex

items-center

gap-2

bg-red-500

text-white

px-4

py-2

rounded-lg

text-sm

"

>

<FiTrash2/>

Delete

</button>


</div>


</div>


))


}


</div>


</div>


</div>


</div>


);

}
