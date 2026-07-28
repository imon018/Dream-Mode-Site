import { getAppliedVersion } from "./appliedVersion";

export async function checkForUpdate() {
  try {
    const currentVersion = await getAppliedVersion();

    const res = await fetch(
      "https://www.dream-mode.shop/updates/version.json?t=" + Date.now()
    );

    const remote = await res.json();

    if (remote.version !== currentVersion) {
      console.log(
        "New update available:",
        remote.version
      );

      return { hasUpdate: true, version: remote.version };
    }

    console.log("App is latest version");
    return { hasUpdate: false, version: remote.version };

  } catch (error) {
    console.log(
      "Update check failed, using local app"
    );

    return { hasUpdate: false, version: null };
  }
}
