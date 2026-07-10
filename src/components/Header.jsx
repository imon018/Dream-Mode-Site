import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiUser,
  FiSearch,
  FiHome,
  FiGrid,
  FiPhone,
  FiLogOut,
  FiChevronRight,
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

      {/*==========================
            TOP BAR
      ==========================*/}

      <div
        className="
        bg-[#071F57]
        h-8
        overflow-hidden
        flex
        items-center
        text-white
        text-[12px]
        font-medium
      "
      >

        <div className="marquee whitespace-nowrap">

          🚚 Inside Dhaka Delivery ৳80

          &nbsp;&nbsp;&nbsp;

          🚚 Outside Dhaka Delivery ৳120

          &nbsp;&nbsp;&nbsp;

          ⭐ Premium Quality

          &nbsp;&nbsp;&nbsp;

          💳 Cash On Delivery

          &nbsp;&nbsp;&nbsp;

          🚚 Fast Shipping

          &nbsp;&nbsp;&nbsp;

          🔥 Dream Mode Premium Collection

        </div>

      </div>

      {/*==========================
              HEADER
      ==========================*/}

      <header
        className="
        sticky
        top-8
        z-50
        bg-white
        border-b
        border-slate-100
        shadow-lg
      "
      >

        <div className="container-box">

          <div
            className="
            h-[72px]
            flex
            items-center
            justify-between
          "
          >

            {/* LEFT */}

            <div
              className="
              flex
              items-center
              gap-3
            "
            >

              <button
                className="lg:hidden"
                onClick={() =>
                  setMobileOpen(true)
                }
              >

                <FiMenu
                  size={28}
                  className="text-[#071F57]"
                />

              </button>

              <Link
                to="/"
                className="
                flex
                items-center
                gap-3
              "
              >

                <img
                  src="/logo.png"
                  alt="Dream Mode"
                  className="
                  w-12
                  h-12
                  object-contain
                "
                />

                <div>

                  <h2
                    className="
                    text-[24px]
                    font-bold
                    leading-none
                    tracking-wide
                    text-[#071F57]
                  "
                    style={{
                      fontFamily:
                        "Playfair Display",
                    }}
                  >

                    DREAM MODE

                  </h2>

                  <p
                    className="
                    hidden
                    sm:block
                    text-[10px]
                    text-gray-500
                    mt-1
                  "
                  >

                    Dress Your Dream,
                    Live Your Style

                  </p>

                </div>

              </Link>

            </div>

            {/* DESKTOP MENU */}

            <nav
              className="
              hidden
              lg:flex
              items-center
              gap-8
              text-[15px]
              font-medium
            "
            >

              <Link
                to="/"
                className="hover:text-[#071F57]"
              >
                Home
              </Link>

              <Link
                to="/shop"
                className="hover:text-[#071F57]"
              >
                Shop
              </Link>

              <Link
                to="/categories"
                className="hover:text-[#071F57]"
              >
                Categories
              </Link>

              <Link
                to="/contact"
                className="hover:text-[#071F57]"
              >
                Contact
              </Link>

            </nav>

            {/* RIGHT */}

            <div
              className="
              flex
              items-center
              gap-5
            "
            >

              <button>

                <FiSearch
                  size={22}
                  className="
                  text-[#071F57]
                "
                />

              </button>

              <Link
                to="/cart"
                className="relative"
              >

                <FiShoppingBag
                  size={24}
                  className="
                  text-[#071F57]
                "
                />

                {cartCount > 0 && (

                  <span
                    className="
                    absolute
                    -top-2
                    -right-2
                    bg-[#071F57]
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


              {/* DESKTOP USER */}

              {!user ? (

                <div
                  className="
                  hidden
                  lg:flex
                  items-center
                  gap-3
                "
                >

                  <Link
                    to="/login"
                    className="
                    px-5
                    py-2.5
                    rounded-full
                    border
                    border-[#071F57]
                    text-[#071F57]
                    font-medium
                    transition
                    hover:bg-[#071F57]
                    hover:text-white
                  "
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="
                    px-6
                    py-2.5
                    rounded-full
                    bg-[#071F57]
                    text-white
                    font-medium
                    transition
                    hover:bg-[#0b2f84]
                  "
                  >
                    Join Now
                  </Link>

                </div>

              ) : (

                <div
                  className="
                  hidden
                  lg:flex
                  items-center
                  gap-4
                "
                >

                  {user.role === "admin" && (

                    <Link
                      to="/admin"
                      className="
                      font-medium
                      hover:text-[#071F57]
                    "
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
                    hover:text-[#071F57]
                  "
                  >

                    <FiUser />

                    Profile

                  </Link>

                  <button
                    onClick={handleLogout}
                    className="
                    text-red-600
                    font-medium
                  "
                  >
                    Logout
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </header>

      {/*==========================
          MOBILE DRAWER
      ==========================*/}

      <div
        className={`
          fixed
          top-0
          left-0
          h-screen
          w-[320px]
          bg-white
          z-[70]
          shadow-2xl
          transition-all
          duration-300
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        <div
          className="
          bg-[#071F57]
          text-white
          p-6
        "
        >

          <div
            className="
            flex
            items-center
            justify-between
          "
          >

            <div
              className="
              flex
              items-center
              gap-3
            "
            >

              <img
                src="/logo.png"
                alt=""
                className="
                w-12
                h-12
                object-contain
              "
              />

              <div>

                <h2
                  className="
                  text-xl
                  font-bold
                "
                  style={{
                    fontFamily:
                      "Playfair Display",
                  }}
                >
                  DREAM MODE
                </h2>

                <p
                  className="
                  text-[11px]
                  text-white/70
                "
                >
                  Premium Fashion
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                setMobileOpen(false)
              }
            >

              <FiX size={28} />

            </button>

          </div>

        </div>

        <div className="py-4">

                    <Link
            to="/"
            onClick={() =>
              setMobileOpen(false)
            }
            className="
            flex
            items-center
            justify-between
            px-6
            py-4
            hover:bg-slate-50
            transition
          "
          >

            <div className="flex items-center gap-4">

              <FiHome
                size={20}
                className="text-[#071F57]"
              />

              <span>Home</span>

            </div>

            <FiChevronRight />

          </Link>

          <Link
            to="/shop"
            onClick={() =>
              setMobileOpen(false)
            }
            className="
            flex
            items-center
            justify-between
            px-6
            py-4
            hover:bg-slate-50
            transition
          "
          >

            <div className="flex items-center gap-4">

              <FiGrid
                size={20}
                className="text-[#071F57]"
              />

              <span>Shop</span>

            </div>

            <FiChevronRight />

          </Link>

          <Link
            to="/cart"
            onClick={() =>
              setMobileOpen(false)
            }
            className="
            flex
            items-center
            justify-between
            px-6
            py-4
            hover:bg-slate-50
            transition
          "
          >

            <div className="flex items-center gap-4">

              <FiShoppingBag
                size={20}
                className="text-[#071F57]"
              />

              <span>Cart</span>

            </div>

            <span
              className="
              bg-[#071F57]
              text-white
              text-xs
              min-w-[24px]
              h-6
              rounded-full
              flex
              items-center
              justify-center
            "
            >
              {cartCount}
            </span>

          </Link>

          <Link
            to="/contact"
            onClick={() =>
              setMobileOpen(false)
            }
            className="
            flex
            items-center
            justify-between
            px-6
            py-4
            hover:bg-slate-50
            transition
          "
          >

            <div className="flex items-center gap-4">

              <FiPhone
                size={20}
                className="text-[#071F57]"
              />

              <span>Contact</span>

            </div>

            <FiChevronRight />

          </Link>

          <div className="border-t my-4" />

          {!user ? (

            <>

              <Link
                to="/login"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                flex
                items-center
                gap-4
                px-6
                py-4
                hover:bg-slate-50
              "
              >

                <FiUser
                  size={20}
                  className="text-[#071F57]"
                />

                Login

              </Link>

              <div className="px-6 mt-5">

                <Link
                  to="/register"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="
                  w-full
                  flex
                  items-center
                  justify-center
                  py-3
                  rounded-xl
                  bg-[#071F57]
                  text-white
                  font-semibold
                "
                >
                  Create Account
                </Link>

              </div>

            </>

          ) : (

            <>

                            <Link
                to="/profile"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                flex
                items-center
                gap-4
                px-6
                py-4
                hover:bg-slate-50
                transition
              "
              >

                <FiUser
                  size={20}
                  className="text-[#071F57]"
                />

                My Profile

              </Link>

              {user.role === "admin" && (

                <Link
                  to="/admin"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="
                  flex
                  items-center
                  justify-between
                  px-6
                  py-4
                  hover:bg-slate-50
                  transition
                "
                >

                  <span>Admin Dashboard</span>

                  <FiChevronRight />

                </Link>

              )}

              <button
                onClick={handleLogout}
                className="
                w-full
                flex
                items-center
                gap-4
                px-6
                py-4
                text-red-600
                hover:bg-red-50
                transition
              "
              >

                <FiLogOut size={20} />

                Logout

              </button>

            </>

          )}

        </div>

        {/* Drawer Footer */}

        <div
          className="
          absolute
          bottom-0
          left-0
          w-full
          p-6
          border-t
          border-slate-200
        "
        >

          <div
            className="
            rounded-2xl
            bg-[#071F57]
            text-white
            p-5
            text-center
          "
          >

            <img
              src="/logo.png"
              alt=""
              className="
              w-16
              h-16
              object-contain
              mx-auto
              mb-3
            "
            />

            <h3
              className="
              text-xl
              font-bold
            "
            style={{
              fontFamily:
                "Playfair Display",
            }}
            >
              Dream Mode
            </h3>

            <p
              className="
              text-xs
              text-white/70
              mt-2
            "
            >
              Dress Your Dream,
              Live Your Style
            </p>

            <Link
              to="/shop"
              onClick={() =>
                setMobileOpen(false)
              }
              className="
              mt-5
              flex
              justify-center
              items-center
              rounded-xl
              bg-white
              text-[#071F57]
              font-semibold
              py-3
            "
            >
              Shop Now
            </Link>

          </div>

        </div>

      </div>

      {mobileOpen && (

        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="
          fixed
          inset-0
          bg-black/40
          backdrop-blur-sm
          z-[60]
        "
        />

      )}

    </>

  );

}
