import { useEffect, useState } from "react";

import ProductCard from "./ProductCard";

import {
  getProductsFromDB,
  getLatestProducts,
} from "../services/firestoreProductService";


export default function RelatedProducts({
  currentId,
  category,
}) {


  const [products,setProducts] =
    useState([]);



  useEffect(()=>{


    const loadProducts = async()=>{


      try{


        let data;


        if(category){


          const allProducts =
            await getProductsFromDB();


          data =
            allProducts.filter(
              (item)=>
                item.category === category
            );


        }

        else{


          // product has no category,
          // fall back to recent products
          data =
            await getLatestProducts();


        }



        const filtered =
          data
          .filter(
            item =>
              item.id !== currentId
          )
          .slice(0,8);



        setProducts(filtered);



      }catch(error){


      }


    };



    loadProducts();


  },[currentId,category]);





  if(!products.length){

    return null;

  }





  return (

    <div
      className="
        mt-6
      "
    >


      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-4
        "
      >


        {
          products.map(product=>(


            <ProductCard

              key={product.id}

              product={product}

              compact={true}

            />


          ))
        }


      </div>



    </div>

  );


}
