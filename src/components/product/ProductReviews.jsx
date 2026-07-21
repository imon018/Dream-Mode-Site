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
} from "../../services/reviewService";

import {
  successToast,
  errorToast,
} from "../ui/Toast";


import { FiUploadCloud } from "react-icons/fi";



export default function ProductReviews({
  productId,
}) {


  const {
    user,
  } = useAuth();



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





  const loadReviews =
  async()=>{

    try{

      const data =
        await getProductReviews(
          productId
        );


      setReviews(data);


    }catch(error){

      console.log(error);

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


    if(!user){

      errorToast(
        "Please login first"
      );

      return;

    }




    if(reviewed){

      errorToast(
        "You already reviewed this product"
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



      await addReview({

        productId,


        userId:
          user.uid,


        userName:
  user.name ||
  "Dream Mode Customer",

photoURL:
  user.photoURL || "",


        userEmail:
          user.email,


        rating,


        comment:
          comment.trim(),


        verifiedBuyer:false,


      });




      successToast(
        "Review submitted successfully"
      );



      setComment("");

      setRating(5);

      setReviewed(true);


      loadReviews();



    }catch(error){


      console.log(error);


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
          ">
            Customer Reviews
          </h2>


          <p className="
            mt-2
            text-gray-500
          ">
            Trusted reviews from our customers
          </p>


        </div>





        <div className="
          bg-gradient-to-r
          from-blue-900
          to-blue-700
          text-white
          rounded-3xl
          px-8
          py-5
          shadow-xl
        ">


          <div className="
            text-3xl
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
        rounded-[32px]
        border
        border-yellow-100
        shadow-xl
        p-6
        md:p-8
      ">


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
            rounded-2xl
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
    gap-2
    w-full
    h-36
    rounded-3xl
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
    className="hidden"
    onChange={(e)=>
      setImages(
        Array.from(e.target.files).slice(0,5)
      )
    }
  />

  <FiUploadCloud
  size={52}
  className="text-yellow-500"
/>

  <h4 className="font-bold text-lg text-blue-900">
    Upload Photos
  </h4>

  <p className="text-sm text-gray-500 text-center">
    JPG • PNG • WEBP <br />
    Maximum 5 Images
  </p>

</label>

{
  images.length > 0 && (

    <div className="flex gap-3 flex-wrap mt-4">

      {
        images.map((image, index) => (

          <img
            key={index}
            src={URL.createObjectURL(image)}
            alt=""
            className="
              w-24
              h-24
              rounded-xl
              object-cover
              border
            "
          />

        ))
      }

    </div>

  )
}



        <button

          onClick={submitReview}

          disabled={
            loading ||
            reviewed
          }

          className="
            mt-5
            px-8
            py-4
            rounded-2xl
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

            reviewed
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


                <div>


                  <h4 className="
                    font-black
                    text-blue-900
                  ">
                    {review.userName}
                  </h4>


                  <p className="
                    text-yellow-500
                    mt-1
                  ">
                    {"⭐".repeat(
                      review.rating
                    )}
                  </p>


                </div>





                {
                  review.verifiedBuyer &&

                  <span className="
                    px-3
                    py-1
                    rounded-full
                    bg-green-100
                    text-green-700
                    text-xs
                    font-bold
                  ">
                    ✓ Verified Buyer
                  </span>

                }


              </div>





              <p className="
                mt-4
                text-gray-600
                leading-7
              ">
                {review.comment}
              </p>



            </div>


          ))
        }


      </div>




    </section>

  );

}
