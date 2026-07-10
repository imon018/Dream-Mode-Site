import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiUser,
  FiSearch,
  FiLogOut,
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

      {/* TOP BAR */}

      <div
        className="
        h-8
        bg-[#071F57]
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

          🔥 Dream Mode Premium Collection

        </div>

      </div>

      {/* HEADER */}

      <header
        className="
        sticky
        top-8
        z-50
        bg-white
        border-b
        border-slate-100
        shadow-md
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
                  w-10
                  h-10
                  md:w-12
                  md:h-12
                  object-contain
                "
                />

                <div className="leading-none">

  <h2
    className="
      text-[22px]
      md:text-[34px]
      font-bold
      tracking-wide
      text-[#0A3D91]
      leading-none
    "
    style={{
      fontFamily: "'Lobster', cursive",
      textShadow: "0 2px 8px rgba(7,31,87,.15)"
    }}
  >
    Dream Mode
  </h2>

  <p
    className="
      text-[9px]
      md:text-[11px]
      mt-1
      tracking-[1px]
      text-[#D4AF37]
      font-medium
      leading-none
    "
  >
    Dress Your Dream, Live Your Style
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

            </nav>

            {/* RIGHT */}

            <div
              className="
              flex
              items-center
              gap-4
            "
            >

              <button
  onClick={() => navigate("/shop")}
  className="
    hover:scale-110
    transition
    duration-300
  "
>
  <FiSearch
    size={22}
    className="text-[#071F57]"
  />
</button>

              <Link
                to="/cart"
                className="relative"
              >

                <FiShoppingBag
                  size={24}
                  className="text-[#071F57]"
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
                    h-[18px]
                    min-w-[18px]
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
                    hover:bg-[#071F57]
                    hover:text-white
                    transition
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
                    hover:bg-[#0A2E82]
                    transition
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

                    <FiUser size={20} />

                    Profile

                  </Link>

                  <button
                    onClick={handleLogout}
                    className="
                    flex
                    items-center
                    gap-2
                    text-red-600
                    font-medium
                  "
                  >

                    <FiLogOut size={18} />

                    Logout

                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </header>

      {/* MOBILE DRAWER */}

      <div
        className={`
        fixed
        top-0
        left-0
        h-screen
        w-[320px]
        bg-white
        z-[70]
        transition-all
        duration-300
        shadow-2xl
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
                w-10
                h-10
                object-contain
              "
              />

              <div>

                <h2
                  className="
                  text-xl
                  font-bold
                "
                >
                  DREAM MODE
                </h2>

                <p
                  className="
                  text-xs
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
            <span>Home</span>
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
            <span>Shop</span>
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

            <span>Cart</span>

            <span
              className="
              bg-[#071F57]
              text-white
              text-xs
              min-w-[22px]
              h-[22px]
              rounded-full
              flex
              items-center
              justify-center
            "
            >
              {cartCount}
            </span>

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
                block
                px-6
                py-4
                hover:bg-slate-50
              "
              >
                Login
              </Link>

              <div className="px-6 mt-4">

                <Link
                  to="/register"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="
                  w-full
                  flex
                  justify-center
                  rounded-xl
                  bg-[#071F57]
                  text-white
                  py-3
                  font-semibold
                "
                >
                  Join Now
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
                block
                px-6
                py-4
                hover:bg-slate-50
                transition
              "
              >
                My Profile
              </Link>

              {user.role === "admin" && (

                <Link
                  to="/admin"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="
                  block
                  px-6
                  py-4
                  hover:bg-slate-50
                  transition
                "
                >
                  Dashboard
                </Link>

              )}

              <button
                onClick={handleLogout}
                className="
                w-full
                text-left
                px-6
                py-4
                text-red-600
                hover:bg-red-50
                transition
              "
              >
                Logout
              </button>

            </>

          )}

        </div>

        {/* DRAWER FOOTER */}

        <div
          className="
          absolute
          bottom-0
          left-0
          w-full
          border-t
          border-slate-200
          p-6
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
              alt="Dream Mode"
              className="
              w-14
              h-14
              mx-auto
              mb-3
              object-contain
            "
            />

            <h3
              className="
              text-xl
              font-bold
            "
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
              items-center
              justify-center
              py-3
              rounded-xl
              bg-white
              text-[#071F57]
              font-semibold
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
