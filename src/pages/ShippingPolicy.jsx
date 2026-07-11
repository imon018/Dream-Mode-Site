import PolicyLayout from "../components/PolicyLayout";
import PolicyFAQ from "../components/PolicyFAQ";


export default function ShippingPolicy(){


const faq=[

{
question:"How long does delivery take?",
answer:"Inside Dhaka usually takes 1-3 working days and outside Dhaka usually takes 3-5 working days."
},

{
question:"Do you deliver all over Bangladesh?",
answer:"Yes, Dream Mode delivers products across Bangladesh."
},

{
question:"Can I change my address after ordering?",
answer:"Address changes are possible only before shipment confirmation."
}

];



return (

<PolicyLayout

title="Shipping Policy"

description="Everything you need to know about Dream Mode delivery process."

>


<div className="space-y-8">


<p>
Dream Mode provides secure and reliable delivery service
to make sure your premium fashion products reach you safely.
</p>




<h2 className="text-2xl font-bold text-blue-950">
Delivery Area
</h2>


<p>
We currently provide delivery service throughout Bangladesh.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Delivery Time
</h2>


<ul className="list-disc pl-6 space-y-3">

<li>
Inside Dhaka: 1-3 working days.
</li>

<li>
Outside Dhaka: 3-5 working days.
</li>

</ul>





<h2 className="text-2xl font-bold text-blue-950">
Delivery Charge
</h2>


<p>
Delivery charge depends on customer location and order
details. Applicable delivery charges will be shown during
checkout.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Order Confirmation
</h2>


<p>
Our team may contact customers for order confirmation
before shipment.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Delivery Delay
</h2>


<p>
Delivery may be delayed due to weather conditions,
holidays, courier issues or unexpected circumstances.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Wrong Address Responsibility
</h2>


<p>
Customers are responsible for providing accurate delivery
information. Additional charges may apply for incorrect
address details.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Frequently Asked Questions
</h2>


<PolicyFAQ items={faq}/>


</div>


</PolicyLayout>


);

}
