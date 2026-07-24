import {
  useNavigate,
} from "react-router-dom";


import useWishlist from "../hooks/useWishlist";

import useCart from "../hooks/useCart";

import Button from "./ui/Button";

import ProductRating from "./product/ProductRating";

import {
  successToast,
} from "./ui/Toast";



export default function WishlistPage() {


  const navigate = useNavigate();


  const [currentPage, setCurrentPage] = useState(1);

	const itemsPerPage = 10;



  const {
    wishlist,
    removeFromWishlist,
  } = useWishlist();



  const {
    addToCart,
  } = useCart();




  const handleCart = (product)=>{

    addToCart(product);


    successToast(
      "Added to cart successfully"
    );

  };





  const totalValue =
  wishlist.reduce(

    (sum,item)=>

      sum +

      Number(
        item.product.price || 0
      ),

    0

  );



const totalPages = Math.ceil(
  wishlist.length / itemsPerPage
);

const currentWishlist = wishlist.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);


  


return (


<div

className="
min-h-screen
bg-[#FCFAF5]
px-4
md:px-8
py-6
"

>


<div

className="
max-w-5xl
mx-auto
space-y-4
"

>



<div

className="
flex
items-center
justify-center
mb-4
"

>

<h1

className="
text-lg
md:text-2xl
font-bold
"

>

My Wishlist

</h1>


</div>





<div

className="
bg-white
border
border-gray-100
rounded-lg
shadow-sm
p-4
flex
justify-between
items-center
"

>


<div

className="
flex
gap-8
"

>


<div>

<p

className="
text-xs
text-gray-500
"

>

Saved Items

</p>


<h2

className="
text-2xl
font-black
"

>

{wishlist.length}

</h2>


</div>





<div>

<p

className="
text-xs
text-gray-500
"

>

Estimated Value

</p>


<h2

className="
text-2xl
font-black
"

>

৳ {totalValue}

</h2>


</div>



</div>



<div

className="
w-12
h-12
rounded-full
bg-amber-50
flex
items-center
justify-center
text-xl
"

>

❤️

</div>


</div>








{

wishlist.length === 0


?


<div

className="
bg-white
border
border-gray-100
rounded-lg
shadow-sm
p-10
text-center
"

>


<div

className="
text-5xl
"

>

💔

</div>


<h2

className="
mt-4
text-xl
font-bold
"

>

Wishlist Empty

</h2>


<p

className="
text-sm
text-gray-500
mt-2
"

>

Add your favourite products here.

</p>


</div>


:


<div

className="
space-y-4
"

>


{
currentWishlist.map((item)=>(


<div

key={
item.firestoreId
}


className="
relative
bg-white
border
border-gray-100
rounded-lg
shadow-sm
p-4
"

>


<button

onClick={()=>


removeFromWishlist(
item.firestoreId
)

}


className="
absolute
top-3
right-3
w-8
h-8
rounded-full
bg-red-50
text-red-600
font-bold
flex
items-center
justify-center
"

>

×

</button>


<div

className="
flex
gap-4
"

>


<img

src={
item.product.image
}

alt={
item.product.name
}

className="
w-24
h-24
rounded-lg
object-cover
bg-gray-50
"

/>



<div

className="
flex-1
pr-8
"

>


<h2

className="
text-base
font-bold
line-clamp-2
"

>

{item.product.name}

</h2>



<ProductRating

productId={
item.product.id
}

/>



<p

className="
text-lg
font-black
mt-2
text-amber-600
"

>

৳ {item.product.price}

</p>


</div>


</div>


  <hr

className="
my-2
border-gray-100
"

/>





{/* BUTTONS */}


<div

className="
flex
gap-2
mt-2
"

>


<Button

onClick={()=>


handleCart(
item.product
)


}

className="
flex-1
!h-10
!py-0
rounded-lg
bg-[#071F57]
text-white
font-bold
text-sm
"

>

🛒 Add Cart

</Button>







<Button

onClick={()=>


navigate(
`/product/${item.product.id}`
)


}

className="
flex-1
!h-10
!py-0
rounded-lg
bg-amber-50
border
border-amber-200
text-amber-700
font-bold
text-sm
"

>

👁️ Product

</Button>



</div>





</div>



))

}


</div>


}





  {
  totalPages > 1 && (
    <div className="flex justify-center items-center gap-2 pt-6">

      <button
        onClick={() =>
          setCurrentPage((p) => Math.max(p - 1, 1))
        }
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50"
      >
        Previous
      </button>

      {Array.from(
        { length: totalPages },
        (_, index) => (
          <button
            key={index}
            onClick={() =>
              setCurrentPage(index + 1)
            }
            className={`w-10 h-10 rounded-lg font-bold ${
              currentPage === index + 1
                ? "bg-amber-500 text-white"
                : "bg-white border"
            }`}
          >
            {index + 1}
          </button>
        )
      )}

      <button
        onClick={() =>
          setCurrentPage((p) =>
            Math.min(p + 1, totalPages)
          )
        }
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50"
      >
        Next
      </button>

    </div>
  )
}


  


</div>


</div>


);


}
