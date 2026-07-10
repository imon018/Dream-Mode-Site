import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Button from "./ui/Button";
import RelatedProducts from "./RelatedProducts";

import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";

import {
  getProductById,
} from "../services/firestoreProductService";

export default function ProductDetailsView() {
  const { id } = useParams();

  const { addToCart } = useCart();
  const { addToWishlist } =
    useWishlist();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [selectedImage,
    setSelectedImage] =
    useState("");

  const [zoom, setZoom] =
    useState(false);

  useEffect(() => {
    const loadProduct =
      async () => {
        const data =
          await getProductById(id);

        setProduct(data);

        if (
          data?.images?.length > 0
        ) {
          setSelectedImage(
            data.images[0]
          );
        } else {
          setSelectedImage(
            data.image
          );
        }

        setLoading(false);
      };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-lg">
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center text-red-600 text-2xl">
        Product Not Found
      </div>
    );
  }

  const galleryImages =
    product.images?.length > 0
      ? product.images
      : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

        {/* IMAGE SECTION */}

        <div>

          <div
            className="
              bg-white
              rounded-[32px]
              overflow-hidden
              shadow-2xl
              border
              border-slate-100
              relative
              cursor-zoom-in
            "
            onMouseEnter={() =>
              setZoom(true)
            }
            onMouseLeave={() =>
              setZoom(false)
            }
          >

            <img
              src={selectedImage}
              alt={product.name}
              className={`
                w-full
                object-cover
                transition-all
                duration-700
                ${
                  zoom
                    ? "scale-125"
                    : "scale-100"
                }
              `}
            />

            <div
              className="
                absolute
                bottom-4
                right-4
                bg-slate-900/80
                text-white
                text-xs
                px-4
                py-2
                rounded-full
                backdrop-blur
              "
            >
              🔍 Zoom
            </div>

          </div>

          {galleryImages.length > 1 && (

            <div className="flex gap-3 mt-5 flex-wrap">

              {galleryImages.map(
                (img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt=""
                    onClick={() =>
                      setSelectedImage(img)
                    }
                    className={`
                      w-20
                      h-20
                      md:w-24
                      md:h-24
                      object-cover
                      rounded-2xl
                      cursor-pointer
                      border-2
                      transition-all
                      duration-300
                      hover:scale-105
                      ${
                        selectedImage === img
                          ? "border-yellow-500 shadow-lg"
                          : "border-gray-200"
                      }
                    `}
                  />
                )
              )}

            </div>

          )}

        </div>

        {/* PRODUCT INFO */}

        <div className="flex flex-col justify-center">

          <div
            className="
            inline-flex
            w-fit
            px-5
            py-2
            rounded-full
            bg-gradient-to-r
            from-yellow-400
            to-yellow-500
            text-slate-900
            text-sm
            font-semibold
          "
          >
            ✨ Premium Collection
          </div>

          <h1
            className="
            text-4xl
            md:text-5xl
            lg:text-6xl
            font-black
            mt-5
            leading-tight
          "
          >
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mt-4">

            <span className="text-yellow-500">
              ⭐⭐⭐⭐⭐
            </span>

            <span className="text-gray-500 text-sm">
              (4.9 Rating)
            </span>

          </div>

          <div className="mt-6">

            <span
              className="
              text-4xl
              md:text-5xl
              font-black
              bg-gradient-to-r
              from-blue-700
              to-yellow-500
              bg-clip-text
              text-transparent
            "
            >
              ৳ {product.price}
            </span>

          </div>

          <div className="mt-5">

            {product.stock > 0 ? (
              <span
                className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-green-100
                text-green-700
                font-semibold
              "
              >
                ✓ In Stock ({product.stock})
              </span>
            ) : (
              <span
                className="
                inline-flex
                px-4
                py-2
                rounded-full
                bg-red-100
                text-red-600
                font-semibold
              "
              >
                Out Of Stock
              </span>
            )}

          </div>

          <div
            className="
            mt-8
            p-6
            rounded-[24px]
            bg-slate-50
            border
            border-slate-200
          "
          >

            <h3 className="font-bold text-lg mb-3">
              Description
            </h3>

            <p className="text-gray-600 leading-8">
              {product.description}
            </p>

          </div>

          <div className="flex flex-wrap gap-4 mt-8">

            <Button
              onClick={() =>
                addToCart(product)
              }
            >
              Add To Cart
            </Button>

            <button
              onClick={() =>
                addToWishlist(product)
              }
              className="
                px-6
                py-3
                rounded-xl
                border
                border-slate-300
                hover:bg-slate-100
                transition
              "
            >
              Wishlist
            </button>

          </div>

        </div>

      </div>

      <RelatedProducts
        currentId={product.id}
      />

    </div>
  );
}
