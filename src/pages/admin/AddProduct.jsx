import { useState } from "react";

import Button from "../../components/ui/Button";

import {
  FiImage,
  FiTrash2,
} from "react-icons/fi";

import {
  addProductToDB,
} from "../../services/firestoreProductService";

import {
  uploadImages,
} from "../../services/uploadService";

import {
  addBanner,
  canAddBanner,
} from "../../services/firestoreBannerService";

import {
  useSettings,
} from "../../context/SettingsContext";

import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";

export default function AddProduct() {

  const { settings } = useSettings();

  const [name,setName]=useState("");

  const [productTitle,setProductTitle]=useState("");

  const [description,setDescription]=useState("");

  const [price,setPrice]=useState("");

  const [offerPrice,setOfferPrice]=useState("");

  const [stock,setStock]=useState("");

  const [heroBanner,setHeroBanner]=useState(false);

  const [themeColor,setThemeColor]=useState("#7e22ce");

  const [useGradient,setUseGradient]=useState(false);

  const [themeColorTo,setThemeColorTo]=useState("#f59e0b");

  const [gradientDirection,setGradientDirection]=useState("to right");

  const [images,setImages]=useState([]);

  const [previewImages,setPreviewImages]=useState([]);

  const [loading,setLoading]=useState(false);





  const handleImageChange=(e)=>{

    const files=Array.from(e.target.files);

    setImages((prev)=>[

      ...prev,

      ...files

    ]);



    const previews=files.map((file)=>({

      file,

      url:URL.createObjectURL(file)

    }));



    setPreviewImages((prev)=>[

      ...prev,

      ...previews

    ]);



    e.target.value="";

  };







  const removeImage=(index)=>{

    URL.revokeObjectURL(

      previewImages[index].url

    );



    setImages(

      images.filter((_,i)=>i!==index)

    );



    setPreviewImages(

      previewImages.filter((_,i)=>i!==index)

    );

  };







  const handleSubmit=async(e)=>{

    e.preventDefault();



    if(

      !name ||

      !description ||

      !price ||

      !stock ||

      images.length===0

    ){

      errorToast(

        "Please fill all fields."

      );

      return;

    }



    try{

      setLoading(true);



      const uploaded=

      await uploadImages(images);



      const productId = await addProductToDB({

        name,

        title: productTitle,

        description,

        price:Number(price),

        offerPrice:
          offerPrice
            ? Number(offerPrice)
            : 0,

        stock:Number(stock),

        heroBanner,

        themeColor,

        themeMode: useGradient ? "gradient" : "solid",

        themeColorTo: useGradient ? themeColorTo : "",

        themeGradientDirection: gradientDirection,

        image:uploaded[0].imageUrl,

        images:uploaded.map(

          img=>img.imageUrl

        ),

        publicIds:uploaded.map(

          img=>img.publicId

        ),

        createdAt:new Date()

      });



      // =========================
      // HERO BANNER: যদি toggle অন থাকে তাহলে
      // heroBanners কালেকশনে ব্যানার তৈরি করে দেওয়া হচ্ছে,
      // যাতে এটা হোমপেজ হিরো ব্যানার স্লাইডারে দেখায়।
      // এতদিন এই toggle শুধু product.heroBanner ফিল্ড সেভ করত,
      // কিন্তু heroBanners কালেকশনে কিছু তৈরি করত না — তাই
      // toggle অন করলেও ব্যানারে কিছু যোগ হতো না।
      // =========================

      if(heroBanner){

        try{

          const allowed =
            await canAddBanner();

          if(allowed){

            await addBanner({

              title: name,

              subtitle:
                productTitle || name,

              image: uploaded[0].imageUrl,

              productId,

              productName: name,

              whatsappNumber:
                settings?.whatsapp || "",

              offerPrice:
                offerPrice
                  ? Number(offerPrice)
                  : 0,

              regularPrice:
                Number(price),

              badgeText:
                "New Collection",

            });

          }
          else{

            errorToast(
              "Product saved, but Hero Banner limit (5) reached. Banner not added."
            );

          }

        }
        catch(bannerError){

          console.log(bannerError);

          errorToast(
            "Product saved, but adding to Hero Banner failed."
          );

        }

      }



      successToast(

        "Product added successfully."

      );



      setName("");

      setProductTitle("");

      setDescription("");

      setPrice("");

      setOfferPrice("");

      setStock("");

      setHeroBanner(false);

      setThemeColor("#7e22ce");

      setUseGradient(false);

      setThemeColorTo("#f59e0b");

      setGradientDirection("to right");

      setImages([]);

      setPreviewImages([]);

      setLoading(false);

    }

    catch(error){

      console.log(error);

      setLoading(false);

      errorToast(

        "Failed to add product."

      );

    }

  };





  return(

<div className="
min-h-screen
bg-[#FAF7F2]
p-4
md:p-8
">

<div className="
max-w-3xl
mx-auto
">

<div
className="
mb-5
text-center
"
>

<h1
className="
text-2xl
font-black
text-[#172033]
"
>
Add Product
</h1>


<p
className="
text-sm
text-gray-500
mt-1
"
>
Create a new product
</p>


</div>

<form

onSubmit={handleSubmit}

className="
bg-white
rounded-lg
p-5
md:p-6
shadow-sm
border
border-gray-100
space-y-4
"
>

        {/* PRODUCT NAME */}

      <div>

        <label className="block font-bold text-sm mb-2 text-[#172033]">
          Product Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          placeholder="Product Name"
          className="
            w-full
            h-12
            rounded-lg
            border
            border-gray-200
            px-4
            outline-none
            focus:border-amber-400
          "
        />

      </div>




      {/* PRODUCT TITLE */}

      <div>

        <label className="block font-bold text-sm mb-2 text-[#172033]">
          Product Title
        </label>

        <input
          type="text"
          value={productTitle}
          onChange={(e)=>setProductTitle(e.target.value)}
          placeholder="Short title shown below product name"
          className="
            w-full
            h-12
            rounded-lg
            border
            border-gray-200
            px-4
            outline-none
            focus:border-amber-400
          "
        />

      </div>





      {/* DESCRIPTION */}

      <div>

        <label className="block font-bold text-sm mb-2 text-[#172033]">
          Product Description
        </label>

        <textarea
          rows={5}
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          placeholder="Write product description..."
          className="
            w-full
            rounded-lg
            border
            border-gray-200
            p-4
            outline-none
            resize-none
            focus:border-amber-400
          "
        />

      </div>




      {/* PRICE */}

      <div>

        <label className="block font-bold text-sm mb-2 text-[#172033]">
          Product Price
        </label>

        <input
          type="number"
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
          placeholder="Price"
          className="
            w-full
            h-12
            rounded-lg
            border
            border-gray-200
            px-4
            outline-none
            focus:border-amber-400
          "
        />

      </div>




      {/* OFFER PRICE */}

      <div>

        <label className="block font-bold text-sm mb-2 text-[#172033]">
          Offer Price
        </label>

        <input
          type="number"
          value={offerPrice}
          onChange={(e)=>setOfferPrice(e.target.value)}
          placeholder="Leave empty if no offer"
          className="
            w-full
            h-12
            rounded-lg
            border
            border-gray-200
            px-4
            outline-none
            focus:border-amber-400
          "
        />

      </div>





      {/* STOCK */}

      <div>

        <label className="block font-bold text-sm mb-2 text-[#172033]">
          Stock Quantity
        </label>

        <input
          type="number"
          value={stock}
          onChange={(e)=>setStock(e.target.value)}
          placeholder="Available Stock"
          className="
            w-full
            h-12
            rounded-lg
            border
            border-gray-200
            px-4
            outline-none
            focus:border-amber-400
          "
        />

      </div>




      {/* HERO BANNER */}

      <div
        className="
          bg-[#FFF9ED]
          border
          border-[#FDECC8]
          rounded-lg
          p-4
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h3 className="font-bold text-sm text-[#172033]">
            Hero Banner Product
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            Use this product as homepage hero banner
          </p>

        </div>

        <label className="cursor-pointer">

          <input
            type="checkbox"
            className="hidden"
            checked={heroBanner}
            onChange={(e)=>setHeroBanner(e.target.checked)}
          />

          <div
            className={`
              w-12
              h-6
              rounded-full
              transition
              ${
                heroBanner
                  ? "bg-amber-500"
                  : "bg-gray-300"
              }
            `}
          >

            <div
              className={`
                w-5
                h-5
                bg-white
                rounded-full
                mt-[2px]
                shadow
                transition
                ${
                  heroBanner
                    ? "translate-x-6"
                    : "translate-x-1"
                }
              `}
            />

          </div>

        </label>

      </div>

        {/* THEME COLOR */}

      <div
        className="
          bg-[#FFF9ED]
          border
          border-[#FDECC8]
          rounded-lg
          p-4
        "
      >

        <h3 className="font-bold text-sm text-[#172033]">
          Product Theme Color
        </h3>

        <p className="text-xs text-gray-500 mt-1 mb-3">
          Product Details পেজে দাম, টাইটেল ও accent element এর কালার হিসেবে এটা ব্যবহার হবে। ইচ্ছেমতো যেকোনো কালার দিন, অথবা দুইটা কালার মিক্স (গ্রেডিয়েন্ট) করুন।
        </p>

        {/* LIVE PREVIEW */}

        <div
          style={
            useGradient
              ? {
                  backgroundImage:
                    `linear-gradient(${gradientDirection}, ${themeColor}, ${themeColorTo})`,
                }
              : { backgroundColor: themeColor }
          }
          className="
            h-12
            rounded-lg
            mb-4
            flex
            items-center
            justify-center
            text-white
            text-xs
            font-bold
          "
        >
          Preview
        </div>

        {/* COLOR 1 */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <input
            type="color"
            value={themeColor}
            onChange={(e)=>setThemeColor(e.target.value)}
            className="
              w-12
              h-12
              rounded-lg
              border
              border-gray-200
              cursor-pointer
              bg-white
              p-1
              shrink-0
            "
          />

          <input
            type="text"
            value={themeColor}
            onChange={(e)=>setThemeColor(e.target.value)}
            placeholder="#7e22ce (যেকোনো hex কোড)"
            className="
              flex-1
              h-12
              rounded-lg
              border
              border-gray-200
              px-4
              outline-none
              focus:border-amber-400
              font-mono
              text-sm
            "
          />

        </div>

        {/* GRADIENT / MIX TOGGLE */}

        <label
          className="
            flex
            items-center
            justify-between
            mt-4
            cursor-pointer
          "
        >

          <span className="text-sm font-bold text-[#172033]">
            দুইটা কালার মিক্স করুন (Gradient)
          </span>

          <input
            type="checkbox"
            className="hidden"
            checked={useGradient}
            onChange={(e)=>setUseGradient(e.target.checked)}
          />

          <div
            className={`
              w-12
              h-6
              rounded-full
              transition
              ${
                useGradient
                  ? "bg-amber-500"
                  : "bg-gray-300"
              }
            `}
          >

            <div
              className={`
                w-5
                h-5
                bg-white
                rounded-full
                mt-[2px]
                shadow
                transition
                ${
                  useGradient
                    ? "translate-x-6"
                    : "translate-x-1"
                }
              `}
            />

          </div>

        </label>

        {/* COLOR 2 + DIRECTION (শুধু Gradient অন থাকলে দেখাবে) */}

        {
          useGradient && (

            <div className="mt-4 space-y-3">

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <input
                  type="color"
                  value={themeColorTo}
                  onChange={(e)=>setThemeColorTo(e.target.value)}
                  className="
                    w-12
                    h-12
                    rounded-lg
                    border
                    border-gray-200
                    cursor-pointer
                    bg-white
                    p-1
                    shrink-0
                  "
                />

                <input
                  type="text"
                  value={themeColorTo}
                  onChange={(e)=>setThemeColorTo(e.target.value)}
                  placeholder="#f59e0b (দ্বিতীয় কালার)"
                  className="
                    flex-1
                    h-12
                    rounded-lg
                    border
                    border-gray-200
                    px-4
                    outline-none
                    focus:border-amber-400
                    font-mono
                    text-sm
                  "
                />

              </div>

              <select
                value={gradientDirection}
                onChange={(e)=>setGradientDirection(e.target.value)}
                className="
                  w-full
                  h-12
                  rounded-lg
                  border
                  border-gray-200
                  px-4
                  outline-none
                  focus:border-amber-400
                  text-sm
                  bg-white
                "
              >

                <option value="to right">বামে → ডানে</option>
                <option value="to left">ডানে → বামে</option>
                <option value="to bottom">উপরে → নিচে</option>
                <option value="to top">নিচে → উপরে</option>
                <option value="to bottom right">তির্যক (↘)</option>
                <option value="to bottom left">তির্যক (↙)</option>

              </select>

            </div>

          )
        }

        {/* QUICK PICKS (ঐচ্ছিক শর্টকাট, চাইলে উপরের ফিল্ডে ইচ্ছেমতো যেকোনো কালারও বসাতে পারবেন) */}

        <p className="text-xs text-gray-500 mt-4 mb-2">
          দ্রুত বেছে নিতে (ঐচ্ছিক):
        </p>

        <div
          className="
            flex
            items-center
            gap-2
            flex-wrap
          "
        >

          {[
            "#7e22ce",
            "#f59e0b",
            "#111827",
            "#1d4ed8",
            "#e11d48",
            "#059669",
            "#db2777",
            "#0891b2",
            "#ea580c",
            "#4338ca",
          ].map((color)=>(

            <button
              key={color}
              type="button"
              onClick={()=>setThemeColor(color)}
              style={{ backgroundColor: color }}
              className={`
                w-8
                h-8
                rounded-full
                border-2
                transition
                ${
                  themeColor.toLowerCase()===color
                    ? "border-[#172033] scale-110"
                    : "border-white"
                }
              `}
            />

          ))}

        </div>

      </div>

        {/* IMAGE UPLOAD */}

      <div>

        <label className="block font-bold text-sm mb-2 text-[#172033]">
          Product Images
        </label>

        <label
          htmlFor="product-images"
          className="
            h-30
            rounded-lg
            border-2
            border-dashed
            border-gray-300
            bg-[#FAF7F2]
            flex
            flex-col
            items-center
            justify-center
            cursor-pointer
            hover:border-amber-400
            transition
          "
        >

          <FiImage className="text-5xl text-amber-500 mb-3" />

          <p className="font-bold">
            Click to Upload Images
          </p>

          <p className="text-xs text-gray-400 mt-1">
            JPG • PNG • WEBP (Multiple)
          </p>

        </label>

        <input
          id="product-images"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

      </div>



      {/* IMAGE PREVIEW */}

      {previewImages.length > 0 && (

        <div>

          <label className="block font-bold text-sm mb-3 text-[#172033]">
            Image Preview
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

            {previewImages.map((image,index)=>(

              <div
                key={index}
                className="
                  relative
                  rounded-lg
                  overflow-hidden
                  border
                  border-gray-200
                  bg-white
                "
              >

                <img
                  src={image.url}
                  alt=""
                  className="
                    w-full
                    h-36
                    object-cover
                  "
                />

                <button
                  type="button"
                  onClick={()=>removeImage(index)}
                  className="
                    absolute
                    top-2
                    right-2
                    w-8
                    h-8
                    rounded-full
                    bg-red-500
                    text-white
                    flex
                    items-center
                    justify-center
                    hover:bg-red-600
                    transition
                  "
                >

                  <FiTrash2 size={16}/>

                </button>

              </div>

            ))}

          </div>

        </div>

      )}



      {/* SAVE BUTTON */}

      <Button
        type="submit"
        disabled={loading}
        className="
          w-full
          h-12
          rounded-lg
          bg-gradient-to-r
          from-amber-400
          to-amber-500
          text-white
          font-black
        "
      >

        {loading
          ? "Uploading..."
          : "Save Product"}

      </Button>

    </form>

  </div>

</div>

);

}
