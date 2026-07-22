import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

import {
  getUserProfile,
} from "./userService";


const reviewsCollection =
  collection(
    db,
    "reviews"
  );




// ADD REVIEW

export async function addReview(reviewData){

  await addDoc(
    reviewsCollection,
    {

      ...reviewData,

      createdAt:
        serverTimestamp(),

    }
  );

}





// GET PRODUCT REVIEWS

export async function getProductReviews(
  productId
){

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



  return snapshot.docs.map(doc=>({

    id:doc.id,

    ...doc.data()

  }));

}





// CHECK REVIEW

export async function hasUserReviewed(
  productId,
  userId
){

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






// HOMEPAGE REVIEWS
// Mobile 10
// Desktop 18


export async function getLatestReviews(
  count = 18
){

  const q =
    query(

      reviewsCollection,

      orderBy(
        "createdAt",
        "desc"
      ),

      limit(count)

    );


  const snapshot =
    await getDocs(q);



  const reviews =
    await Promise.all(

      snapshot.docs.map(
        async(doc)=>{


          const data =
            doc.data();



          let name =
            data.userName ||
            "Customer";


          let photo =
            data.photoURL ||
            "";



          // Sync profile data

          if (data.userId) {
  try {
    const profile = await getUserProfile(data.userId);

    if (profile) {
      name = profile.name || name;
      photo = profile.photoURL || photo;
    }
  } catch (error) {
    // Guest user বা permission error হলেও review দেখাবে
    console.log("Profile sync skipped:", error);
  }
}



          return {

            id:doc.id,

            ...data,

            name,

            photo,

          };


        }

      )

    );



  return reviews;

}






export function formatReviewDate(timestamp){

  if(!timestamp)
    return "";


  try{

    return new Intl.DateTimeFormat(
      "en-BD",
      {

        day:"numeric",

        month:"short",

        year:"numeric",

      }

    ).format(
      timestamp.toDate()
    );


  }catch{

    return "";

  }

}
