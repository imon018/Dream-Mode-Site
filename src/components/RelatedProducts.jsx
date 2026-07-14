import { useEffect, useState } from "react";

import ProductCard from "./ProductCard";

import {
  getProductsFromDB,
} from "../services/firestoreProductService";


export default function RelatedProducts({
  currentId,
}) {


  const [products,setProducts] =
    useState([]);



  useEffect(()=>{


    const loadProducts = async()=>{


      try{


        const data =
          await getProductsFromDB();



        const filtered =
          data
          .filter(
            item =>
              item.id !== currentId
          )
          .slice(0,4);



        setProducts(filtered);



      }catch(error){

        console.log(error);

      }


    };



    loadProducts();


  },[currentId]);





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
