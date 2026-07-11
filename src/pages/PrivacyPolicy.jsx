import PolicyLayout from "../components/PolicyLayout";
import PolicyFAQ from "../components/PolicyFAQ";


export default function PrivacyPolicy(){


const faq=[

{
question:"Does Dream Mode share customer information?",
answer:"No. Customer information is never sold or shared for unauthorized purposes."
},

{
question:"What information do you collect?",
answer:"We collect necessary information like name, phone number, address and order details."
},

{
question:"How do you protect my information?",
answer:"We use reasonable security practices to protect customer data."
}

];



return (

<PolicyLayout

title="Privacy Policy"

description="Learn how Dream Mode collects, uses and protects your personal information."

>


<div className="space-y-8">


<p>
Dream Mode respects your privacy and is committed to
protecting your personal information.
</p>




<h2 className="text-2xl font-bold text-blue-950">
Information We Collect
</h2>


<ul className="list-disc pl-6 space-y-3">

<li>
Name and contact information.
</li>

<li>
Delivery address.
</li>

<li>
Order and transaction details.
</li>

<li>
Email subscription information.
</li>

</ul>





<h2 className="text-2xl font-bold text-blue-950">
How We Use Information
</h2>


<ul className="list-disc pl-6 space-y-3">

<li>
Process and deliver orders.
</li>

<li>
Provide customer support.
</li>

<li>
Improve website experience.
</li>

<li>
Send updates and offers if customers subscribe.
</li>

</ul>





<h2 className="text-2xl font-bold text-blue-950">
Payment Security
</h2>


<p>
Payment related information is handled securely through
available payment methods.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Cookies
</h2>


<p>
We may use cookies to improve website performance and
provide a better shopping experience.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Third Party Sharing
</h2>


<p>
Customer information is not sold or shared with
unauthorized third parties.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Frequently Asked Questions
</h2>


<PolicyFAQ items={faq}/>


</div>


</PolicyLayout>


);

}
