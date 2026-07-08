import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/admin/Dashboard";
import AdminProfile from "../pages/admin/AdminProfile";
import Users from "../pages/admin/Users";
import Products from "../pages/admin/Products";
import AddProduct from "../pages/admin/AddProduct";
import EditProduct from "../pages/admin/EditProduct";
import Orders from "../pages/admin/Orders";
import Analytics from "../pages/admin/Analytics";
import Settings from "../pages/admin/Settings";

import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import Wishlist from "../pages/Wishlist";
import Profile from "../pages/Profile";
import About from "../pages/About";
import Contact from "../pages/Contact";
import OrderSuccess from "../pages/OrderSuccess";

import NotFound from "../pages/NotFound";


export default function AppRoutes() {

  return (

    <Routes>


      {/* Public Website Routes */}

      <Route element={<MainLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route path="/cart" element={<Cart />} />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

      </Route>



      {/* Admin Dashboard Routes */}

      <Route
        path="/admin"
        element={<AdminLayout />}
      >

        <Route
          index
          element={<Dashboard />}
        />


        <Route
          path="profile"
          element={<AdminProfile />}
        />


        <Route
          path="users"
          element={<Users />}
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
  path="analytics"
  element={<Analytics />}
/>

        <Route
  path="settings"
  element={<Settings />}
/>


      </Route>



      {/* 404 Page */}

      <Route
        path="*"
        element={<NotFound />}
      />


    </Routes>

  );

}
