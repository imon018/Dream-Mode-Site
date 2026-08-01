import { getAppliedVersion } from "./appliedVersion";
import { pushDebugLog } from "./debugOverlay";

export async function checkForUpdate() {
  try {
    const currentVersion = await getAppliedVersion();

    pushDebugLog("checkForUpdate: currentVersion=" + currentVersion);

    const res = await fetch(
      "https://www.dream-mode.shop/updates/version.json?t=" + Date.now()
    );

    pushDebugLog("checkForUpdate: fetch status=" + res.status);

    const remote = await res.json();

    pushDebugLog("checkForUpdate: remoteVersion=" + remote.version);

    if (remote.version !== currentVersion) {
      console.log(
        "New update available:",
        remote.version
      );

      pushDebugLog("checkForUpdate: hasUpdate=true");

      return { hasUpdate: true, version: remote.version };
    }

    console.log("App is latest version");
    pushDebugLog("checkForUpdate: hasUpdate=false (versions match)");
    return { hasUpdate: false, version: remote.version };

  } catch (error) {
    console.log(
      "Update check failed, using local app"
    );

    pushDebugLog("checkForUpdate: ERROR " + (error && error.message ? error.message : String(error)));

    return { hasUpdate: false, version: null };
  }
}
