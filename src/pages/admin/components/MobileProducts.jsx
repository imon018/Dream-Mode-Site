import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch
} from "react-icons/fi";


import {
  useNavigate
} from "react-router-dom";




export default function MobileProducts({data}){


const {
products,
search,
setSearch,
handleDelete,
setDeleteId

}=data;



const navigate = useNavigate();





return(


<div className="
min-h-screen
bg-[#FAF7F2]
p-4
space-y-3
">







{/* HEADER */}



<div className="
bg-white
rounded-lg
p-4
border
border-gray-100
shadow-sm
">


<div className="
flex
items-center
justify-between
">


<div>


<h1 className="
text-xl
font-black
">

Products

</h1>



<p className="
text-xs
text-gray-500
mt-1
">

Manage your store products

</p>



</div>





<button

onClick={()=>navigate(
"/admin/add-product"
)}

className="
w-9
h-9
rounded-lg
bg-amber-500
text-white
flex
items-center
justify-center
"

>

<FiPlus size={18}/>

</button>



</div>


</div>









{/* SEARCH */}



<div className="
bg-white
rounded-lg
border
border-gray-100
px-3
h-11
flex
items-center
gap-2
">


<FiSearch
className="
text-gray-400
"
/>



<input

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

placeholder="
Search product...
"

className="
w-full
outline-none
text-sm
bg-transparent
"

/>



</div>









{/* PRODUCTS */}




<div className="
space-y-2
">



{

products.length===0

?

<div className="
bg-white
rounded-lg
p-6
text-center
text-sm
text-gray-400
border
border-gray-100
">

No Products Found

</div>


:


products.map(product=>(


<div

key={product.id}

className="
bg-white
rounded-lg
p-3
border
border-gray-100
shadow-sm
"

>


<div className="
flex
gap-3
">


<img

src={
product.image ||
"https://via.placeholder.com/100"
}

className="
w-20
h-20
rounded-lg
object-cover
bg-gray-50
"

/>





<div className="
flex-1
min-w-0
">


<h2 className="
font-bold
text-sm
truncate
">

{product.name}

</h2>




<p className="
text-xs
text-gray-500
mt-1
">

{product.category}

</p>




<p className="
text-sm
font-black
text-amber-600
mt-2
">

৳ {product.price}

</p>



</div>



</div>










<div className="
flex
items-center
justify-between
mt-3
">


<span className="
bg-green-50
text-green-600
px-2.5
py-1
rounded-lg
text-xs
font-semibold
">


Stock:
{product.stock || 0}


</span>







<div className="
flex
gap-2
">


<button

onClick={()=>navigate(
`/admin/edit-product/${product.id}`
)}

className="
w-8
h-8
rounded-lg
bg-blue-50
text-blue-600
flex
items-center
justify-center
"

>

<FiEdit size={15}/>

</button>







<button

onClick={()=>setDeleteId(product.id)}

className="
w-8
h-8
rounded-lg
bg-red-50
text-red-500
flex
items-center
justify-center
"

>

<FiTrash2 size={15}/>

</button>




</div>



</div>





</div>


))


}




</div>






</div>


);


}
