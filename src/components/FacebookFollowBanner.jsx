import { FaFacebookF, FaThumbsUp, FaHeart, FaGem } from "react-icons/fa";
import jewelryImage from "../assets/banners/facebook-jewelry.png";

export default function FacebookFollowBanner() {
  return (
    <section className="pb-10 md:pb-14">
      <div className="container-box">
        <div
          className="
          relative
          overflow-hidden
          rounded-xl
          bg-[#0B1229]
          border
          border-amber-400/10
          shadow-luxury
          "
        >
          {/* Decorative Glows */}
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-amber-400/10 blur-[90px]" />
          <div className="absolute -bottom-16 -right-10 w-56 h-56 rounded-full bg-blue-500/10 blur-[90px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-40 rounded-full bg-amber-400/[0.06] blur-[70px]" />

          {/* Diamond texture */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 1px, transparent 40px)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, #D4AF37 0, #D4AF37 1px, transparent 1px, transparent 40px)",
            }}
          />

          {/* Scattered sparkles filling the empty space */}
          <FaGem className="absolute top-4 left-[46%] text-amber-400/25 text-xs sm:text-sm" />
          <span className="absolute top-8 left-[58%] text-amber-400/30 text-[10px] sm:text-sm">✦</span>
          <span className="absolute bottom-6 left-[50%] text-amber-400/20 text-xs sm:text-base">✧</span>
          <span className="absolute top-1/2 left-[38%] -translate-y-1/2 text-amber-400/20 text-[10px] sm:text-sm">✦</span>
          <span className="absolute bottom-10 left-[62%] text-white/10 text-[10px] sm:text-sm">✧</span>

          <div
            className="
            relative
            z-10
            flex
            flex-row
            items-center
            justify-between
            gap-3
            sm:gap-6
            px-4
            py-4
            sm:px-8
            sm:py-6
            md:px-14
            md:py-8
            "
          >
            {/* Left: Text */}
            <div className="flex items-center gap-3 sm:gap-5 min-w-0">
              <div className="shrink-0 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#1877F2] flex items-center justify-center shadow-gold">
                <FaFacebookF className="text-white text-base sm:text-2xl md:text-3xl" />
              </div>

              <div className="min-w-0">
                <p className="text-gold text-[9px] sm:text-xs md:text-sm font-bold tracking-[0.15em] uppercase mb-0.5">
                  Follow Us On
                </p>

                <h2 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-1 sm:mb-2">
                  Facebook
                </h2>

                <p className="hidden sm:block text-slate-300 text-xs md:text-sm max-w-xs mb-3">
                  Join our Facebook page for latest updates, exclusive offers and new arrivals.
                </p>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="
                  inline-block
                  bg-gold-gradient
                  text-primary
                  font-bold
                  text-[9px]
                  sm:text-xs
                  tracking-wider
                  uppercase
                  px-3
                  py-1.5
                  sm:px-5
                  sm:py-2.5
                  rounded-md
                  shadow-gold
                  transition
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-xl
                  "
                >
                  Follow Now
                </a>
              </div>
            </div>

            {/* Right: Compact phone image with floating reactions */}
            <div className="relative shrink-0">
              {/* Soft glow behind the phone so it doesn't float in empty space */}
              <div className="absolute inset-0 scale-125 rounded-full bg-amber-400/10 blur-2xl" />

              {/* Floating reactions - visible on all screen sizes */}
              <FaHeart className="absolute -top-2.5 -left-2.5 sm:-top-3 sm:-left-3 text-amber-400 text-xs sm:text-base md:text-xl drop-shadow-lg animate-bounce [animation-duration:3s] z-20" />

              <div className="flex absolute top-2.5 sm:top-3 -left-4 sm:-left-5 md:-left-6 w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-7 md:h-7 rounded-full bg-[#1877F2] items-center justify-center shadow-lg z-20">
                <FaThumbsUp className="text-white text-[6px] sm:text-[8px] md:text-xs" />
              </div>

              <div className="flex absolute bottom-6 sm:bottom-8 -left-3 sm:-left-4 md:-left-6 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 rounded-full bg-white items-center justify-center text-[7px] sm:text-[9px] md:text-xs shadow-lg z-20">
                😮
              </div>

              <div className="flex absolute top-0.5 sm:top-1 -right-2.5 sm:-right-3 md:-right-4 w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-7 md:h-7 rounded-full bg-[#F02849] items-center justify-center shadow-lg z-20">
                <FaHeart className="text-white text-[6px] sm:text-[8px] md:text-xs" />
              </div>

              <div className="flex absolute bottom-1.5 sm:bottom-2 -right-3 sm:-right-4 md:-right-5 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 rounded-full bg-white items-center justify-center text-[7px] sm:text-[9px] md:text-xs shadow-lg z-20">
                😍
              </div>

              <div className="relative w-20 sm:w-28 md:w-36 aspect-[9/16] rounded-[0.9rem] bg-black p-1 shadow-2xl">
                <div className="relative w-full h-full rounded-[0.6rem] overflow-hidden">
                  <img
                    src={jewelryImage}
                    alt="Dream Mode jewelry"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-1.5 left-1.5 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#1877F2] flex items-center justify-center shadow">
                    <FaFacebookF className="text-white text-[8px] sm:text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
