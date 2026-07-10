import {
  useEffect,
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
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";


import ProductCard from "./ProductCard";

import {
  getLatestProducts,
} from "../services/firestoreProductService";



export default function FeaturedProducts() {


  const navigate =
    useNavigate();



  const [
    products,
    setProducts,
  ] = useState([]);



  const [
    loading,
    setLoading,
  ] = useState(true);





  useEffect(()=>{

    loadProducts();

  },[]);





  const loadProducts =
    async()=>{

      try{

        const data =
          await getLatestProducts();


        setProducts(
          data.slice(0,8)
        );


      }
      finally{

        setLoading(false);

      }

    };





  // make 2 slides
  const slides = [];

  for(
    let i = 0;
    i < products.length;
    i += 4
  ){

    slides.push(
      products.slice(
        i,
        i + 4
      )
    );

  }






  return (

    <section
      className="
        section
      "
    >


      <div
        className="
          container-box
        "
      >



        {/* HEADER */}

        <div
          className="
            text-center
            mb-5
          "
        >


          <h2
            className="
              section-title
            "
          >

            Featured Products

          </h2>



          <p
            className="
              section-subtitle
            "
          >

            Discover our best selling products

          </p>



          {/* VIEW ALL */}

          <div
            className="
              flex
              justify-end
              mt-3
            "
          >

            <button

              onClick={()=>
                navigate("/shop")
              }


              className="
                text-amber-500
                font-bold
                text-sm
                flex
                items-center
                gap-1
                hover:scale-105
                transition
              "

            >

              View All ➡


            </button>


          </div>


        </div>








        {
          loading

          ?

          (

            <div
              className="
                text-center
              "
            >

              Loading...

            </div>

          )


          :


          (

          <Swiper

            modules={[
              Pagination
            ]}


            pagination={{
              clickable:true
            }}


            spaceBetween={20}


            onSlideChange={(swiper)=>{


              if(
                swiper.activeIndex === slides.length
              ){

                navigate("/shop");

              }


            }}


            className="
              pb-12
            "

          >



            {
              slides.map(
                (
                  slide,
                  index
                )=>(


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
                      slide.map(
                        product=>(

                          <ProductCard

                            key={
                              product.id
                            }

                            product={
                              product
                            }

                            compact={
                              true
                            }

                          />

                        )

                      )
                    }


                  </div>



                </SwiperSlide>


                )

              )
            }





          </Swiper>

          )

        }



      </div>


    </section>

  );


}
