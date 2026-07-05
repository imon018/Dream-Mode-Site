export function isOffline() {
  return !navigator.onLine;
}

window.addEventListener("offline", () => {
  console.log("Offline mode");
});
