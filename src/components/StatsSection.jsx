import {
  useEffect,
  useState,
} from "react";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Autoplay,
  Pagination,
} from "swiper/modules";


import "swiper/css";
import "swiper/css/pagination";


import {
  FaStar,
  FaUserCircle,
  FaQuoteLeft,
  FaCheckCircle,
} from "react-icons/fa";


import {
  getLatestReviews,
  formatReviewDate,
} from "../services/reviewService";



export default function StatsSection(){


  const [
    reviews,
    setReviews,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);





  useEffect(()=>{


    const loadReviews =
    async()=>{

      try{


        const data =
          await getLatestReviews(18);


        setReviews(data);



      }catch(error){


        console.log(error);


      }finally{


        setLoading(false);


      }


    };


    loadReviews();


  },[]);







  const mobileReviews =
    reviews.slice(0,10);








  return (

    <section className="
      py-14
      md:py-20
      bg-white
    ">


      <div className="
        container-box
      ">




        {/* Heading */}


        <div className="
          text-center
          mb-10
        ">


          <h2
            className="
            text-2xl
            md:text-5xl
            font-black
            whitespace-nowrap
            "
          >

            What Our Customers Say

          </h2>



          <div
            className="
            w-72
            max-w-full
            h-1.5
            bg-gradient-to-r
            from-transparent
            via-yellow-500
            to-transparent
            rounded-full
            mx-auto
            mt-4
            "
          />


        </div>







        {
          loading ?


          (

            <div className="
              text-center
              py-16
              text-gray-500
            ">

              Loading Reviews...


            </div>

          )



          :



          reviews.length === 0 ?


          (

            <div className="
              text-center
              py-16
              text-gray-500
            ">

              No Reviews Yet


            </div>

          )



          :



          (

          <Swiper


            modules={[
              Autoplay,
              Pagination,
            ]}


            className="
              !pb-12
              w-full
            "



            spaceBetween={20}



            autoplay={{

              delay:5000,

              disableOnInteraction:false,

            }}



            pagination={{

              clickable:true,

            }}



            loop={true}



            breakpoints={{


              0:{

                slidesPerView:1,

                spaceBetween:20,

              },



              640:{

                slidesPerView:2,

              },



              1024:{

                slidesPerView:3,

              },


            }}



          >


            {

              reviews.map((review)=>(



                <SwiperSlide
                  key={review.id}
                  className="
                    flex
                    justify-center
                  "
                >



                  <div
                    className="
                    w-full
                    max-w-sm
                    rounded-[32px]
                    bg-white
                    border
                    border-slate-200
                    shadow-xl
                    p-6
                    relative
                    "
                  >



                    <FaQuoteLeft

                      className="
                      absolute
                      right-6
                      top-6
                      text-5xl
                      text-yellow-100
                      "

                    />






                    <div className="
                      flex
                      items-center
                      gap-4
                    ">


                      {


                      review.photo ?


                      (

                        <img

                          src={
                            review.photo
                          }

                          alt="customer"

                          className="
                          w-16
                          h-16
                          rounded-full
                          object-cover
                          border-2
                          border-yellow-400
                          "

                        />

                      )


                      :


                      (

                        <FaUserCircle

                          className="
                          text-6xl
                          text-slate-300
                          "

                        />

                      )


                      }




                      <div>


                        <h3 className="
                          font-bold
                          text-lg
                        ">


                          {
                            review.name ||
                            "Dream Mode Customer"
                          }


                        </h3>



                        <div className="
                          flex
                          mt-2
                        ">


                          {
                            Array.from({
                              length:5
                            }).map(
                              (_,i)=>(


                              <FaStar

                                key={i}

                                className={
                                  i <
                                  (review.rating || 5)

                                  ?

                                  "text-yellow-500"

                                  :

                                  "text-gray-300"
                                }


                              />

                            ))

                          }


                        </div>


                      </div>


                    </div>







                    <p className="
                      mt-6
                      text-gray-600
                      leading-7
                      min-h-[100px]
                    ">


                      {review.comment
                        ? 
                        `“${review.comment}”`
                        :
                        "Excellent quality product."
                      }


                    </p>







                    <div className="
                      mt-5
                      pt-4
                      border-t
                      flex
                      justify-between
                      items-center
                    ">


                      <span className="
                        text-xs
                        text-gray-400
                      ">


                        {
                          formatReviewDate(
                            review.createdAt
                          )
                        }


                      </span>





                      <span className="
                        flex
                        items-center
                        gap-1
                        text-xs
                        font-semibold
                        text-emerald-700
                      ">


                        <FaCheckCircle/>


                        Verified


                      </span>


                    </div>



                  </div>



                </SwiperSlide>



              ))

            }



          </Swiper>


          )

        }




      </div>


    </section>

  );


}
