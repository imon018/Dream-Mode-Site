import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";



export default function DesktopProducts({data}){


const {

products,

search,

setSearch,

handleDelete,

setDeleteId

}=data;



const navigate = useNavigate();





return (

<div

className="

w-full

min-h-screen

bg-[#FAF7F2]

p-8

"

>





{/* HEADER */}


<div

className="

bg-white

rounded-[32px]

p-8

border

border-gray-100

shadow-sm

mb-8

"

>


<div

className="

flex

justify-between

items-center

"

>


<div>


<h1

className="

text-4xl

font-bold

"

>

Products Management

</h1>


<p

className="

text-gray-500

mt-2

"

>

Manage all your store products

</p>


</div>





<button

onClick={()=>navigate("/admin/add-product")}

className="

flex

items-center

gap-2

bg-amber-500

hover:bg-amber-600

text-white

px-6

py-3

rounded-2xl

shadow

transition

"

>


<FiPlus/>

Add Product


</button>



</div>



</div>









{/* SEARCH BAR */}



<div

className="

bg-white

rounded-3xl

border

border-gray-100

p-5

mb-8

flex

items-center

gap-4

"

>


<FiSearch

className="

text-gray-400

text-xl

"

/>


<input


value={search}

onChange={(e)=>setSearch(e.target.value)}


placeholder="Search products..."


className="

w-full

outline-none

text-gray-700

"

>


</input>



</div>









{/* TABLE */}



<div

className="

bg-white

rounded-[32px]

border

border-gray-100

shadow-sm

overflow-hidden

"

>


<table

className="

w-full

"

>


<thead>


<tr

className="

bg-gray-50

text-left

text-gray-500

"

>


<th className="px-6 py-5">

Product

</th>


<th>

Category

</th>


<th>

Price

</th>


<th>

Stock

</th>


<th>

Status

</th>


<th>

Action

</th>


</tr>


</thead>







<tbody>


{

products.length===0 ?


(


<tr>

<td

colSpan="6"

className="

text-center

py-12

text-gray-400

"

>

No Products Found

</td>

</tr>


)



:


products.map(product=>(



<tr

key={product.id}

className="

border-t

border-gray-100

hover:bg-gray-50

transition

"

>






<td

className="

px-6

py-5

"

>


<div

className="

flex

items-center

gap-4

"

>


<img

src={

product.image ||

"https://via.placeholder.com/80"

}


className="

w-16

h-16

rounded-2xl

object-cover

"

/>



<div>


<h3

className="

font-semibold

"

>

{product.name}

</h3>


<p

className="

text-gray-400

text-sm

"

>

ID: {product.id}

</p>


</div>


</div>


</td>







<td>

{product.category || "N/A"}

</td>





<td

className="

font-semibold

text-amber-600

"

>

৳ {product.price}

</td>







<td>

{product.stock || 0}

</td>






<td>


{

Number(product.stock || 0) > 0 ?


<span

className="

bg-green-50

text-green-600

px-4

py-2

rounded-full

text-sm

"

>

In Stock

</span>


:


<span

className="

bg-red-50

text-red-500

px-4

py-2

rounded-full

text-sm

"

>

Out

</span>


}



</td>







<td>


<div

className="

flex

gap-3

"

>


<button

onClick={()=>navigate(
`/admin/edit-product/${product.id}`
)}

className="

bg-blue-50

text-blue-600

p-3

rounded-xl

hover:bg-blue-100

"

>


<FiEdit/>

</button>







<button

onClick={()=>setDeleteId(product.id)}

className="

bg-red-50

text-red-500

p-3

rounded-xl

hover:bg-red-100

"

>


<FiTrash2/>

</button>



</div>



</td>







</tr>


))


}



</tbody>


</table>



</div>






</div>


);


}
