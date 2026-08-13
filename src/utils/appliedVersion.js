import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

import { APP_VERSION } from "./appVersion";
import { pushDebugLog } from "./debugOverlay";


const VERSION_FILE = "updates/applied-version.json";


export async function getAppliedVersion() {

  pushDebugLog("getAppliedVersion: APP_VERSION (baked in APK)=" + APP_VERSION);

  try {

    const result = await Filesystem.readFile({
      path: VERSION_FILE,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });

    const parsed = JSON.parse(result.data);

    if (parsed && parsed.version) {
      pushDebugLog("getAppliedVersion: found applied-version.json=" + parsed.version);
      return parsed.version;
    }

    return APP_VERSION;

  } catch (_error) {

    // No applied-update record yet, this is the version baked
    // into the installed APK itself.
    pushDebugLog("getAppliedVersion: no applied-version.json, using APP_VERSION");
    return APP_VERSION;
  }
}


export async function setAppliedVersion(version) {

  try {

    await Filesystem.writeFile({
      path: VERSION_FILE,
      data: JSON.stringify({ version }),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
      recursive: true,
    });

    return true;

  } catch (_error) {


    return false;
  }
}
