export function trackRevenue(amount) {
  let revenue = Number(localStorage.getItem("dm_revenue")) || 0;

  revenue += amount;

  localStorage.setItem("dm_revenue", revenue);
}
