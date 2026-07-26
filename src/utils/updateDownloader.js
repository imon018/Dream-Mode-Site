import { Filesystem, Directory } from "@capacitor/filesystem";


const UPDATE_URL =
  "https://www.dream-mode.shop/updates/app.zip";


export async function downloadUpdate() {

  try {

    console.log("Downloading update...");


    const response = await fetch(
      UPDATE_URL + "?t=" + Date.now()
    );


    const blob = await response.blob();


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


    return true;


  } catch(error){

    console.log(
      "Download failed",
      error
    );

    return false;
  }
}
