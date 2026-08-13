export default function Testimonials() {
  const reviews = [
    {
      name: "Nusrat",
      review:
        "Amazing quality and super fast delivery.",
    },
    {
      name: "Mim",
      review:
        "Beautiful collection and premium packaging.",
    },
    {
      name: "Tania",
      review:
        "Exactly as shown in the pictures.",
    },
  ];

  return (
    <section className="py-20 bg-[#faf7f2]">
      <div className="container-box">
        <h2 className="section-title text-center">
          Customer Reviews
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-14">
          {reviews.map((item, index) => (
            <div
              key={index}
              className="premium-card p-8"
            >
              <div className="text-yellow-500 text-xl">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="mt-4 text-gray-600">
                &quot;{item.review}&quot;
              </p>

              <h4 className="mt-6 font-semibold">
                {item.name}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
