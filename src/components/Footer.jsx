import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiMail,
  FiPhone,
} from "react-icons/fi";

import { siteConfig } from "../config/siteConfig";

export default function Footer() {
  return (
    <footer
      className="
      bg-gradient-to-br
      from-slate-950
      via-blue-950
      to-slate-900
      text-white
      mt-24
    "
    >
      <div className="max-w-7xl mx-auto px-5 md:px-6 py-20">

        <div className="grid lg:grid-cols-4 gap-12">

          {/* BRAND */}

          <div>

            <h2
              className="
              text-4xl
              font-black
            "
            >
              Dream
              <span className="text-yellow-400">
                Mode
              </span>
            </h2>

            <p
              className="
              mt-5
              text-slate-300
              leading-7
            "
            >
              Premium fashion &
              lifestyle products
              designed for modern
              shoppers.
            </p>

          </div>

          {/* LINKS */}

          <div>

            <h3
              className="
              text-lg
              font-bold
              mb-5
            "
            >
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">

              <Link
                to="/"
                className="text-slate-300 hover:text-yellow-400 transition"
              >
                Home
              </Link>

              <Link
                to="/shop"
                className="text-slate-300 hover:text-yellow-400 transition"
              >
                Shop
              </Link>

              <Link
                to="/cart"
                className="text-slate-300 hover:text-yellow-400 transition"
              >
                Cart
              </Link>

              <Link
                to="/profile"
                className="text-slate-300 hover:text-yellow-400 transition"
              >
                Profile
              </Link>

            </div>

          </div>

          {/* CONTACT */}

          <div>

            <h3
              className="
              text-lg
              font-bold
              mb-5
            "
            >
              Contact
            </h3>

            <div className="space-y-4">

              <div className="flex gap-3 items-center">

                <FiPhone />

                <span className="text-slate-300">
                  {siteConfig.phone}
                </span>

              </div>

              <div className="flex gap-3 items-center">

                <FiMail />

                <span className="text-slate-300 break-all">
                  {siteConfig.email}
                </span>

              </div>

            </div>

          </div>

          {/* SOCIAL */}

          <div>

            <h3
              className="
              text-lg
              font-bold
              mb-5
            "
            >
              Follow Us
            </h3>

            <a
              href={siteConfig.facebook}
              target="_blank"
              rel="noreferrer"
              className="
                inline-flex
                items-center
                gap-3
                px-5
                py-3
                rounded-2xl
                bg-white/10
                hover:bg-yellow-400
                hover:text-black
                transition-all
              "
            >
              <FiFacebook />
              Facebook
            </a>

          </div>

        </div>

        {/* Divider */}

        <div
          className="
          h-px
          bg-white/10
          my-12
        "
        />

        {/* Bottom */}

        <div
          className="
          flex
          flex-col
          md:flex-row
          justify-between
          items-center
          gap-4
        "
        >

          <p className="text-slate-400 text-sm">

            © 2026 Dream Mode.
            All Rights Reserved.

          </p>

          <div
            className="
            text-yellow-400
            text-sm
            font-medium
          "
          >
            Premium Fashion Store
          </div>

        </div>

      </div>
    </footer>
  );
}
