import { useEffect, useMemo, useState } from "react";

import {
  getLandingPages,
  deleteLandingPage,
} from "../../services/landingPageService";

import MobileLandingPages from "./components/MobileLandingPages";
import DesktopLandingPages from "./components/DesktopLandingPages";

export default function LandingPages() {
  const [landingPages, setLandingPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

const itemsPerPage = 10;

  useEffect(() => {
    loadLandingPages();
  }, []);


	useEffect(() => {
  setCurrentPage(1);
}, [search]);


	

  async function loadLandingPages() {
    try {
      const data = await getLandingPages();

      setLandingPages(data);
    } catch (error) {
    console.error(error);
  } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteLandingPage(deleteId);

      setDeleteId(null);

      loadLandingPages();
    } catch (error) {
    console.error(error);
  }
  }

  const filteredLandingPages = useMemo(() => {
    return landingPages.filter((landing) => {
      const title = landing.title?.toLowerCase() || "";

      const slug = landing.slug?.toLowerCase() || "";

      return (
        title.includes(search.toLowerCase()) ||
        slug.includes(search.toLowerCase())
      );
    });
  }, [landingPages, search]);


  const totalPages = Math.ceil(
  filteredLandingPages.length / itemsPerPage
);

const paginatedLandingPages = filteredLandingPages.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm text-amber-600 font-semibold">
        Loading Landing Pages...
      </div>
    );
  }

  const landingData = {
    landingPages: paginatedLandingPages,

    currentPage,
    
		setCurrentPage,
    
		totalPages,

    search,

    setSearch,

    handleDelete,

    setDeleteId,

    reload: loadLandingPages,
  };

  return (
    <>
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[320px]">

            <h2 className="font-bold text-lg">
              Delete Landing Page?
            </h2>

            <p className="my-3 text-gray-500">
              Are you sure you want to delete this Landing Page?
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 h-11 rounded-lg bg-gray-200"
              >
                No
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 h-11 rounded-lg bg-red-500 text-white"
              >
                Yes
              </button>

            </div>

          </div>
        </div>
      )}

      {/* MOBILE */}

      <div className="lg:hidden">

        <MobileLandingPages

          data={landingData}

        />

      </div>

      {/* DESKTOP */}

      <div className="hidden lg:block">

        <DesktopLandingPages

          data={landingData}

        />

      </div>




		{totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-6 mb-6">

    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
      className="px-4 py-2 rounded-lg border disabled:opacity-40"
    >
      Previous
    </button>

    {[...Array(totalPages)].map((_, index) => {
      const pageNumber = index + 1;

      const showPage =
        pageNumber === 1 ||
        pageNumber === totalPages ||
        Math.abs(pageNumber - currentPage) <= 1;

      const showDots =
        (pageNumber === 2 && currentPage > 4) ||
        (pageNumber === totalPages - 1 &&
          currentPage < totalPages - 3);

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
          onClick={() => setCurrentPage(pageNumber)}
          className={`w-10 h-10 rounded-lg font-bold ${
            currentPage === pageNumber
              ? "bg-amber-500 text-white"
              : "bg-white border border-gray-200"
          }`}
        >
          {pageNumber}
        </button>
      );
    })}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(currentPage + 1)}
      className="px-4 py-2 rounded-lg border disabled:opacity-40"
    >
      Next
    </button>

  </div>
)}




		
    </>
  );
}
