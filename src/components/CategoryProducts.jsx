import {
  useEffect,
  useState,
} from "react";

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
import { ProductCardSkeletonGrid } from "./ProductCardSkeleton";

import {
  getCategories,
} from "../services/categoryService";


import {
  getProductsByCategory,
} from "../services/firestoreProductService";



export default function CategoryProducts(){


  const [
    categories,
    setCategories,
  ] = useState([]);



  const [
    categoryProducts,
    setCategoryProducts,
  ] = useState({});


  const [
    loading,
    setLoading,
  ] = useState(true);



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


    setLoading(false);


  }



  return (

    <section
      className="
        space-y-12
      "
    >

      {
        loading && (

          <>

            {
              Array.from({ length: 2 }).map(
                (_, index) => (

                  <div
                    key={index}
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

                      <div
                        className="
                          inline-flex
                          w-40
                          h-9
                          rounded-full
                          bg-gray-200
                          animate-pulse
                        "
                      />

                    </div>

                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-4
                        lg:grid-cols-4
                      "
                    >

                      <ProductCardSkeletonGrid
                        count={4}
                        compact={true}
                      />

                    </div>

                  </div>

                )
              )
            }

          </>

        )
      }

      {
        !loading &&
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
