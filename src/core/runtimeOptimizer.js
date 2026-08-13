export function optimizeRuntime() {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
    });
  }
}
