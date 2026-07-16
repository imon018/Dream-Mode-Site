import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import ProtectedAdminRoute from "./ProtectedAdminRoute";



/* =========================
   USER PAGES
========================= */

import ChangePassword from "../pages/user/ChangePassword";
import DeleteAccount from "../pages/user/DeleteAccount";
import ProfileEditPage from "../pages/ProfileEditPage";
import UserOrderDetails from "../pages/user/UserOrderDetails";
import ReturnOrder from "../pages/user/ReturnOrder";


/* =========================
   ADMIN PAGES
========================= */

import Dashboard from "../pages/admin/Dashboard";
import AdminProfile from "../pages/admin/AdminProfile";
import Users from "../pages/admin/Users";
import Products from "../pages/admin/Products";
import HeroBanners from "../pages/admin/HeroBanners";
import AddProduct from "../pages/admin/AddProduct";
import AddOrder from "../pages/admin/AddOrder";
import EditProduct from "../pages/admin/EditProduct";
import Orders from "../pages/admin/Orders";
import Analytics from "../pages/admin/Analytics";
import Settings from "../pages/admin/Settings";
import Subscribers from "../pages/admin/Subscribers";
import Newsletter from "../pages/admin/Newsletter";
import ShopHeroBanner from "../pages/admin/ShopHeroBanner";
import OrderDetails from "../pages/admin/OrderDetails";
import UserDetails from "../pages/admin/UserDetails";
import SendNotification from "../pages/admin/SendNotification";


/* =========================
   PUBLIC PAGES
========================= */

import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import Wishlist from "../pages/Wishlist";
import Profile from "../pages/Profile";
import About from "../pages/About";
import Contact from "../pages/Contact";
import OrderSuccess from "../pages/OrderSuccess";
import MyOrders from "../pages/MyOrders";
import VerifyEmail from "../pages/VerifyEmail";
import Notifications from "../pages/common/Notifications";
import PasswordChangeVerify from "../pages/PasswordChangeVerify";
import ResetPassword from "../pages/ResetPassword";


/* =========================
   POLICIES
========================= */

import ReturnPolicy from "../pages/ReturnPolicy";
import RefundPolicy from "../pages/RefundPolicy";
import ShippingPolicy from "../pages/ShippingPolicy";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Terms from "../pages/Terms";
import AboutUs from "../pages/AboutUs";
import FAQs from "../pages/FAQs";


import NotFound from "../pages/NotFound";



export default function AppRoutes() {

  return (

    <Routes>


      {/* =========================
          WEBSITE ROUTES
      ========================= */}

      <Route element={<MainLayout />}>



        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />



        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />



        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />



        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

         <Route
  path="/password-change-verify"
  element={<PasswordChangeVerify />}
/>

         <Route
 path="/reset-password"
 element={<ResetPassword />}
/>




        {/* USER PROFILE */}

        <Route
          path="/profile"
          element={<UserLayout />}
        >

          <Route index element={<Profile />} />

          <Route
            path="orders"
            element={<MyOrders />}
          />

          <Route
            path="wishlist"
            element={<Wishlist />}
          />

          <Route
            path="notifications"
            element={<Notifications />}
          />


          <Route
            path="security/password"
            element={<ChangePassword />}
          />

          <Route
            path="security/delete"
            element={<DeleteAccount />}
          />

           <Route
        path="/profile/edit"
        element={<ProfileEditPage />}
      />

           <Route
 path="orders/:id"
 element={<UserOrderDetails />}
/>

           <Route

path="/return-order/:id"

element={<ReturnOrder />}

/>


        </Route>





        {/* POLICIES */}

        <Route
          path="/page/returnpolicy"
          element={<ReturnPolicy />}
        />

        <Route
          path="/page/refundpolicy"
          element={<RefundPolicy />}
        />

        <Route
          path="/page/shippingpolicy"
          element={<ShippingPolicy />}
        />

        <Route
          path="/page/privacypolicy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/page/terms"
          element={<Terms />}
        />

        <Route
          path="/about-us"
          element={<AboutUs />}
        />

        <Route
          path="/faqs"
          element={<FAQs />}
        />


      </Route>






      {/* =========================
          ADMIN ROUTES
      ========================= */}


      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >


        <Route index element={<Dashboard />} />


        <Route
          path="profile"
          element={<AdminProfile />}
        />


        <Route
          path="users"
          element={<Users />}
        />


        <Route
          path="users/:id"
          element={<UserDetails />}
        />



        <Route
          path="products"
          element={<Products />}
        />


        <Route
          path="add-product"
          element={<AddProduct />}
        />


        <Route
          path="edit-product/:id"
          element={<EditProduct />}
        />



        <Route
          path="orders"
          element={<Orders />}
        />


        <Route
          path="orders/:id"
          element={<OrderDetails />}
        />


        <Route
          path="add-order"
          element={<AddOrder />}
        />



        <Route
          path="analytics"
          element={<Analytics />}
        />


        <Route
          path="settings"
          element={<Settings />}
        />



        <Route
          path="banners"
          element={<HeroBanners />}
        />


        <Route
          path="shop-hero"
          element={<ShopHeroBanner />}
        />



        <Route
          path="subscribers"
          element={<Subscribers />}
        />


        <Route
          path="newsletter"
          element={<Newsletter />}
        />



        <Route
          path="send-notification"
          element={<SendNotification />}
        />


        <Route
          path="notifications"
          element={<Notifications />}
        />

         <Route
 path="change-password"
 element={<ChangePassword />}
/>


      </Route>






      {/* 404 */}

      <Route
        path="*"
        element={<NotFound />}
      />


    </Routes>

  );

}
