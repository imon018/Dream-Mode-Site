import PolicyLayout from "../components/PolicyLayout";

import {
FiPhone,
FiMail,
FiMapPin
} from "react-icons/fi";

import { siteConfig } from "../config/siteConfig";


export default function Contact(){


return (

<PolicyLayout

title="Contact Us"

description="We are always ready to help you with your shopping experience."

>


<div className="space-y-8">



<p>
Have questions about products, orders or policies?
Feel free to contact Dream Mode support team.
</p>




<div className="grid md:grid-cols-3 gap-5">



<div
className="
bg-slate-50
rounded-2xl
p-5
"
>

<FiPhone
className="
text-amber-500
text-3xl
mb-3
"
/>


<h3 className="font-bold">
Phone
</h3>


<p>
{siteConfig.phone}
</p>


</div>





<div
className="
bg-slate-50
rounded-2xl
p-5
"
>

<FiMail
className="
text-amber-500
text-3xl
mb-3
"
/>


<h3 className="font-bold">
Email
</h3>


<p>
{siteConfig.email}
</p>


</div>





<div
className="
bg-slate-50
rounded-2xl
p-5
"
>

<FiMapPin
className="
text-amber-500
text-3xl
mb-3
"
/>


<h3 className="font-bold">
Location
</h3>


<p>
Dhaka, Bangladesh
</p>


</div>



</div>





<a

href={siteConfig.whatsapp}

target="_blank"

rel="noopener noreferrer"

className="
inline-flex
items-center
justify-center
bg-amber-500
text-black
font-bold
px-8
py-4
rounded-full
hover:scale-105
transition
"

>

Chat On WhatsApp

</a>





</div>


</PolicyLayout>


);

}
