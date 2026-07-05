export default function Login() {
  return (
    <div className="max-w-md mx-auto py-20">

      <h1 className="text-3xl font-bold mb-6">
        Login
      </h1>

      <form className="space-y-4">

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3"
        />

        <button
          className="w-full bg-primary text-white py-3 rounded-lg"
        >
          Login
        </button>

      </form>

    </div>
  );
}
