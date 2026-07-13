import {
  useEffect,
  useState
} from "react";


import {
  FiImage,
  FiUploadCloud,
} from "react-icons/fi";


import Button from "../../components/ui/Button";


import {
  uploadSingleImage,
} from "../../services/uploadService";


import {
  getShopHeroBanner,
  saveShopHeroBanner,
} from "../../services/firestoreShopHeroService";


import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";





export default function ShopHeroBanner(){



const [
image,
setImage
]=useState(null);



const [
preview,
setPreview
]=useState("");



const [
loading,
setLoading
]=useState(false);








useEffect(()=>{


const loadBanner =
async()=>{


try{


const banner =
await getShopHeroBanner();



if(banner?.imageUrl){


setPreview(
banner.imageUrl
);


}


}
catch(error){

console.log(error);

}


};



loadBanner();



},[]);









const handleImageChange =
(e)=>{


const file =
e.target.files[0];



if(!file)
return;



setImage(file);



setPreview(
URL.createObjectURL(file)
);



};









const handleSubmit =
async(e)=>{


e.preventDefault();



if(!image){


errorToast(
"Please select a banner image."
);


return;


}



try{


setLoading(true);



const uploaded =
await uploadSingleImage(
image
);



await saveShopHeroBanner({


imageUrl:
uploaded.imageUrl,


publicId:
uploaded.publicId,


updatedAt:
new Date(),


});



successToast(
"Shop Hero Banner Updated Successfully!"
);



}

catch(error){


errorToast(
error.message ||
"Upload failed."
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

Shop Hero Banner

</h1>


<p

className="

text-sm

text-gray-500

mt-1

"

>

Upload homepage hero banner

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

<FiImage/>

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

  {/* BANNER PREVIEW */}


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

Current Banner

</label>




<div

className="

border

border-gray-200

rounded-lg

overflow-hidden

"

>


{
preview ?

(

<img

src={preview}

alt="Banner Preview"

className="

w-full

h-auto

object-cover

block

"

/>

)

:

(

<div

className="

h-32

bg-[#FAF7F2]

flex

items-center

justify-center

text-gray-400

text-sm

"

>

No Banner Selected

</div>

)

}



</div>



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

Upload Banner Image

<span

className="

text-amber-500

ml-1

"

>

*

</span>

</label>





<label

htmlFor="shop-hero-image"

className="

h-32

rounded-lg

border

border-dashed

border-gray-300

bg-[#FAF7F2]

flex

flex-col

items-center

justify-center

cursor-pointer

hover:bg-gray-50

transition

"

>


<div

className="

text-amber-500

text-2xl

mb-1

"

>

<FiUploadCloud size={28}/>

</div>




<p

className="

text-sm

font-semibold

text-[#172033]

"

>

Upload Banner

</p>



<p

className="

text-xs

text-gray-400

mt-1

"

>

PNG JPG WEBP

</p>



</label>





<input

id="shop-hero-image"

type="file"

accept="image/*"

className="hidden"

onChange={handleImageChange}

/>



<p

className="

text-xs

text-gray-500

mt-2

"

>

Recommended Size:
1536 × 801 px

</p>


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

"Uploading..."

:

"Save Shop Hero Banner"

}

</Button>






</form>


</div>


</div>


);

}
