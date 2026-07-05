import { useState } from "react";
import { register } from "../services/authService";
import { successToast, errorToast } from "../components/ui/Toast";
import Button from "../components/ui/Button";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await register(email, password);
      successToast("Account Created Successfully");
    } catch (err) {
      errorToast(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20">

      <h1 className="text-3xl font-bold mb-6">
        Create Account
      </h1>

      <form onSubmit={handleRegister} className="space-y-4">

        <input
          className="w-full border p-3 rounded-xl"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-3 rounded-xl"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="w-full">
          Register
        </Button>

      </form>

    </div>
  );
}
