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
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";


import ProductCard from "./ProductCard";
import { ProductCardSkeletonGrid } from "./ProductCardSkeleton";

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
          data.slice(0,12)
        );


      }
      finally{

        setLoading(false);

      }

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



        {/* HEADER */}

        <div
          className="
            text-center
            mb-5
          "
        >


          <h2
            className="
              inline-flex
              items-center
              justify-center

              px-5
              py-2

              rounded-full

              border
              border-amber-500

              bg-transparent

              text-amber-500

              font-black

              text-lg
              md:text-2xl

              shadow-[0_0_20px_rgba(245,158,11,.35)]

              backdrop-blur-md
            "
          >

            ✨ Featured Products

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

          (

            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-4
                gap-4
                md:gap-6
              "
            >

              <ProductCardSkeletonGrid
                count={4}
                compact={true}
              />

            </div>

          )


          :

          (

          <Swiper

  modules={[
    Pagination,
    Autoplay
  ]}

  pagination={{
    clickable:true
  }}

  spaceBetween={16}

  slidesPerGroup={1}

  autoplay={{
    delay:2000,
    disableOnInteraction:false,
    pauseOnMouseEnter:true
  }}

  loop={
    products.length > 6
  }

  speed={600}

  breakpoints={{

    0:{
      slidesPerView:2
    },

    640:{
      slidesPerView:3
    },

    1024:{
      slidesPerView:6
    }

  }}

  onTouchEnd={(swiper)=>{
    if(
      swiper.realIndex === products.length - 1 &&
      swiper.touches.diff < -50
    ){
      navigate("/shop");
    }
  }}

  className="
    pb-12
  "

>



            {
              products.map(
                product=>(

                <SwiperSlide
                  key={
                    product.id
                  }
                >


                  <ProductCard

                    product={
                      product
                    }

                    compact={
                      true
                    }

                  />


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
