import { useState } from "react";


export default function PolicyFAQ({
items=[]
}){


return (

<div
className="
mt-10
space-y-4
"
>


{
items.map((item,index)=>(

<FAQItem

key={index}

question={item.question}

answer={item.answer}

/>

))

}


</div>

);


}





function FAQItem({
question,
answer
}){


const [open,setOpen]=useState(false);



return (

<div
className="
border
border-slate-200
rounded-2xl
overflow-hidden
"
>


<button

onClick={()=>setOpen(!open)}

className="
w-full
flex
justify-between
items-center
p-5
text-left
font-semibold
text-blue-950
"

>


<span>
{question}
</span>


<span
className="
text-amber-500
text-xl
"
>

{open ? "-" : "+"}

</span>


</button>



{

open &&

<div
className="
px-5
pb-5
text-gray-600
"
>

{answer}

</div>

}



</div>


);


}
