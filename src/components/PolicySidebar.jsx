import { Link } from "react-router-dom";


export default function PolicySidebar(){


const links=[

{
name:"Return Policy",
path:"/return-policy"
},

{
name:"Refund Policy",
path:"/refund-policy"
},

{
name:"Shipping Policy",
path:"/shipping-policy"
},

{
name:"Privacy Policy",
path:"/privacy-policy"
},

{
name:"Terms & Conditions",
path:"/terms"
},

{
name:"Size Guide",
path:"/size-guide"
},

{
name:"Contact Us",
path:"/contact"
},

];



return (

<div
className="
bg-white
rounded-[30px]
shadow-premium
p-6
sticky
top-24
"
>


<h3
className="
text-xl
font-bold
text-blue-950
mb-5
"
>
Customer Service
</h3>



<div
className="
flex
flex-col
gap-3
"
>


{
links.map((item)=>(


<Link

key={item.path}

to={item.path}

className="
px-4
py-3
rounded-xl
text-gray-600
hover:bg-amber-500
hover:text-black
transition
"

>

{item.name}

</Link>


))
}



</div>


</div>


);


}
