import { useState } from "react";

import {
  loginWithGoogle,
} from "../../services/authService";

import {
  loginWithPasskey,
  isPasskeySupported,
} from "../../services/passkeyService";

import { FiKey } from "react-icons/fi";

import { errorToast } from "../ui/Toast";

// =========================
// GOOGLE "G" LOGO
// Official 4-color mark (not a single-color icon font glyph).
// =========================

function GoogleIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

// =========================
// SOCIAL LOGIN BUTTONS
// Shown under the Login / Register card.
// Calls onAuthenticated({ user, role, isNewUser, hasPassword })
// so the parent page can decide where to redirect.
// =========================

export default function SocialLoginButtons({ onAuthenticated }) {

  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleClick = async (providerFn, providerKey) => {

    if (loadingProvider) return;

    try {

      setLoadingProvider(providerKey);

      const result = await providerFn();

      onAuthenticated?.(result);

    } catch (error) {

      console.log("SOCIAL LOGIN ERROR:", error);

      let message = "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন.";

      if (error.code === "auth/popup-closed-by-user") {

        // User closed the popup themselves, no need to show an error.
        setLoadingProvider(null);
        return;

      } else if (error.code === "auth/account-exists-with-different-credential") {

        message =
          "এই email আগে থেকেই অন্য একটি sign-in পদ্ধতিতে ব্যবহৃত হয়েছে।";

      } else if (error.message === "PASSKEY_NOT_SETUP") {

        message =
          "Please Login your account and setup Passkey first.";

      } else if (error.message) {

        message = error.message;

      }

      errorToast(message);

    } finally {

      setLoadingProvider(null);

    }

  };

  return (
    <div className="space-y-3">

      {/* DIVIDER */}
      <div className="flex items-center gap-3 pt-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">অথবা</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* GOOGLE */}
      <button
        type="button"
        disabled={!!loadingProvider}
        onClick={() => handleClick(loginWithGoogle, "google")}
        className="
          w-full
          h-12
          rounded-lg
          border
          border-gray-200
          bg-white
          text-sm
          font-semibold
          text-gray-700
          flex
          items-center
          justify-center
          gap-2
          transition-all
          duration-200
          hover:bg-gray-50
          disabled:opacity-60
        "
      >
        <GoogleIcon size={18} />
        {loadingProvider === "google"
          ? "Connecting..."
          : "Continue with Google"}
      </button>

      {/* PASSKEY */}
      {isPasskeySupported() && (
        <button
          type="button"
          disabled={!!loadingProvider}
          onClick={() => handleClick(loginWithPasskey, "passkey")}
          className="
            w-full
            h-12
            rounded-lg
            border
            border-gray-200
            bg-white
            text-sm
            font-semibold
            text-gray-700
            flex
            items-center
            justify-center
            gap-2
            transition-all
            duration-200
            hover:bg-gray-50
            disabled:opacity-60
          "
        >
          <FiKey size={18} />
          {loadingProvider === "passkey"
            ? "Verifying..."
            : "Login with Passkey"}
        </button>
      )}

    </div>
  );

}
