import { Filesystem, Directory } from "@capacitor/filesystem";
import { pushDebugLog } from "./debugOverlay";


const UPDATE_URL =
  "https://www.dream-mode.shop/updates/app.zip";


export async function downloadUpdate() {

  try {

    console.log("Downloading update...");
    pushDebugLog("downloadUpdate: fetching app.zip...");


    const response = await fetch(
      UPDATE_URL + "?t=" + Date.now()
    );

    pushDebugLog("downloadUpdate: fetch status=" + response.status);


    const blob = await response.blob();

    pushDebugLog("downloadUpdate: blob size=" + blob.size + " bytes, type=" + blob.type);


    const reader = new FileReader();


    const base64 = await new Promise(
      (resolve, reject) => {

        reader.onloadend = () => {
          resolve(
            reader.result.split(",")[1]
          );
        };

        reader.onerror = reject;

        reader.readAsDataURL(blob);
      }
    );


    await Filesystem.writeFile({

      path: "updates/app.zip",

      data: base64,

      directory: Directory.Data,

      recursive: true

    });


    console.log(
      "Update downloaded"
    );

    pushDebugLog("downloadUpdate: written to Filesystem OK");


    return true;


  } catch(error){

    console.log(
      "Download failed",
      error
    );

    pushDebugLog("downloadUpdate: ERROR " + (error && error.message ? error.message : String(error)));

    return false;
  }
}
