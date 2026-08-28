// প্রোডাক্ট লোড হওয়ার সময় দেখানোর জন্য Skeleton কার্ড।
// ProductCard.jsx এর সাইজ/শেপের সাথে মিলিয়ে বানানো হয়েছে, যাতে
// লোডিং থেকে আসল কন্টেন্টে বদল হওয়ার সময় লেআউট হুট করে না লাফায়।

export default function ProductCardSkeleton({ compact = false }) {

  return (

    <div
      className={`
        bg-white
        overflow-hidden
        border
        border-amber-500/10
        animate-pulse
        ${
          compact
          ?
          "rounded-[24px]"
          :
          "rounded-[32px] shadow-lg"
        }
      `}
    >

      {/* IMAGE PLACEHOLDER */}

      <div
        className="
          w-full
          aspect-[3/4]
          bg-gray-200
        "
      />

      {/* CONTENT PLACEHOLDER */}

      <div
        className={`
          ${
            compact
            ?
            "p-3"
            :
            "p-5"
          }
          -mt-[14px]
          relative
          z-20
          bg-white
          rounded-t-[22px]
          shadow-[0_-8px_25px_rgba(0,0,0,.08)]
          space-y-3
        `}
      >

        <div
          className="
            h-4
            w-3/4
            rounded-full
            bg-gray-200
          "
        />

        <div
          className="
            h-4
            w-1/3
            rounded-full
            bg-gray-200
          "
        />

        {
          !compact && (

            <div
              className="
                h-3
                w-full
                rounded-full
                bg-gray-200
              "
            />

          )
        }

        <div
          className="
            flex
            gap-2
            pt-1
          "
        >

          <div
            className="
              h-8
              w-1/2
              rounded-lg
              bg-gray-200
            "
          />

          <div
            className="
              h-8
              w-1/2
              rounded-xl
              bg-gray-200
            "
          />

        </div>

      </div>

    </div>

  );

}


// এক সাথে একগুচ্ছ Skeleton কার্ড বসানোর জন্য শর্টকাট — গ্রিড
// লোডিং স্টেটে ব্যবহার করার জন্য (যেমন: Shop পেজ, ক্যাটাগরি
// লিস্টিং)।

export function ProductCardSkeletonGrid({ count = 8, compact = false }) {

  return (

    <>

      {
        Array.from({ length: count }).map(
          (_, index) => (

            <ProductCardSkeleton
              key={index}
              compact={compact}
            />

          )
        )
      }

    </>

  );

}
