import {
  useEffect,
  useState,
} from "react";

import {
  getProductsFromDB,
} from "../services/firestoreProductService";

import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import SearchBar from "../components/ui/SearchBar";
import ShopHero from "../components/ShopHero";


export default function Shop() {


  const [products,setProducts] =
    useState([]);


  const [filteredProducts,setFilteredProducts] =
    useState([]);


  const [loading,setLoading] =
    useState(true);



  const [currentPage,setCurrentPage] =
    useState(1);



  const [itemsPerPage,setItemsPerPage] =
    useState(16);





  // MOBILE / DESKTOP LIMIT

  useEffect(()=>{


    const updateLimit = ()=>{


      if(window.innerWidth >= 768){

        setItemsPerPage(24);

      }

      else{

        setItemsPerPage(16);

      }


    };



    updateLimit();


    window.addEventListener(
      "resize",
      updateLimit
    );


    return ()=>{

      window.removeEventListener(
        "resize",
        updateLimit
      );

    };


  },[]);







  useEffect(()=>{


    const fetchData =
      async()=>{


        const data =
          await getProductsFromDB();


        setProducts(data);

        setFilteredProducts(data);

        setLoading(false);


      };


    fetchData();


  },[]);







  const handleSearch = (text)=>{


    const keyword =
      text.toLowerCase();



    const filtered =
      products.filter(
        (product)=>

          product.name
          ?.toLowerCase()
          .includes(keyword)

          ||

          product.description
          ?.toLowerCase()
          .includes(keyword)

      );



    setFilteredProducts(filtered);


    // search করলে প্রথম page

    setCurrentPage(1);


  };







  if(loading)
    return <Spinner />;







  // PAGINATION


  const totalPages =
    Math.ceil(
      filteredProducts.length /
      itemsPerPage
    );



  const startIndex =
    (currentPage - 1)
    *
    itemsPerPage;



  const currentProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + itemsPerPage
    );









  return (

  <div className="min-h-screen bg-[#FAF7F2]">


      <ShopHero />




      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          md:px-6
          pt-2
          pb-10
          md:pb-16
        "
      >





        {/* SEARCH */}

        <div
          className="
            mt-3
            mb-10
          "
        >

          <div
            className="
              bg-white/90
              backdrop-blur
              p-3
              rounded-3xl
              shadow-lg
            "
          >

            <SearchBar
              onSearch={
                handleSearch
              }
            />


          </div>


        </div>






        {/* COUNT */}

        <div
          className="
            mb-8
          "
        >

          <p
            className="
              text-gray-500
            "
          >

            Showing

            <span
              className="
                font-bold
                text-black
                mx-2
              "
            >

              {
                filteredProducts.length
              }

            </span>

            Products


          </p>


        </div>








        {/* PRODUCTS */}


        {
          currentProducts.length === 0 ? (


            <div
              className="
                text-center
                py-24
                bg-white
                rounded-[32px]
                shadow-sm
              "
            >

              <div className="text-6xl">
                🔍
              </div>


              <h3
                className="
                  mt-6
                  text-2xl
                  font-bold
                "
              >
                No Products Found
              </h3>


              <p
                className="
                  mt-3
                  text-gray-500
                "
              >
                Try another keyword.
              </p>


            </div>



          )

          :



          (

          <div
  className="
    grid
    grid-cols-2
    md:grid-cols-3
    gap-4
    md:gap-6
  "
>


            {
              currentProducts.map(
                (product)=>(


                  <ProductCard

                    key={
                      product.id
                    }


                    product={
                      product
                    }


                    compact={true}


                  />


                )
              )
            }



          </div>

          )

        }







        {/* PAGINATION */}


        {
          totalPages > 1 && (

          <div
            className="
              flex
              justify-center
              items-center
              gap-2
              mt-12
              flex-wrap
            "
          >


            {
              Array.from(
                {
                  length: totalPages
                },
                (_,i)=>i+1
              )
              .map((page)=>(


                <button

                  key={page}


                  onClick={()=>{

                    setCurrentPage(page);

                    window.scrollTo({
                      top:0,
                      behavior:"smooth"
                    });

                  }}


                  className={`
                    w-10
                    h-10
                    rounded-full
                    font-bold
                    transition

                    ${
                      currentPage === page

                      ?

                      "bg-amber-500 text-black"

                      :

                      "bg-white border border-gray-200 text-gray-600"

                    }

                  `}

                >

                  {page}

                </button>


              ))
            }



          </div>

          )

        }





      </div>


    </div>

  );

}
