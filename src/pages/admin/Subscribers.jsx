import {
  useEffect,
  useState,
} from "react";


import {
  FiMail,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";


import {
  getSubscribers,
  deleteSubscriber,
} from "../../services/newsletterService";


import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";




export default function Subscribers(){


const [
subscribers,
setSubscribers
]=useState([]);



const [
search,
setSearch
]=useState("");


const [
deleteId,
setDeleteId
]=useState(null);


const [page, setPage] = useState(1);

const subscribersPerPage = 10;

  

useEffect(()=>{

load();

},[]);





  useEffect(() => {
  setPage(1);
}, [search]);

  


const load = async()=>{

try{

const data =
await getSubscribers();


setSubscribers(data);


}

catch(error){

console.log(error);

}

};







const remove=(id)=>{

setDeleteId(id);

};

const confirmDelete=async()=>{

try{

await deleteSubscriber(deleteId);

successToast(
"Subscriber deleted");

load();

setDeleteId(null);

}
catch(error){

errorToast(
"Delete failed");

}

};








const filtered =
subscribers.filter(
(item)=>

item.email
?.toLowerCase()
.includes(
search.toLowerCase()
)

);




const totalPages = Math.max(
  1,
  Math.ceil(filtered.length / subscribersPerPage)
);

const currentSubscribers = filtered.slice(
  (page - 1) * subscribersPerPage,
  page * subscribersPerPage
);



return(


<div

className="
min-h-screen
bg-[#FAF7F2]
p-4
md:p-8
"

>


<div

className="
max-w-3xl
mx-auto
"

>






{/* HEADER */}



<div

className="
flex
items-center
justify-between
mb-5
"

>


<div>


<h1

className="
text-2xl
font-black
text-[#172033]
"

>

Subscribers

</h1>



<p

className="
text-sm
text-gray-500
mt-1
"

>

Manage newsletter subscribers

</p>


</div>





<div

className="
w-11
h-11
rounded-xl
bg-[#FFF7E8]
flex
items-center
justify-center
text-amber-500
text-xl
"

>

<FiUsers/>

</div>



</div>









{/* SEARCH */}



<div

className="
bg-white
rounded-xl
p-5
shadow-sm
border
border-gray-100
mb-5
"

>


<div

className="
relative
"

>


<div

className="
absolute
left-3
top-1/2
-translate-y-1/2
w-8
h-8
rounded-lg
bg-[#FFF7E8]
flex
items-center
justify-center
text-amber-500
"

>

<FiMail/>

</div>



<input


placeholder="Search email..."


value={search}


onChange={
e=>
setSearch(
e.target.value
)
}



className="

w-full

h-12

pl-12

pr-3

rounded-lg

border

border-gray-200

outline-none

text-sm

focus:border-amber-400

"


/>



</div>



</div>









{/* LIST */}



<div

className="
bg-white
rounded-xl
shadow-sm
border
border-gray-100
overflow-hidden
"

>


<div

className="
hidden
md:grid
grid-cols-3
bg-[#FFF7E8]
text-[#172033]
font-bold
text-sm
p-4
"

>


<div>
Email
</div>


<div>
Date
</div>


<div className="text-center">
Action
</div>


</div>






{


currentSubscribers.map((item) => (


<div

key={item.id}

className="

p-4

border-b

border-gray-100

"

>


{/* EMAIL + DELETE */}

<div

className="

flex

items-center

justify-between

"

>


<div

className="

flex

items-center

gap-2

font-semibold

text-[#172033]

"

>

<FiMail

className="
text-amber-500
"

/>

<span>

{item.email}

</span>


</div>





<button


onClick={()=>
remove(item.id)
}


className="

w-9

h-9

rounded-lg

bg-red-500

text-white

flex

items-center

justify-center

"


>

<FiTrash2 size={16}/>


</button>



</div>







{/* DATE */}

<div

className="

mt-3

text-sm

text-gray-500

"

>


{

item.createdAt

?

item.createdAt
.toDate()
.toLocaleDateString()

:

""

}


</div>



</div>


)

)


}





{

currentSubscribers.length===0 &&

<div

className="
p-8
text-center
text-gray-400
text-sm
"

>

No subscribers found

</div>

}



</div>






</div>






  {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-6 mb-6">

    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
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
        (pageNumber === totalPages - 1 &&
          page < totalPages - 3);

      if (showDots) {
        return (
          <span
            key={pageNumber}
            className="px-2 text-gray-500 font-bold"
          >
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
              : "bg-white border border-gray-200"
          }`}
        >
          {pageNumber}
        </button>
      );
    })}

    <button
      disabled={page === totalPages}
      onClick={() => setPage(page + 1)}
      className="px-4 py-2 rounded-lg border disabled:opacity-40"
    >
      Next
    </button>

  </div>
)}




  





  {
deleteId && (

<div
className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
z-[100]
"
>

<div
className="
bg-white
rounded-xl
p-5
w-[300px]
shadow-xl
"
>

<h3
className="
font-black
text-lg
text-slate-900
"
>
Delete Subscriber?
</h3>

<p
className="
text-sm
text-gray-500
mt-2
"
>
Are you sure you want to delete this subscriber?
</p>

<div
className="
flex
gap-3
mt-5
"
>

<button
onClick={()=>setDeleteId(null)}
className="
flex-1
h-10
rounded-lg
bg-gray-200
font-bold
text-sm
"
>
No
</button>

<button
onClick={confirmDelete}
className="
flex-1
h-10
rounded-lg
bg-red-500
text-white
font-bold
text-sm
"
>
Yes
</button>

</div>

</div>

</div>

)
}


  
</div>


);


}
