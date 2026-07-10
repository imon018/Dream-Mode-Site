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





  const firstProducts =
    products.slice(
      0,
      4
    );


  const secondProducts =
    products.slice(
      4,
      8
    );





  const createSlides =
    (items)=>{

      const result = [];

      for(
        let i = 0;
        i < items.length;
        i += 2
      ){

        result.push(
          items.slice(
            i,
            i + 2
          )
        );

      }

      return result;

    };





  const renderSlider =
    (items)=>{

      const slides =
        createSlides(
          items
        );


      return (

        <Swiper

          modules={[
            Pagination
          ]}


          pagination={{
            clickable:true
          }}


          spaceBetween={16}


          onReachEnd={()=>{
            navigate("/shop");
          }}


          className="
            pb-10
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

      );

    };





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
              "

            >

              View All ➡

            </button>


          </div>


        </div>





        {
          loading

          ?

          <div
            className="
              text-center
            "
          >

            Loading...

          </div>


          :

          <>


            {
              renderSlider(
                firstProducts
              )
            }



            {
              renderSlider(
                secondProducts
              )
            }


          </>

        }



      </div>


    </section>

  );

}
