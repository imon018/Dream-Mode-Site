import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <Link
          to="/"
          className="text-2xl font-bold text-primary"
        >
          Dream Mode
        </Link>

        <nav className="flex gap-6 font-medium">

          <Link to="/">Home</Link>

          <Link to="/shop">Shop</Link>

          <Link to="/cart">Cart</Link>
          
          <Link to="/admin">Admin</Link>

          <Link to="/login">Login</Link>

        </nav>

      </div>
    </header>
  );
}
