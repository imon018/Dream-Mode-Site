import {
  useEffect,
  useState
} from "react";


import {
  useNavigate
} from "react-router-dom";


import {
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiEdit,
  FiShield,
  FiUser,
  FiLoader,
} from "react-icons/fi";


import {
  getUsers,
  changeRole,
  deleteUser,
} from "../../services/adminService";





export default function Users(){


const navigate = useNavigate();



const [users,setUsers] =
useState([]);


const [loading,setLoading] =
useState(true);


const [search,setSearch] =
useState("");



const [roleFilter,setRoleFilter] =
useState("all");


const [roleMenu,setRoleMenu] =
useState(null);


const [filterOpen,setFilterOpen] =
useState(false);



const [page,setPage] =
useState(1);



const usersPerPage = 6;





useEffect(()=>{

loadUsers();

},[search]);





useEffect(()=>{

setPage(1);

},[
search,
roleFilter
]);







async function loadUsers(){


try{


setLoading(true);



const data =
await getUsers(search);



setUsers(data);



}

catch(error){

console.log(error);

}


finally{

setLoading(false);

}


}








async function removeUser(user){


const confirmDelete =
window.confirm(
`Are you sure you want to delete ${user.email}?`
);



if(!confirmDelete)
return;



try{


await deleteUser(
user.id
);



await loadUsers();



setRoleMenu(null);


}

catch(error){

console.log(error);

}


}







const filteredUsers =

roleFilter==="all"

?

users

:

users.filter(
user =>
user.role===roleFilter
);








const totalUsers =
users.length;



const totalAdmins =
users.filter(
user =>
user.role==="admin"
).length;




const totalActive =
users.filter(
user =>
user.status!=="inactive"
).length;






const totalPages =
Math.ceil(
filteredUsers.length /
usersPerPage
);






const currentUsers =
filteredUsers.slice(

(page-1)*usersPerPage,

page*usersPerPage

);





return (

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
max-w-5xl
mx-auto
"
>


{/* HEADER */}


<div
className="
mb-6
"
>


<h1
className="
text-2xl
md:text-3xl
font-black
text-[#172033]
"
>

Users

</h1>


<p
className="
text-sm
text-gray-500
mt-1
"
>

Dashboard
<span className="mx-2">
›
</span>
Users

</p>


</div>





{/* STATS */}


<div
className="
grid
grid-cols-4
gap-2
mb-6
"
>



<div
className="
bg-white
rounded-xl
p-3
shadow-sm
border
border-gray-100
"
>


<div
className="
w-8
h-8
rounded-xl
bg-[#FFF7E8]
text-amber-500
flex
items-center
justify-center
mb-3
"
>

<FiUser size={16}/>

</div>



<p
className="
text-[10px]
text-gray-500
"
>

Total Users

</p>



<h2
className="
text-lg
font-black
text-[#172033]
"
>

{totalUsers}

</h2>


</div>







<div
className="
bg-white
rounded-xl
p-3
shadow-sm
border
border-gray-100
"
>


<div
className="
w-8
h-8
rounded-xl
bg-[#FFF7E8]
text-amber-500
flex
items-center
justify-center
mb-3
"
>

<FiShield size={16}/>

</div>


<p
className="
text-[10px]
text-gray-500
"
>

Admins

</p>


<h2
className="
text-lg
font-black
"
>

{totalAdmins}

</h2>


</div>






<div
className="
bg-white
rounded-xl
p-3
shadow-sm
border
border-gray-100
"
>


<div
className="
w-8
h-8
rounded-xl
bg-green-50
text-green-500
flex
items-center
justify-center
mb-3
"
>

<FiShield size={16}/>

</div>


<p
className="
text-[10px]
text-gray-500
"
>

Active Users

</p>


<h2
className="
text-lg
font-black
"
>

{totalActive}

</h2>


</div>






<div
className="
bg-white
rounded-xl
p-3
shadow-sm
border
border-gray-100
"
>


<div
className="
w-8
h-8
rounded-xl
bg-blue-50
text-blue-500
flex
items-center
justify-center
mb-3
"
>

<FiUser size={16}/>

</div>


<p
className="
text-[10px]
text-gray-500
"
>

New Users

</p>


<h2
className="
text-lg
font-black
"
>

0

</h2>


</div>



</div>


  {/* SEARCH */}

<div
className="
relative
mb-4
"
>


<FiSearch

className="
absolute
left-4
top-3.5
text-gray-400
"

/>


<input

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

placeholder="
Search users by email...
"

className="
w-full
h-12
bg-white
rounded-xl
pl-11
pr-4
border
border-gray-200
outline-none
text-sm
focus:border-amber-400
"

/>


</div>








{/* ROLE FILTER */}


<div
className="
relative
mb-6
"
>


<button

onClick={()=>
setFilterOpen(!filterOpen)
}

className="
w-full
h-12
bg-white
rounded-xl
px-4
border
border-gray-200
flex
items-center
justify-between
text-sm
text-[#172033]
"

>


<span>

{
roleFilter==="all"
?
"All Users"
:
roleFilter==="admin"
?
"Admins"
:
"Users"
}

</span>


<FiChevronDown/>

</button>





{
filterOpen &&

<div

className="
absolute
top-14
left-0
right-0
bg-white
rounded-xl
border
border-gray-100
shadow-lg
overflow-hidden
z-20
"

>


<button

onClick={()=>{

setRoleFilter("all");
setFilterOpen(false);

}}

className="
w-full
text-left
px-4
py-3
text-sm
hover:bg-[#FFF7E8]
"

>

All Users

</button>





<button

onClick={()=>{

setRoleFilter("admin");
setFilterOpen(false);

}}

className="
w-full
text-left
px-4
py-3
text-sm
hover:bg-[#FFF7E8]
"

>

Admins

</button>






<button

onClick={()=>{

setRoleFilter("user");
setFilterOpen(false);

}}

className="
w-full
text-left
px-4
py-3
text-sm
hover:bg-[#FFF7E8]
"

>

Users

</button>


</div>


}


</div>









{/* LOADING */}


{
loading &&

<div
className="
bg-white
rounded-xl
p-10
shadow-sm
border
border-gray-100
flex
justify-center
"
>

<FiLoader
size={30}
className="animate-spin text-amber-500"
/>


</div>

}










{/* USERS LIST */}


{
!loading &&

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


{
currentUsers.map((user)=>(


<div

key={user.id}

className="
flex
items-center
justify-between
p-4
border-b
last:border-none
"

>


{/* USER INFO */}


<div
className="
flex
items-center
gap-3
min-w-0
flex-1
"
>


<img

src={
user.photoURL ||
`https://ui-avatars.com/api/?name=${encodeURIComponent(
user.email || "User"
)}`
}

className="
w-12
h-12
rounded-full
object-cover
border
border-gray-100
"

/>



<div
className="
min-w-0
"
>


<h3
className="
font-bold
text-sm
text-[#172033]
truncate
"
>

{
user.name ||
"User"
}

</h3>



<p
className="
text-xs
text-gray-500
truncate
"
>

{user.email}

</p>


</div>


</div>









{/* ACTIONS */}


<div
className="
flex
items-center
gap-2
ml-3
"
>




{/* ROLE */}


<div
className="
relative
"
>


<button

onClick={()=>{

setRoleMenu(
roleMenu===user.id
?
null
:
user.id
);

}}

className={`

text-xs
px-3
py-2
rounded-xl
font-semibold
flex
items-center
gap-1


${
user.role==="admin"

?

"bg-[#FFF7E8] text-amber-600"

:

"bg-blue-50 text-blue-600"

}

`}

>


{
user.role==="admin"
?
"Admin"
:
"User"
}


<FiChevronDown size={14}/>


</button>





{
roleMenu===user.id &&

<div

className="
absolute
right-0
top-11
w-36
bg-white
rounded-xl
border
border-gray-100
shadow-lg
z-50
overflow-hidden
"

>


<button

onClick={()=>{


const newRole =
user.role==="admin"
?
"user"
:
"admin";



const confirm =
window.confirm(
`Are you sure you want to make ${
newRole==="admin"
?
"Admin"
:
"User"
}?`
);



if(!confirm)
return;



changeRole(
user.id,
newRole
)
.then(()=>{

loadUsers();

setRoleMenu(null);

});


}}

className="
w-full
px-4
py-3
text-left
text-sm
hover:bg-[#FFF7E8]
"

>

{
user.role==="admin"
?
"Make User"
:
"Make Admin"
}


</button>


</div>

}


</div>









{/* EDIT */}


<button

onClick={()=>
navigate(`/admin/users/${user.id}`)
}

className="
w-9
h-9
rounded-xl
bg-[#FFF7E8]
text-amber-500
flex
items-center
justify-center
"

>

<FiEdit size={16}/>

</button>









{/* DELETE */}


<button

onClick={()=>
removeUser(user)
}

className="
w-9
h-9
rounded-xl
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


</div>


))

}


</div>

}


  
{/* EMPTY STATE */}


{
!loading &&
currentUsers.length===0 &&

<div
className="
bg-white
rounded-xl
p-10
text-center
text-gray-500
border
border-gray-100
shadow-sm
"
>

No Users Found

</div>

}









{/* PAGINATION */}



{
totalPages > 1 &&

<div
className="
flex
justify-center
items-center
gap-2
mt-6
"
>


<button

disabled={page===1}

onClick={()=>
setPage(page-1)
}

className="
w-10
h-10
rounded-xl
bg-white
border
border-gray-200
flex
items-center
justify-center
disabled:opacity-40
"

>

<FiChevronLeft/>

</button>






{

Array.from(
{
length: totalPages
}
)
.map((_,index)=>(


<button

key={index}

onClick={()=>
setPage(index+1)
}

className={`
w-10
h-10
rounded-xl
font-bold
text-sm


${
page===index+1

?

"bg-amber-500 text-white"

:

"bg-white border border-gray-200"

}

`}

>

{index+1}

</button>


))

}







<button

disabled={page===totalPages}

onClick={()=>
setPage(page+1)
}

className="
w-10
h-10
rounded-xl
bg-white
border
border-gray-200
flex
items-center
justify-center
disabled:opacity-40
"

>

<FiChevronRight/>

</button>



</div>





}



</div>

</div>

);

}
