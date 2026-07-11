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








// GET PRODUCT REVIEWS

export async function getProductReviews(productId) {

  const q = query(
    reviewsCollection,
    where("productId", "==", productId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  const reviews = await Promise.all(

    snapshot.docs.map(async (reviewDoc) => {

      const review = {
        id: reviewDoc.id,
        ...reviewDoc.data(),
      };

      if (!review.userId) {
        return review;
      }

      try {

        const userRef = doc(
          db,
          "users",
          review.userId
        );

        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

          const user = userSnap.data();

          return {

            ...review,

            userName:
              user.name ||
              review.userName ||
              "Dream Mode Customer",

            photoURL:
              user.photoURL ||
              review.photoURL ||
              "",

          };

        }

      } catch (error) {

        console.error(error);

      }

      return review;

    })

  );

  return reviews;

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



