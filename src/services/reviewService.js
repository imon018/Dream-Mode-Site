import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";



const reviewsCollection =
  collection(
    db,
    "reviews"
  );




// ================================
// ADD REVIEW
// ================================

export async function addReview(reviewData) {


  await addDoc(
    reviewsCollection,
    {

      ...reviewData,

      createdAt:
        serverTimestamp(),

    }
  );


}





// ================================
// GET PRODUCT REVIEWS
// ================================

export async function getProductReviews(
  productId
) {


  const q =
    query(

      reviewsCollection,

      where(
        "productId",
        "==",
        productId
      ),

      orderBy(
        "createdAt",
        "desc"
      )

    );



  const snapshot =
    await getDocs(q);



  return snapshot.docs.map(
    (doc)=>({

      id:doc.id,

      ...doc.data(),

    })
  );


}





// ================================
// CHECK USER ALREADY REVIEWED
// ================================

export async function hasUserReviewed(
  productId,
  userId
) {


  const q =
    query(

      reviewsCollection,


      where(
        "productId",
        "==",
        productId
      ),


      where(
        "userId",
        "==",
        userId
      ),


      limit(1)

    );



  const snapshot =
    await getDocs(q);



  return !snapshot.empty;


}





// ================================
// GET LATEST REVIEWS
// ================================

export async function getLatestReviews() {


  const q =
    query(

      reviewsCollection,

      orderBy(
        "createdAt",
        "desc"
      ),

      limit(10)

    );



  const snapshot =
    await getDocs(q);



  return snapshot.docs.map(
    (doc)=>({

      id:doc.id,

      ...doc.data(),

    })
  );


}






// ================================
// GET REVIEWS WITH USER PROFILE
// ================================

export async function getLatestReviewsWithUser() {


  const reviews =
    await getLatestReviews();



  const updatedReviews =
    await Promise.all(


      reviews.map(
        async(review)=>{


          if(!review.userId){

            return review;

          }




          try{


            const userRef =
              doc(
                db,
                "users",
                review.userId
              );



            const userSnap =
              await getDoc(
                userRef
              );



            if(userSnap.exists()){


              const user =
                userSnap.data();



              return {

                ...review,


                name:
                  user.name ||
                  review.userName ||
                  "Dream Mode Customer",



                photo:
                  user.photoURL ||
                  "",


              };


            }




            return review;



          }catch(error){


            console.log(error);


            return review;


          }


        }

      )

    );



  return updatedReviews;


}







// ================================
// FORMAT REVIEW DATE
// ================================

export function formatReviewDate(
  timestamp
) {


  if(!timestamp){

    return "";

  }



  try{


    const date =
      timestamp.toDate();



    return new Intl.DateTimeFormat(
      "en-BD",
      {

        day:"numeric",

        month:"short",

        year:"numeric",

      }

    ).format(date);



  }catch(error){


    return "";

  }


}
