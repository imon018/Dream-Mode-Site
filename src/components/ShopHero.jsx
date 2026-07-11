import {
  useEffect,
  useState,
} from "react";

import {
  getShopHeroBanner,
} from "../services/firestoreShopHeroService";

import Spinner from "./Spinner";

export default function ShopHero() {
  const [banner, setBanner] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadBanner =
      async () => {
        try {
          const data =
            await getShopHeroBanner();

          setBanner(data);
        } finally {
          setLoading(false);
        }
      };

    loadBanner();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (!banner?.imageUrl) {
    return null;
  }

  return (
    <section
      className="
        w-full
        mb-8
        overflow-hidden
      "
    >
      <img
        src={banner.imageUrl}
        alt="Shop Hero Banner"
        className="
          block
          w-full
          h-auto
          select-none
        "
        draggable={false}
      />
    </section>
  );
}
