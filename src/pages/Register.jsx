import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { successToast, errorToast } from "../components/ui/Toast";
import Button from "../components/ui/Button";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const data = await register(email, password);
      console.log("REGISTER SUCCESS:", data);

      // show toast, wait briefly so toast can appear, then navigate
      successToast("Account Created Successfully");
      await new Promise((r) => setTimeout(r, 500));
      navigate("/profile");

    } catch (err) {
      console.log("REGISTER FAILED:", err);
      errorToast(err.message || "Registration failed");
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

        <Button type="submit" className="w-full">
          Register
        </Button>

      </form>

    </div>
  );
}
