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

  const [products, setProducts] =
    useState([]);

  const [
    filteredProducts,
    setFilteredProducts,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    const fetchData =
      async () => {

        const data =
          await getProductsFromDB();

        setProducts(data);

        setFilteredProducts(data);

        setLoading(false);
      };


    fetchData();

  }, []);



  const handleSearch = (text) => {

    const keyword =
      text.toLowerCase();


    const filtered =
      products.filter(
        (product) =>

          product.name
            ?.toLowerCase()
            .includes(keyword) ||

          product.description
            ?.toLowerCase()
            .includes(keyword)

      );


    setFilteredProducts(
      filtered
    );

  };



  if (loading)
    return <Spinner />;



  return (

    <>

      {/* HERO FULL WIDTH */}

      <ShopHero />


      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          md:px-6
          py-10
          md:py-16
        "
      >



      {/* SEARCH */}

      <div
        className="
          sticky
          top-24
          z-20
          mt-10
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



      {/* PRODUCT COUNT */}

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
        filteredProducts.length === 0 ? (

          <div
            className="
              text-center
              py-24
              bg-white
              rounded-[32px]
              shadow-sm
            "
          >

            <div
              className="
                text-6xl
              "
            >
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


        ) : (


          <div
            className="
              grid
              grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-4
              md:gap-8
            "
          >

            {
              filteredProducts.map(
                (product) => (

                  <ProductCard
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                  />

                )
              )
            }


          </div>


        )

      }


          

      </div>

    </>

  );
