import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#faf7f2]">

      <div className="container-box py-20 lg:py-32">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          <div>

            <span className="inline-block px-5 py-2 rounded-full bg-white shadow">
              Premium Collection 2026
            </span>

            <h1 className="mt-6 text-5xl lg:text-7xl font-bold leading-tight">

              Elevate Your Style
              <br />

              With Dream Mode

            </h1>

            <p className="mt-6 text-gray-600 text-lg">

              Discover elegant fashion and premium
              collections crafted for modern women.

            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">

              <Link
                to="/shop"
                className="primary-btn text-center"
              >
                Shop Collection
              </Link>

              <a
                href="https://wa.me/"
                className="outline-btn text-center"
              >
                WhatsApp Order
              </a>

            </div>

          </div>

          <div>

            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b"
              alt=""
              className="rounded-[35px] shadow-premium object-cover h-[600px]"
            />

          </div>

        </div>

      </div>

    </section>
  );
}
