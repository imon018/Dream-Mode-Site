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


    const { hasUpdate, version } =
      await checkForUpdate();


    if (!hasUpdate) {

      console.log(
        "No update required"
      );

      pushDebugLog("runUpdateManager: no update needed, stopping here");

      return null;
    }



    console.log(
      "Downloading new frontend..."
    );


    const downloaded =
      await downloadUpdate();



    if (!downloaded) {

      pushDebugLog("runUpdateManager: download failed, stopping here");

      return null;

    }


    pushDebugLog("runUpdateManager: calling native extractUpdate()...");

    const extracted =
      await UpdateLoader.extractUpdate();

    pushDebugLog("runUpdateManager: extractUpdate result=" + JSON.stringify(extracted));



    if (!extracted.success) {

      console.log(
        "Extraction failed"
      );

      pushDebugLog("runUpdateManager: extraction failed, stopping here");

      return null;
    }


    pushDebugLog("runUpdateManager: calling native startServer()...");

    const server =
      await LocalServer.startServer();

    pushDebugLog("runUpdateManager: startServer result=" + JSON.stringify(server));



    if(server.available) {


      if (version) {
        await setAppliedVersion(version);
      }


      console.log(
        "Update applied:",
        server.url
      );

      pushDebugLog("runUpdateManager: SUCCESS, redirecting to " + server.url);


      return server.url;

    }


    pushDebugLog("runUpdateManager: server not available, stopping here");

    return null;



  } catch(error) {


    console.log(
      "Update manager failed",
      error
    );

    pushDebugLog("runUpdateManager: ERROR " + (error && error.message ? error.message : String(error)));


    return null;

  }

}
