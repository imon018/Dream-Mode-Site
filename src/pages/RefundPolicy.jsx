import PolicyLayout from "../components/PolicyLayout";
import PolicyFAQ from "../components/PolicyFAQ";
import {
  useSettings
} from "../context/SettingsContext";


export default function RefundPolicy(){

  const {
  settings
}=useSettings();


const faq=[

{
question:"When will I receive my refund?",
answer:"Refund processing starts after product verification and approval."
},

{
question:"Which payment methods support refunds?",
answer:"Refunds are processed according to the available payment method used during purchase."
},

{
question:"Are all products refundable?",
answer:"Only eligible products and approved cases qualify for refunds."
}

];



return (

<PolicyLayout

title="Refund Policy"

description="Understand our refund process, eligibility and payment guidelines."

>


<div className="space-y-8">


<p>
{settings.storeName || "DREAM MODE"} provides refunds for eligible cases after
proper verification.
</p>




<h2 className="text-2xl font-bold text-blue-950">
Refund Eligibility
</h2>



<ul className="list-disc pl-6 space-y-3">


<li>
Wrong product delivered.
</li>


<li>
Damaged or defective product received.
</li>


<li>
Approved cancellation before shipment.
</li>


</ul>





<h2 className="text-2xl font-bold text-blue-950">
Refund Process
</h2>


<p>
After inspection and approval, refunds will be processed
through the available payment channel.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Payment Methods
</h2>


<p>
Refunds may be processed through bKash, Nagad or card
payment methods depending on the original transaction.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Refund Timeline
</h2>


<p>
Processing time may vary depending on payment providers
and verification procedures.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Frequently Asked Questions
</h2>


<PolicyFAQ items={faq}/>


</div>


</PolicyLayout>


);


}
