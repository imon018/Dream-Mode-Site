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
    loading
  } = useSettings();


  const {
    user
  } = useAuth();




  if(loading){

    return null;

  }




  const isAdmin =
    user?.role === "admin";




  const endTime =
    settings?.maintenanceEndTime
    ?
    new Date(
      settings.maintenanceEndTime
    ).getTime()
    :
    null;




  const maintenanceExpired =
    endTime &&
    Date.now() >= endTime;





  if(
    settings?.maintenanceMode
    &&
    !maintenanceExpired
    &&
    !isAdmin
  ){

    return (
      <MaintenancePage/>
    );

  }





  return children;


}
