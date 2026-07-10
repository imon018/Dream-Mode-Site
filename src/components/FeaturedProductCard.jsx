import { useNavigate } from "react-router-dom";

export default function FeaturedProductCard({
  product,
}) {

  const navigate =
    useNavigate();

  return (

    <div
      onClick={() =>
        navigate(
          `/product/${product.id}`
        )
      }
      className="
        group
        cursor-pointer
        bg-white
        rounded-[22px]
        overflow-hidden
        border
        border-amber-500/30
        shadow-[0_0_20px_rgba(245,158,11,.12)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_0_20px_rgba(245,158,11,.25)]
      "
    >

      {/* IMAGE */}

      <div className="relative">

        <img
          src={
            product.image ||
            "https://via.placeholder.com/600"
          }
          alt={product.name}
          className="
            w-full
            h-32
            md:h-52
            object-cover
            transition
            duration-500
            group-hover:scale-105
          "
        />

        <div
          className="
            absolute
            top-2
            left-2
            px-2
            py-1
            rounded-full
            bg-gradient-to-r
            from-amber-300
            to-amber-500
            text-black
            text-[9px]
            md:text-xs
            font-bold
          "
        >
          Premium
        </div>

      </div>

      {/* CONTENT */}

      <div className="p-3 md:p-4">

        <h3
          className="
            text-xs
            md:text-base
            font-bold
            text-slate-900
            line-clamp-1
          "
        >
          {product.name}
        </h3>

        <div
          className="
            mt-2
            flex
            items-center
            justify-between
          "
        >

          <span
            className="
              text-amber-600
              font-bold
              text-sm
              md:text-lg
            "
          >
            ৳ {product.price}
          </span>

          <span
            className="
              text-[10px]
              md:text-xs
              text-slate-500
            "
          >
            View
          </span>

        </div>

      </div>

    </div>

  );

}
