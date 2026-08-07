import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import MobileBottomNav from "../components/MobileBottomNav";
import AIChatWidget from "../components/AIChatWidget";


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
/>


</div>

);

}
