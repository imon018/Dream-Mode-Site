import { trackEvent } from "./userBehaviorTracker";

export function initAI() {
  trackEvent("AI_INIT", { status: "ready" });
  console.log("AI System Loaded");
}
