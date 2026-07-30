import AppRoutes from "./routes/AppRoutes";


import AuthProvider from "./context/AuthContext";


import {
  NotificationProvider,
} from "./context/NotificationContext";


import {
  SEOProvider,
} from "./context/SEOContext";


import CartProvider from "./context/CartContext";


import AnalyticsTracker from "./components/AnalyticsTracker";


import WishlistProvider from "./context/WishlistContext";


import {
  SettingsProvider,
} from "./context/SettingsContext";


import MaintenanceGuard from "./components/MaintenanceGuard";
import NoInternet from "./components/NoInternet";

import {
  Toaster,
} from "react-hot-toast";


import useAuth from "./hooks/useAuth";


import {
  useSettings,
} from "./context/SettingsContext";


import ScrollToTop from "./components/ScrollToTop";


import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

import SEO from "./seo/SEO";

import { routeSEO } from "./seo/routeSEO";


import {
  initFacebookPixel,
  trackPageView,
} from "./utils/facebookPixel";




function AppContent(){



  const {
    loading,
  } = useAuth();


  const location = useLocation();
const navigate = useNavigate();
const lastBackPress = useRef(0);

const seo = routeSEO[location.pathname] || {};



const {
  settings,
} = useSettings();



	useEffect(() => {
  initFacebookPixel();
}, []);

useEffect(() => {
  trackPageView();
}, [location.pathname]);



useEffect(() => {
  if (!Capacitor.isNativePlatform()) return;

  let lastBackTime = 0;

  const listener = CapacitorApp.addListener("backButton", () => {
    const isHome = location.pathname === "/";

    if (!isHome) {
      navigate(-1);
      return;
    }

    const now = Date.now();

    if (now - lastBackTime < 2000) {
      CapacitorApp.exitApp();
    } else {
      lastBackTime = now;
      toast("আবার Back চাপুন App বন্ধ করতে", {
        duration: 2000,
        icon: "⚠️",
      });
    }
  });

  return () => {
    listener.then((h) => h.remove());
  };
}, [location.pathname, navigate]);



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

		<NoInternet />

    <AnalyticsTracker />

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
        

        <SEOProvider>



        <NotificationProvider>



          <CartProvider>



            <WishlistProvider>




              <ScrollToTop />



              <AppContent />



            </WishlistProvider>



          </CartProvider>



        </NotificationProvider>



        </SEOProvider>



      </SettingsProvider>



    </AuthProvider>


  );


}
