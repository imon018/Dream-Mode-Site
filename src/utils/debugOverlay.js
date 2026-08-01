// The on-screen debug overlay has been switched off now that the OTA
// update flow is confirmed working. pushDebugLog() is still called
// from updateManager.js / updateChecker.js / updateDownloader.js /
// appliedVersion.js / main.jsx, so rather than touching every one of
// those files again, this just quietly logs to the console instead of
// drawing anything on screen.

export function pushDebugLog(message) {
  console.log("[update-debug]", message);
}
