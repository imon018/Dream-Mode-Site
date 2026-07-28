import { useEffect, useRef, useState } from "react";
import { getCategories } from "../services/categoryService";

export default function CategoryBar({
  selectedCategory,
  onSelectCategory,
}) {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function load() {
      const data = await getCategories();
      setCategories(data);
    }

    load();
  }, []);

  // Auto Slide
  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    const interval = setInterval(() => {
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 5
      ) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        container.scrollBy({
          left: 90,
          behavior: "smooth",
        });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [categories]);

  return (
    <>
      <div
        ref={scrollRef}
        className="
          flex
          items-start
          gap-4
          overflow-x-auto
          whitespace-nowrap
          scroll-smooth
          px-1
        "
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* ALL */}

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
              overflow-hidden
              flex
              items-center
              justify-center
              transition-all
              duration-300
              ${
                selectedCategory === ""
                  ? "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,.35)]"
                  : "border-transparent"
              }
            `}
          >
            <span className="text-2xl">
              ✨
            </span>
          </div>

          <p
            className="
              mt-2
              text-xs
              font-semibold
              whitespace-nowrap
            "
          >
            All
          </p>
        </button>

        {/* CATEGORY */}

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
                overflow-hidden
                flex
                items-center
                justify-center
                transition-all
                duration-300
                ${
                  selectedCategory === category.name
                    ? "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,.35)]"
                    : "border-transparent"
                }
              `}
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                loading="lazy"
                className="
                  w-full
                  h-full
                  object-contain
                  p-2
                "
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

      {/* Hide Scrollbar */}

      <style>
        {`
          div::-webkit-scrollbar{
            display:none;
          }
        `}
      </style>
    </>
  );
}
