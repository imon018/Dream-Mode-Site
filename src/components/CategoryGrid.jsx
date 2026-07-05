const categories = [
  "Electronics",
  "Fashion",
  "Beauty",
  "Home",
  "Sports",
  "Gaming"
];

export default function CategoryGrid() {
  return (
    <section className="py-20 bg-gray-50">

      <h2 className="text-3xl font-bold text-center mb-12">
        Shop by Category
      </h2>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-6">

        {categories.map((cat, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition text-center font-semibold"
          >
            {cat}
          </div>
        ))}

      </div>

    </section>
  );
}
