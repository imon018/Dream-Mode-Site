import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import MobileBottomNav from "../components/MobileBottomNav";
import AIChatWidget from "../components/AIChatWidget";


// Admin-চ্যাটের quick-action কার্ড — কাস্টমার-চ্যাটের "প্রোডাক্ট
// খুঁজুন/এডমিন হেল্প" এর বদলে এখানে Admin-এর কাজের সাথে
// প্রাসঙ্গিক শর্টকাট রাখা হয়েছে।
const ADMIN_QUICK_ACTIONS = [
  {
    icon: "📦",
    title: "স্টক আপডেট",
    subtitle: "প্রোডাক্ট স্টক দেখুন/বদলান",
    prompt: "একটি প্রোডাক্টের স্টক আপডেট করতে চাই",
  },
  {
    icon: "💰",
    title: "দাম পরিবর্তন",
    subtitle: "প্রোডাক্টের দাম বদলান",
    prompt: "একটি প্রোডাক্টের দাম পরিবর্তন করতে চাই",
  },
  {
    icon: "🚚",
    title: "অর্ডার Status",
    subtitle: "অর্ডার আপডেট করুন",
    prompt: "একটি অর্ডারের status পরিবর্তন করতে চাই",
  },
  {
    icon: "🔍",
    title: "অর্ডার/প্রোডাক্ট খুঁজুন",
    subtitle: "দ্রুত সার্চ করুন",
    prompt: "একটি নির্দিষ্ট অর্ডার বা প্রোডাক্ট খুঁজে দিন",
  },
];


export default function AdminLayout(){

return(

<div
className="
min-h-screen
bg-[#F8F5EF]
"
>


<Header />


<main
className="
p-4
pb-24
md:pb-4
lg:p-8
"
>

<Outlet />

</main>


<MobileBottomNav />

{/* Admin-only AI Assistant — customer চ্যাট (aiChat) থেকে
    সম্পূর্ণ আলাদা, নিজস্ব secured endpoint (aiChatAdmin)
    ব্যবহার করে, আলাদা localStorage key-তে history রাখে */}
<AIChatWidget
  functionName="aiChatAdmin"
  storageKey="dreamModeAdminChatHistory"
  title="Admin Assistant"
  subtitle="স্টক, দাম, অর্ডার status নিয়ন্ত্রণ করুন"
  welcomeText="স্টক/দাম আপডেট, অর্ডার status বদলানো, বা অর্ডার/প্রোডাক্ট খোঁজা — কী করতে চান?"
  quickActions={ADMIN_QUICK_ACTIONS}
/>


</div>

);

}
