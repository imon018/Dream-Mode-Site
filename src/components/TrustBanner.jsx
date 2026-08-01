export default function TrustBanner() {

  const delivery = [
    {
      icon: "🛵",
      title: "Inside Dhaka",
      value: "৳80",
    },

    {
      icon: "🚚",
      title: "Outside Dhaka",
      value: "৳150",
    },

    {
      icon: "📦",
      title: "Dispatch From",
      value: "Dhaka",
    },
  ];


  return (

    <section className="pb-20">

      <div className="container-box">


        <div
          className="
          relative
          overflow-hidden
          rounded-lg
          bg-white
          border
          border-slate-100
          shadow-premium
          px-6
          py-10
          md:px-12
          md:py-14
          "
        >


          {/* Background Glow */}

          <div
            className="
            absolute
            -top-20
            -left-20
            w-60
            h-60
            rounded-full
            bg-yellow-400/10
            blur-[100px]
            "
          />


          <div
            className="
            absolute
            -bottom-20
            -right-20
            w-60
            h-60
            rounded-lg
            bg-blue-500/10
            blur-[100px]
            "
          />



          <div className="relative z-10">


            {/* Heading */}

            <div
              className="
              text-center
              mb-10
              "
            >

              <h2
                className="
                text-3xl
                md:text-4xl
                font-black
                text-blue-950
                "
              >
                Our Delivery Service
              </h2>


              {/* Gold Underline */}

              <div
                className="
                w-full
                max-w-xs
                h-[2px]
                bg-gradient-to-r
                from-transparent
                via-yellow-500
                to-transparent
                mx-auto
                mt-4
                "
              />


            </div>





            {/* Delivery Cards */}


            <div
  className="
    grid
    grid-cols-3
    gap-2
    md:gap-5
  "
>


              {
                delivery.map((item)=>(

                  <div
                    key={item.title}
                    className="
flex
flex-col
items-center
text-center
gap-2
rounded-lg
bg-white
border
border-slate-200
px-2
py-3
shadow-md
transition
duration-300
hover:-translate-y-1
hover:shadow-xl
"
                  >


                    {/* Icon */}

                    <div
                      className="
w-10
h-10
md:w-16
md:h-16
rounded-lg
bg-blue-50
flex
items-center
justify-center
text-2xl
md:text-4xl
"
                    >

                      {item.icon}

                    </div>




                    {/* Text */}

                    <div>

                      <p className="text-[10px] md:text-base text-gray-600">
                        {item.title}
                      </p>


                      <h3 className="text-sm md:text-3xl font-black text-blue-900 mt-1">
                        {item.value}
                      </h3>


                    </div>



                  </div>

                ))
              }



            </div>


          </div>


        </div>


      </div>


    </section>

  );

}
