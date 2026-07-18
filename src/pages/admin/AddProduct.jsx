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
  successToast,
  errorToast,
} from "../../components/ui/Toast";

export default function AddProduct() {

  const [name,setName]=useState("");

  const [description,setDescription]=useState("");

  const [price,setPrice]=useState("");

  const [stock,setStock]=useState("");

  const [heroBanner,setHeroBanner]=useState(false);

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



      await addProductToDB({

        name,

        description,

        price:Number(price),

        stock:Number(stock),

        heroBanner,

        image:uploaded[0].imageUrl,

        images:uploaded.map(

          img=>img.imageUrl

        ),

        publicIds:uploaded.map(

          img=>img.publicId

        ),

        createdAt:new Date()

      });



      successToast(

        "Product added successfully."

      );



      setName("");

      setDescription("");

      setPrice("");

      setStock("");

      setHeroBanner(false);

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
            rounded-xl
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
            rounded-xl
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
            rounded-xl
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
            rounded-xl
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
          rounded-xl
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

        {/* IMAGE UPLOAD */}

      <div>

        <label className="block font-bold text-sm mb-2 text-[#172033]">
          Product Images
        </label>

        <label
          htmlFor="product-images"
          className="
            h-44
            rounded-xl
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
                  rounded-xl
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
          rounded-xl
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
