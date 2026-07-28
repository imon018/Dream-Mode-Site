import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

import { APP_VERSION } from "./appVersion";


const VERSION_FILE = "updates/applied-version.json";


export async function getAppliedVersion() {

  try {

    const result = await Filesystem.readFile({
      path: VERSION_FILE,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });

    const parsed = JSON.parse(result.data);

    if (parsed && parsed.version) {
      return parsed.version;
    }

    return APP_VERSION;

  } catch (error) {

    // No applied-update record yet, this is the version baked
    // into the installed APK itself.
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

  } catch (error) {

    console.log(
      "Failed to persist applied OTA version",
      error
    );

    return false;
  }
}
