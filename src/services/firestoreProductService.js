import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";


import {
  db,
} from "../firebase/firestore";


import {
  sendNotification,
} from "./notificationService";



const productRef =
collection(
  db,
  "products"
);





// =========================
// ADD PRODUCT
// =========================

export const addProductToDB =
async(product)=>{


  await addDoc(

    productRef,

    product

  );




  // ADMIN NOTIFICATION

  await sendNotification({

    title:
      "New Product Added",


    message:
      `${product.name || "New product"} has been added.`,


    userId:
      "admin",


    type:
      "product_added",

  });


};









// =========================
// GET PRODUCTS
// =========================

export const getProductsFromDB =
async()=>{


  const snapshot =

  await getDocs(
    productRef
  );




  return snapshot.docs.map(

    (doc)=>(

      {

        id:doc.id,

        ...doc.data(),

      }

    )

  );


};









// =========================
// LATEST PRODUCTS
// =========================

export const getLatestProducts =
async()=>{


  const snapshot =

  await getDocs(
    productRef
  );




  const products =

  snapshot.docs.map(

    (doc)=>(

      {

        id:doc.id,

        ...doc.data(),

      }

    )

  );




  return products

    .sort(

      (a,b)=>

      b.createdAt?.seconds -

      a.createdAt?.seconds

    )

    .slice(0,8);


};









// =========================
// GET SINGLE PRODUCT
// =========================

export const getProductById =
async(id)=>{


  const productDoc =

  doc(

    db,

    "products",

    id

  );




  const snapshot =

  await getDoc(
    productDoc
  );




  if(!snapshot.exists()){

    return null;

  }




  return {

    id:snapshot.id,

    ...snapshot.data(),

  };


};









// =========================
// UPDATE PRODUCT
// =========================

export const updateProductInDB =
async(
  id,
  updatedData
)=>{


  const productDoc =

  doc(

    db,

    "products",

    id

  );






  await updateDoc(

    productDoc,

    updatedData

  );








  // =========================
  // STOCK CHECK
  // =========================


  if(
    updatedData.stock !== undefined
  ){



    if(
      updatedData.stock === 0
    ){



      await sendNotification({

        title:
          "Product Out Of Stock",


        message:
          `${updatedData.name || "Product"} is out of stock.`,


        userId:
          "admin",


        type:
          "stock_out",


      });



    }






    else if(

      updatedData.stock <= 5

    ){



      await sendNotification({

        title:
          "Low Stock Alert",


        message:
          `${updatedData.name || "Product"} stock is only ${updatedData.stock} left.`,


        userId:
          "admin",


        type:
          "low_stock",


      });



    }



  }





};









// =========================
// DELETE PRODUCT
// =========================

export const deleteProductFromDB =
async(id)=>{


  await deleteDoc(

    doc(

      db,

      "products",

      id

    )

  );


};









// =========================
// HERO PRODUCT
// =========================

export const getHeroBannerProduct =
async()=>{


  const snapshot =

  await getDocs(
    productRef
  );




  const products =

  snapshot.docs.map(

    (doc)=>(

      {

        id:doc.id,

        ...doc.data(),

      }

    )

  );




  const heroProduct =

  products.find(

    product =>

    product.heroBanner === true

  );




  return (

    heroProduct ||

    products[0] ||

    null

  );


};









// =========================
// RELATED PRODUCTS
// =========================

export const getRelatedProducts =
async(currentId)=>{


  const snapshot =

  await getDocs(
    productRef
  );




  const products =

  snapshot.docs.map(

    (doc)=>(

      {

        id:doc.id,

        ...doc.data(),

      }

    )

  );




  return products

    .filter(

      item =>

      item.id !== currentId

    )

    .slice(0,4);


};









// Alias
export const deleteProduct =
async(id)=>{


  await deleteDoc(

    doc(

      db,

      "products",

      id

    )

  );


};
