import { FaFacebookF } from "react-icons/fa";

import {
  useSettings,
} from "../context/SettingsContext";


export default function FacebookFollowBanner() {


  const {
    settings,
  } = useSettings();


  const fbLink =
    settings.facebook || "#";


  return (

    <section
      className="
        pb-1
      "
    >

      <div
        className="
          container-box
        "
      >

        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            bg-[#0A1730]
            px-6
            py-10
            md:px-12
            lg:px-16
            md:py-12
            lg:py-14
            flex
            flex-col
            lg:flex-row
            items-center
            justify-between
            gap-10
            lg:gap-6
          "
        >

          {/* ===== SPARKLE BACKGROUND ===== */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.35]
            "
            style={{
              backgroundImage:
                "radial-gradient(#D4AF37 0.6px, transparent 0.6px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              -top-24
              -left-24
              w-72
              h-72
              rounded-full
              bg-[#D4AF37]/10
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              -right-10
              w-72
              h-72
              rounded-full
              bg-[#1877F2]/10
              blur-3xl
            "
          />


          {/* ===== LEFT: ICON + TEXT ===== */}

          <div
            className="
              relative
              flex
              flex-col
              sm:flex-row
              items-center
              text-center
              sm:text-left
              gap-5
              lg:gap-6
            "
          >

            <div
              className="
                w-16
                h-16
                md:w-[70px]
                md:h-[70px]
                shrink-0
                rounded-full
                bg-[#1877F2]
                flex
                items-center
                justify-center
                shadow-lg
                shadow-[#1877F2]/30
              "
            >
              <FaFacebookF
                size={30}
                className="text-white md:w-8 md:h-8"
              />
            </div>

            <div>

              <p
                className="
                  text-[#D4AF37]
                  text-xs
                  md:text-sm
                  font-bold
                  tracking-[3px]
                  uppercase
                "
              >
                Follow Us On
              </p>

              <h2
                className="
                  mt-1
                  text-3xl
                  md:text-4xl
                  lg:text-[42px]
                  font-bold
                  text-white
                  tracking-wide
                "
              >
                FACEBOOK
              </h2>

              <p
                className="
                  mt-3
                  text-gray-300
                  text-sm
                  md:text-[15px]
                  max-w-sm
                  leading-relaxed
                "
              >
                Join our Facebook page for latest updates,
                exclusive offers and new arrivals.
              </p>

              <a
                href={fbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-5
                  inline-flex
                  items-center
                  justify-center
                  rounded-md
                  bg-gradient-to-b
                  from-[#E8C766]
                  to-[#D4AF37]
                  text-[#0A1730]
                  font-bold
                  text-xs
                  md:text-sm
                  tracking-widest
                  uppercase
                  px-8
                  py-3.5
                  hover:brightness-105
                  active:scale-95
                  transition-all
                  shadow-lg
                  shadow-[#D4AF37]/20
                "
              >
                Follow Now
              </a>

            </div>

          </div>


          {/* ===== RIGHT: PHONE MOCKUP ===== */}

          <div
            className="
              relative
              shrink-0
              w-[190px]
              h-[230px]
              md:w-[220px]
              md:h-[260px]
              lg:w-[240px]
              lg:h-[280px]
              mt-4
              lg:mt-0
            "
          >

            {/* Floating reactions */}

            <span
              className="
                floatA
                absolute
                -top-2
                left-2
                text-3xl
                md:text-4xl
                drop-shadow-lg
                z-20
              "
            >
              ❤️
            </span>

            <span
              className="
                floatB
                absolute
                top-16
                md:top-20
                -left-8
                md:-left-10
                w-8
                h-8
                md:w-10
                md:h-10
                rounded-full
                bg-[#1877F2]
                flex
                items-center
                justify-center
                text-lg
                md:text-xl
                z-20
                shadow-lg
              "
            >
              👍
            </span>

            <span
              className="
                floatC
                absolute
                top-32
                md:top-36
                left-4
                text-2xl
                md:text-3xl
                z-20
              "
            >
              😮
            </span>

            <span
              className="
                floatA
                absolute
                top-6
                -right-6
                md:-right-8
                w-7
                h-7
                md:w-9
                md:h-9
                rounded-full
                bg-[#FA3E3E]
                flex
                items-center
                justify-center
                text-sm
                md:text-base
                z-20
                shadow-lg
              "
            >
              ❤️
            </span>

            <span
              className="
                floatB
                absolute
                top-16
                md:top-20
                -right-2
                text-2xl
                md:text-3xl
                z-20
              "
            >
              😮
            </span>

            <span
              className="
                floatC
                absolute
                top-32
                md:top-36
                -right-8
                md:-right-10
                w-9
                h-9
                md:w-11
                md:h-11
                rounded-full
                bg-[#FA3E3E]
                flex
                items-center
                justify-center
                text-base
                md:text-lg
                z-20
                shadow-lg
              "
            >
              ❤️
            </span>


            {/* Phone frame */}

            <div
              className="
                relative
                w-full
                h-full
                rounded-[26px]
                bg-[#111827]
                border-[5px]
                border-[#1F2937]
                shadow-2xl
                overflow-hidden
                z-10
              "
            >

              {/* status bar */}

              <div
                className="
                  h-6
                  bg-[#1877F2]
                  flex
                  items-center
                  px-3
                  gap-1
                "
              >
                <div className="w-2 h-2 rounded-full bg-white/70" />
                <div className="w-2 h-2 rounded-full bg-white/70" />
                <p className="ml-auto text-[8px] text-white/80 font-semibold">
                  Dream Mode
                </p>
              </div>

              {/* fb post header */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  px-2.5
                  py-2
                  bg-white
                "
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8a6a15]" />
                <div>
                  <div className="w-16 h-[6px] rounded bg-gray-800" />
                  <div className="w-10 h-[5px] mt-1 rounded bg-gray-300" />
                </div>
              </div>

              {/* product grid */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-[2px]
                  bg-white
                  px-[2px]
                "
              >

                {[
                  "from-[#F5D98B] to-[#B8860B]",
                  "from-[#E8C766] to-[#9c7a1e]",
                  "from-[#D4AF37] to-[#7a5c14]",
                  "from-[#F0DFA0] to-[#a3801f]",
                ].map((grad, i) => (

                  <div
                    key={i}
                    className={`
                      aspect-square
                      bg-gradient-to-br
                      ${grad}
                      flex
                      items-center
                      justify-center
                    `}
                  >
                    <span className="text-white/70 text-lg">
                      💍
                    </span>
                  </div>

                ))}

              </div>

              {/* fb footer bar */}

              <div
                className="
                  bg-white
                  px-2.5
                  py-2
                  flex
                  items-center
                  gap-3
                  text-[10px]
                  text-gray-500
                "
              >
                👍 ❤️ 😮
              </div>

            </div>

          </div>


        </div>

      </div>


      <style>
        {`
          @keyframes floatA {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes floatB {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(8px); }
          }
          @keyframes floatC {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-6px) rotate(6deg); }
          }
          .floatA { animation: floatA 3s ease-in-out infinite; }
          .floatB { animation: floatB 3.4s ease-in-out infinite; }
          .floatC { animation: floatC 2.6s ease-in-out infinite; }
        `}
      </style>

    </section>

  );

}
