import {
  useEffect,
  useState,
} from "react";

import {
  getHeroBanner,
} from "../services/heroService";


export default function ShopHero(){

  const [image,setImage] =
    useState("");

  useEffect(()=>{

    const loadHero =
      async()=>{

        const data =
          await getHeroBanner();

        if(data?.imageUrl){

          setImage(
            data.imageUrl
          );

        }

      };


    loadHero();

  },[]);


  if(!image){
    return null;
  }


  return (

    <section
      className="
        w-full
        overflow-hidden
      "
    >

      <img
        src={image}
        alt="Shop Hero"
        className="
          w-full
          h-auto
          object-cover
          block
        "
      />

    </section>

  );

}
