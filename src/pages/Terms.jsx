import PolicyLayout from "../components/PolicyLayout";
import PolicyFAQ from "../components/PolicyFAQ";
import {
  useSettings
} from "../context/SettingsContext";

export default function Terms(){

  const {
  settings
}=useSettings();


const faq=[
const faq=[

{
question:"Can product prices change?",
answer:"Yes. Product prices, offers and availability may change without prior notice."
},

{
question:"Can an order be cancelled?",
answer:"Orders may be cancelled in certain situations such as incorrect information or payment issues."
},

{
question:`Who owns ${settings.storeName || "DREAM MODE"} website content?`,
answer:`All website content, logo, images and design belong to ${settings.storeName || "DREAM MODE"}.`
}

];



return (

<PolicyLayout

title="Terms & Conditions"

description={`Please read our terms before using {settings.storeName || "DREAM MODE"} website and services.`}

>


<div className="space-y-8">


<p>
By accessing and using {settings.storeName || "DREAM MODE"} website, you agree
to follow our terms and conditions.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Product Information
</h2>


<p>
We try our best to provide accurate product images,
descriptions and pricing. Slight color variation may occur
due to different screen settings.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Pricing & Availability
</h2>


<p>
Product prices, discounts and availability may change
without prior notice.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Order Policy
</h2>


<p>
  {settings.storeName || "DREAM MODE"} reserves the right to cancel orders due to
incorrect information, payment verification issues or
unavailable stock.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Website Usage
</h2>


<p>
Users must provide accurate information and use the website
responsibly.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Copyright
</h2>


<p>
All logos, designs, images and content belong to {settings.storeName || "DREAM MODE"}
and cannot be used without permission.
</p>





<h2 className="text-2xl font-bold text-blue-950">
Frequently Asked Questions
</h2>


<PolicyFAQ items={faq}/>


</div>


</PolicyLayout>


);

}
