import PolicyLayout from "../components/PolicyLayout";
import PolicyFAQ from "../components/PolicyFAQ";


export default function ReturnPolicy(){

const faq = [

{
question:"How many days do I have to request a return?",
answer:"Return requests must be submitted within 3 days after receiving the product."
},

{
question:"Can I return a used product?",
answer:"No. Products must be unused, unworn and in original condition with tags and packaging."
},

{
question:"Can I return a customized product?",
answer:"No. Customized or altered products cannot be returned."
},

];


return (

<PolicyLayout

title="Return Policy"

description="Learn about our product return process and customer friendly return guidelines."

>


<div className="space-y-8">


<p>
At Dream Mode, customer satisfaction is our priority.
We carefully check every product before delivery to
provide you with the best shopping experience.
</p>



<h2 className="text-2xl font-bold text-blue-950">
Return Eligibility
</h2>



<ul className="list-disc pl-6 space-y-3">


<li>
Return request must be made within 3 days after delivery.
</li>


<li>
Product must be unused, unworn and in original condition.
</li>


<li>
Original tag, packaging and order information must be available.
</li>


<li>
Product should not have any damage caused by customer.
</li>


</ul>





<h2 className="text-2xl font-bold text-blue-950">
Wrong or Defective Product
</h2>


<p>
If you receive a wrong, damaged or defective product,
please contact our support team with product images
within the return period.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Size & Color Policy
</h2>


<p>
Customers are responsible for selecting the correct size.
Slight color differences may occur due to device screen
settings.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Exchange Policy
</h2>


<p>
Exchange availability depends on product condition and
stock availability.
Please contact our support team for assistance.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Return Shipping
</h2>


<p>
If the issue is caused by Dream Mode, we will support the
return process. For customer preference based returns,
shipping charges may apply.
</p>



<h2 className="text-2xl font-bold text-blue-950">
Frequently Asked Questions
</h2>


<PolicyFAQ items={faq}/>



</div>


</PolicyLayout>

);

}
