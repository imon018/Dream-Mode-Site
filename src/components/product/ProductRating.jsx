import {
  useEffect,
  useState,
} from "react";

import {
  getProductReviews,
} from "../../services/reviewService";


export default function ProductRating({
  productId
}) {


  const [
    rating,
    setRating
  ] = useState(0);


  const [
    count,
    setCount
  ] = useState(0);



  useEffect(()=>{


    const loadRating =
    async()=>{


      try{


        const reviews =
          await getProductReviews(
            productId
          );



        setCount(
          reviews.length
        );



        if(reviews.length){


          const avg =
            reviews.reduce(
              (sum,item)=>
                sum + item.rating,
              0
            )
            /
            reviews.length;



          setRating(
            avg.toFixed(1)
          );


        }



      }catch(error){

        console.log(error);

      }


    };



    loadRating();



  },[productId]);




  return (

    <div className="
      flex
      items-center
      gap-2
      mt-3
    ">


      <div className="
        flex
        items-center
        gap-1
        px-3
        py-1
        rounded-full
        bg-yellow-50
        border
        border-yellow-200
      ">


        <span>
          ⭐
        </span>


        <span className="
          font-bold
          text-yellow-700
        ">
          {rating || "0.0"}
        </span>


      </div>




      <span className="
        text-sm
        text-gray-500
      ">
        ({count} reviews)
      </span>



    </div>

  );

}
