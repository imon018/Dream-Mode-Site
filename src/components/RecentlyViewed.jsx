import ProductCard from "./ProductCard";

import useRecentlyViewed from "../hooks/useRecentlyViewed";


// এই কম্পোনেন্টটা যেকোনো পেজে বসানো যাবে (Home, Product Details
// ইত্যাদি)। localStorage-এ কিছু না থাকলে (নতুন ভিজিটর, বা এখনো
// কোনো প্রোডাক্ট দেখা হয়নি) কিছুই রেন্ডার করবে না — তাই খালি
// সেকশন দেখা যাবে না।

export default function RecentlyViewed({

  excludeId,
  title = "সম্প্রতি যা দেখেছেন",

}) {


  const { recentlyViewed } =
    useRecentlyViewed(excludeId);


  if(!recentlyViewed.length){

    return null;

  }


  return (

    <div
      className="
        mt-12
      "
    >

      <h2
        className="
          text-2xl
          font-black
          text-[#172033]
          text-center
          mb-5
        "
      >

        🕘 {title}

      </h2>


      <div
        className="
          flex
          gap-4
          overflow-x-auto
          pb-3

          [&::-webkit-scrollbar]:h-1.5
          [&::-webkit-scrollbar-thumb]:bg-amber-500/40
          [&::-webkit-scrollbar-thumb]:rounded-full
        "
      >

        {
          recentlyViewed.map(
            (item) => (

              <div
                key={item.id}
                className="
                  min-w-[150px]
                  w-[150px]
                  md:min-w-[190px]
                  md:w-[190px]
                  shrink-0
                "
              >

                <ProductCard
                  product={item}
                  compact={true}
                />

              </div>

            )
          )
        }

      </div>

    </div>

  );

}
