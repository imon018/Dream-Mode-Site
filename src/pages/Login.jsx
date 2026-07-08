import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  login,
  logout,
  resendVerificationEmail,
} from "../services/authService";

import {
  successToast,
  errorToast,
} from "../components/ui/Toast";

import Button from "../components/ui/Button";

export default function Login() {
  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [unverifiedUser, setUnverifiedUser] =
    useState(null);

  const handleLogin = async (
    e
  ) => {
    e.preventDefault();

    try {
      const result =
        await login(
          email,
          password
        );

      await result.user.reload();

      if (
        !result.user.emailVerified
      ) {
        setUnverifiedUser(
          result.user
        );

        await logout();

        errorToast(
          "Please verify your email first."
        );

        return;
      }

      successToast(
        "Login Successful"
      );

      navigate("/profile");
    } catch (err) {
      errorToast(
        err.message
      );
    }
  };

  const handleResendVerification =
    async () => {
      try {
        if (!unverifiedUser)
          return;

        await resendVerificationEmail(
          unverifiedUser
        );

        successToast(
          "Verification email sent again."
        );
      } catch (err) {
        errorToast(
          err.message
        );
      }
    };

  return (
    <div className="max-w-md mx-auto py-20">

      <h1 className="text-3xl font-bold mb-6">
        Login
      </h1>

      <form
        onSubmit={handleLogin}
        className="space-y-4"
      >
        <input
          className="w-full border p-3 rounded-xl"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          className="w-full border p-3 rounded-xl"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <Button
          type="submit"
          className="w-full"
        >
          Login
        </Button>

        {unverifiedUser && (
          <button
            type="button"
            onClick={
              handleResendVerification
            }
            className="w-full text-blue-600 font-medium mt-3"
          >
            Resend Verification Email
          </button>
        )}
      </form>

    </div>
  );
}
