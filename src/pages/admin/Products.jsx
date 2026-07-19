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




useEffect(()=>{

loadProducts();

},[]);





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







const productData={

products:filteredProducts,

search,

setSearch,

handleDelete,

setDeleteId,

reload:loadProducts

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




</>


);


}
