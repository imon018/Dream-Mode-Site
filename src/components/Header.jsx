import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";

import { logout } from "../services/authService";

export default function Header() {
  const { user } = useAuth();

  const { cartCount } = useCart();

  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const handleLogout = async () => {
    await logout();

    navigate("/login");

    setMobileOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}

      <header
        className="
        sticky
        top-0
        z-50
        border-b
        border-white/20
        bg-white/75
        backdrop-blur-xl
        shadow-sm
      "
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          <div className="h-16 md:h-20 flex items-center justify-between">

            {/* LOGO */}

            <Link
              to="/"
              className="text-2xl md:text-3xl font-black tracking-tight"
            >
              Dream
              <span className="text-primary">
                Mode
              </span>
            </Link>

            {/* DESKTOP MENU */}

            <nav className="hidden md:flex items-center gap-8 font-medium">

              <Link
                to="/"
                className="hover:text-primary transition"
              >
                Home
              </Link>

              <Link
                to="/shop"
                className="hover:text-primary transition"
              >
                Shop
              </Link>

              <Link
                to="/cart"
                className="relative flex items-center gap-2 hover:text-primary transition"
              >
                <FiShoppingBag />

                Cart

                {cartCount > 0 && (
                  <span
                    className="
                    absolute
                    -top-3
                    -right-4
                    bg-primary
                    text-white
                    text-xs
                    min-w-[20px]
                    h-5
                    px-1
                    rounded-full
                    flex
                    items-center
                    justify-center
                  "
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="hover:text-primary transition"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="
                    bg-black
                    text-white
                    px-5
                    py-2.5
                    rounded-full
                    hover:scale-105
                    transition
                  "
                  >
                    Join Now
                  </Link>
                </>
              ) : (
                <>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="hover:text-primary transition"
                    >
                      Dashboard
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className="
                    flex
                    items-center
                    gap-2
                    hover:text-primary
                    transition
                  "
                  >
                    <FiUser />
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>

            {/* MOBILE ACTIONS */}

            <div className="flex items-center gap-3 md:hidden">

              <Link
                to="/cart"
                className="relative"
              >
                <FiShoppingBag
                  size={22}
                />

                {cartCount > 0 && (
                  <span
                    className="
                    absolute
                    -top-2
                    -right-2
                    bg-primary
                    text-white
                    text-[10px]
                    min-w-[18px]
                    h-[18px]
                    rounded-full
                    flex
                    items-center
                    justify-center
                  "
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() =>
                  setMobileOpen(
                    !mobileOpen
                  )
                }
              >
                {mobileOpen ? (
                  <FiX size={28} />
                ) : (
                  <FiMenu size={28} />
                )}
              </button>

            </div>

          </div>

        </div>
      </header>

      {/* MOBILE DRAWER */}

      <div
        className={`
        fixed
        top-0
        right-0
        h-screen
        w-[280px]
        bg-white
        z-[60]
        shadow-2xl
        transition-all
        duration-300
        ${
          mobileOpen
            ? "translate-x-0"
            : "translate-x-full"
        }
      `}
      >
        <div className="p-6">

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-xl font-bold">
              Menu
            </h2>

            <button
              onClick={() =>
                setMobileOpen(false)
              }
            >
              <FiX size={26} />
            </button>

          </div>

          <div className="flex flex-col gap-5 font-medium">

            <Link
              to="/"
              onClick={() =>
                setMobileOpen(false)
              }
            >
              Home
            </Link>

            <Link
              to="/shop"
              onClick={() =>
                setMobileOpen(false)
              }
            >
              Shop
            </Link>

            <Link
              to="/cart"
              onClick={() =>
                setMobileOpen(false)
              }
            >
              Cart ({cartCount})
            </Link>

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                >
                  Profile
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="
                  text-left
                  text-red-600
                "
                >
                  Logout
                </button>
              </>
            )}

          </div>

        </div>
      </div>

      {/* BACKDROP */}

      {mobileOpen && (
        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="
          fixed
          inset-0
          bg-black/40
          z-50
        "
        />
      )}
    </>
  );
}
