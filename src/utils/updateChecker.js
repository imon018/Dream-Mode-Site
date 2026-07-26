import { APP_VERSION } from "./appVersion";

export async function checkForUpdate() {
  try {
    const res = await fetch(
      "https://www.dream-mode.shop/updates/version.json?t=" + Date.now()
    );

    const remote = await res.json();

    if (remote.version !== APP_VERSION) {
      console.log(
        "New update available:",
        remote.version
      );

      return true;
    }

    console.log("App is latest version");
    return false;

  } catch (error) {
    console.log(
      "Update check failed, using local app"
    );

    return false;
  }
}
