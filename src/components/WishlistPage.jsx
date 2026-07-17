import useWishlist from "../hooks/useWishlist";

import useCart from "../hooks/useCart";

import Button from "./ui/Button";

import ProductRating from "./product/ProductRating";

import {
  successToast,
} from "./ui/Toast";



export default function WishlistPage() {


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



{/* HEADER */}

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







{/* SUMMARY */}

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

{
wishlist.length
}

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







{/* EMPTY */}


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
wishlist.map(

(item)=>(


<div

key={
item.firestoreId
}

className="
bg-white
border
border-gray-100
rounded-lg
shadow-sm
p-4
"

>


{/* PRODUCT */}


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
"

>


<h2

className="
text-base
font-bold
line-clamp-2
"

>

{
item.product.name
}

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
my-4
border-gray-100
"

/>


  {/* ACTIONS */}


<div

className="
flex
gap-3
"

>


<Button

onClick={()=>{

handleCart(
item.product
)

}}

className="
flex-1
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

onClick={()=>{

removeFromWishlist(
item.product.id
)

}}

className="
flex-1
rounded-lg
bg-red-600
text-white
font-bold
text-sm
"

>

Remove

</Button>



</div>







{/* VIEW PRODUCT */}


<button

className="
w-full
flex
items-center
justify-between
text-sm
font-bold
text-amber-600
pt-4
"

>

<span>

View Product

</span>


<span>

›

</span>


</button>



</div>


)


)

}



</div>


}



</div>


</div>


);

}
