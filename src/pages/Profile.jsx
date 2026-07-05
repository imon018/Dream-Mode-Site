import useAuth from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold">
        My Profile
      </h1>

      {user ? (
        <div className="mt-6 space-y-2">

          <p>Email: {user.email}</p>
          <p>User ID: {user.uid}</p>

        </div>
      ) : (
        <p>Please login</p>
      )}

    </div>
  );
}
