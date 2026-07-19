import {
  Outlet,
  useLocation,
} from "react-router-dom";


import AnnouncementBar from "../components/AnnouncementBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/MobileBottomNav";
import WhatsAppButton from "../components/WhatsAppButton";



export default function MainLayout() {


const location = useLocation();



const isUserPanel =
location.pathname.startsWith(
"/profile"
);



const isAdminPanel =
location.pathname.startsWith(
"/admin"
);



const hideFooter =
isUserPanel ||
isAdminPanel;



return (

<div className="flex flex-col min-h-screen">


{/* শুধু Public Page এ AnnouncementBar */}

{
!isUserPanel &&
!isAdminPanel && (

<AnnouncementBar />

)
}



{/* সব জায়গায় Header থাকবে */}

<Header />





<main

className={
hideFooter

?

"flex-1"

:

"flex-1 pb-20 md:pb-0"

}

>

<Outlet />

</main>





{/* শুধু Public Page এ Footer */}

{
!hideFooter && (

<>

<WhatsAppButton />

<MobileBottomNav />

<Footer />

</>

)

}


</div>

);

}
