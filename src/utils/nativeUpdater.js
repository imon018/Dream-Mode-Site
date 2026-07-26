import { Capacitor } from "@capacitor/core";
import LocalServer from "../plugins/LocalServer";


export async function getNativeUpdatePath() {

  try {

    if (!Capacitor.isNativePlatform()) {
      return null;
    }


    const result =
      await LocalServer.startServer();


    if (result.available) {

      console.log(
        "Using local update server:",
        result.url
      );

      return result.url;
    }


    return null;


  } catch(error) {

    console.log(
      "Native update server failed",
      error
    );

    return null;
  }
}
