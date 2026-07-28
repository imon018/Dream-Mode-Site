import { Capacitor } from "@capacitor/core";

import { checkForUpdate } from "./updateChecker";
import { downloadUpdate } from "./updateDownloader";
import { setAppliedVersion } from "./appliedVersion";

import UpdateLoader from "../plugins/UpdateLoader";
import LocalServer from "../plugins/LocalServer";


export async function runUpdateManager() {

  try {

    if (!Capacitor.isNativePlatform()) {
      return null;
    }


    const { hasUpdate, version } =
      await checkForUpdate();


    if (!hasUpdate) {

      console.log(
        "No update required"
      );

      return null;
    }



    console.log(
      "Downloading new frontend..."
    );


    const downloaded =
      await downloadUpdate();



    if (!downloaded) {

      return null;

    }



    const extracted =
      await UpdateLoader.extractUpdate();



    if (!extracted.success) {

      console.log(
        "Extraction failed"
      );

      return null;
    }



    const server =
      await LocalServer.startServer();



    if(server.available) {


      if (version) {
        await setAppliedVersion(version);
      }


      console.log(
        "Update applied:",
        server.url
      );


      return server.url;

    }



    return null;



  } catch(error) {


    console.log(
      "Update manager failed",
      error
    );


    return null;

  }

}
