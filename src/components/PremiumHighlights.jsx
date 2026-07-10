import {
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiLock,
  FiUsers,
  FiShoppingBag,
  FiAward,
  FiHeadphones,
} from "react-icons/fi";

export default function PremiumHighlights() {
  const features = [
    {
      icon: FiShield,
      title: "Premium",
      subtitle: "Quality",
    },
    {
      icon: FiTruck,
      title: "Fast",
      subtitle: "Delivery",
    },
    {
      icon: FiRefreshCw,
      title: "Easy",
      subtitle: "Return",
    },
    {
      icon: FiLock,
      title: "Secure",
      subtitle: "Order",
    },
  ];

  const stats = [
    {
      icon: FiUsers,
      value: "5K+",
      label: "Customers",
    },
    {
      icon: FiShoppingBag,
      value: "2K+",
      label: "Orders",
    },
    {
      icon: FiAward,
      value: "100+",
      label: "Products",
    },
    {
      icon: FiHeadphones,
      value: "24/7",
      label: "Support",
    },
  ];

  return (
    <section className="relative z-20 -mt-3 px-3 md:px-6">
      <div className="max-w-6xl mx-auto">

        {/* FEATURES */}

        <div
          className="
            bg-white
            rounded-t-3xl
            border
            border-amber-500
            shadow-[0_0_20px_rgba(245,158,11,.15)]
            overflow-hidden
          "
        >
          <div className="grid grid-cols-4">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    py-4
                    px-1
                    text-center
                  "
                >
                  <Icon
                    className="
                      text-amber-500
                      text-xl
                      md:text-2xl
                      mb-2
                    "
                  />

                  <p
                    className="
                      text-[10px]
                      md:text-xs
                      font-bold
                      text-slate-800
                      leading-tight
                    "
                  >
                    {item.title}
                  </p>

                  <p
                    className="
                      text-[10px]
                      md:text-xs
                      text-slate-600
                      leading-tight
                    "
                  >
                    {item.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* STATS */}

        <div
          className="
            bg-gradient-to-r
            from-[#021B4A]
            via-[#03235F]
            to-[#021B4A]
            rounded-b-3xl
            border-x
            border-b
            border-amber-500
            shadow-[0_0_20px_rgba(245,158,11,.45)]
            overflow-hidden
          "
        >
          <div className="grid grid-cols-4">
            {stats.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    py-4
                    px-1
                    text-center
                  "
                >
                  <Icon
                    className="
                      text-amber-400
                      text-lg
                      md:text-xl
                      mb-2
                    "
                  />

                  <h3
                    className="
                      text-white
                      font-bold
                      text-sm
                      md:text-lg
                    "
                  >
                    {item.value}
                  </h3>

                  <p
                    className="
                      text-white/80
                      text-[10px]
                      md:text-xs
                    "
                  >
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
