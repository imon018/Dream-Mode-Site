import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import AdminProfile from "../pages/admin/AdminProfile";

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
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>

  <Route
    index
    element={<Dashboard />}
  />

  <Route
    path="profile"
    element={<AdminProfile />}
  />

</Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
