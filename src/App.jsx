import AppRoutes from "./routes/AppRoutes";


import AuthProvider from "./context/AuthContext";


import CartProvider from "./context/CartContext";


import WishlistProvider from "./context/WishlistContext";


import {
  SettingsProvider
} from "./context/SettingsContext";


import MaintenanceGuard from "./components/MaintenanceGuard";


import {
  Toaster
} from "react-hot-toast";


import useAuth from "./hooks/useAuth";


import ScrollToTop from "./components/ScrollToTop";







function AppContent(){


const {
loading
}=useAuth();




if(loading){


return (

<div className="
min-h-screen
flex
items-center
justify-center
">


Loading Dream Mode...


</div>

);


}





return (

<>


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


<CartProvider>


<WishlistProvider>


<ScrollToTop/>


<AppContent/>


</WishlistProvider>


</CartProvider>


</SettingsProvider>


</AuthProvider>


);


}
