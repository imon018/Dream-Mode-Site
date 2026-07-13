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





export function SettingsProvider({ children }) {



  const [settings, setSettings] = useState({

    storeName: "Dream Mode",

    email: "",

    phone: "",

    address: "",

    facebook: "",

    whatsapp: "",

    logoUrl: "",

    logoPublicId: "",

    maintenanceMode: false,

  });





  const [loading, setLoading] = useState(true);







  useEffect(() => {


    const loadSettings = async () => {


      try {


        const data = await getSettings();



        if (data) {


          setSettings(prev => ({

            ...prev,

            ...data

          }));


        }


      }
      catch(error) {


        console.log(
          "Settings load error:",
          error
        );


      }
      finally {


        setLoading(false);


      }


    };



    loadSettings();



  }, []);









  return (


    <SettingsContext.Provider


      value={{

        settings,

        loading,

      }}


    >


      {children}


    </SettingsContext.Provider>


  );


}








export function useSettings(){


  return useContext(SettingsContext);


}
