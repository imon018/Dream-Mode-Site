import { useEffect, useState } from "react";

import {
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiShield,
  FiUser,
  FiX,
  FiLoader,
} from "react-icons/fi";


import {
  getUsers,
  changeRole,
  deleteUser,
} from "../../services/adminService";



export default function Users() {


  const [users,setUsers] =
    useState([]);


  const [loading,setLoading] =
    useState(true);


  const [search,setSearch] =
    useState("");


  const [roleFilter,setRoleFilter] =
    useState("all");

  const [filterOpen, setFilterOpen] = useState(false);


  const [selectedUser,setSelectedUser] =
    useState(null);


  const [showAction,setShowAction] =
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






  async function toggleAdmin(user){


    try{


      await changeRole(

        user.id,

        user.role==="admin"
        ?
        "user"
        :
        "admin"

      );


      await loadUsers();


      setShowAction(false);


    }
    catch(error){

      console.log(error);

    }


  }






  async function removeUser(user){

const confirmDelete = window.confirm(
  `Are you sure you want to delete ${user.email}?`
);


if(!confirmDelete){
  return;
}


try{

  await deleteUser(user.id);

  await loadUsers();

  setShowAction(false);

  setSelectedUser(null);


}catch(error){

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

<div className="
min-h-screen
bg-[#F8F5EF]
p-4
lg:p-8
">


{/* Header */}

<div className="mb-6">


<h1 className="
text-3xl
font-bold
text-slate-800
">

Users

</h1>



<p className="
text-sm
text-gray-500
mt-1
">

Dashboard
<span className="mx-2">
›
</span>
Users

</p>


</div>





{/* Stats */}

<div className="
grid
grid-cols-4
gap-2
mb-6
">


<div className="
bg-white
rounded-2xl
p-3
shadow-sm
">

<div className="
w-8
h-8
rounded-xl
bg-orange-50
text-orange-500
flex
items-center
justify-center
mb-3
">

<FiUser size={22}/>

</div>


<p className="
text-[10px]
text-gray-500
">

Total Users

</p>


<h2 className="
text-xl
font-bold
">

{totalUsers}

</h2>


</div>






<div className="
bg-white
rounded-2xl
p-4
shadow-sm
">


<div className="
w-10
h-10
rounded-xl
bg-amber-50
text-amber-500
flex
items-center
justify-center
mb-3
">

<FiShield size={22}/>

</div>


<p className="
text-xs
text-gray-500
">

Admins

</p>


<h2 className="
text-2xl
font-bold
">

{totalAdmins}

</h2>


</div>






<div className="
bg-white
rounded-2xl
p-4
shadow-sm
">


<div className="
w-10
h-10
rounded-xl
bg-green-50
text-green-500
flex
items-center
justify-center
mb-3
">

<FiShield size={22}/>

</div>



<p className="
text-xs
text-gray-500
">

Active Users

</p>



<h2 className="
text-2xl
font-bold
">

{totalActive}

</h2>


</div>






<div className="
bg-white
rounded-2xl
p-4
shadow-sm
">


<div className="
w-10
h-10
rounded-xl
bg-blue-50
text-blue-500
flex
items-center
justify-center
mb-3
">

<FiUser size={22}/>

</div>



<p className="
text-xs
text-gray-500
">

New Users

</p>



<h2 className="
text-2xl
font-bold
">

0

</h2>


</div>



</div>







{/* Search */}


<div className="
relative
mb-4
">


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
bg-white
rounded-xl
py-3
pl-11
pr-4
border
border-gray-200
outline-none
focus:ring-2
focus:ring-amber-400
"

/>


</div>







{/* Role Filter */}


<div className="relative mb-5">


<button

onClick={()=>setFilterOpen(!filterOpen)}

className="
w-full
bg-white
border
border-gray-200
rounded-xl
px-4
py-3
flex
items-center
justify-between
text-slate-700
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
filterOpen && (

<div

className="
absolute
top-14
left-0
right-0
bg-white
border
border-gray-200
rounded-xl
shadow-lg
z-20
overflow-hidden
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
hover:bg-amber-50
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
hover:bg-amber-50
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
hover:bg-amber-50
"

>

Users

</button>



</div>

)

}


</div>






{/* Loading */}


{
loading &&

<div className="
bg-white
rounded-2xl
p-10
flex
justify-center
">

<FiLoader
className="animate-spin"
size={30}
/>


</div>

}






{/* Empty */}


{
!loading &&
currentUsers.length===0 &&

<div className="
bg-white
rounded-2xl
p-10
text-center
text-gray-500
">

No Users Found

</div>

}






{/* User List */}


{
!loading &&

<div className="
bg-white
rounded-2xl
overflow-hidden
shadow-sm
">


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


<div className="
flex
items-center
gap-3
min-w-0
">


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
"

/>


<div className="min-w-0">


<h3 className="
font-semibold
text-slate-800
truncate
">

{
user.name ||
"User"
}

</h3>



<p className="
text-xs
text-gray-500
truncate
">

{user.email}

</p>


</div>


</div>





<div className="
flex
items-center
gap-2
">


<button
onClick={()=>{
  setSelectedUser(user);
  setShowAction(true);
}}
className={`
text-xs
px-3
py-1
rounded-lg
font-medium

${
user.role==="admin"
?
"bg-amber-50 text-amber-600"
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

</button>




<button

onClick={()=>{

setSelectedUser(user);

setShowAction(true);

}}

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

  
{/* Pagination */}


{
totalPages > 1 &&

<div className="
flex
justify-center
items-center
gap-2
mt-6
">


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
font-medium

${
page===index+1

?

"bg-amber-500 text-white"

:

"bg-white border"

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







{/* Action Bottom Sheet */}



{

showAction &&
selectedUser &&

<div

className="
fixed
inset-0
bg-black/40
z-50
flex
items-end
"


onClick={()=>
setShowAction(false)
}


>


<div

onClick={(e)=>
e.stopPropagation()
}


className="
w-full
bg-white
rounded-t-3xl
p-6
space-y-3
"


>


<div className="
flex
items-center
justify-between
mb-4
">


<h2 className="
font-bold
text-lg
text-slate-800
truncate
">

{selectedUser.email}

</h2>




<button

onClick={()=>
setShowAction(false)
}

className="
w-9
h-9
rounded-full
bg-gray-100
flex
items-center
justify-center
"

>

<FiX/>

</button>


</div>







<button

onClick={()=>
toggleAdmin(selectedUser)
}

className="
w-full
py-4
rounded-xl
bg-amber-50
text-amber-600
flex
items-center
gap-3
px-4
font-medium
"

>


<FiShield/>


{
selectedUser.role==="admin"

?

"Remove Admin"

:

"Make Admin"

}


</button>








<button

onClick={()=>removeUser(user)}

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

<FiTrash2/>

</button>








<button

onClick={()=>
setShowAction(false)
}

className="
w-full
py-4
rounded-xl
bg-gray-100
text-gray-700
"

>

Cancel

</button>





</div>


</div>


}





</div>

  );

}
