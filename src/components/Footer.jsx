import {
Link
} from "react-router-dom";


import {
FiPhone,
FiMail,
FiMapPin,
FiHome,
FiShoppingBag,
FiFacebook,
FiInfo,
FiHelpCircle
} from "react-icons/fi";

import {
  useSettings
} from "../context/SettingsContext";

import AnimatedLogo from "./AnimatedLogo";


export default function Footer(){

const {
  settings
}=useSettings();

const isLogoVideo =
  settings.logoType === "video" ||
  /\.(mp4|webm)(\?|$)/i.test(settings.logoUrl || "");

  
return (

<footer
className="
bg-[#061538]
text-white
pt-12
lg:pt-20
pb-24
lg:pb-14
px-6
lg:px-8
"
>


<div className="max-w-7xl mx-auto">



<div
className="
grid
grid-cols-2
md:grid-cols-3
lg:grid-cols-[1.3fr_1fr_1fr]
gap-10
lg:gap-16
"
>


{/* BRAND */}

<div
className="
col-span-2
md:col-span-1
"
>


<div
className="
flex
items-center
gap-3
mb-5
"
>


{
  settings.logoUrl && isLogoVideo
  ?
  <AnimatedLogo
    src={settings.logoUrl}
    className="
      w-14
      h-14
      lg:w-16
      lg:h-16
      object-contain
    "
  />
  :
  <img
  src={
    settings.logoUrl ||
    "/logo.png"
  }
  alt={
    settings.storeName ||
    ""
  }
  className="
  w-14
  h-14
  lg:w-16
  lg:h-16
  object-contain
  "
  />
}


<div>


<h2
  className="
    text-2xl
    lg:text-3xl
    font-bold
    tracking-widest
  "
>
  <span className="text-white">
{
(settings.storeName || "")
.split(" ")[0]
}
</span>{" "}

<span className="text-amber-500">
{
(settings.storeName || "")
.split(" ").slice(1).join(" ")
}
</span>
  
</h2>


<p
className="
text-amber-400
text-xs
mt-1
"
>
Dress Your Dream, Live Your Style
</p>


</div>


</div>



<p
className="
text-gray-300
leading-7
text-sm
lg:text-[15px]
lg:leading-8
max-w-sm
"
>

{settings.storeName || ""} is your trusted destination for premium dress. We ensure quality, style and customer satisfaction.

</p>



</div>





{/* QUICK LINKS */}


<div>


<h3
className="
text-amber-500
font-bold
text-lg
lg:text-xl
mb-5
lg:mb-6
"
>

Quick Links

</h3>


<ul
className="
space-y-3
lg:space-y-4
text-gray-300
text-sm
lg:text-[15px]
"
>


<li>
<Link to="/" className="flex items-center gap-2 transition-colors hover:text-amber-400">
<FiHome className="text-amber-500" />
Home
</Link>
</li>


<li>
<Link to="/shop" className="flex items-center gap-2 transition-colors hover:text-amber-400">
<FiShoppingBag className="text-amber-500" />
Shop
</Link>
</li>


  <li>
<a
href={settings.facebook || "#"}
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-2 transition-colors hover:text-amber-400"
>
<FiFacebook className="text-amber-500" />
Facebook
</a>
</li>
  

<li>
<Link to="/about" className="flex items-center gap-2 transition-colors hover:text-amber-400">
<FiInfo className="text-amber-500" />
About Us
</Link>
</li>


<li>
<Link to="/faqs" className="flex items-center gap-2 transition-colors hover:text-amber-400">
<FiHelpCircle className="text-amber-500" />
FAQs
</Link>
</li>


</ul>


</div>






{/* CUSTOMER */}


<div>


<h3
className="
text-amber-500
font-bold
text-lg
lg:text-xl
mb-5
lg:mb-6
"
>

Customer Service

</h3>



<ul
className="
space-y-3
lg:space-y-4
text-gray-300
text-sm
lg:text-[15px]
"
>


<li>
<Link to="/page/returnpolicy" className="transition-colors hover:text-amber-400">
Return Policy
</Link>
</li>


<li>
<Link to="/page/refundpolicy" className="transition-colors hover:text-amber-400">
Refund Policy
</Link>
</li>


<li>
<Link to="/page/shippingpolicy" className="transition-colors hover:text-amber-400">
Shipping Policy
</Link>
</li>


<li>
<Link to="/page/privacypolicy" className="transition-colors hover:text-amber-400">
Privacy Policy
</Link>
</li>


<li>
<Link to="/page/terms" className="transition-colors hover:text-amber-400">
Terms & Conditions
</Link>
</li>



</ul>


</div>



</div>







<div
className="
mt-12
lg:mt-16
border-t
border-white/10
pt-8
lg:pt-10
grid
md:grid-cols-2
lg:grid-cols-2
gap-8
lg:gap-16
"
>




{/* CONTACT */}

<div>


<h3
className="
text-amber-500
font-bold
lg:text-xl
mb-5
lg:mb-6
"
>
Contact Us
</h3>


<div
className="
space-y-4
lg:space-y-5
text-gray-300
text-sm
lg:text-[15px]
"
>


<p className="flex gap-3">
<FiPhone className="text-amber-500"/>
{settings.phone || ""}
</p>


<p className="flex gap-3">
<FiMail className="text-amber-500"/>
{settings.email || ""}
</p>


<p className="flex gap-3">
<FiMapPin className="text-amber-500"/>
{settings.address || "Dhaka, Bangladesh"}
</p>



</div>


</div>





{/* PAYMENT */}

<div>


<h3
className="
text-amber-500
font-bold
lg:text-xl
mb-5
lg:mb-6
"
>

We Accept

</h3>



<div
className="
grid
grid-cols-4
lg:flex
lg:flex-wrap
gap-3
lg:gap-5
items-center
"
>

<img
  src="/payments/visa-logo.png"
  className="
    w-full
    lg:w-20
    h-8
    lg:h-10
    object-contain
    bg-white
    rounded-md
    lg:p-1.5
  "
/>

<img
  src="/payments/mastercard-logo.png"
  className="
    w-full
    lg:w-20
    h-8
    lg:h-10
    object-contain
    bg-white
    rounded-md
    lg:p-1.5
  "
/>

<img
  src="/payments/bkash-logo.png"
  className="
    w-full
    lg:w-20
    h-8
    lg:h-10
    object-contain
    bg-white
    rounded-md
    lg:p-1.5
  "
/>

<img
  src="/payments/nagad-logo.png"
  className="
    w-full
    lg:w-20
    h-8
    lg:h-10
    object-contain
    bg-white
    rounded-md
    lg:p-1.5
  "
/>

</div>


</div>



</div>







<div
className="
border-t
border-white/10
mt-8
lg:mt-12
pt-6
lg:pt-7
text-center
text-gray-400
text-sm
"
>

© 2026 All Rights Reserved by {settings.storeName || ""}

</div>




</div>


</footer>


);


}
