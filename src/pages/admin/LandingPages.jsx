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

  useEffect(() => {
    loadLandingPages();
  }, []);

  async function loadLandingPages() {
    try {
      const data = await getLandingPages();

      setLandingPages(data);
    } catch (error) {
      console.log(error);
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
      console.log(error);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm text-amber-600 font-semibold">
        Loading Landing Pages...
      </div>
    );
  }

  const landingData = {
    landingPages: filteredLandingPages,

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
    </>
  );
}
