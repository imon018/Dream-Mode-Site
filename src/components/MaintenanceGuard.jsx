import {
  useSettings,
} from "../context/SettingsContext";


import useAuth from "../hooks/useAuth";


import MaintenancePage from "./MaintenancePage";



export default function MaintenanceGuard({
  children
}){


  const {
    settings,
    loading,
  } = useSettings();



  const {
    user,
  } = useAuth();





  if(loading){

    return null;

  }





  const isAdmin =
    user?.role === "admin";





  // ADMIN কখনো maintenance page দেখবে না

  if(isAdmin){

    return children;

  }







  // Maintenance ON থাকলে

  if(settings.maintenanceMode){


    // যদি end time দেওয়া থাকে

    if(settings.maintenanceEndTime){


      const endTime =
        new Date(
          settings.maintenanceEndTime
        ).getTime();



      const now =
        Date.now();



      // সময় শেষ হয়ে গেলে site চালু

      if(now >= endTime){


        return children;


      }


    }




    return (

      <MaintenancePage />

    );


  }






  return children;


}
