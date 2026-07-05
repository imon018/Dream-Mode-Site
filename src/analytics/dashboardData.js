import { getFunnel } from "./funnelAnalysis";

export function getDashboardData() {
  return {
    funnel: getFunnel(),
    revenue: Number(localStorage.getItem("dm_revenue")) || 0
  };
}
