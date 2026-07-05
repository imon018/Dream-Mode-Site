import Button from "./ui/Button";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-white py-20">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-10">

        <div>

          <h1 className="text-5xl font-bold leading-tight">
            Shop Smart with <span className="text-primary">Dream Mode</span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg">
            AI Powered Premium E-Commerce Experience for Modern Shopping.
          </p>

          <div className="mt-8 flex gap-4">

            <Link to="/shop">
              <Button>Start Shopping</Button>
            </Link>

            <Link to="/register">
              <button className="border border-primary px-6 py-3 rounded-xl">
                Join Now
              </button>
            </Link>

          </div>

        </div>

        <div className="flex justify-center">
          <img
            src="https://picsum.photos/600"
            className="rounded-3xl shadow-xl"
            alt="hero"
          />
        </div>

      </div>

    </section>
  );
}
