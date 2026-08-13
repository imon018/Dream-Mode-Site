// src/components/product/ProductReviews.jsx

import {
  useEffect,
  useState,
} from "react";

import useAuth from "../../hooks/useAuth";

import {
  addReview,
  getProductReviews,
  hasUserReviewed,
  formatReviewDate,
} from "../../services/reviewService";

import {
  successToast,
  errorToast,
} from "../ui/Toast";


import { FiUploadCloud } from "react-icons/fi";

import { uploadImages } from "../../services/uploadService";


export default function ProductReviews({
  productId,
}) {


  const {
    user,
  } = useAuth();


  const [
  selectedImage,
  setSelectedImage,
] = useState(null);



  const [
    reviews,
    setReviews,
  ] = useState([]);



  const [
    rating,
    setRating,
  ] = useState(5);



  const [
    comment,
    setComment,
  ] = useState("");


  const [
  images,
  setImages,
] = useState([]);



  const [
    loading,
    setLoading,
  ] = useState(false);



  const [
    reviewed,
    setReviewed,
  ] = useState(false);


  const [
    guestName,
    setGuestName,
  ] = useState("");





  const loadReviews =
  async()=>{

    try{

      const data =
        await getProductReviews(
          productId
        );


      setReviews(data);


    }catch (error) {
    console.error(error);
  }

  };






  const checkReviewed =
  async()=>{


    if(!user){

      return;

    }


    const result =
      await hasUserReviewed(
        productId,
        user.uid
      );


    setReviewed(result);


  };









  useEffect(()=>{

    loadReviews();

    checkReviewed();

  },[
    productId,
    user
  ]);








  const averageRating =
    reviews.length
      ?
      (
        reviews.reduce(
          (sum,item)=>
            sum + item.rating,
          0
        )
        /
        reviews.length
      ).toFixed(1)

      :

      "0.0";







  const submitReview =
  async()=>{


    if(user && reviewed){

      errorToast(
        "You already reviewed this product"
      );

      return;

    }




    if(!user && !guestName.trim()){

      errorToast(
        "Please enter your name"
      );

      return;

    }





    if(!comment.trim()){

      errorToast(
        "Please write your review"
      );

      return;

    }





    try{


      setLoading(true);



      let uploadedImages = [];

if (images.length > 0) {
  uploadedImages = await uploadImages(images);
}



      const reviewData = {

        productId,

        rating,

        comment:
          comment.trim(),

        verifiedBuyer:false,
        images: uploadedImages,

      };


      if(user){

        reviewData.userId = user.uid;
        reviewData.userName = user.name || "Customer";
        reviewData.photoURL = user.photoURL || "";
        reviewData.userEmail = user.email;

      }else{

        // Guest review — intentionally no "userId" key so
        // Firestore rules can tell guest vs registered creates apart.
        reviewData.userName = guestName.trim();
        reviewData.photoURL = "";

      }


      await addReview(reviewData);




      successToast(
        "Review submitted successfully"
      );


			setImages([]);
      
      setComment("");

      setRating(5);

      setGuestName("");

      if(user){

        setReviewed(true);

      }


      loadReviews();



    }catch(error){




      errorToast(
        "Failed to submit review"
      );


    }
    finally{


      setLoading(false);


    }



  };







  return (

    <section className="
      mt-16
    ">



      {/* HEADER */}

      <div className="
        flex
        flex-col
        md:flex-row
        md:justify-between
        md:items-center
        gap-5
        mb-8
      ">


        <div>


          <h2 className="
            text-3xl
            md:text-4xl
            font-black
            bg-gradient-to-r
            from-blue-900
            to-yellow-500
            bg-clip-text
            text-transparent
			text-center
          ">
            Customer Reviews
          </h2>


          <p className="
            mt-2
            text-gray-500
			text-center
		    "
		  >
            Trusted reviews from our customers
          </p>


        </div>





        <div className="
          bg-gradient-to-r
          from-blue-900
          to-blue-700
          text-white
          rounded-lg
          px-3
          py-2
          shadow-xl
        ">


          <div className="
            text-xl
            font-black
          ">
            ⭐ {averageRating}
          </div>


          <div className="
            text-yellow-300
            text-sm
          ">
            {reviews.length} Reviews
          </div>


        </div>


      </div>







      {/* REVIEW FORM */}


      <div className="
        bg-white
        rounded-lg
        border
        border-yellow-100
        shadow-xl
        p-6
        md:p-8
      ">


        {
          !user && (

            <input

              type="text"

              value={guestName}

              onChange={(e)=>
                setGuestName(
                  e.target.value
                )
              }

              placeholder="Your Name"

              className="
                w-full
                rounded-lg
                border
                border-gray-200
                p-3
                mb-5
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "

            />

          )
        }



        <h3 className="
          text-xl
          font-black
          text-blue-900
          mb-5
        ">
          Share Your Experience
        </h3>



        <div className="
          flex
          gap-2
          mb-6
        ">


          {
            [1,2,3,4,5]
            .map((star)=>(

              <button

                key={star}

                onClick={()=>
                  setRating(star)
                }

                className="
                  text-4xl
                  hover:scale-125
                  transition
                "

              >

                {
                  star <= rating
                  ?
                  "⭐"
                  :
                  "☆"
                }

              </button>


            ))
          }


        </div>






        <textarea

          rows="4"

          value={comment}

          onChange={(e)=>
            setComment(
              e.target.value
            )
          }

          placeholder="
          Write your premium experience...
          "

          className="
            w-full
            rounded-lg
            border
            border-gray-200
            p-4
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "

        />



<label
  className="
    mt-5
    flex
    flex-col
    items-center
    justify-center
    gap-1
    w-full
    h-24
    rounded-lg
    border-2
    border-dashed
    border-yellow-300
    bg-yellow-50
    cursor-pointer
    hover:bg-yellow-100
    transition-all
    duration-300
  "
>

  <input
    type="file"
    multiple
    accept="image/*"
    disabled={loading}
    className="hidden"
      onChange={(e)=>{
  const files = Array.from(e.target.files);

  setImages((prev)=>
    [...prev, ...files].slice(0,5)
  );
}}
    
  />

  <FiUploadCloud
  size={30}
  className="text-yellow-500"
/>

<h4 className="font-semibold text-base text-blue-900">
  Upload Photos
</h4>

<p className="text-xs text-gray-500 text-center">
  JPG • PNG • WEBP • Max 5 Images
</p>

</label>

{
  images.length > 0 && (

    <div className="flex flex-wrap gap-3 mt-4">

      {
        images.map((image, index) => (

          <div
            key={index}
            className="relative"
          >

            <img
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
              className="
                w-24
                h-24
                rounded-xl
                object-cover
                border
                border-gray-200
                shadow-sm
              "
            />

            <button
              type="button"
              onClick={() =>
                setImages(
                  images.filter((_, i) => i !== index)
                )
              }
              className="
                absolute
                -top-2
                -right-2
                w-6
                h-6
                rounded-full
                bg-red-500
                text-white
                text-xs
                font-bold
                flex
                items-center
                justify-center
                shadow-md
                hover:bg-red-600
              "
            >
              ✕
            </button>

          </div>

        ))
      }

    </div>

  )
}



        <button

          onClick={submitReview}

          disabled={
            loading ||
            (user && reviewed)
          }

          className="
            mt-5
            px-6
            py-2
            rounded-lg
            font-black
            text-white
            bg-gradient-to-r
            from-blue-900
            to-yellow-500
            hover:scale-105
            transition
            disabled:opacity-50
          "

        >

          {
            loading
            ?
            "Submitting..."

            :

            (user && reviewed)
            ?
            "Already Reviewed ✓"

            :

            "Submit Review ⭐"
          }


        </button>


      </div>










      {/* REVIEW LIST */}



      <div className="
        mt-8
        space-y-5
      ">


        {
          reviews.length === 0

          ?

          <div className="
            bg-blue-50
            rounded-3xl
            p-8
            text-center
          ">

            <div className="
              text-5xl
            ">
              ⭐
            </div>


            <p className="
              mt-3
              font-bold
              text-blue-900
            ">
              No reviews yet
            </p>


          </div>


          :


          reviews.map((review)=>(


            <div

              key={review.id}

              className="
                bg-gradient-to-br
                from-white
                to-blue-50
                rounded-3xl
                border
                border-blue-100
                p-6
                shadow-md
              "

            >


              <div className="
                flex
                justify-between
                items-start
              ">


                {
  review.photoURL ? (

    <img
      src={review.photoURL}
      alt={review.userName}
      className="
        w-12
        h-12
        rounded-full
        object-cover
      "
    />

  ) : (

    <div
      className="
        w-12
        h-12
        rounded-full
        bg-gradient-to-r
        from-blue-900
        to-yellow-500
        text-white
        flex
        items-center
        justify-center
        font-black
        text-sm
      "
    >
      DM
    </div>

  )
}


<div className="flex-1 ml-3">

  <h4 className="
    font-black
    text-blue-900
  ">
    {review.userName}
  </h4>

  <div className="
    flex
    items-center
    gap-2
    mt-1
  ">

    <span className="text-yellow-500">
      {"⭐".repeat(review.rating)}
    </span>

    {
      review.verifiedBuyer && (

        <span className="
          text-xs
          font-semibold
          text-green-600
        ">
          ✓ Verified Purchase
        </span>

      )
    }

  </div>

</div>




              </div>





              <p className="
                mt-4
                text-gray-600
                leading-7
              ">
                {review.comment}
              </p>

              


              {
  review.images?.length > 0 && (

    <div className="
      flex
      flex-wrap
      gap-3
      mt-4
    ">

      {
        review.images.map((img,index)=>(

  <img
    key={index}
    src={img.imageUrl}
    alt=""
    onClick={() =>
      setSelectedImage(img.imageUrl)
    }
    className="
      w-20
      h-20
      rounded-xl
      object-cover
      cursor-pointer
      border
      hover:scale-105
      transition
    "
  />

))
      }

    </div>

  )
}


              <p className="
  mt-4
  text-sm
  text-gray-500
">
  {formatReviewDate(review.createdAt)}
</p>

              



            </div>


          ))
        }


      </div>

{
  selectedImage && (

    <div
      onClick={() =>
        setSelectedImage(null)
      }
      className="
        fixed
        inset-0
        bg-black/80
        z-[9999]
        flex
        items-center
        justify-center
        p-4
      "
    >

      <img
        src={selectedImage}
        alt=""
        onClick={(e)=>
          e.stopPropagation()
        }
        className="
          max-w-full
          max-h-[90vh]
          rounded-2xl
          shadow-2xl
        "
      />

      <button
        onClick={() =>
          setSelectedImage(null)
        }
        className="
          absolute
          top-5
          right-5
          w-10
          h-10
          rounded-full
          bg-white
          text-black
          font-bold
          text-xl
        "
      >
        ✕
      </button>

    </div>

  )
}


    </section>

  );

}
