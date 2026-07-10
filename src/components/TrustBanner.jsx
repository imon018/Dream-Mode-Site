export default function TrustBanner() {
  const features = [
    {
      icon: "🔒",
      title: "Secure Payment",
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
    },
    {
      icon: "💳",
      title: "Cash On Delivery",
    },
    {
      icon: "⭐",
      title: "Premium Quality",
    },
    {
      icon: "↩️",
      title: "Easy Returns",
    },
    {
      icon: "🎧",
      title: "24/7 Support",
    },
  ];

  return (
    <section className="pb-20">

      <div className="container-box">

        <div
          className="
          relative
          overflow-hidden
          rounded-[40px]
          border
          border-slate-200
          bg-white/80
          backdrop-blur-xl
          p-8
          md:p-12
          shadow-premium
        "
        >

          {/* Glow */}

          <div
            className="
            absolute
            top-0
            left-0
            w-52
            h-52
            rounded-full
            bg-yellow-400/10
            blur-[100px]
          "
          />

          <div
            className="
            absolute
            bottom-0
            right-0
            w-52
            h-52
            rounded-full
            bg-blue-500/10
            blur-[100px]
          "
          />

          <div className="relative z-10">

            <div className="text-center mb-10">

              <h2 className="text-3xl md:text-4xl font-black">

                Shop With Confidence

              </h2>

              <p className="mt-3 text-gray-500">

                Trusted service, secure payment,
                and premium shopping experience.

              </p>

            </div>

            <div
              className="
              grid
              grid-cols-2
              md:grid-cols-3
              gap-5
            "
            >

              {features.map((item) => (
                <div
                  key={item.title}
                  className="
                  premium-card
                  p-6
                  text-center
                "
                >

                  <div className="text-4xl mb-4">
                    {item.icon}
                  </div>

                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
