import { Link } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";

import { toggleLandingPageStatus } from "../../../services/landingPageService";

export default function DesktopLandingPages({ data }) {
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
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-[#faf9f6] min-h-screen p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h1 className="text-3xl font-black text-slate-900">
            Landing Pages
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage all Facebook Landing Pages
          </p>

        </div>

        <Link
  to="/admin/landing/create"
  className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center gap-2"
>
  <FiPlus />
  Create Landing
</Link>

      </div>

      {/* Search */}

      <div className="relative mb-6">

        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Landing Page..."
          className="w-full h-12 bg-white border border-gray-200 rounded-xl pl-11 pr-4 outline-none"
        />

      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-5 py-4 text-left text-xs text-gray-500">
                Landing
              </th>

              <th className="px-5 py-4 text-left text-xs text-gray-500">
                Slug
              </th>

              <th className="px-5 py-4 text-center text-xs text-gray-500">
                Status
              </th>

              <th className="px-5 py-4 text-center text-xs text-gray-500">
                Views
              </th>

              <th className="px-5 py-4 text-center text-xs text-gray-500">
                Orders
              </th>

              <th className="px-5 py-4 text-center text-xs text-gray-500">
                Revenue
              </th>

              <th className="px-5 py-4 text-center text-xs text-gray-500">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {landingPages.map((landing) => (

              <tr
                key={landing.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-5 py-4">

                  <div className="flex items-center gap-3">

                    <img
                      src={landing.heroImage}
                      alt={landing.title}
                      className="w-14 h-14 rounded-lg object-cover"
                    />

                    <div>

                      <h2 className="font-bold text-slate-900">
                        {landing.title}
                      </h2>

                      <p className="text-xs text-gray-500">
                        {landing.productName || "No Product"}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  /landing/{landing.slug}
                </td>

                <td className="px-5 py-4 text-center">

                  <select
                    value={landing.status}
                    onChange={(e) =>
                      changeStatus(
                        landing.id,
                        e.target.value
                      )
                    }
                    className={`px-3 py-2 rounded-lg text-xs font-bold outline-none
                      ${
                        landing.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>

                  </select>

                </td>

                <td className="px-5 py-4 text-center font-semibold">
                  {landing.views || 0}
                </td>

                <td className="px-5 py-4 text-center font-semibold">
                  {landing.orders || 0}
                </td>

                <td className="px-5 py-4 text-center font-bold text-green-600">
                  ৳ {landing.revenue || 0}
                </td>

                <td className="px-5 py-4">

                  <div className="flex justify-center gap-2">

                    <a
                      href={`/landing/${landing.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"
                    >
                      <FiEye />
                    </a>

                    <Link
                      to={`/admin/landing-pages/edit/${landing.id}`}
                      className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"
                    >
                      <FiEdit2 />
                    </Link>

                    <button
                      onClick={() => setDeleteId(landing.id)}
                      className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"
                    >
                      <FiTrash2 />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

            {landingPages.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="py-10 text-center text-gray-400"
                >
                  No Landing Pages Found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
