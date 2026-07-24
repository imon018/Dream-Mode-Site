import {
  useEffect,
  useMemo,
  useState
} from "react";


import {
  getProductsFromDB,
  deleteProduct
} from "../../services/firestoreProductService";


import MobileProducts from "./components/MobileProducts";

import DesktopProducts from "./components/DesktopProducts";



export default function Products(){


const [products,setProducts]=useState([]);

const [loading,setLoading]=useState(true);


const [search,setSearch]=useState("");


const [deleteId,setDeleteId]=useState(null);


const [page, setPage] = useState(1);

const productsPerPage = 10;




useEffect(()=>{

loadProducts();

},[]);


useEffect(() => {
  setPage(1);
}, [search]);


async function loadProducts(){


try{


const data = await getProductsFromDB();


setProducts(data);



}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}


}







async function handleDelete(){

try{

await deleteProduct(deleteId);

setDeleteId(null);

loadProducts();

}
catch(error){

console.log(error);

}

}








const filteredProducts = useMemo(()=>{


return products.filter(product=>{


const name =
product.name
?.toLowerCase()
|| "";



return name.includes(
search.toLowerCase()
);


});


},[

products,

search

]);






  const totalPages = Math.max(
  1,
  Math.ceil(filteredProducts.length / productsPerPage)
);

const currentProducts = filteredProducts.slice(
  (page - 1) * productsPerPage,
  page * productsPerPage
);

  



if(loading){


return (

<div

className="
min-h-screen
flex
items-center
justify-center

bg-warm

text-amber-600

font-semibold

"

>

Loading Products...

</div>

);


}







const productData = {

products: currentProducts,

search,

setSearch,

handleDelete,

setDeleteId,

reload: loadProducts

};







return (


  <>

    
{
deleteId && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white rounded-xl p-6">

<h2 className="font-bold text-lg">
Delete Product?
</h2>

<p className="my-3">
Are you sure you want to delete this product?
</p>

<div className="flex gap-3">

<button
onClick={()=>setDeleteId(null)}
className="px-4 py-2 bg-gray-200 rounded"
>
No
</button>


<button
onClick={handleDelete}
className="px-4 py-2 bg-red-500 text-white rounded"
>
Yes
</button>

</div>

</div>

</div>

)
}



{/* MOBILE */}


<div className="lg:hidden">

<MobileProducts

data={productData}

/>

</div>







{/* DESKTOP */}


<div className="hidden lg:block">

<DesktopProducts

data={productData}

/>

</div>




    {
totalPages > 1 && (

<div className="flex justify-center items-center gap-2 mt-6">

<button
disabled={page===1}
onClick={()=>setPage(page-1)}
className="px-4 py-2 rounded-lg border disabled:opacity-40"
>
Previous
</button>



{[...Array(totalPages)].map((_, index) => {

const pageNumber = index + 1;

const showPage =
pageNumber === 1 ||
pageNumber === totalPages ||
Math.abs(pageNumber - page) <= 1;

const showDots =
(pageNumber === 2 && page > 4) ||
(pageNumber === totalPages - 1 && page < totalPages - 3);

if (showDots) {
return (
<span key={pageNumber} className="px-2">
...
</span>
);
}

if (!showPage) return null;

return (
<button
key={pageNumber}
onClick={() => setPage(pageNumber)}
className={`w-10 h-10 rounded-lg font-bold ${
page === pageNumber
? "bg-amber-500 text-white"
: "bg-white border"
}`}
>
{pageNumber}
</button>
);

})}

  


<button
disabled={page===totalPages}
onClick={()=>setPage(page+1)}
className="px-4 py-2 rounded-lg border disabled:opacity-40"
>
Next
</button>

</div>

)
}

    




</>


);


}
