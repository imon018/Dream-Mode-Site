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



  return snapshot.docs.map(
    doc=>({

      id:doc.id,

      ...doc.data()

    })
  );

}








// CHECK USER ALREADY REVIEWED


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

// ================================
// GET LATEST REVIEWS (Homepage)
// ================================

export async function getLatestReviews() {

  const q = query(

    reviewsCollection,

    orderBy(
      "createdAt",
      "desc"
    ),

    limit(10)

  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({

    id: doc.id,

    ...doc.data(),

  }));

}

// ================================
// FORMAT REVIEW DATE
// ================================

export function formatReviewDate(timestamp) {

  if (!timestamp) return "";

  try {

    const date = timestamp.toDate();

    return new Intl.DateTimeFormat(
      "en-BD",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ).format(date);

  } catch {

    return "";

  }

}


