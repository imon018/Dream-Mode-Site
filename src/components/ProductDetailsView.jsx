import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SEO from "../seo/SEO";

import {
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiLock,
  FiX,
  FiGift
} from "react-icons/fi";

import { FaWhatsapp } from "react-icons/fa6";

import Button from "./ui/Button";
import RelatedProducts from "./RelatedProducts";
import ProductReviews from "./product/ProductReviews";

import { useSettings } from "../context/SettingsContext";

import useCart from "../hooks/useCart";

import {
  getProductById,
} from "../services/firestoreProductService";


export default function ProductDetailsView() {


  const { id } = useParams();


  const {
    addToCart,
  } = useCart();



  const {
    settings
  } = useSettings();



  const [product,setProduct] =
    useState(null);


  const [loading,setLoading] =
    useState(true);


  const [selectedImage,setSelectedImage] =
    useState("");

  const [fullscreen, setFullscreen] = useState(false);


	const galleryImages =
  product?.images?.length
    ? product.images
    : product?.image
      ? [product.image]
      : [];
	

	useEffect(() => {

  if (galleryImages.length <= 1) return;

  const interval = setInterval(() => {

    setSelectedImage((prev) => {

      const currentIndex =
        galleryImages.indexOf(prev);

      const nextIndex =
        (currentIndex + 1) %
        galleryImages.length;

      return galleryImages[nextIndex];

    });

  }, 3000);

  return () => clearInterval(interval);

}, [galleryImages]);




  useEffect(()=>{


    const loadProduct = async()=>{


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

      <div
        className="
          min-h-screen
          bg-[#FAF7F2]
          flex
          items-center
          justify-center
        "
      >

        <div
          className="
            text-[#172033]
            font-bold
          "
        >
          Loading Product...
        </div>

      </div>

    );

  }


	


  if(!product){

    return (

      <div
        className="
          min-h-screen
          bg-[#FAF7F2]
          flex
          items-center
          justify-center
        "
      >

        <h2
          className="
            text-2xl
            font-black
            text-red-600
          "
        >
          Product Not Found
        </h2>

      </div>

    );

  }






  return (
  <>

    <SEO
  title={product.name}
  description={
    product.description ||
    `${product.name} available at ${settings.storeName}.`
  }
  image={
    product.images?.[0] ||
    product.image
  }
  url={`/product/${product.id}`}
  type="product"
  product={product}
/>

    <div
      className="
        min-h-screen
        bg-[#FAF7F2]
        py-8
      "
    >


      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          md:px-6
        "
      >



        



			<div
className="
bg-purple-700
text-white
h-10
px-3
flex
items-center
justify-center
gap-2
text-xs
font-semibold
whitespace-nowrap
"
>

<FiGift className="text-base shrink-0"/>

<span>
আজই অর্ডার করুন, ক্যাশ অন ডেলিভারি!
</span>

</div>


		  <div
          className="
            grid
            lg:grid-cols-2
            gap-8
          "
        >




          {/* IMAGE SECTION */}

<div>

  <div className="relative">

    <img
      src={selectedImage}
      alt={product.name}
      onClick={() => setFullscreen(true)}
      className="
        w-full
        h-auto
        object-contain
        cursor-pointer
      	transition
				duration-300
      "
    />

  </div>

	<div className="mx-5 bg-gray-50">

  {
    galleryImages.length > 1 && (

      <div
        className="
          flex
          gap-3
          mt-4
          overflow-x-auto
          pb-1
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >

        {
          galleryImages.map((img,index)=>(

            <img
              key={index}
              src={img}
              alt=""
              onClick={()=>setSelectedImage(img)}
              className={`
                w-14
                h-20
                object-cover
                rounded-md
                cursor-pointer
                border

                ${
                  selectedImage===img
                  ? "border-amber-500"
                  : "border-gray-200"
                }
              `}
            />

          ))
        }

      </div>

    )
  }





<div className="mt-4">


                    {/* PRODUCT INFO */}


          <div>


            <div
              className="
                inline-flex
                px-2
                py-1
                rounded-xl
                bg-black
                text-amber-400
                text-xs
                font-bold
              "
            >
              ✨ New Collection
            </div>





            <h1
              className="
                mt-3
                text-3xl
                md:text-5xl
                font-black
                leading-tight
                text-purple-700
              "
            >

              {product.name}

            </h1>



			  

	{/* DESCRIPTION */}



            <div
              className="
                mt-5
				border-t
              "
            >

              <h3
                className="
                  text-xl
                  font-black
                  text-[#172033]
                  mb-2
                "
              >
                পণ্যের বিবরণ
              </h3>



              <div className="space-y-3 mt-2">

  {(product.description || "")
    .split("\n")
    .filter(line => line.trim() !== "")
    .map((line, index) => (

      <div
        key={index}
        className="
          flex
          items-start
          gap-2
        "
      >

        <div
  className="
    w-4
    h-4
    rounded-full
    bg-purple-700
    text-white
    flex
    items-center
    justify-center
    text-xs
    font-bold
    shrink-0
    mt-1
  "
>
  ✓
</div>

        <p
          className="
            text-gray-600
            leading-7
            text-sm
            md:text-base
          "
        >
          {line}
        </p>

      </div>

    ))}

</div>


            </div>






            <div
              className="
                mt-3
                flex
                items-center
                justify-between
                rounded-xl
				border-t
                p-2
              "
            >


              <div>


                <p
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  Price
                </p>



                <h2
                  className="
                    text-3xl
                    font-black
                    text-purple-700
                  "
                >
                  ৳ {product.price}
                </h2>


              </div>





              <div>

                {
                  product.stock > 0

                  ?

                  <span
                    className="
                      px-3
                      py-2
                      rounded-xl
                      bg-green-50
                      text-green-600
                      text-xs
                      font-bold
                    "
                  >
                    ✓ Stock {product.stock}
                  </span>


                  :

                  <span
                    className="
                      px-3
                      py-2
                      rounded-xl
                      bg-red-50
                      text-red-600
                      text-xs
                      font-bold
                    "
                  >
                    Out Of Stock
                  </span>

                }


              </div>



            </div>


			  </div>

	</div>


</div>





            {/* ACTION BUTTONS */}



            <div
              className="
                grid
                grid-cols-2
                gap-3
                mt-8
              "
            >




              <Button

                onClick={()=>
                  addToCart(product)
                }

                className="
                  h-12
                  rounded-xl
                  bg-black
                  border
                  border-amber-500
                  text-white
                  font-bold
                  hover:bg-amber-500
                  hover:text-black
                  transition
                "

              >

                🛒 Add To Cart


              </Button>








              <a

                href={`https://wa.me/${settings.whatsapp?.replace(/\D/g,"")}?text=I'm interested in ${product.name}`}

                target="_blank"

                rel="noreferrer"

                className="
                  h-12
                  rounded-xl
                  bg-green-600
                  font-bold
                  flex
                  items-center
                  justify-center
                  hover:bg-green-700
                  transition
                "

              >

                <FaWhatsapp className="text-xl" />
<span>WhatsApp Order</span>


              </a>




            </div>

			  

	

		
	









           {/* PREMIUM FEATURES */}


<div
  className="
    mt-8
    bg-white
    rounded-xl
    border
    border-amber-200
    px-5
    py-4
  "
>


<div
  className="
    grid
    grid-cols-4
    gap-2
    text-center
  "
>


{/* Premium */}

<div>

<div
className="
text-3xl
text-amber-500
mb-2
flex
justify-center
"
>
<FiShield />
</div>


<h4
className="
text-sm
font-black
text-[#172033]
"
>
Premium
</h4>


<p
className="
text-xs
text-gray-500
"
>
Quality
</p>


</div>





{/* Delivery */}

<div>

<div
className="
text-3xl
text-amber-500
mb-2
flex
justify-center
"
>
<FiTruck />
</div>


<h4
className="
text-sm
font-black
text-[#172033]
"
>
Fast
</h4>


<p
className="
text-xs
text-gray-500
"
>
Delivery
</p>


</div>






{/* Return */}

<div>

<div
className="
text-3xl
text-amber-500
mb-2
flex
justify-center
"
>
<FiRefreshCw />
</div>


<h4
className="
text-sm
font-black
text-[#172033]
"
>
Easy
</h4>


<p
className="
text-xs
text-gray-500
"
>
Return
</p>


</div>






{/* Secure */}

<div>

<div
className="
text-3xl
text-amber-500
mb-2
flex
justify-center
"
>
<FiLock />
</div>


<h4
className="
text-sm
font-black
text-[#172033]
"
>
Secure
</h4>


<p
className="
text-xs
text-gray-500
"
>
Order
</p>


</div>



</div>


</div>
            



          </div>



        </div>

                {/* REVIEWS */}


        <div
          className="
            mt-8
          "
        >

          <ProductReviews
            productId={product.id}
          />

        </div>







        {/* RELATED PRODUCTS */}



        <div
          className="
            mt-12
          "
        >


          <h2
  className="
    text-2xl
    font-black
    text-[#172033]
    text-center
    mb-5
  "
>
  Related Products
</h2>



          <RelatedProducts
            currentId={product.id}
          />


        </div>





      </div>


    </div>


    

    {
fullscreen && (

<div
className="
fixed
inset-0
bg-black/90
z-50
flex
items-center
justify-center
p-5
"
>

<button

onClick={()=>setFullscreen(false)}

className="
absolute
top-5
right-5
bg-white
text-black
rounded-full
w-12
h-12
flex
items-center
justify-center
text-xl
"
>

<FiX/>

</button>

<img

src={selectedImage}

alt={product.name}

className="
max-h-full
max-w-full
rounded-lg
object-contain
"

/>

</div>

)
}


  
  </>

  );


}
