import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiGlobe,
} from "react-icons/fi";

import {
  getLandingPages,
  deleteLandingPage,
} from "../../../services/landingPageService";

import {
  successToast,
  errorToast,
} from "../../../components/ui/Toast";

export default function LandingPages() {

  const navigate = useNavigate();

  const [landingPages, setLandingPages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadLandingPages();
  }, []);

  async function loadLandingPages() {

    try {

      const data = await getLandingPages();

      setLandingPages(data);

    }

    catch (error) {

      console.log(error);

    }

    finally {

      setLoading(false);

    }

  }

  async function handleDelete() {

    try {

      await deleteLandingPage(deleteId);

      successToast("Landing deleted");

      setDeleteId(null);

      loadLandingPages();

    }

    catch (error) {

      console.log(error);

      errorToast("Delete failed");

    }

  }

  const filteredLanding = useMemo(() => {

    return landingPages.filter(item => {

      const title =
        item.title?.toLowerCase() || "";

      return title.includes(
        search.toLowerCase()
      );

    });

  }, [landingPages, search]);

  if (loading) {

    return (

      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      font-bold
      ">

        Loading...

      </div>

    );

  }

  return (

<div className="
min-h-screen
bg-[#FAF9F6]
p-4
lg:p-6
space-y-5
">

{/* HEADER */}

<div className="
flex
items-center
justify-between
">

<div>

<h1 className="
text-2xl
font-black
">

Landing Pages

</h1>

<p className="
text-sm
text-gray-500
">

Facebook Landing Pages

</p>

</div>

<button

onClick={()=>
navigate("/admin/landing/create")
}

className="
h-11
px-5
rounded-xl
bg-amber-500
text-white
font-bold
flex
items-center
gap-2
"

>

<FiPlus/>

Create

</button>

</div>

{/* SEARCH */}

<div className="
relative
">

<FiSearch

className="
absolute
left-4
top-1/2
-translate-y-1/2
text-gray-400
"

/>

<input

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

placeholder="Search landing..."

className="
w-full
h-12
rounded-xl
border
pl-11
pr-4
outline-none
bg-white
"

/>

</div>

{/* MOBILE */}

<div className="
lg:hidden
space-y-3
">

{

filteredLanding.map(item=>(

<div

key={item.id}

className="
bg-white
rounded-xl
border
p-4
space-y-3
"

>

<div className="
flex
justify-between
">

<h2 className="
font-black
">

{item.title}

</h2>

<span className={`

text-xs
px-3
py-1
rounded-full

${

item.status==="published"

?

"bg-green-100 text-green-700"

:

"bg-yellow-100 text-yellow-700"

}

`}>

{item.status}

</span>

</div>

<p className="
text-sm
text-gray-500
">

Offer Price

</p>

<p className="
font-bold
text-lg
">

৳ {item.offerPrice}

</p>

<div className="
grid
grid-cols-4
gap-2
">

<button

className="
h-10
rounded-lg
bg-blue-50
"

onClick={()=>

navigator.clipboard.writeText(

`${window.location.origin}/landing/${item.slug}`

)

}

>

<FiCopy className="mx-auto"/>

</button>

<button

className="
h-10
rounded-lg
bg-green-50
"

>

<FiGlobe className="mx-auto"/>

</button>

<button

onClick={()=>

navigate(`/admin/landing/edit/${item.id}`)

}

className="
h-10
rounded-lg
bg-yellow-50
"

>

<FiEdit2 className="mx-auto"/>

</button>

<button

onClick={()=>
setDeleteId(item.id)
}

className="
h-10
rounded-lg
bg-red-50
text-red-600
"

>

<FiTrash2 className="mx-auto"/>

</button>

</div>

</div>

))

}

</div>

{/* DESKTOP */}

<div className="
hidden
lg:block
bg-white
rounded-xl
overflow-hidden
border
">

<table className="
w-full
">

<thead className="
bg-gray-50
">

<tr>

<th className="px-5 py-3 text-left">

Title

</th>

<th>

Offer

</th>

<th>

Status

</th>

<th>

Slug

</th>

<th>

Action

</th>

</tr>

</thead>

<tbody>

{

filteredLanding.map(item=>(

<tr

key={item.id}

className="
border-t
"

>

<td className="px-5 py-4">

{item.title}

</td>

<td>

৳ {item.offerPrice}

</td>

<td>

{item.status}

</td>

<td>

{item.slug}

</td>

<td>

<div className="
flex
gap-2
">

<button

onClick={()=>{

navigator.clipboard.writeText(

`${window.location.origin}/landing/${item.slug}`

);

successToast("Link copied");

}}

className="
w-9
h-9
rounded-lg
bg-blue-50
"

>

<FiCopy className="mx-auto"/>

</button>

<button

onClick={()=>

navigate(`/admin/landing/edit/${item.id}`)

}

className="
w-9
h-9
rounded-lg
bg-yellow-50
"

>

<FiEdit2 className="mx-auto"/>

</button>

<button

onClick={()=>
setDeleteId(item.id)
}

className="
w-9
h-9
rounded-lg
bg-red-50
text-red-600
"

>

<FiTrash2 className="mx-auto"/>

</button>

</div>

</td>

</tr>

))

}

</tbody>

</table>

</div>

{

deleteId &&

<div className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
z-50
">

<div className="
bg-white
rounded-xl
p-6
w-[320px]
">

<h2 className="
font-bold
text-lg
">

Delete Landing?

</h2>

<p className="
text-sm
text-gray-500
mt-2
">

Are you sure?

</p>

<div className="
flex
gap-3
mt-5
">

<button

onClick={()=>
setDeleteId(null)
}

className="
flex-1
h-11
rounded-lg
bg-gray-200
"

>

Cancel

</button>

<button

onClick={handleDelete}

className="
flex-1
h-11
rounded-lg
bg-red-500
text-white
"

>

Delete

</button>

</div>

</div>

</div>

}

</div>

  );

}
