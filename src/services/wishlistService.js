import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";



const wishlistCollection =
  collection(
    db,
    "wishlist"
  );





export async function getUserWishlist(
  userId
){

  const q =
    query(
      wishlistCollection,
      where(
        "userId",
        "==",
        userId
      )
    );


  const snapshot =
    await getDocs(q);



  return snapshot.docs.map(
    item => ({
      firestoreId:item.id,
      ...item.data()
    })
  );

}







export async function addWishlistItem(
  userId,
  product
){


  await addDoc(
    wishlistCollection,
    {

      userId,

      productId:
        product.id,

      product,

    }
  );


}







export async function removeWishlistItem(
  firestoreId
){

  await deleteDoc(
    doc(
      db,
      "wishlist",
      firestoreId
    )
  );

}
