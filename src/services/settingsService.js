import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";


import {
  db
} from "../firebase/firestore";




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

      return snap.data();

    }



    return null;


  }
  catch(error){

    console.log(
      "Get settings error:",
      error
    );


    throw error;

  }


};
