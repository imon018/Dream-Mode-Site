import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

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

export default function StatsSection() {

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadReviews() {

      try {

        const data = await getLatestReviews();

        setReviews(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }

    loadReviews();

  }, []);

  return (

    <section className="py-14 md:py-20 bg-white">

      <div className="container-box">

        {/* Heading */}

        <div className="text-center mb-10">

          <h2
  className="
  text-2xl
  md:text-5xl
  font-bold
  whitespace-nowrap
  text-center
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
  from-yellow-400
  via-amber-500
  to-yellow-400
  rounded-full
  mx-auto
  mt-4
  shadow-lg
  "
/>

        </div>

        {loading ? (

          <div className="text-center py-16">

            <p className="text-gray-500 text-lg">
              Loading Reviews...
            </p>

          </div>

        ) : reviews.length === 0 ? (

          <div
            className="
            rounded-3xl
            border
            border-dashed
            border-slate-300
            py-16
            text-center
            "
          >

            <h3 className="text-xl font-semibold">
              No Reviews Yet
            </h3>

            <p className="mt-3 text-gray-500">
              Be the first customer to share your experience.
            </p>

          </div>

        ) : (

          <Swiper
  className="max-w-6xl mx-auto"

            modules={[
              Autoplay,
              Pagination,
            ]}

            loop={reviews.length > 3}

            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}

            pagination={{
              clickable: true,
            }}

            spaceBetween={24}

            breakpoints={{

              0: {
                slidesPerView: 1.1,
              },

              640: {
                slidesPerView: 2,
              },

              1024: {
                slidesPerView: 3,
              },

            }}

          >

                        {reviews.map((review) => (

              <SwiperSlide
  key={review.id}
  className="flex justify-center"
>

                <div
                  className="
                  relative
                  h-full
                  overflow-hidden
                  rounded-[32px]
                  border
                  border-slate-200
                  bg-white
                  p-7
                  shadow-lg
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:shadow-2xl
                  "
                >

                  {/* Quote Icon */}

                  <FaQuoteLeft
                    className="
                    absolute
                    top-6
                    right-6
                    text-5xl
                    text-amber-100
                    "
                  />



                  {/* Customer */}

                  <div className="flex items-center gap-4">

                    {review.photo ? (

                      <img
                        src={review.photo}
                        alt={review.name}
                        className="
                        h-16
                        w-16
                        rounded-full
                        object-cover
                        border-2
                        border-amber-400
                        "
                      />

                    ) : (

                      <FaUserCircle
                        className="
                        text-6xl
                        text-slate-300
                        "
                      />

                    )}



                    <div>

                      <h3
                        className="
                        text-lg
                        font-bold
                        "
                      >
                        {review.name || "Dream Mode Customer"}
                      </h3>

                      <div className="mt-2 flex">

                        {Array.from({
                          length: 5,
                        }).map((_, index) => (

                          <FaStar
                            key={index}
                            className={
                              index < (review.rating || 5)
                                ? "text-amber-500"
                                : "text-gray-300"
                            }
                          />

                        ))}

                      </div>

                    </div>

                  </div>



                  {/* Review */}

                  <p
                    className="
                    mt-6
                    text-[15px]
                    leading-7
                    text-slate-600
                    min-h-[120px]
                    "
                  >
                    {review.review
                      ? `“${review.review}”`
                      : "Excellent quality product. Highly recommended."}
                  </p>



                  {/* Footer */}

                  <div
                    className="
                    mt-6
                    flex
                    items-center
                    justify-between
                    border-t
                    border-slate-100
                    pt-5
                    "
                  >

                    <span
                      className="
                      text-xs
                      text-gray-400
                      "
                    >
                      {formatReviewDate(
                        review.createdAt
                      )}
                    </span>

                    <span
                      className="
                      inline-flex
                      items-center
                      gap-1
                      rounded-full
                      bg-emerald-50
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-emerald-700
                      "
                    >

                      <FaCheckCircle />

                      Verified Purchase

                    </span>

                  </div>

                </div>

              </SwiperSlide>

            ))}

                      </Swiper>

        )}

      </div>

    </section>

  );

}
