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



  const hideBottomArea =
    location.pathname.startsWith(
      "/profile/orders/"
    );



  return (

    <>


      <AnnouncementBar />


      <Header />



      <main
        className={
          hideBottomArea

          ?

          "min-h-screen"

          :

          "min-h-screen pb-20 md:pb-0"
        }
      >

        <Outlet />

      </main>





      <WhatsAppButton />





      {
        !hideBottomArea && (

          <>

            <MobileBottomNav />

            <Footer />

          </>

        )
      }





    </>

  );

}
