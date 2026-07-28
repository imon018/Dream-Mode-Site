import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";

export default function CategoryBar({
  selectedCategory,
  onSelectCategory,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getCategories();
      setCategories(data);
    }

    load();
  }, []);

  return (
    <div
      className="
        flex
        gap-4
        overflow-x-auto
        py-2
        px-1
        scrollbar-hide
      "
    >
      {/* All */}
      <button
        onClick={() => onSelectCategory("")}
        className="
          flex
          flex-col
          items-center
          shrink-0
        "
      >
        <div
          className={`
            w-16
            h-16
            rounded-full
            bg-white
            shadow-md
            border-2
            transition-all
            duration-300
            flex
            items-center
            justify-center
            ${
              selectedCategory === ""
                ? "border-amber-500 shadow-[0_0_18px_rgba(245,158,11,.35)]"
                : "border-transparent"
            }
          `}
        >
          <span className="text-xl">
            ✨
          </span>
        </div>

        <p
          className="
            mt-2
            text-xs
            font-semibold
          "
        >
          All
        </p>
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() =>
            onSelectCategory(category.name)
          }
          className="
            flex
            flex-col
            items-center
            shrink-0
          "
        >
          <div
            className={`
              w-16
              h-16
              rounded-full
              bg-white
              shadow-md
              border-2
              transition-all
              duration-300
              flex
              items-center
              justify-center
              overflow-hidden
              ${
                selectedCategory === category.name
                  ? "border-amber-500 shadow-[0_0_18px_rgba(245,158,11,.35)]"
                  : "border-transparent"
              }
            `}
          >
            <img
              src={category.imageUrl}
              alt={category.name}
              className="
                w-full
                h-full
                object-contain
                p-2
              "
              loading="lazy"
            />
          </div>

          <p
            className="
              mt-2
              text-xs
              font-semibold
              whitespace-nowrap
            "
          >
            {category.name}
          </p>
        </button>
      ))}
    </div>
  );
}
