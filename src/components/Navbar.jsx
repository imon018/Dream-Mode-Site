import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { cart } = useCart();
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

      <Link to="/" className="text-2xl font-bold text-primary">
        Dream Mode
      </Link>

      <div className="flex gap-5 items-center">

        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/cart">Cart ({cart.length})</Link>

        {user ? (
          <Link to="/profile" className="text-green-600">
            {user.email.split("@")[0]}
          </Link>
        ) : (
          <Link to="/login">Login</Link>
        )}

      </div>

    </nav>
  );
}
