import { Capacitor } from "@capacitor/core";

import { checkForUpdate } from "./updateChecker";
import { downloadUpdate } from "./updateDownloader";
import { setAppliedVersion } from "./appliedVersion";
import { pushDebugLog } from "./debugOverlay";

import UpdateLoader from "../plugins/UpdateLoader";
import LocalServer from "../plugins/LocalServer";


export async function runUpdateManager() {

  try {

    if (!Capacitor.isNativePlatform()) {
      return null;
    }

    pushDebugLog("runUpdateManager: started");


    // Whether we should serve the local OTA package at all this launch.
    // This used to only become true when a NEWER version was detected,
    // which meant that once the locally applied version caught up with
    // the remote version, every later cold launch skipped straight past
    // the update check and just sat on whatever the WebView loaded by
    // default - the OLD content baked into the installed APK at build
    // time. A previously-applied update package sitting on disk was
    // never re-served on its own. Now we check for that package
    // independently and serve it regardless of whether today's check
    // finds anything new.
    let shouldServe = false;


    const existing = await UpdateLoader.checkUpdate();

    pushDebugLog("runUpdateManager: existing local package=" + JSON.stringify(existing));

    if (existing.available) {
      shouldServe = true;
    }


    const { hasUpdate, version } =
      await checkForUpdate();


    if (!hasUpdate) {


      pushDebugLog("runUpdateManager: no newer update (shouldServe=" + shouldServe + ")");

    } else {



      const downloaded =
        await downloadUpdate();


      if (!downloaded) {

        pushDebugLog("runUpdateManager: download failed, keeping previous local package if any");

      } else {

        pushDebugLog("runUpdateManager: calling native extractUpdate()...");

        const extracted =
          await UpdateLoader.extractUpdate();

        pushDebugLog("runUpdateManager: extractUpdate result=" + JSON.stringify(extracted));


        if (!extracted.success) {


          pushDebugLog("runUpdateManager: extraction failed, keeping previous local package if any");

        } else {

          shouldServe = true;

          if (version) {
            await setAppliedVersion(version);
          }
        }
      }
    }


    if (!shouldServe) {

      pushDebugLog("runUpdateManager: nothing to serve, staying on bundled app");

      return null;
    }


    pushDebugLog("runUpdateManager: calling native startServer()...");

    const server =
      await LocalServer.startServer();

    pushDebugLog("runUpdateManager: startServer result=" + JSON.stringify(server));


    if (server.available) {


      pushDebugLog("runUpdateManager: SUCCESS, redirecting to " + server.url);

      return server.url;
    }


    pushDebugLog("runUpdateManager: server not available, stopping here");

    return null;



  } catch(error) {



    pushDebugLog("runUpdateManager: ERROR " + (error && error.message ? error.message : String(error)));


    return null;

  }

}
