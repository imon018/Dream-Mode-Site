import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Pagination,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";


import ProductCard from "./ProductCard";

import {
  getCategories,
} from "../services/categoryService";


import {
  getProductsByCategory,
} from "../services/firestoreProductService";



export default function CategoryProducts(){


  const navigate = useNavigate();


  const [
    categories,
    setCategories,
  ] = useState([]);



  const [
    categoryProducts,
    setCategoryProducts,
  ] = useState({});


  // tracks whether the current slide change came from
  // a real user swipe/drag, per category
  const manualSlideRef = useRef({});



  useEffect(()=>{

    loadCategories();

  },[]);





  async function loadCategories(){


    const data =
      await getCategories();


    setCategories(data);



    const productsData = {};



    for(
      const category of data
    ){

      const products =
        await getProductsByCategory(
          category.name
        );


      productsData[
        category.name
      ] = products;


    }



    setCategoryProducts(
      productsData
    );


  }



  return (

    <section
      className="
        space-y-12
      "
    >

      {
        categories.map(
          (category)=>{


          const totalSlides =
            Math.ceil(
              (
                categoryProducts[
                  category.name
                ] || []
              ).length / 4
            );


          return (


          <div
            key={category.id}
            className="
              container-box
            "
          >


            <div
              className="
                text-center
                mb-5
              "
            >

              <h2
                className="
                  inline-flex
                  px-5
                  py-2
                  rounded-full
                  border
                  border-amber-500
                  text-amber-500
                  font-black
                  text-lg
                  md:text-2xl
                "
              >

                ✨ {category.name}

              </h2>


            </div>




            <Swiper

              modules={[
                Pagination,
                Autoplay,
              ]}

              pagination={{
                clickable:true
              }}

              loop={totalSlides > 1}

              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}

              spaceBetween={20}

              slidesPerView={1}

              className="pb-12"

              onTouchStart={()=>{

                manualSlideRef.current[
                  category.name
                ] = true;

              }}

              onSliderMove={()=>{

                manualSlideRef.current[
                  category.name
                ] = true;

              }}

              onSlideChange={(swiper)=>{

                const wasManual =
                  manualSlideRef.current[
                    category.name
                  ];


                // reset immediately so autoplay-driven
                // changes are never treated as manual
                manualSlideRef.current[
                  category.name
                ] = false;


                if(
                  !wasManual ||
                  totalSlides <= 1
                ){

                  return;

                }


                if(
                  swiper.realIndex ===
                  totalSlides - 1
                ){

                  navigate(
                    `/shop?category=${encodeURIComponent(
                      category.name
                    )}`
                  );

                }

              }}

            >


              {
                Array.from(
                  {
                    length: totalSlides
                  }
                ).map(
                  (_,index)=>{


                  const products =
                  (
                    categoryProducts[
                      category.name
                    ] || []
                  )
                  .slice(
                    index * 4,
                    index * 4 + 4
                  );



                  return (

                    <SwiperSlide
                      key={index}
                    >

                      <div
                        className="
                          grid
                          grid-cols-2
                          gap-4
                          lg:grid-cols-4
                        "
                      >

                        {
                          products.map(
                            (product)=>(

                              <ProductCard

                                key={
                                  product.id
                                }

                                product={
                                  product
                                }

                                compact={true}

                              />

                            )
                          )
                        }


                      </div>


                    </SwiperSlide>

                  );


                  }

                )
              }


            </Swiper>



          </div>


          );

          }

        )
      }


    </section>

  );


}
