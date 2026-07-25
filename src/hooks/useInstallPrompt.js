import { useEffect, useState } from "react";

export default function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    const isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;

    if (isInstalled) {
      setInstallable(false);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();

    const choice =
      await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setInstallable(false);
      setDeferredPrompt(null);
    }

    return choice.outcome === "accepted";
  };

  return {
    installable,
    install,
  };
}
