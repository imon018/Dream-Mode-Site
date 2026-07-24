import AppRoutes from "./routes/AppRoutes";


import AuthProvider from "./context/AuthContext";


import {
  NotificationProvider,
} from "./context/NotificationContext";


import CartProvider from "./context/CartContext";


import WishlistProvider from "./context/WishlistContext";


import {
  SettingsProvider,
} from "./context/SettingsContext";


import MaintenanceGuard from "./components/MaintenanceGuard";


import {
  Toaster,
} from "react-hot-toast";


import useAuth from "./hooks/useAuth";


import {
  useSettings,
} from "./context/SettingsContext";


import ScrollToTop from "./components/ScrollToTop";


import { useLocation } from "react-router-dom";

import SEO from "./seo/SEO";

import { routeSEO } from "./seo/routeSEO";







function AppContent(){



  const {
    loading,
  } = useAuth();


  const location = useLocation();

const seo = routeSEO[location.pathname] || {};



const {
  settings,
} = useSettings();



  if(loading){


    return (

      <div

        className="
        min-h-screen
        flex
        items-center
        justify-center
        "

      >


        <div className="text-center">



          <div className="
          text-4xl
          mb-4
          ">

            ⏳

          </div>




          <h2

            className="
            text-2xl
            font-bold
            "

          >

            Loading {settings?.storeName || "Dream Mode"}...

          </h2>




          <p

            className="
            text-gray-500
            mt-2
            "

          >

            Checking authentication

          </p>



        </div>



      </div>

    );


  }








  return (

  <>

    <SEO
      title={seo.title}
      description={seo.description}
      keywords={seo.keywords}
      image={seo.image}
      url={location.pathname}
      type={seo.type}
      noIndex={seo.noIndex}
    />

    <MaintenanceGuard>

      <AppRoutes />

    </MaintenanceGuard>

    <Toaster
      position="top-right"
    />

  </>

);

}









export default function App(){


  return (


    <AuthProvider>


      <SettingsProvider>



        <NotificationProvider>



          <CartProvider>



            <WishlistProvider>




              <ScrollToTop />



              <AppContent />



            </WishlistProvider>



          </CartProvider>



        </NotificationProvider>



      </SettingsProvider>



    </AuthProvider>


  );


}
