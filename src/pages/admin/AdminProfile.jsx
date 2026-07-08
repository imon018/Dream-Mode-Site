import useAuth from "../../hooks/useAuth";

export default function AdminProfile() {
  const { user } = useAuth();

  const createdAt = user?.metadata?.creationTime
    ? new Date(
        user.metadata.creationTime
      ).toLocaleString()
    : "N/A";

  const lastLogin = user?.metadata?.lastSignInTime
    ? new Date(
        user.metadata.lastSignInTime
      ).toLocaleString()
    : "N/A";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="bg-slate-900 text-white p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">

            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold">
              {user?.email?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Admin Profile
              </h1>

              <p className="text-gray-300 mt-2">
                {user?.email}
              </p>

              <span className="inline-block mt-3 bg-blue-600 px-4 py-2 rounded-full text-sm">
                Administrator
              </span>
            </div>

          </div>
        </div>

        <div className="p-8">

          <div className="grid md:grid-cols-2 gap-6">

            <div className="border rounded-xl p-5">
              <p className="text-gray-500 mb-2">
                Email Address
              </p>

              <h2 className="font-semibold break-all">
                {user?.email}
              </h2>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-gray-500 mb-2">
                User ID
              </p>

              <h2 className="break-all text-sm">
                {user?.uid}
              </h2>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-gray-500 mb-2">
                Account Created
              </p>

              <h2>
                {createdAt}
              </h2>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-gray-500 mb-2">
                Last Login
              </p>

              <h2>
                {lastLogin}
              </h2>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-gray-500 mb-2">
                Email Verified
              </p>

              <h2>
                {user?.emailVerified
                  ? "Yes"
                  : "No"}
              </h2>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-gray-500 mb-2">
                Role
              </p>

              <span className="bg-blue-600 text-white px-4 py-2 rounded-full">
                Admin
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
