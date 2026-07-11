import { useEffect, useState } from "react";

import {
  getShopHeroBanner,
} from "../services/firestoreShopHeroService";

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
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadBanner();
  }, []);

  if (loading) {
    return (
      <div
        className="
          w-full
          bg-gray-100
          animate-pulse
          aspect-[1536/801]
        "
      />
    );
  }

  if (!banner?.imageUrl) {
    return null;
  }

  return (
    <section className="w-full bg-white">

      <div
        className="
          w-full
          max-w-7xl
          mx-auto
          px-4
          md:px-6
          py-4
        "
      >

        <img
          src={banner.imageUrl}
          alt="Shop Hero Banner"
          className="
            w-full
            h-auto
            object-contain
            rounded-3xl
            shadow-lg
            block
          "
          loading="lazy"
        />

      </div>

    </section>
  );
}
