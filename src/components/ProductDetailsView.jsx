import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEO from "../seo/SEO";

import {
  trackViewContent,
  trackAddToCart,
} from "../utils/facebookPixel";

import {
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiLock,
  FiX,
  FiGift,
  FiShoppingBag
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

  const navigate = useNavigate();


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

		  trackViewContent(data);



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




  // PublicLandingPage.jsx এর মতোই offer % হিসাব করা হচ্ছে,
  // যাতে অফার প্রাইজ দিলে percentage সহ দেখায়

  const discount =

    product.offerPrice > 0 &&
    product.price > 0 &&
    product.offerPrice < product.price

    ?

    Math.round(

      (
        (product.price - product.offerPrice)
        /
        product.price
      )

      * 100

    )

    :

    0;


  // এই প্রোডাক্টে যদি themeColor সেট করা না থাকে (পুরাতন প্রোডাক্ট)
  // তাহলে আগের ডিফল্ট বেগুনী (purple-700) কালারই ব্যবহার হবে,
  // যাতে বিদ্যমান প্রোডাক্টের UI ভেঙে না যায়।
  // themeMode === "gradient" হলে দুইটা কালার মিক্স করে gradient দেখানো হবে।

  const themeColor =
    product.themeColor || "#7e22ce";

  const isGradientTheme =
    product.themeMode === "gradient" &&
    product.themeColorTo;

  const gradientCSS =
    isGradientTheme
      ? `linear-gradient(${product.themeGradientDirection || "to right"}, ${themeColor}, ${product.themeColorTo})`
      : null;

  // ব্যাকগ্রাউন্ড হিসেবে ব্যবহারের জন্য (যেমন CTA ব্যানার, চেকমার্ক বৃত্ত)

  const themeBgStyle =
    isGradientTheme
      ? { backgroundImage: gradientCSS }
      : { backgroundColor: themeColor };

  // টেক্সট কালার হিসেবে ব্যবহারের জন্য (গ্রেডিয়েন্ট হলে gradient text)

  const themeTextStyle =
    isGradientTheme
      ? {
          backgroundImage: gradientCSS,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }
      : { color: themeColor };


  // Buy Now বাটনে ক্লিক করলে প্রোডাক্টটি কার্টে যোগ হয়ে সরাসরি কার্ট পেজে নিয়ে যাবে

  const handleBuyNow = () => {

  addToCart(product);

  trackAddToCart(product);

  navigate("/cart");

};



	const handleAddToCart = () => {

  addToCart(product);

  trackAddToCart(product);

};




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
style={themeBgStyle}
className="
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

	<div className="mx-0 px-5 bg-gray-50">

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
                text-black
              "
            >

              {product.name}

            </h1>



            {
              product.title && (

                <h2
                  style={themeTextStyle}
                  className="
                    text-sm
                    font-bold
                    mt-2
                  "
                >

                  {product.title}

                </h2>

              )
            }



			  

	{/* DESCRIPTION */}



            <div
              className="
                mt-5
				border-t
              "
            >

              <h3
                className="
                  text-2xl
                  font-black
                  text-[#172033]
                  mb-2
                  text-center
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
  style={themeBgStyle}
  className="
    w-4
    h-4
    rounded-full
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
                flex-wrap
                gap-3
				border-t
                p-2
              "
            >


              <div
                className="
                  flex
                  items-center
                  gap-4
                  flex-wrap
                "
              >

                {

                  product.price > 0 &&
                  product.offerPrice > 0 &&
                  product.offerPrice < product.price

                  ?

                  <>

                    <span
                      style={themeTextStyle}
                      className="
                        text-2xl
                        font-black
                      "
                    >
                      ৳{product.offerPrice}
                    </span>


                    <span
                      className="
                        text-base
                        text-gray-400
                        font-medium
                        line-through
                      "
                    >
                      ৳{product.price}
                    </span>


                    {
                      discount > 0 && (

                        <span
                          className="
                            px-4
                            py-2
                            rounded-lg
                            font-bold
                            text-red-600
                            bg-white/40
                            backdrop-blur-md
                            border
                            border-white/60
                            shadow-lg
                          "
                        >
                          {discount}% OFF
                        </span>

                      )
                    }

                  </>


                  :

                  product.price > 0

                  ?

                  <span
                    style={themeTextStyle}
                    className="
                      text-3xl
                      font-black
                    "
                  >
                    ৳{product.price}
                  </span>


                  :

                  null

                }

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
                mt-8
              "
            >

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                "
              >

                <Button
  onClick={handleAddToCart}

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

                <button

                  type="button"

                  onClick={handleBuyNow}

                  style={themeBgStyle}

                  className="
                    h-12
                    rounded-xl
                    border
                    border-amber-500
                    text-white
                    font-bold
                    flex
                    items-center
                    justify-center
                    transition
                    hover:opacity-90
                    gap-2
                  "

                >

                  <FiShoppingBag size={18} />
                  Buy Now

                </button>

              </div>

              <div
                className="
                  flex
                  justify-center
                  mt-3
                "
              >

                <a

                  href={`https://wa.me/${settings.whatsapp?.replace(/\D/g,"")}?text=${encodeURIComponent(
                    `আমি এই প্রোডাক্টটি নিতে চাই।\n${window.location.origin}/product/${product.id}\n\nনামঃ \nমোবাইলঃ \nঠিকানাঃ \nথানাঃ \nজেলাঃ `
                  )}`}

                  target="_blank"

                  rel="noreferrer"

                  className="
                    h-12
                    w-1/2
                    rounded-xl
                    bg-green-600
                    border
                    border-amber-500
                    font-bold
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-white
                    hover:bg-green-700
                    transition
                  "

                >

                  <FaWhatsapp className="text-xl" />
                  <span>WhatsApp Order</span>

                </a>

              </div>

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
            category={product.category}
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
