import useAuth from "../../hooks/useAuth";

export default function AdminProfile() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-2xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Admin Profile
      </h1>

      <div className="space-y-5">

        <div>

          <p className="text-gray-500">
            Email
          </p>

          <h2 className="text-xl font-semibold">
            {user?.email}
          </h2>

        </div>

        <div>

          <p className="text-gray-500">
            UID
          </p>

          <h2 className="text-lg break-all">
            {user?.uid}
          </h2>

        </div>

        <div>

          <p className="text-gray-500">
            Role
          </p>

          <span className="bg-blue-600 text-white px-4 py-2 rounded-full">
            Admin
          </span>

        </div>

      </div>

    </div>
  );
}
