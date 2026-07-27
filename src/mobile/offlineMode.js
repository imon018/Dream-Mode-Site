export function isOffline() {
  return !navigator.onLine;
}

export function onOffline(callback) {
  window.addEventListener("offline", callback);
}

export function onOnline(callback) {
  window.addEventListener("online", callback);
}

export function removeOffline(callback) {
  window.removeEventListener("offline", callback);
}

export function removeOnline(callback) {
  window.removeEventListener("online", callback);
}
