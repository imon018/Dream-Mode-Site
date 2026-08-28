import { FaFacebookF, FaThumbsUp, FaHeart } from "react-icons/fa";
import jewelryImage from "../assets/banners/facebook-jewelry.png";

export default function FacebookFollowBanner() {
  return (
    <section className="pb-20">
      <div className="container-box">
        <div
          className="
          relative
          overflow-hidden
          rounded-2xl
          bg-[#0B1229]
          shadow-luxury
          "
        >
          {/* Decorative Glows */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-400/10 blur-[110px]" />
          <div className="absolute -bottom-24 -right-10 w-72 h-72 rounded-full bg-blue-500/10 blur-[110px]" />

          {/* Faint diamond texture */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 1px, transparent 40px)",
            }}
          />

          <div
            className="
            relative
            z-10
            grid
            grid-cols-1
            md:grid-cols-2
            items-center
            gap-10
            px-6
            py-12
            md:px-14
            md:py-16
            "
          >
            {/* Left: Text */}
            <div className="flex items-center gap-5">
              <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1877F2] flex items-center justify-center shadow-gold">
                <FaFacebookF className="text-white text-3xl md:text-4xl" />
              </div>

              <div>
                <p className="text-gold text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-1">
                  Follow Us On
                </p>

                <h2 className="font-serif text-3xl md:text-5xl font-bold text-white leading-none mb-3">
                  Facebook
                </h2>

                <p className="text-slate-300 text-sm md:text-base max-w-xs mb-5">
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
                  text-xs
                  md:text-sm
                  tracking-wider
                  uppercase
                  px-6
                  py-3
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

            {/* Right: Phone Mockup */}
            <div className="relative flex justify-center md:justify-end">
              {/* Floating reactions */}
              <FaHeart className="hidden md:block absolute -top-2 left-10 text-amber-400 text-3xl drop-shadow-lg animate-bounce [animation-duration:3s]" />

              <div className="hidden md:flex absolute top-16 -left-6 w-11 h-11 rounded-full bg-[#1877F2] items-center justify-center shadow-lg">
                <FaThumbsUp className="text-white text-lg" />
              </div>

              <div className="hidden md:flex absolute bottom-24 -left-8 w-9 h-9 rounded-full bg-white items-center justify-center text-lg shadow-lg">
                😮
              </div>

              <div className="hidden md:flex absolute top-6 right-2 w-12 h-12 rounded-full bg-[#F02849] items-center justify-center shadow-lg">
                <FaHeart className="text-white text-xl" />
              </div>

              <div className="hidden md:flex absolute bottom-4 right-10 w-9 h-9 rounded-full bg-white items-center justify-center text-lg shadow-lg">
                😍
              </div>

              {/* Phone frame */}
              <div className="relative w-[210px] md:w-[240px] h-[420px] md:h-[480px] rounded-[2.2rem] bg-black p-2.5 shadow-2xl">
                <div className="relative w-full h-full rounded-[1.7rem] overflow-hidden bg-[#F0F2F5]">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-2xl z-20" />

                  {/* Status/App bar */}
                  <div className="h-11 bg-white flex items-center px-3 gap-2 border-b border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-gold-gradient" />
                    <div className="h-2 w-16 rounded-full bg-slate-200" />
                  </div>

                  {/* Post header */}
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-white">
                    <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center">
                      <FaFacebookF className="text-white text-xs" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-24 rounded-full bg-slate-700 mb-1.5" />
                      <div className="h-1.5 w-14 rounded-full bg-slate-300" />
                    </div>
                  </div>

                  {/* Post image - real product photo */}
                  <div className="px-0.5">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={jewelryImage}
                        alt="Dream Mode jewelry"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Post footer */}
                  <div className="px-3 py-2.5">
                    <div className="h-1.5 w-3/4 rounded-full bg-slate-300 mb-1.5" />
                    <div className="h-1.5 w-1/2 rounded-full bg-slate-200" />
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
