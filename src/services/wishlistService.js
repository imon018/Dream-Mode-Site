import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";


import { db } from "../firebase/firestore";





const wishlistCollection =
  collection(
    db,
    "wishlist"
  );









// GET USER WISHLIST

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

      firestoreId:
        item.id,

      ...item.data(),

    })
  );


}









// ADD WISHLIST ITEM

export async function addWishlistItem(
  userId,
  product
){



  // CHECK DUPLICATE


  const q =
    query(

      wishlistCollection,

      where(
        "userId",
        "==",
        userId
      ),

      where(
        "productId",
        "==",
        product.id
      )

    );



  const existing =
    await getDocs(q);





  if(
    !existing.empty
  ){

    return {
      alreadyExists:true
    };

  }







  const result =
    await addDoc(

      wishlistCollection,

      {

        userId,

        productId:
          product.id,

        product,

        createdAt:
          new Date(),

      }

    );




  return {

    id:
      result.id,

  };


}









// REMOVE WISHLIST ITEM


export async function removeWishlistItem(
  firestoreId
){


  if(!firestoreId)
    return;



  await deleteDoc(

    doc(

      db,

      "wishlist",

      firestoreId

    )

  );


}









// CHECK SINGLE PRODUCT


export async function checkWishlistItem(
  userId,
  productId
){


  const q =
    query(

      wishlistCollection,

      where(
        "userId",
        "==",
        userId
      ),

      where(
        "productId",
        "==",
        productId
      )

    );



  const snapshot =
    await getDocs(q);



  return !snapshot.empty;


}
