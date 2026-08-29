import {
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaLock,
  FaHeadset,
  FaStore,
} from "react-icons/fa";

import { useSettings } from "../context/SettingsContext";


export default function WhyChooseUs() {

const { settings } = useSettings();

  const items = [
    {
      icon: FaShieldAlt,
      title: "100% Original",
      desc: "Premium Quality",
    },
    {
      icon: FaTruck,
      title: "Fast Delivery",
      desc: "On Time Delivery",
    },
    {
      icon: FaUndo,
      title: "Easy Return",
      desc: "3 Days Return Policy",
    },
    {
      icon: FaLock,
      title: "Secure Payment",
      desc: "Safe & Secure",
    },
    {
      icon: FaHeadset,
      title: "Best Support",
      desc: "24/7 Customer Support",
    },
    {
      icon: FaStore,
      title: "Trusted Shop",
      desc: "Thousands Happy Customers",
    },
  ];


  return (

    <section className="pt-0 pb-10 bg-white">

      <div className="container-box">


        {/* Title */}

        <div className="text-center mb-4">

          <h2
  className="
  text-[26px]
  sm:text-3xl
  md:text-5xl
  font-bold
  whitespace-nowrap
  "
>
            Why Choose Us
          </h2>

        </div>



        {/* Features */}

        <div
          className="
          bg-gradient-to-br
          from-[#0f172a]
          via-[#172554]
          to-[#1e3a8a]
          rounded-3xl
          p-5
          md:p-8
          grid
          grid-cols-3
          gap-y-7
          gap-x-2
          shadow-xl
          "
        >


          {items.map((item,index)=>{

            const Icon = item.icon;


            return (

              <div
                key={index}
                className="
                flex
                flex-col
                items-center
                text-center
                "
              >

                <Icon
                  className="
                  text-3xl
                  md:text-4xl
                  text-amber-500
                  mb-2
                  "
                />


                <h3
                  className="
                  text-white
                  text-xs
                  md:text-base
                  font-semibold
                  leading-tight
                  "
                >
                  {item.title}
                </h3>


                <p
                  className="
                  text-gray-300
                  text-[10px]
                  md:text-sm
                  leading-tight
                  mt-1
                  "
                >
                  {item.desc}
                </p>


              </div>

            );

          })}


        </div>


      </div>

    </section>

  );
}
