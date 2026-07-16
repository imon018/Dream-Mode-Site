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

    <>


      {
        !isAdminPanel && (

          <>
            <AnnouncementBar />

            <Header />
          </>

        )
      }





      <main
        className={
          hideFooter

          ?

          "min-h-screen"

          :

          "min-h-screen pb-20 md:pb-0"
        }
      >

        <Outlet />

      </main>





      {
        !hideFooter && (

          <>

            <WhatsAppButton />

            <MobileBottomNav />

            <Footer />

          </>

        )
      }





    </>

  );

}
