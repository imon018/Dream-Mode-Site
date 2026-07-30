import { useState } from "react";

import { FaGoogle } from "react-icons/fa";

import {
  loginWithGoogle,
} from "../../services/authService";

import { errorToast } from "../ui/Toast";

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
        <FaGoogle className="text-[#EA4335]" size={16} />
        {loadingProvider === "google"
          ? "Connecting..."
          : "Continue with Google"}
      </button>

    </div>
  );

}
