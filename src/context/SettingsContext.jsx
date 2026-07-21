import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";


import {
  getSettings
} from "../services/settingsService";



const SettingsContext = createContext();



export function SettingsProvider({
  children
}) {


  const [settings,setSettings] = useState({

    storeName:"",

    email:"",

    phone:"",

    address:"",

    websiteUrl:"",

    facebook:"",

    whatsapp:"",

    logoUrl:"",

    logoPublicId:"",

    maintenanceMode:false,

    maintenanceEndTime:"",

  });



  const [loading,setLoading] =
  useState(true);





  useEffect(()=>{


    const loadSettings =
    async()=>{


      try{


        const data =
        await getSettings();



        if(data){


          setSettings(prev=>({

            ...prev,

            ...data

          }));

        }



      }
      catch(error){

        console.log(
          "Settings load error:",
          error
        );

      }
      finally{

        setLoading(false);

      }


    };



    loadSettings();



  },[]);





  // AUTO CHECK MAINTENANCE TIME

  const isMaintenanceActive = ()=>{


    if(!settings.maintenanceMode){

      return false;

    }



    if(!settings.maintenanceEndTime){

      return true;

    }



    const end =
    new Date(
      settings.maintenanceEndTime
    ).getTime();



    const now =
    Date.now();



    return now < end;



  };






  return (

    <SettingsContext.Provider

      value={{

        settings,

        loading,

        isMaintenanceActive,

      }}

    >

      {children}

    </SettingsContext.Provider>


  );


}






export function useSettings(){

  return useContext(SettingsContext);

}
