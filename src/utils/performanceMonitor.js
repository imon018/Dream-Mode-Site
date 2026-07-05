export function startPerformanceMonitor() {
  console.time("app-load");

  window.addEventListener("load", () => {
    console.timeEnd("app-load");
  });
}
