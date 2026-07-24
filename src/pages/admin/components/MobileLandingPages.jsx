import { Link } from "react-router-dom";

import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiShare2,
} from "react-icons/fi";

import { toggleLandingPageStatus } from "../../../services/landingPageService";

export default function MobileLandingPages({ data }) {
  const {
    landingPages,
    search,
    setSearch,
    setDeleteId,
    reload,
  } = data;

  async function changeStatus(id, status) {
    try {
      await toggleLandingPageStatus(id, status);
      reload();
    } catch (err) {
      console.log(err);
    }
  }

  async function shareLanding(slug) {

  const url = `${window.location.origin}/landing/${slug}`;

  if (navigator.share) {

    await navigator.share({
      title: "Dream Mode Landing Page",
      url,
    });

  } else {

    await navigator.clipboard.writeText(url);

    alert("Link copied!");

  }

}

  return (
    <div className="bg-[#faf9f6] min-h-screen p-3">

      {/* Header */}

      <div className="flex items-center justify-between mb-4">

        <h1 className="text-2xl font-black">
          Landing Pages
        </h1>

        <Link
  to="/admin/landing/create"
  className="h-10 px-3 rounded-lg bg-amber-500 text-white flex items-center gap-2"
>
  <FiPlus />
  
</Link>

      </div>

      {/* Search */}

      <div className="relative mb-4">

        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Search Landing..."
          className="w-full h-11 bg-white border rounded-lg pl-10 pr-4"
        />

      </div>

      {/* Cards */}

      <div className="space-y-3">

        {landingPages.map((landing)=>(

          <div
            key={landing.id}
            className="bg-white rounded-lg border p-4 shadow-sm"
          >

            <div className="flex gap-3">

              <img
  src={landing.heroImages?.[0] || landing.heroImage}
  alt={landing.title}
  className="w-20 h-20 rounded-lg object-cover"
/>

              <div className="flex-1">

                <h2 className="font-bold text-slate-900">
                  {landing.title}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  /landing/{landing.slug}
                </p>

                <div className="mt-2">

                  <select
                    value={landing.status}
                    onChange={(e)=>
                      changeStatus(
                        landing.id,
                        e.target.value
                      )
                    }
                    className="text-xs bg-amber-50 rounded-lg px-2 py-1"
                  >

                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>

                  </select>

                </div>

              </div>

            </div>

            <div className="grid grid-cols-4 gap-2 mt-4">

              <a
                href={`/landing/${landing.slug}`}
                target="_blank"
                rel="noreferrer"
                className="h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"
              >
                <FiEye />
              </a>

              <Link
                to={`/admin/landing/edit/${landing.id}`}
                className="h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"
              >
                <FiEdit2 />
              </Link>

              <button
                onClick={()=>setDeleteId(landing.id)}
                className="h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"
              >
                <FiTrash2 />
              </button>

              <button
  onClick={() => shareLanding(landing.slug)}
  className="h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"
>
  <FiShare2 />
</button>

            </div>

          </div>

        ))}

        {
          landingPages.length===0 && (

            <div className="bg-white rounded-lg p-10 text-center text-gray-400">

              No Landing Pages Found

            </div>

          )
        }

      </div>

    </div>
  );
}
