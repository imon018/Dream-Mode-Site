import { Link, useLocation } from "react-router-dom";

export default function VerifyEmail() {
  const location = useLocation();

  const email =
    location.state?.email || "";

  return (
    <div className="max-w-xl mx-auto py-20 px-6">

      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">

        <div className="text-6xl mb-6">
          📧
        </div>

        <h1 className="text-3xl font-bold mb-4">
          Check Your Email
        </h1>

        <p className="text-gray-600 mb-4">
          We've sent a verification link to:
        </p>

        <p className="font-semibold text-lg break-all mb-8">
          {email}
        </p>

        <p className="text-gray-500 mb-8">
          Please open your inbox and click the
          verification link before logging in.
        </p>

        <div className="flex flex-col gap-4">

          <Link
            to="/login"
            className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
          >
            Go To Login
          </Link>

          <Link
            to="/register"
            className="border py-3 rounded-xl"
          >
            Back To Register
          </Link>

        </div>

      </div>

    </div>
  );
}
