export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/8801406978619?text=Hello%20Dream%20Mode,%20I'm%20interested%20in%20your%20products."
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed
        bottom-6
        right-6
        z-[999]
        group
      "
    >
      <div
        className="
        flex
        items-center
        gap-3

        bg-gradient-to-r
        from-blue-700
        to-yellow-500

        text-white

        px-5
        py-4

        rounded-full

        shadow-2xl

        hover:scale-105

        transition-all
        duration-300

        animate-pulse
      "
      >
        <span className="text-2xl">
          💬
        </span>

        <span
          className="
          hidden
          sm:block
          font-semibold
        "
        >
          WhatsApp
        </span>
      </div>
    </a>
  );
}
