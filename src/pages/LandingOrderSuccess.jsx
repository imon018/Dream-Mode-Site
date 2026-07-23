import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";


import {
  FiCheckCircle,
  FiPackage,
  FiCalendar,
  FiTruck,
  FiCreditCard,
  FiShoppingBag,
  FiHeadphones,
  FiHome,
} from "react-icons/fi";


import {
  doc,
  getDoc,
} from "firebase/firestore";


import {
  db,
} from "../firebase/firestore";


import {
  useSettings,
} from "../context/SettingsContext";


import {
  getLandingPageBySlug,
} from "../services/landingPageService";



export default function LandingOrderSuccess(){


const navigate = useNavigate();


const {
  slug,
  orderId,
}=useParams();



const {
  settings
}=useSettings();



const [order,setOrder]=useState(null);

const [landing,setLanding]=useState(null);

const [loading,setLoading]=useState(true);





useEffect(()=>{


const loadData = async()=>{


try{


const orderSnap =
await getDoc(
doc(
db,
"orders",
orderId
)
);



if(orderSnap.exists()){


setOrder({

id:orderSnap.id,

...orderSnap.data(),

});


}





const landingData =
await getLandingPageBySlug(
slug
);


setLanding(
landingData
);



}

catch(error){

console.log(
error
);

}

finally{

setLoading(false);

}


};


loadData();


},[
slug,
orderId
]);







if(loading){


return (

<div
className="
min-h-screen
flex
items-center
justify-center
bg-[#FAF7F2]
"
>

Loading...

</div>

);

}






if(!order){


return (

<div
className="
min-h-screen
flex
items-center
justify-center
bg-[#FAF7F2]
"
>

<div
className="
bg-white
p-8
rounded-xl
shadow
"
>

Order not found

</div>


</div>

);

}






const orderDate =
order.createdAt
?
new Date(
order.createdAt
)
.toLocaleString(
"en-GB",
{
day:"2-digit",
month:"short",
year:"numeric"
}
)
:
"";








return (

<div
className="
min-h-screen
bg-[#FAF7F2]
px-4
py-8
"
>


<div
className="
max-w-xl
mx-auto
"
>




{/* SUCCESS */}


<div
className="
bg-[#fffaf0]
rounded-2xl
text-center
py-10
shadow-sm
"
>


<div
className="
w-24
h-24
mx-auto
rounded-full
bg-green-100
flex
items-center
justify-center
"
>


<FiCheckCircle
size={65}
className="
text-green-600
"
/>


</div>





<h1
className="
mt-6
text-3xl
font-black
text-green-700
"
>

অর্ডার সফল হয়েছে

</h1>



<p
className="
mt-3
text-gray-600
"
>

আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।

</p>



</div>








{/* ORDER INFO */}



<div
className="
mt-4
bg-white
rounded-2xl
overflow-hidden
shadow
"
>



<div
className="
p-5
flex
items-center
gap-4
"
>

<FiPackage
size={28}
className="
text-green-600
"
/>


<div>

<p
className="
text-gray-500
text-sm
"
>
অর্ডার নম্বর
</p>


<p
className="
font-black
text-xl
text-green-700
"
>

#{order.id.slice(0,8)}

</p>


</div>


</div>





<div
className="
border-t
"
/>





<div
className="
p-5
flex
justify-between
"
>


<div
className="
flex
gap-3
items-center
"
>

<FiCalendar/>

<span>
তারিখ
</span>

</div>


<span>
{orderDate}
</span>


</div>





<div
className="
border-t
"
/>



<div
className="
p-5
flex
justify-between
"
>


<div
className="
flex
gap-3
items-center
"
>

<FiCreditCard/>

<span>
Payment
</span>

</div>


<span>
Cash On Delivery
</span>


</div>





<div
className="
border-t
"
/>




<div
className="
p-5
flex
justify-between
"
>


<div
className="
flex
gap-3
items-center
"
>

<FiTruck/>

<span>
Delivery
</span>

</div>


<span>
2-4 Days
</span>


</div>




</div>










{/* PRODUCT */}



<div
className="
mt-4
bg-white
rounded-2xl
p-5
shadow
"
>


<h2
className="
font-black
text-xl
mb-4
"
>

অর্ডারকৃত পণ্য

</h2>



<div
className="
flex
gap-4
items-center
"
>



<img

src={
landing?.heroImages?.[0]
}

className="
w-24
h-24
rounded-xl
object-cover
"

/>



<div
className="
flex-1
"
>

<h3
className="
font-bold
"
>

{
order.items?.[0]?.name ||
landing?.title

}

</h3>


<p>
পরিমাণ:
{
order.items?.[0]?.quantity ||
1
}

</p>


</div>




<strong
className="
text-purple-700
text-xl
"
>

৳
{
order.total ||
order.items?.[0]?.price
}


</strong>



</div>



</div>









<button

onClick={()=>navigate("/")}

className="
mt-5
w-full
bg-purple-700
text-white
py-3
rounded-xl
font-bold
flex
justify-center
items-center
gap-2
"

>

<FiHome/>

হোম পেজে যান

</button>






<button

onClick={()=>navigate("/")}

className="
mt-3
w-full
border
border-purple-700
text-purple-700
py-3
rounded-xl
font-bold
flex
justify-center
items-center
gap-2
"

>


<FiShoppingBag/>

আরও কেনাকাটা করুন


</button>







<div
className="
mt-6
flex
justify-center
items-center
gap-3
text-gray-600
"
>

<FiHeadphones/>

হেল্পলাইন:

<span
className="
font-bold
text-purple-700
"
>

{
settings?.phone ||
""
}

</span>


</div>







</div>


</div>


);

}
