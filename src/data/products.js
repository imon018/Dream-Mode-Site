import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export default function Products() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const productsCollection = collection(db, "products");

        const productsSnapshot = await getDocs(productsCollection);


        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));


        setProducts(productsData);


      } catch (error) {

        console.log("Products fetch error:", error);

      } finally {

        setLoading(false);

      }

    };


    fetchProducts();

  }, []);



  const filteredProducts = products.filter((product) =>
    product.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );



  return (

    <div className="p-6">


      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Products Management
        </h1>


      </div>



      <div className="mb-6">


        <input

          type="text"

          placeholder="Search product by name..."

          value={search}

          onChange={(e) => setSearch(e.target.value)}

          className="w-full border rounded-xl px-4 py-3"

        />


      </div>




      {loading ? (

        <p className="text-center">
          Loading products...
        </p>


      ) : filteredProducts.length === 0 ? (


        <p className="text-center">
          No products found
        </p>


      ) : (



        <div className="bg-white rounded-2xl shadow overflow-hidden">


          <table className="w-full">


            <thead className="bg-gray-100">


              <tr>


                <th className="p-4 text-left">
                  Image
                </th>


                <th className="p-4 text-left">
                  Name
                </th>


                <th className="p-4 text-left">
                  Category
                </th>


                <th className="p-4 text-left">
                  Price
                </th>


                <th className="p-4 text-left">
                  Stock
                </th>


              </tr>


            </thead>




            <tbody>


              {filteredProducts.map((product) => (


                <tr
                  key={product.id}
                  className="border-t"
                >


                  <td className="p-4">


                    {product.image ? (

                      <img

                        src={product.image}

                        alt={product.name}

                        className="w-12 h-12 object-cover rounded-lg"

                      />

                    ) : (

                      "N/A"

                    )}


                  </td>




                  <td className="p-4">

                    {product.name || "Unnamed"}

                  </td>




                  <td className="p-4">

                    {product.category || "N/A"}

                  </td>




                  <td className="p-4">

                    ৳ {product.price || 0}

                  </td>




                  <td className="p-4">

                    {product.stock || 0}

                  </td>




                </tr>


              ))}


            </tbody>


          </table>


        </div>


      )}


    </div>

  );

}
