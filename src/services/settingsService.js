import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";


import {
  db
} from "../firebase/firestore";


import {
  notifyAdmin,
  NotificationTypes,
  NotificationPriority,
} from "./notificationService";




// SAVE SETTINGS

export const saveSettings = async(data)=>{

  try{

    await setDoc(

      doc(
        db,
        "settings",
        "store"
      ),

      data,

      {
        merge:true
      }

    );

   await notifyAdmin({
  title: "⚙️ Settings Updated",
  message: `Updated: ${Object.keys(data).join(", ")}`,
  type: NotificationTypes.SETTINGS,
  priority: NotificationPriority.MEDIUM,
  actionUrl: "/admin/settings",
  metadata: {
    updatedFields: Object.keys(data),
  },
}); 


  }
  catch(error){

    console.log(
      "Save settings error:",
      error
    );

    throw error;

  }

};



// GET SETTINGS

export const getSettings = async()=>{


  try{


    const snap = await getDoc(

      doc(
        db,
        "settings",
        "store"
      )

    );



    if(snap.exists()){

      return {

        storeName:"Dream Mode",

        ...snap.data(),

      };

    }



    return {

      storeName:"Dream Mode",

    };


  }
  catch(error){

    console.log(
      "Get settings error:",
      error
    );


    return {

      storeName:"Dream Mode",

    };

  }


};


// DISABLE MAINTENANCE

export const disableMaintenance = async()=>{

  try{

    await saveSettings({

      maintenanceMode:false,

    });


    await notifyAdmin({
  title: "🟢 Maintenance Disabled",
  message: "Maintenance mode has been disabled.",
  type: NotificationTypes.SETTINGS,
  priority: NotificationPriority.MEDIUM,
  actionUrl: "/admin/settings",
});


  }
  catch(error){

    console.log(
      "Disable maintenance error:",
      error
    );

    throw error;

  }

};
