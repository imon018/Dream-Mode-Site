import { Link, useLocation } from "react-router-dom";

import {
  FiHome,
  FiShoppingBag,
  FiShoppingCart,
  FiHeart,
  FiUser,
} from "react-icons/fi";

import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";
import useAuth from "../hooks/useAuth";

export default function MobileBottomNav() {
  const location = useLocation();

  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  const wishlistCount = wishlist?.length || 0;

  const isAdmin = user?.role === "admin";

  const accountLabel = user
    ? (user.name || user.displayName || "User").trim().split(" ")[0]
    : "Account";

  const accountPath = user ? (isAdmin ? "/admin/profile" : "/profile") : "/login";

  const isAccountActive =
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/admin");

  const navItems = [
    {
      key: "home",
      to: "/",
      label: "Home",
      icon: FiHome,
      active: location.pathname === "/",
    },
    {
      key: "shop",
      to: "/shop",
      label: "Shop",
      icon: FiShoppingBag,
      active: location.pathname === "/shop",
    },
    {
      key: "cart",
      to: "/cart",
      label: "Cart",
      icon: FiShoppingCart,
      active: location.pathname === "/cart",
      badge: cartCount > 0 ? cartCount : null,
    },
    {
      key: "wishlist",
      to: "/profile/wishlist",
      label: "Wishlist",
      icon: FiHeart,
      active: location.pathname === "/profile/wishlist",
      badge: wishlistCount > 0 ? wishlistCount : null,
    },
    {
      key: "account",
      to: accountPath,
      label: accountLabel,
      icon: FiUser,
      active: isAccountActive,
    },
  ];

  return (
    <div
      className="
      md:hidden
      fixed
      bottom-0
      left-0
      right-0
      z-[999]
      "
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        className="
        grid
        grid-cols-5
        bg-warm/95
        backdrop-blur-xl
        border-t
        border-amber-500/15
        shadow-[0_-10px_30px_rgba(15,23,42,0.10)]
        rounded-t-2xl
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              to={item.to}
              className="
              relative
              flex
              flex-col
              items-center
              justify-end
              pt-2.5
              pb-2
              h-[64px]
              "
            >
              <span
                className={`
                relative
                flex
                items-center
                justify-center
                transition-all
                duration-200
                ${item.active ? "-mt-[22px]" : "mt-0"}
                `}
              >
                {/* soft glow halo behind the active bubble */}
                {item.active && (
                  <span
                    className="
                    absolute
                    inset-0
                    -m-1.5
                    rounded-full
                    bg-amber-400/40
                    blur-md
                    "
                    aria-hidden="true"
                  />
                )}

                <span
                  className={`
                  relative
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-200
                  ${
                    item.active
                      ? "w-11 h-11 rounded-full bg-gold-gradient shadow-gold text-white"
                      : "w-6 h-6 text-slate-500"
                  }
                  `}
                >
                  <Icon size={20} />
                </span>

                {item.badge && (
                  <span
                    className="
                    absolute
                    -top-1
                    -right-1
                    bg-red-500
                    text-white
                    text-[10px]
                    leading-none
                    min-w-[16px]
                    h-[16px]
                    px-[3px]
                    rounded-full
                    flex
                    items-center
                    justify-center
                    "
                  >
                    {item.badge}
                  </span>
                )}
              </span>

              <span
                className={`
                mt-1
                text-[11px]
                font-medium
                truncate
                max-w-[64px]
                transition-colors
                duration-200
                ${item.active ? "text-amber-600 font-semibold" : "text-slate-500"}
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
