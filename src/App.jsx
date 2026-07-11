import AppRoutes from "./routes/AppRoutes";

import AuthProvider from "./context/AuthContext";

import CartProvider from "./context/CartContext";

import WishlistProvider from "./context/WishlistContext";

import { Toaster } from "react-hot-toast";

import useAuth from "./hooks/useAuth";

import ScrollToTop from "./components/ScrollToTop";



function AppContent() {


  const {
    loading,
  } = useAuth();





  if(loading){


    return (

      <div className="min-h-screen flex items-center justify-center">


        <div className="text-center">


          <div className="text-4xl mb-4">
            ⏳
          </div>



          <h2 className="text-2xl font-bold">

            Loading Dream Mode...

          </h2>



          <p className="text-gray-500 mt-2">

            Checking authentication

          </p>


        </div>



      </div>


    );


  }







  return (

    <>


      <AppRoutes />


      <Toaster
        position="top-right"
      />


    </>


  );

}







export default function App(){


  return (


    <AuthProvider>


      <CartProvider>


        <WishlistProvider>


          <AppContent />


        </WishlistProvider>


      </CartProvider>


    </AuthProvider>

    <ScrollToTop />


  );


}
