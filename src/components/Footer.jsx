import { Link } from "react-router-dom";

import {
  FiFacebook,
  FiMail,
  FiPhone,
  FiMapPin,
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
      mt-2
      "

    >



      <div

        className="
        max-w-7xl
        mx-auto
        px-5
        md:px-8
        py-14
        "

      >





        <div

          className="
          grid
          md:grid-cols-2
          lg:grid-cols-4
          gap-10
          "

        >







          {/* BRAND */}


          <div>



            <img

              src="/logo.png"

              alt="Dream Mode"

              className="
              w-32
              mb-5
              "

            />




            <p

              className="
              text-amber-500
              italic
              font-medium
              text-lg
              "

            >

              Dress Your Dream, Live Your Life

            </p>





            <p

              className="
              text-slate-300
              mt-5
              leading-7
              "

            >

              Dream Mode is your trusted destination
              for Premium Dress. We ensure quality,
              style & customer satisfaction.

            </p>




          </div>









          {/* QUICK LINKS */}


          <div>


            <h3

              className="
              text-xl
              font-bold
              mb-5
              "

            >

              Quick Links

            </h3>




            <div

              className="
              flex
              flex-col
              gap-3
              text-slate-300
              "

            >


              <Link
                to="/"
                className="hover:text-amber-500 transition"
              >
                Home
              </Link>



              <Link
                to="/shop"
                className="hover:text-amber-500 transition"
              >
                Shop
              </Link>



              <Link
                to="/cart"
                className="hover:text-amber-500 transition"
              >
                Cart
              </Link>



              <Link
                to="/profile"
                className="hover:text-amber-500 transition"
              >
                My Account
              </Link>



            </div>



          </div>









          {/* CUSTOMER SERVICE */}


          <div>


            <h3

              className="
              text-xl
              font-bold
              mb-5
              "

            >

              Customer Service

            </h3>





            <div

              className="
              flex
              flex-col
              gap-3
              text-slate-300
              "

            >



              <Link
                to="/contact"
                className="hover:text-amber-500 transition"
              >
                Contact Us
              </Link>



              <Link
                to="/shipping-policy"
                className="hover:text-amber-500 transition"
              >
                Shipping Policy
              </Link>




              <Link
                to="/return-policy"
                className="hover:text-amber-500 transition"
              >
                Return Policy
              </Link>




              <Link
                to="/refund-policy"
                className="hover:text-amber-500 transition"
              >
                Refund Policy
              </Link>




              <Link
                to="/privacy-policy"
                className="hover:text-amber-500 transition"
              >
                Privacy Policy
              </Link>




              <Link
                to="/terms"
                className="hover:text-amber-500 transition"
              >
                Terms & Conditions
              </Link>




              <Link
                to="/size-guide"
                className="hover:text-amber-500 transition"
              >
                Size Guide
              </Link>



            </div>


          </div>









          {/* CONTACT */}


          <div>


            <h3

              className="
              text-xl
              font-bold
              mb-5
              "

            >

              Contact

            </h3>





            <div

              className="
              space-y-5
              text-slate-300
              "

            >





              <div className="flex gap-3 items-center">


                <FiPhone
                  className="
                  text-amber-500
                  text-xl
                  "
                />


                <span>
                  {siteConfig.phone}
                </span>


              </div>







              <div className="flex gap-3 items-center">


                <FiMail
                  className="
                  text-amber-500
                  text-xl
                  "
                />


                <span>
                  {siteConfig.email}
                </span>


              </div>








              <div className="flex gap-3 items-center">


                <FiMapPin
                  className="
                  text-amber-500
                  text-xl
                  "
                />


                <span>
                  Dhaka, Bangladesh
                </span>


              </div>





            </div>






            <a

              href={siteConfig.facebook}

              target="_blank"

              rel="noopener noreferrer"

              className="
              inline-flex
              items-center
              gap-2
              mt-6
              bg-white/10
              px-5
              py-3
              rounded-full
              hover:bg-amber-500
              hover:text-black
              transition
              "

            >

              <FiFacebook />

              Facebook

            </a>



          </div>






        </div>









        {/* PAYMENT */}



        <div

          className="
          mt-12
          pt-8
          border-t
          border-white/10
          "

        >



          <h3

            className="
            text-lg
            font-bold
            mb-5
            "

          >

            We Accept

          </h3>





          <div

            className="
            flex
            flex-wrap
            items-center
            gap-5
            "

          >


            <img
              src="/payments/visa.png"
              alt="Visa"
              className="h-10 w-auto"
            />



            <img
              src="/payments/mastercard.png"
              alt="Mastercard"
              className="h-10 w-auto"
            />



            <img
              src="/payments/bkash.png"
              alt="bKash"
              className="h-10 w-auto"
            />



            <img
              src="/payments/nagad.png"
              alt="Nagad"
              className="h-10 w-auto"
            />




            <span
              className="
              text-slate-300
              text-sm
              "
            >

              bKash / Nagad:
              <br/>
              01628464209 (Personal)

            </span>



          </div>


        </div>









        {/* BOTTOM */}



        <div

          className="
          mt-10
          pt-6
          border-t
          border-white/10
          flex
          flex-col
          md:flex-row
          justify-between
          items-center
          gap-3
          "

        >



          <p

            className="
            text-slate-400
            text-sm
            text-center
            "

          >

            © 2026 DREAM MODE.
            All Rights Reserved.

          </p>




          <p

            className="
            text-amber-500
            italic
            text-sm
            "

          >

            Premium Fashion Store

          </p>



        </div>






      </div>



    </footer>


  );

}


