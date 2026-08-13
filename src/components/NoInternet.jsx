import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  isOffline,
  onOffline,
  onOnline,
  removeOffline,
  removeOnline,
} from "../mobile/offlineMode";

import {
  useSettings,
} from "../context/SettingsContext";

import {
  FiCloud,
  FiWifiOff,
  FiWifi,
  FiRefreshCw,
  FiHome,
  FiInfo,
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiPhone,
} from "react-icons/fi";

import {
  FaWhatsapp,
} from "react-icons/fa";


export default function NoInternet() {

  const [
    offline,
    setOffline,
  ] = useState(isOffline());

  const {
    settings,
  } = useSettings();


  useEffect(() => {

    const offlineHandler = () => setOffline(true);

    const onlineHandler = () => setOffline(false);

    onOffline(offlineHandler);

    onOnline(onlineHandler);

    return () => {

      removeOffline(offlineHandler);

      removeOnline(onlineHandler);

    };

  }, []);


  if (!offline) return null;


  return (

    <div
      className="
        fixed
        inset-0
        z-[99999]
        bg-[#FAF7F2]
        overflow-y-auto
      "
    >


      {/* TOP BAR */}

      <div
        className="
          bg-[#071F57]
          text-white
          text-sm
          font-medium
          py-2.5
          flex
          items-center
          justify-center
          gap-2
        "
      >

        <FiCloud size={16}/>

        You are currently offline

      </div>




      <div
        className="
          max-w-xl
          mx-auto
          px-6
          pt-10
          pb-8
        "
      >


        {/* LOGO */}

        <div
          className="
            flex
            items-center
            justify-center
            gap-3
            mb-12
          "
        >

          <img

            src={settings.logoUrl || "/logo.png"}

            alt="logo"

            className="
              w-10
              h-10
              object-contain
            "

          />

          <h1
            className="
              text-2xl
              font-bold
              text-[#111827]
            "
          >

            {settings.storeName || ""}

          </h1>

        </div>




        {/* ILLUSTRATION */}

        <div
          className="
            relative
            w-64
            h-64
            mx-auto
            flex
            items-center
            justify-center
            mb-10
          "
        >

          <div
            className="
              absolute
              inset-0
              rounded-full
              bg-amber-100/70
            "
          />


          <div
            className="
              relative
              w-28
              h-28
              rounded-full
              bg-white
              shadow-lg
              border
              border-amber-200
              flex
              items-center
              justify-center
            "
          >

            <FiWifiOff
              size={44}
              className="text-[#071F57]"
            />

          </div>

        </div>




        {/* HEADING */}

        <h2
          className="
            text-3xl
            font-black
            text-center
            text-[#111827]
          "
        >

          You&apos;re Offline 😔

        </h2>


        <p
          className="
            mt-3
            text-center
            text-gray-500
            leading-7
          "
        >

          No internet connection detected.
          <br/>
          Some features are unavailable while you&apos;re offline.

        </p>




        {/* BUTTONS */}

        <div
          className="
            mt-7
            flex
            flex-col
            sm:flex-row
            gap-3
            justify-center
          "
        >

          <button

            onClick={() => window.location.reload()}

            className="
              flex
              items-center
              justify-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-[#071F57]
              text-white
              font-semibold
            "

          >

            <FiRefreshCw size={18}/>

            Try Again

          </button>


          <Link

            to="/"

            className="
              flex
              items-center
              justify-center
              gap-2
              px-6
              py-3
              rounded-xl
              border
              border-[#071F57]
              text-[#071F57]
              font-semibold
            "

          >

            <FiHome size={18}/>

            Go to Home

          </Link>

        </div>




        {/* INFO BOX */}

        <div
          className="
            mt-7
            flex
            items-start
            gap-3
            bg-white
            border
            border-amber-200
            rounded-2xl
            p-4
          "
        >

          <FiInfo
            size={20}
            className="text-[#071F57] shrink-0 mt-0.5"
          />

          <div>

            <p
              className="
                font-semibold
                text-[#111827]
                text-sm
              "
            >

              You can still browse last viewed content

            </p>

            <p
              className="
                text-sm
                text-gray-500
                mt-0.5
              "
            >

              Some previously loaded pages might be available.

            </p>

          </div>

        </div>




        {/* NEED HELP */}

        <div
          className="
            mt-8
            flex
            items-center
            gap-3
          "
        >

          <div className="flex-1 h-px bg-gray-200"/>

          <span
            className="
              text-sm
              text-gray-500
            "
          >

            Need Help?

          </span>

          <div className="flex-1 h-px bg-gray-200"/>

        </div>


        <div
          className="
            mt-4
            flex
            items-start
            gap-3
          "
        >

          <FiWifi
            size={18}
            className="text-amber-500 mt-0.5"
          />

          <p
            className="
              text-sm
              text-gray-500
              leading-6
            "
          >

            Please check your internet connection
            <br/>
            or try again in a few moments.

          </p>

        </div>




        {/* FOOTER */}

        <div
          className="
            mt-10
            pt-6
            border-t
            border-gray-200
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <img

                src={settings.logoUrl || "/logo.png"}

                alt="logo"

                className="
                  w-7
                  h-7
                  object-contain
                "

              />

              <span
                className="
                  font-semibold
                  text-sm
                  text-[#111827]
                "
              >

                {settings.storeName || ""}

              </span>

            </div>


            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              {
                settings.facebook && (

                  <a

                    href={settings.facebook}

                    target="_blank"

                    rel="noreferrer"

                    className="
                      w-9
                      h-9
                      rounded-full
                      bg-gray-100
                      flex
                      items-center
                      justify-center
                      text-gray-600
                    "

                  >

                    <FiFacebook size={16}/>

                  </a>

                )
              }


              {
                settings.instagram && (

                  <a

                    href={settings.instagram}

                    target="_blank"

                    rel="noreferrer"

                    className="
                      w-9
                      h-9
                      rounded-full
                      bg-gray-100
                      flex
                      items-center
                      justify-center
                      text-gray-600
                    "

                  >

                    <FiInstagram size={16}/>

                  </a>

                )
              }


              {
                settings.youtube && (

                  <a

                    href={settings.youtube}

                    target="_blank"

                    rel="noreferrer"

                    className="
                      w-9
                      h-9
                      rounded-full
                      bg-gray-100
                      flex
                      items-center
                      justify-center
                      text-gray-600
                    "

                  >

                    <FiYoutube size={16}/>

                  </a>

                )
              }


              {
                settings.whatsapp && (

                  <a

                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g,"")}`}

                    target="_blank"

                    rel="noreferrer"

                    className="
                      w-9
                      h-9
                      rounded-full
                      bg-gray-100
                      flex
                      items-center
                      justify-center
                      text-gray-600
                    "

                  >

                    <FaWhatsapp size={16}/>

                  </a>

                )
              }

            </div>

          </div>




          {
            settings.phone && (

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  mt-2
                "
              >

                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#071F57]
                  "
                >

                  Contact Us

                </p>

                <p
                  className="
                    text-sm
                    text-gray-500
                    flex
                    items-center
                    gap-1
                  "
                >

                  <FiPhone size={13}/>

                  {settings.phone}

                </p>

              </div>

            )
          }




          <p
            className="
              text-center
              text-xs
              text-gray-400
              mt-6
            "
          >

            © {new Date().getFullYear()} All rights reserved by {settings.storeName || ""}

          </p>

        </div>


      </div>


    </div>

  );

}
