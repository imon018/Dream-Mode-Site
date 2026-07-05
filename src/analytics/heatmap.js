export function trackClick(x, y) {
  const clicks = JSON.parse(localStorage.getItem("dm_clicks")) || [];

  clicks.push({ x, y, time: new Date().toISOString() });

  localStorage.setItem("dm_clicks", JSON.stringify(clicks));
}
