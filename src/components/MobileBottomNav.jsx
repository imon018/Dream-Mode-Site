import { Link, useLocation } from "react-router-dom";
import useCart from "../hooks/useCart";

export default function MobileBottomNav() {
  const location = useLocation();
  const { cartCount } = useCart();

  const isActive = (path) =>
    location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">

      <div className="grid grid-cols-4 h-16">

        <Link
          to="/"
          className={`flex flex-col items-center justify-center text-sm ${
            isActive("/")
              ? "text-black font-semibold"
              : "text-gray-500"
          }`}
        >
          <span>🏠</span>
          <span>Home</span>
        </Link>

        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center text-sm ${
            isActive("/shop")
              ? "text-black font-semibold"
              : "text-gray-500"
          }`}
        >
          <span>🛍</span>
          <span>Shop</span>
        </Link>

        <Link
          to="/cart"
          className={`flex flex-col items-center justify-center text-sm relative ${
            isActive("/cart")
              ? "text-black font-semibold"
              : "text-gray-500"
          }`}
        >
          <span>🛒</span>

          {cartCount > 0 && (
            <span className="absolute top-1 right-7 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}

          <span>Cart</span>
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center text-sm ${
            location.pathname.startsWith(
              "/profile"
            )
              ? "text-black font-semibold"
              : "text-gray-500"
          }`}
        >
          <span>👤</span>
          <span>Profile</span>
        </Link>

      </div>

    </div>
  );
}
