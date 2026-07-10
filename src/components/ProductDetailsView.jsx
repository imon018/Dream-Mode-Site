import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Button from "./ui/Button";
import RelatedProducts from "./RelatedProducts";
import ProductReviews from "./product/ProductReviews";

import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";

import {
  getProductById,
} from "../services/firestoreProductService";


export default function ProductDetailsView() {


  const { id } = useParams();


  const { addToCart } =
    useCart();


  const { addToWishlist } =
    useWishlist();



  const [product,setProduct] =
    useState(null);


  const [loading,setLoading] =
    useState(true);


  const [selectedImage,setSelectedImage] =
    useState("");


  const [zoom,setZoom] =
    useState(false);



  useEffect(()=>{


    const loadProduct =
    async()=>{

      try{

        const data =
          await getProductById(id);


        setProduct(data);



        if(data?.images?.length){

          setSelectedImage(
            data.images[0]
          );

        }else{

          setSelectedImage(
            data.image
          );

        }


      }catch(error){

        console.log(error);

      }
      finally{

        setLoading(false);

      }

    };


    loadProduct();


  },[id]);





  if(loading){

    return (

      <div className="
        min-h-[60vh]
        flex
        items-center
        justify-center
        text-xl
        font-bold
        text-blue-700
      ">
        Loading Premium Product...
      </div>

    );

  }




  if(!product){

    return (

      <div className="
        min-h-[60vh]
        flex
        items-center
        justify-center
        text-2xl
        font-black
        text-red-600
      ">
        Product Not Found
      </div>

    );

  }





  const galleryImages =
    product.images?.length
      ? product.images
      :
      [
        product.image
      ];




  return (

    <div className="
      max-w-7xl
      mx-auto
      px-4
      md:px-6
      py-12
    ">




      <div className="
        grid
        lg:grid-cols-2
        gap-10
      ">





        {/* IMAGE SECTION */}


        <div>


          <div
            onMouseEnter={()=>
              setZoom(true)
            }

            onMouseLeave={()=>
              setZoom(false)
            }

            className="
              relative
              overflow-hidden
              rounded-[36px]
              bg-white
              shadow-xl
              border
              border-yellow-100
            "
          >


            <img

              src={selectedImage}

              alt={product.name}

              className={`
                w-full
                aspect-square
                object-cover
                transition
                duration-500
                ${
                  zoom
                  ?
                  "scale-125"
                  :
                  "scale-100"
                }
              `}

            />



            <div className="
              absolute
              top-5
              left-5
              px-4
              py-2
              rounded-full
              bg-blue-900
              text-yellow-300
              font-bold
              text-sm
            ">
              Premium
            </div>



          </div>






          {
            galleryImages.length > 1 &&

            <div className="
              flex
              gap-4
              mt-5
              flex-wrap
            ">


              {
                galleryImages.map(
                  (img,index)=>(

                    <img

                      key={index}

                      src={img}

                      alt=""

                      onClick={()=>
                        setSelectedImage(img)
                      }

                      className={`
                        w-20
                        h-20
                        rounded-2xl
                        object-cover
                        cursor-pointer
                        border-2
                        transition
                        hover:scale-105

                        ${
                          selectedImage===img
                          ?
                          "border-yellow-500 shadow-lg"
                          :
                          "border-gray-200"
                        }

                      `}

                    />

                  )
                )
              }


            </div>

          }



        </div>








        {/* PRODUCT INFO */}



        <div className="
          lg:sticky
          lg:top-24
          h-fit
        ">



          <span className="
            inline-flex
            px-5
            py-2
            rounded-full
            bg-blue-50
            text-blue-700
            font-bold
          ">
            💎 Premium Collection
          </span>





          <h1 className="
            mt-5
            text-4xl
            md:text-5xl
            font-black
            leading-tight
          ">

            {product.name}

          </h1>





          <div className="
            mt-6
            flex
            items-center
            gap-4
          ">


            <span className="
              text-4xl
              font-black
              text-blue-700
            ">
              ৳ {product.price}
            </span>


            <span className="
              px-3
              py-1
              rounded-full
              bg-yellow-100
              text-yellow-700
              font-bold
            ">
              ⭐ Premium
            </span>


          </div>







          <div className="mt-5">


          {
            product.stock > 0

            ?

            <span className="
              text-green-600
              font-bold
            ">
              ✓ Available Stock ({product.stock})
            </span>


            :

            <span className="
              text-red-600
              font-bold
            ">
              Out Of Stock
            </span>

          }


          </div>







          <p className="
            mt-8
            text-gray-600
            leading-8
          ">
            {product.description}
          </p>








          <div className="
            flex
            flex-wrap
            gap-4
            mt-10
          ">



            <Button

              onClick={()=>
                addToCart(product)
              }

              className="
                bg-gradient-to-r
                from-blue-900
                to-yellow-500
                px-8
              "

            >
              🛒 Add To Cart
            </Button>






            <button

              onClick={()=>
                addToWishlist(product)
              }

              className="
                px-8
                py-3
                rounded-xl
                border
                border-yellow-300
                text-blue-900
                font-bold
                hover:bg-yellow-50
                transition
              "

            >
              ❤️ Wishlist
            </button>






            <a

              href={`https://wa.me/8801406978619?text=I'm interested in ${product.name}`}

              target="_blank"

              rel="noreferrer"

              className="
                px-8
                py-3
                rounded-xl
                bg-green-600
                text-white
                font-bold
                hover:bg-green-700
                transition
              "

            >
              WhatsApp Order
            </a>



          </div>







          <div className="
            mt-10
            space-y-4
          ">


            <div className="
              p-5
              rounded-3xl
              bg-green-50
              border
              border-green-100
            ">
              🚚 Fast & Secure Delivery
            </div>


            <div className="
              p-5
              rounded-3xl
              bg-blue-50
              border
              border-blue-100
            ">
              🔒 Secure Payment System
            </div>



            <div className="
              p-5
              rounded-3xl
              bg-yellow-50
              border
              border-yellow-100
            ">
              💎 Premium Quality Guarantee
            </div>


          </div>






          <div className="
            mt-8
            rounded-[28px]
            border
            overflow-hidden
          ">


            <div className="
              p-5
              bg-blue-900
              text-white
              font-black
              text-lg
            ">
              Delivery Information
            </div>


            <div className="
              p-5
              space-y-4
              text-gray-600
            ">

              <p>
                🚚 Inside Dhaka: 1–2 Days
              </p>

              <p>
                📦 Outside Dhaka: 2–5 Days
              </p>

              <p>
                💵 Cash On Delivery Available
              </p>

              <p>
                🔄 7 Days Easy Return Policy
              </p>

            </div>


          </div>






        </div>



      </div>







      {/* REVIEWS */}


      <ProductReviews
        productId={product.id}
      />





      {/* RELATED PRODUCTS */}


      <RelatedProducts
        currentId={product.id}
      />




    </div>

  );


}
