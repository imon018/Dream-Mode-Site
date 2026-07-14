import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";


import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";


import {
  auth
} from "../firebase/auth";


import {
  db
} from "../firebase/firestore";


import {
  createAdminNotification,
  createUserNotification,
} from "../utils/notificationHelper";


import {
  sendNotification,
} from "./notificationService";





// =================================
// GET STORE NAME
// =================================

const getStoreName = async()=>{

  try{


    const settingsDoc =
    await getDoc(
      doc(
        db,
        "settings",
        "store"
      )
    );



    if(
      settingsDoc.exists()
    ){

      return (
        settingsDoc.data().storeName ||
        "Dream Mode"
      );

    }



    return "Dream Mode";


  }
  catch(error){

    console.log(
      "Store name load error:",
      error
    );


    return "Dream Mode";

  }


};









// =================================
// LOGIN
// =================================

export const login = async(
  email,
  password
)=>{


  const result =
  await signInWithEmailAndPassword(
    auth,
    email,
    password
  );



  const userRef =
  doc(
    db,
    "users",
    result.user.uid
  );



  await setDoc(

    userRef,

    {

      lastLogin:
      serverTimestamp(),

    },

    {
      merge:true,
    }

  );





  // Login Security Notification

  await createUserNotification({

    userId:
    result.user.uid,


    title:
    "🔐 New Login Detected",


    message:
    "Your account was logged in successfully.",


    type:
    "system",

  });





  return result;


};









// =================================
// REGISTER
// =================================


export const register = async(
  name,
  email,
  password
)=>{


  try{


    const result =
    await createUserWithEmailAndPassword(

      auth,

      email,

      password

    );





    await sendEmailVerification(
      result.user
    );





    const userRef =
    doc(
      db,
      "users",
      result.user.uid
    );





    // Save User Data

    await setDoc(

      userRef,

      {

        name,

        email:
        result.user.email,


        phone:"",

        address:"",

        photoURL:"",

        role:"user",


        createdAt:
        serverTimestamp(),

      }

    );







    const storeName =
    await getStoreName();







    // Welcome Notification


    await sendNotification({

      receiverId:
      result.user.uid,


      title:
      `Welcome to ${storeName} 🎉`,


      message:
      `Thank you for joining ${storeName}. Enjoy your shopping experience.`,


      type:
      "system",

    });








    // Extra User Notification


    await createUserNotification({

      userId:
      result.user.uid,


      title:
      `🎉 Welcome to ${storeName}`,


      message:
      `Your ${storeName} account has been created successfully.`,


      type:
      "system",

    });









    // Admin Notification


    await createAdminNotification({

      title:
      "👤 New User Registered",


      message:
      `${name} created a new account.`,


      type:
      "system",

    });








    return result;



  }

  catch(error){


    console.error(
      error
    );


    throw error;


  }


};









// =================================
// RESEND EMAIL VERIFICATION
// =================================


export const resendVerificationEmail =
async(user)=>{


  await sendEmailVerification(
    user
  );


};









// =================================
// FORGOT PASSWORD
// =================================


export const forgotPassword =
async(email)=>{


  await sendPasswordResetEmail(
    auth,
    email
  );


};









// =================================
// CHANGE PASSWORD
// =================================


export const changePassword =
async(
  user,
  newPassword
)=>{


  await updatePassword(
    user,
    newPassword
  );


};









// =================================
// SEND VERIFICATION
// =================================


export const sendVerificationEmail =
async(user)=>{


  await sendEmailVerification(
    user
  );


};









// =================================
// DELETE ACCOUNT
// =================================


export const deleteUserAccount =
async(user)=>{


  await deleteUser(
    user
  );


};









// =================================
// LOGOUT
// =================================


export const logout = ()=>{


  return signOut(
    auth
  );


};
