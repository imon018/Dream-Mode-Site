import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../services/authService";

import {
  successToast,
  errorToast,
} from "../components/ui/Toast";

import Button from "../components/ui/Button";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      errorToast("Please fill in all fields.");
      return;
    }

    try {
      await register(
        name,
        email,
        password
      );

      successToast(
        "Verification email sent."
      );

      navigate("/verify-email", {
        state: { email },
      });
    } catch (err) {
      errorToast(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-6">

      <h1 className="text-3xl font-bold mb-6">
        Create Account
      </h1>

      <form
        onSubmit={handleRegister}
        className="space-y-4"
      >

        <input
          className="w-full border p-3 rounded-xl"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          className="w-full border p-3 rounded-xl"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          className="w-full border p-3 rounded-xl"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <Button
          type="submit"
          className="w-full"
        >
          Register
        </Button>

      </form>

    </div>
  );
}
