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
  sendAdminNotification,
  sendNotification,
} from "./notificationService";




const productRef =
collection(
  db,
  "products"
);









// =========================
// Add Product
// =========================

export const addProductToDB =
async(product)=>{


  const docRef =
  await addDoc(

    productRef,

    product

  );





  // ADMIN NOTIFICATION

  await sendAdminNotification({
  title: "🛍️ New Product Added",
  message: `${product.name} has been added successfully.`,
  type: "product",
  productId: docRef.id,
  actionUrl: `/admin/products/${docRef.id}`,
  priority: "medium",
});



  return docRef.id;


};









// =========================
// Get All Products
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

        id:
        doc.id,


        ...doc.data(),

      }

    )

  );


};









// =========================
// Latest Products
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

        id:
        doc.id,


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
// Get Single Product
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

   id:
   snapshot.id,


   ...snapshot.data(),

 };


};









// =========================
// Update Product
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


  await sendAdminNotification({
  title: "✏️ Product Updated",
  message: `${updatedData.name || "Product"} has been updated.`,
  type: "product",
  productId: id,
  actionUrl: `/admin/products/${id}`,
  priority: "low",
});




 // STOCK AUTOMATION


 if(
  updatedData.stock !== undefined
 ){



   if(
    Number(updatedData.stock) === 0
   ){


    await sendAdminNotification({
  title: "🚨 Out Of Stock",
  message: `${updatedData.name || "Product"} is out of stock.`,
  type: "product",
  productId: id,
  actionUrl: `/admin/products/${id}`,
  priority: "high",
});


   }



   else if(
    Number(updatedData.stock) <= 5
   ){



    await sendAdminNotification({
  title: "⚠️ Low Stock Alert",
  message: `${updatedData.name || "Product"} stock is only ${updatedData.stock} left.`,
  type: "product",
  productId: id,
  actionUrl: `/admin/products/${id}`,
  priority: "high",
});


   }


 }


};









// =========================
// Delete Product
// =========================

export const deleteProductFromDB = async (id) => {

  const productDoc = doc(db, "products", id);

  const snapshot = await getDoc(productDoc);

  const product = snapshot.exists()
    ? snapshot.data()
    : null;

  await deleteDoc(productDoc);

  await sendAdminNotification({
    title: "🗑️ Product Deleted",
    message: `${product?.name || "Product"} has been deleted.`,
    type: "product",
    productId: id,
    actionUrl: "/admin/products",
    priority: "high",
  });

};









// =========================
// Hero Banner Product
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

    id:
    doc.id,


    ...doc.data(),

   }

  )

 );



 const heroProduct =
 products.find(

  (product)=>

  product.heroBanner === true

 );



 return (

  heroProduct ||

  products[0] ||

  null

 );


};









// =========================
// Related Products
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

    id:
    doc.id,


    ...doc.data(),

   }

  )

 );



 return products

 .filter(

  item=>

  item.id !== currentId

 )

 .slice(0,4);


};









// Alias Admin Delete
export const deleteProduct = deleteProductFromDB;
