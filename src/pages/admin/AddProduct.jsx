import {
  useState
} from "react";


import {
  FiSettings,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiMessageCircle,
  FiUploadCloud,
} from "react-icons/fi";


import Button from "../../components/ui/Button";




export default function Settings(){



const [
settings,
setSettings
]=useState({

storeName:"Dream Mode",

email:"",

phone:"",

address:"",

facebook:"",

whatsapp:"",

});



const [
logo,
setLogo
]=useState(null);



const [
logoPreview,
setLogoPreview
]=useState("");



const [
maintenanceMode,
setMaintenanceMode
]=useState(false);






const handleChange=(e)=>{


setSettings({

...settings,

[e.target.name]:
e.target.value,

});


};






const handleLogoChange=(e)=>{


const file=e.target.files[0];


if(file){

setLogo(file);


setLogoPreview(
URL.createObjectURL(file)
);

}


};





const handleSave=()=>{


alert(
"Settings save feature will be connected later."
);


};








const inputClass = `

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

focus:border-amber-400

`;








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

System Settings

</h1>


<p

className="
text-sm
text-gray-500
mt-1
"

>

Manage store information

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

<FiSettings/>

</div>


</div>









<form

onSubmit={(e)=>{

e.preventDefault();

handleSave();

}}

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







{/* STORE LOGO */}



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

Store Logo

</label>




<div

className="
border
border-gray-200
rounded-xl
p-4
"

>



<label

htmlFor="logo"

className="
h-36
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
overflow-hidden
"

>



{

logoPreview ?


<img

src={logoPreview}

className="
w-28
h-28
object-contain
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

Upload Store Logo

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

id="logo"

type="file"

accept="image/*"

className="hidden"

onChange={handleLogoChange}

/>



</div>



</div>









{/* STORE NAME */}



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

Store Name

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

<FiUser size={16}/>

</div>



<input


name="storeName"

value={settings.storeName}

onChange={handleChange}

className={inputClass}


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

Store Email

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

<FiMail size={16}/>

</div>



<input

name="email"

value={settings.email}

onChange={handleChange}

className={inputClass}

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

<FiPhone size={16}/>

</div>


<input

name="phone"

value={settings.phone}

onChange={handleChange}

className={inputClass}

/>


</div>


</div>








{/* ADDRESS */}


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

Store Address

</label>


<div className="relative">


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

<FiMapPin size={16}/>

</div>



<textarea

rows="4"

name="address"

value={settings.address}

onChange={handleChange}

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

/>



</div>


</div>









{/* FACEBOOK */}


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

Facebook URL

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

<FiFacebook size={16}/>

</div>


<input

name="facebook"

value={settings.facebook}

onChange={handleChange}

className={inputClass}

/>


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

<FiMessageCircle size={16}/>

</div>


<input

name="whatsapp"

value={settings.whatsapp}

onChange={handleChange}

className={inputClass}

/>


</div>


</div>









{/* MAINTENANCE MODE */}


<div

className="
bg-[#FFF9ED]
rounded-xl
p-4
border
border-[#FDECC8]
flex
items-center
justify-between
"

>


<div>


<h3

className="
font-bold
text-sm
text-[#172033]
"

>

Maintenance Mode

</h3>


<p

className="
text-xs
text-gray-500
mt-1
"

>

Temporarily disable website

</p>


</div>





<label

className="cursor-pointer"

>


<input

type="checkbox"

className="sr-only"

checked={maintenanceMode}

onChange={(e)=>
setMaintenanceMode(
e.target.checked
)
}

/>


<div

className={`

w-12
h-6
rounded-full
transition

${
maintenanceMode
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
maintenanceMode
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
shadow
"

>

Save Settings

</Button>







</form>


</div>


</div>


);


}
