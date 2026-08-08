import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  startPageView,
  initVisitorTrackingLifecycle,
} from "../utils/visitorTracking";

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    initVisitorTrackingLifecycle();
  }, []);

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-B1N6B2GPCG", {
        page_path: location.pathname + location.search,
      });
    }

    // এই পেজে ভিজিটর কতক্ষণ থাকে সেটা ট্র্যাক করা শুরু হয় —
    // Admin AI Assistant পরে এই ডেটা দেখতে পারবে।
    startPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

export default AnalyticsTracker;
