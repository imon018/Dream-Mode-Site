import {
  useEffect,
  useState,
} from "react";


import {
  FiPhone,
  FiMail,
  FiFacebook,
} from "react-icons/fi";


import {
  useSettings,
} from "../context/SettingsContext";





export default function MaintenancePage(){


  const {
    settings,
  } = useSettings();




  const [timeLeft,setTimeLeft] =
    useState({

      days:0,

      hours:0,

      minutes:0,

      seconds:0,

    });







  useEffect(()=>{


    const calculateTime = ()=>{


      if(!settings.maintenanceEndTime){

        return;

      }



      const endTime =
        new Date(
          settings.maintenanceEndTime
        )
        .getTime();




      const now =
        new Date()
        .getTime();



      const distance =
        endTime - now;




      if(distance <= 0){


        setTimeLeft({

          days:0,

          hours:0,

          minutes:0,

          seconds:0,

        });


        return;


      }






      setTimeLeft({

        days:
          Math.floor(
            distance /
            (1000 * 60 * 60 * 24)
          ),


        hours:
          Math.floor(
            (
              distance %
              (1000 * 60 * 60 * 24)
            )
            /
            (1000 * 60 * 60)
          ),



        minutes:
          Math.floor(
            (
              distance %
              (1000 * 60 * 60)
            )
            /
            (1000 * 60)
          ),




        seconds:
          Math.floor(
            (
              distance %
              (1000 * 60)
            )
            /
            1000
          ),


      });



    };




    calculateTime();



    const timer =
      setInterval(
        calculateTime,
        1000
      );



    return ()=>{

      clearInterval(timer);

    };


  },[
    settings.maintenanceEndTime
  ]);







  return (


    <div
      className="
        min-h-screen
        bg-[#FAF7F2]
        flex
        flex-col
        justify-between
        px-6
        py-8
      "
    >





      <div
        className="
          max-w-7xl
          mx-auto
          w-full
        "
      >




        {/* HEADER LOGO */}


        {
          settings.logoUrl && (

            <img

              src={
                settings.logoUrl
              }

              alt="Logo"

              className="
                w-52
                h-auto
                object-contain
                mb-8
              "

            />

          )

        }






        <div
          className="
            grid
            lg:grid-cols-2
            gap-10
            items-center
          "
        >





          {/* LEFT */}


          <div>



            <p
              className="
                text-amber-500
                text-xl
                italic
                font-semibold
              "
            >

              We're Currently In

            </p>





            <h1
              className="
                mt-3
                text-5xl
                md:text-6xl
                font-black
                text-[#172033]
                leading-tight
              "
            >

              Maintenance
              <br/>
              Mode

            </h1>






            <div
              className="
                w-20
                h-1
                bg-amber-500
                mt-6
              "
            />







            <p
              className="
                mt-8
                text-gray-600
                leading-8
                max-w-lg
              "
            >

              We're making some exciting updates
              to improve your experience.

              <br/>

              Our site will be back soon!

              <br/>

              Thank you for your patience and support.

            </p>








            {/* COUNTDOWN */}


            <div
              className="
                mt-8
                bg-white
                rounded-2xl
                shadow-md
                p-5
                max-w-md
              "
            >

              <h3
                className="
                  font-bold
                  text-[#172033]
                  mb-4
                "
              >

                We will be back in

              </h3>





              <div
                className="
                  grid
                  grid-cols-4
                  gap-3
                  text-center
                "
              >


                {
                  [

                    ["Days",timeLeft.days],

                    ["Hours",timeLeft.hours],

                    ["Minutes",timeLeft.minutes],

                    ["Seconds",timeLeft.seconds],

                  ]
                  .map(
                    ([label,value])=>(


                    <div
                      key={label}
                      className="
                        bg-[#FFF7E8]
                        rounded-xl
                        p-3
                      "
                    >

                      <h2
                        className="
                          text-2xl
                          font-black
                          text-amber-500
                        "
                      >

                        {
                          String(value)
                          .padStart(2,"0")
                        }

                      </h2>


                      <p
                        className="
                          text-xs
                          text-gray-500
                        "
                      >

                        {label}

                      </p>


                    </div>


                    )
                  )

                }


              </div>


            </div>







            {/* CONTACT */}


            <div
              className="
                mt-8
                space-y-3
                text-gray-600
              "
            >


              {
                settings.email && (

                  <p className="flex gap-3 items-center">

                    <FiMail
                      className="text-amber-500"
                    />

                    {settings.email}

                  </p>

                )
              }





              {
                settings.phone && (

                  <p className="flex gap-3 items-center">

                    <FiPhone
                      className="text-amber-500"
                    />

                    {settings.phone}

                  </p>

                )
              }




              {
                settings.facebook && (

                  <a

                    href={
                      settings.facebook
                    }

                    target="_blank"

                    rel="noreferrer"

                    className="
                      flex
                      gap-3
                      items-center
                      text-blue-600
                    "

                  >

                    <FiFacebook/>

                    Facebook

                  </a>

                )
              }




            </div>





          </div>









          {/* RIGHT IMAGE */}


          <div
            className="
              flex
              justify-center
            "
          >

            <img

              src="/maintenance.png"

              alt="Maintenance"

              className="
                w-full
                max-w-xl
              "

            />

          </div>





        </div>



      </div>








      {/* FOOTER */}


      <footer
        className="
          text-center
          text-gray-500
          text-sm
          mt-10
        "
      >

        © 2026 {settings.storeName || "Dream Mode"}.
        All Rights Reserved ❤️


      </footer>



    </div>


  );


}
