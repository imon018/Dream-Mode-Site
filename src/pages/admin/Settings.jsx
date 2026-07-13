import {
  useState,
  useEffect
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


import {
  saveSettings,
  getSettings,
} from "../../services/settingsService";

import {
  uploadImages,
} from "../../services/uploadService";





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

logoUrl:"",

logoPublicId:"",

maintenanceMode:false,

});




const [
logoFile,
setLogoFile
]=useState(null);






// LOAD SETTINGS

useEffect(()=>{


const loadSettings = async()=>{


try{


const data = await getSettings();



if(data){


setSettings(data);



if(data.logoUrl){

setLogoPreview(
data.logoUrl
);

}


}



}
catch(error){


console.log(error);


}


};



loadSettings();



},[]);








// INPUT CHANGE

const handleChange=(e)=>{


setSettings({

...settings,

[e.target.name]:

e.target.value,

});


};







// LOGO PREVIEW ONLY

const handleLogoChange=(e)=>{


const file=e.target.files[0];


if(file){


setLogoFile(file);


setLogoPreview(
URL.createObjectURL(file)
);


}


};








// SAVE SETTINGS

const handleSave=async()=>{


try{


let logoData={};



if(logoFile){


const uploaded =
await uploadImages([logoFile]);



logoData={

logoUrl:
uploaded[0].imageUrl,


logoPublicId:
uploaded[0].publicId

};


}




await saveSettings({

...settings,

...logoData

});



alert(
"Settings saved successfully!"
);



}

catch(error){


console.log(error);



alert(
"Failed to save settings"
);


}


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

onSubmit={(e)=>{


e.preventDefault();


handleSave();


}}

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

<FiUser size={16}/>

</div>





<input


type="text"


name="storeName"


value={settings.storeName}


onChange={handleChange}


placeholder="Store Name"


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

<FiMail size={16}/>

</div>





<input


type="email"


name="email"


value={settings.email}


onChange={handleChange}


placeholder="Store email"


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

<FiPhone size={16}/>

</div>




<input


name="phone"


value={settings.phone}


onChange={handleChange}


placeholder="Phone number"


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

<FiMapPin size={16}/>

</div>




<textarea


rows="4"


name="address"


value={settings.address}


onChange={handleChange}


placeholder="Store address"


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

<FiFacebook size={16}/>

</div>




<input


name="facebook"


value={settings.facebook}


onChange={handleChange}


placeholder="Facebook URL"


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

<FiMessageCircle size={16}/>

</div>




<input


name="whatsapp"


value={settings.whatsapp}


onChange={handleChange}


placeholder="WhatsApp number"


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

className="
cursor-pointer
"

>


<input


type="checkbox"


className="sr-only"



checked={settings.maintenanceMode}



onChange={(e)=>


setSettings({

...settings,

maintenanceMode:
e.target.checked

})


}



/>



<div

className={`

w-12

h-6

rounded-full

transition


${
settings.maintenanceMode

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
settings.maintenanceMode

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









{/* SAVE BUTTON */}



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
