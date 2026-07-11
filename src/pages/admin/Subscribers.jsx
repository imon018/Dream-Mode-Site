import {
  useEffect,
  useState,
} from "react";


import {
  getSubscribers,
  deleteSubscriber,
} from "../../services/newsletterService";


import {
  successToast,
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




useEffect(()=>{


load();


},[]);




async function load(){


const data =
await getSubscribers();


setSubscribers(data);


}




async function remove(id){

  if(
    !window.confirm(
      "Delete this subscriber?"
    )
  ){
    return;
  }

  await deleteSubscriber(id);

  successToast(
    "Subscriber deleted"
  );

  load();

}





const filtered =
subscribers.filter(
(item)=>

item.email
.toLowerCase()
.includes(
search.toLowerCase()
)

);





return (

<div className="
p-6
">


<h1 className="
text-3xl
font-black
text-blue-900
mb-6
">

Subscribers

</h1>




<input

placeholder="
Search email...
"

value={search}

onChange={(e)=>
setSearch(e.target.value)
}


className="
w-full
border
rounded-xl
px-4
py-3
mb-6
"

/>






<div className="
bg-white
rounded-3xl
shadow
overflow-hidden
">


<table className="
w-full
">


<thead>

<tr className="
bg-blue-900
text-white
">


<th className="
p-4
text-left
">

Email

</th>


<th className="
p-4
text-left
">

Date

</th>


<th className="
p-4
">

Action

</th>


</tr>

</thead>





<tbody>


{

filtered.map(
(item)=>(


<tr
key={item.id}
className="
border-b
"
>


<td className="
p-4
">

{item.email}

</td>




<td className="
p-4
">

{
item.createdAt
?
item.createdAt
.toDate()
.toLocaleDateString()
:
""
}

</td>





<td className="
p-4
text-center
">


<button

onClick={()=>
remove(item.id)
}


className="
bg-red-500
text-white
px-4
py-2
rounded-xl
"

>

Delete

</button>


</td>



</tr>


)

)


}



</tbody>



</table>


</div>


</div>

);


}
