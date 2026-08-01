// Temporary on-screen debug overlay for diagnosing the OTA update flow
// directly on the phone (no computer / logcat needed). Shows the last
// few log lines in a small fixed box at the bottom of the screen.
//
// Safe to leave in: it only ever renders once something calls
// pushDebugLog(), and every call site that does so is already gated
// behind Capacitor.isNativePlatform() in updateManager.js, so it never
// shows up on the live website - only inside the Android app.

const lines = [];
let container = null;

function ensureContainer() {
  if (container) return container;

  container = document.createElement("div");

  container.style.cssText = [
    "position:fixed",
    "left:0",
    "right:0",
    "bottom:0",
    "z-index:999999",
    "max-height:40vh",
    "overflow-y:auto",
    "background:rgba(0,0,0,0.85)",
    "color:#0f0",
    "font-family:monospace",
    "font-size:10px",
    "line-height:1.4",
    "padding:6px 8px",
    "white-space:pre-wrap",
    "word-break:break-word",
    "pointer-events:none",
  ].join(";");

  document.body.appendChild(container);

  return container;
}

export function pushDebugLog(message) {
  try {
    const time = new Date().toISOString().split("T")[1].replace("Z", "");
    const line = `[${time}] ${message}`;

    lines.push(line);

    if (lines.length > 30) {
      lines.shift();
    }

    const el = ensureContainer();
    el.textContent = lines.join("\n");
  } catch (e) {
    // Never let the debug overlay itself break the app.
  }
}
