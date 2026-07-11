import { useEffect, useState } from "react";

import Button from "../../components/ui/Button";

import {
  uploadSingleImage,
} from "../../services/uploadService";

import {
  getShopHeroBanner,
  saveShopHeroBanner,
} from "../../services/firestoreShopHeroService";

import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";

export default function ShopHeroBanner() {
  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const loadBanner =
      async () => {
        const banner =
          await getShopHeroBanner();

        if (banner?.imageUrl) {
          setPreview(
            banner.imageUrl
          );
        }
      };

    loadBanner();
  }, []);

  const handleImageChange = (
    e
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (!image) {
        errorToast(
          "Please select a banner image."
        );
        return;
      }

      try {
        setLoading(true);

        const uploaded =
          await uploadSingleImage(
            image
          );

        await saveShopHeroBanner({
          imageUrl:
            uploaded.imageUrl,

          publicId:
            uploaded.publicId,

          updatedAt:
            new Date(),
        });

        successToast(
          "Shop Hero Banner Updated Successfully!"
        );

      } catch (err) {
        errorToast(
          err.message ||
            "Upload failed."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-2">
        Shop Hero Banner
      </h1>

      <p className="text-gray-500 mb-8">
        Upload one premium banner.
        It will automatically appear
        on the Shop page.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div
          className="
            rounded-3xl
            overflow-hidden
            border
            bg-white
            shadow
          "
        >

          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="
                w-full
                h-auto
                block
              "
            />
          ) : (
            <div
              className="
                h-72
                flex
                items-center
                justify-center
                text-gray-400
              "
            >
              No Banner Selected
            </div>
          )}

        </div>

        <div>

          <label className="font-medium block mb-2">
            Upload Banner
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImageChange
            }
          />

          <p className="text-sm text-gray-500 mt-2">
            Recommended Size:
            <br />
            Desktop: 1536 × 801 px
            <br />
            Landscape Banner
          </p>

        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading
            ? "Uploading..."
            : "Save Shop Hero Banner"}
        </Button>

      </form>

    </div>
  );
}
