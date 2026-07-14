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




  const [timeLeft,setTimeLeft] = useState({

    days:0,

    hours:0,

    minutes:0,

    seconds:0,

  });







  useEffect(()=>{


    if(!settings.maintenanceEndTime){

      return;

    }






    const timer = setInterval(()=>{


      const endTime = new Date(
        settings.maintenanceEndTime
      ).getTime();



      const now = Date.now();



      const distance = endTime - now;






      // TIME FINISHED

      if(distance <= 0){


        clearInterval(timer);



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



    },1000);






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
        items-center
        justify-center
        px-6
      "
    >




      <div
        className="
          max-w-6xl
          w-full
          grid
          lg:grid-cols-2
          gap-10
          items-center
        "
      >






        {/* CONTENT */}


        <div>



          {
            settings.logoUrl && (

              <img

                src={settings.logoUrl}

                alt="logo"

                className="
                  w-40
                  mb-8
                  object-contain
                "

              />

            )
          }






          <h1
            className="
              text-4xl
              md:text-5xl
              font-black
              text-[#172033]
            "
          >

            Website Under Maintenance

          </h1>







          <p
            className="
              mt-5
              text-gray-600
              leading-8
              text-lg
            "
          >

            {settings.storeName || "Dream Mode"}

            {" "}is upgrading the website experience.

            <br/>

            We will be back soon.

          </p>









          {/* COUNTDOWN */}


          {
            settings.maintenanceEndTime && (

              <div
                className="
                  mt-8
                  grid
                  grid-cols-4
                  gap-3
                "
              >


                {
                  [

                    ["Days",timeLeft.days],

                    ["Hours",timeLeft.hours],

                    ["Min",timeLeft.minutes],

                    ["Sec",timeLeft.seconds],

                  ].map(item=>(


                    <div
                      key={item[0]}
                      className="
                        bg-white
                        rounded-xl
                        shadow
                        p-4
                        text-center
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
                          String(item[1])
                          .padStart(2,"0")
                        }

                      </h2>



                      <p
                        className="
                          text-xs
                          text-gray-500
                        "
                      >

                        {item[0]}

                      </p>


                    </div>


                  ))

                }


              </div>

            )
          }









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

                <p
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <FiMail/>

                  {settings.email}

                </p>

              )
            }





            {
              settings.phone && (

                <p
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <FiPhone/>

                  {settings.phone}

                </p>

              )
            }







            {
              settings.facebook && (

                <a

                  href={settings.facebook}

                  target="_blank"

                  rel="noreferrer"

                  className="
                    flex
                    items-center
                    gap-3
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









        {/* IMAGE */}


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
              max-w-xl
              w-full
            "

          />


        </div>






      </div>


    </div>


  );


}
