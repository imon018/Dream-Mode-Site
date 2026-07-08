import { useState } from "react";
import { Link } from "react-router-dom";

import Button from "../components/ui/Button";
import { forgotPassword } from "../services/authService";
import {
  successToast,
  errorToast,
} from "../components/ui/Toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      errorToast("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(email);

      successToast(
        "Password reset email sent. Please check your inbox."
      );

      setEmail("");
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-2">
        Forgot Password
      </h1>

      <p className="text-gray-500 mb-6">
        Enter your email to receive a password reset link.
      </p>

      <form
        onSubmit={handleReset}
        className="space-y-4"
      >
        <input
          type="email"
          className="w-full border p-3 rounded-xl"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading
            ? "Sending..."
            : "Send Reset Link"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-primary hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
