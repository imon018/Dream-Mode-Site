import { useEffect, useState } from "react";
import {
  isOffline,
  onOffline,
  onOnline,
  removeOffline,
  removeOnline,
} from "../mobile/offlineMode";

export default function NoInternet() {
  const [offline, setOffline] = useState(isOffline());

  useEffect(() => {
    const offlineHandler = () => setOffline(true);
    const onlineHandler = () => setOffline(false);

    onOffline(offlineHandler);
    onOnline(onlineHandler);

    return () => {
      removeOffline(offlineHandler);
      removeOnline(onlineHandler);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white">
      <div className="text-center px-6">
        <div className="text-6xl mb-4">📶</div>

        <h2 className="text-2xl font-bold mb-3">
          No Internet Connection
        </h2>

        <p className="text-gray-500 mb-6">
          Please check your internet connection.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
