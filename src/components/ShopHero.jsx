import {
  useEffect,
  useState
} from "react";


import {
  getShopHeroBanner,
} from "../services/firestoreShopHeroService";



export default function ShopHero(){


const [
banner,
setBanner
]=useState(null);



const [
loading,
setLoading
]=useState(true);





useEffect(()=>{


const loadBanner =
async()=>{


try{


const data =
await getShopHeroBanner();


setBanner(data);



}
catch(error){


}
finally{

setLoading(false);

}


};



loadBanner();


},[]);







if(loading){


return(

<div

className="

w-full

h-48

md:h-80

bg-[#FAF7F2]

animate-pulse

"

>


</div>

);


}






if(
!banner?.imageUrl
){

return null;

}







return(


<section

className="

w-full

bg-white

"

>



<div

className="

w-full

overflow-hidden

"

>



<img

src={
banner.imageUrl
}

alt="Shop Hero Banner"

className="

w-full

h-auto

object-cover

block

"

loading="lazy"

/>



</div>



</section>


);


}
