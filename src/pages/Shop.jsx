import { useEffect, useState } from "react";
import { getProductsFromDB } from "../services/firestoreProductService";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import SearchBar from "../components/SearchBar";

export default function Shop() {
  const [products, setProducts] = useState([]);
const [filteredProducts, setFilteredProducts] = useState([]);
const [loading, setLoading] = useState(true);
  useEffect(() => {
  const fetchData = async () => {
    const data = await getProductsFromDB();

    setProducts(data);
    setFilteredProducts(data);
    setLoading(false);
  };

  fetchData();
}, []);

  const handleSearch = (text) => {
  const keyword = text.toLowerCase();

  const filtered = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(keyword) ||
      product.category?.toLowerCase().includes(keyword)
  );

  setFilteredProducts(filtered);
};

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold mb-8">
        Shop
      </h1>

      <div className="mb-8">
  <SearchBar onSearch={handleSearch} />
</div>

      {filteredProducts.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

    </div>
  );
}
