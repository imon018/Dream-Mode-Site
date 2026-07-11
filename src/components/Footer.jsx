import {
Link
} from "react-router-dom";


import {
FiPhone,
FiMail,
FiMapPin
} from "react-icons/fi";



export default function Footer(){


return (

<footer
className="
bg-[#061538]
text-white
pt-12
pb-24
px-6
"
>


<div className="max-w-7xl mx-auto">



<div
className="
grid
grid-cols-2
md:grid-cols-3
gap-10
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


<img
src="/logo.png"
className="
w-14
h-14
object-contain
"
/>


<div>


<h2
  className="
    text-2xl
    font-bold
    tracking-widest
  "
>
  <span className="text-white">
    DREAM
  </span>{" "}
  <span className="text-amber-500">
    MODE
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
"
>

Dream Mode is your trusted destination for premium dress. We ensure quality, style and customer satisfaction.

</p>



</div>





{/* QUICK LINKS */}


<div>


<h3
className="
text-amber-500
font-bold
text-lg
mb-5
"
>

Quick Links

</h3>


<ul
className="
space-y-3
text-gray-300
text-sm
"
>


<li>
<Link to="/">
Home
</Link>
</li>


<li>
<Link to="/shop">
Shop
</Link>
</li>


<li>
<Link to="/about">
About Us
</Link>
</li>


<li>
<Link to="/faqs">
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
mb-5
"
>

Customer Service

</h3>



<ul
className="
space-y-3
text-gray-300
text-sm
"
>


<li>
<Link to="/page/returnpolicy">
Return Policy
</Link>
</li>


<li>
<Link to="/page/refundpolicy">
Refund Policy
</Link>
</li>


<li>
<Link to="/page/shippingpolicy">
Shipping Policy
</Link>
</li>


<li>
<Link to="/page/privacypolicy">
Privacy Policy
</Link>
</li>


<li>
<Link to="/page/terms">
Terms & Conditions
</Link>
</li>



</ul>


</div>



</div>







<div
className="
mt-12
border-t
border-white/10
pt-8
grid
md:grid-cols-2
gap-8
"
>




{/* CONTACT */}

<div>


<h3
className="
text-amber-500
font-bold
mb-5
"
>
Contact Us
</h3>


<div
className="
space-y-4
text-gray-300
text-sm
"
>


<p className="flex gap-3">
<FiPhone className="text-amber-500"/>
+8801406978619
</p>


<p className="flex gap-3">
<FiMail className="text-amber-500"/>
dreammode27@gmail.com
</p>


<p className="flex gap-3">
<FiMapPin className="text-amber-500"/>
Dhaka, Bangladesh
</p>



</div>


</div>





{/* PAYMENT */}

<div>


<h3
className="
text-amber-500
font-bold
mb-5
"
>

We Accept

</h3>



<div
className="
grid
grid-cols-4
gap-3
items-center
"
>

<img
  src="/payments/visa-logo.png"
  className="
    w-full
    h-8
    object-contain
  "
/>

<img
  src="/payments/mastercard-logo.png"
  className="
    w-full
    h-8
    object-contain
  "
/>

<img
  src="/payments/bkash-logo.png"
  className="
    w-full
    h-8
    object-contain
  "
/>

<img
  src="/payments/nagad-logo.png"
  className="
    w-full
    h-8
    object-contain
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
pt-6
text-center
text-gray-400
text-sm
"
>

© 2026 Dream Mode. All Rights Reserved by Dream Mode.

</div>




</div>


</footer>


);


}
