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


      return result.url;
    }


    return null;


  } catch(error) {


    return null;
  }
}
