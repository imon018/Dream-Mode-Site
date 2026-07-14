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
  setDoc,
  serverTimestamp,
} from "firebase/firestore";


import { auth } from "../firebase/auth";
import { db } from "../firebase/firestore";


import {
  sendNotification,
} from "./notificationService";




// =========================
// LOGIN
// =========================

export const login = async (
  email,
  password
) => {


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



  return result;

};









// =========================
// REGISTER
// =========================

export const register = async (
  name,
  email,
  password
) => {


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







    // =========================
    // ADMIN NOTIFICATION
    // =========================


    await sendNotification({

      title:
        "New User Registration",


      message:
        `${name} created a new account.`,


      userId:
        "admin",


      type:
        "user_register",

    });







    return result;



  }
  catch(error){


    console.error(error);

    throw error;


  }


};









// =========================
// RESEND VERIFICATION
// =========================

export const resendVerificationEmail =
async(user)=>{


  await sendEmailVerification(
    user
  );


};









// =========================
// FORGOT PASSWORD
// =========================

export const forgotPassword =
async(email)=>{


  await sendPasswordResetEmail(
    auth,
    email
  );


};









// =========================
// CHANGE PASSWORD
// =========================

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









// =========================
// SEND VERIFICATION
// =========================

export const sendVerificationEmail =
async(user)=>{


  await sendEmailVerification(
    user
  );


};









// =========================
// DELETE ACCOUNT
// =========================

export const deleteUserAccount =
async(user)=>{


  await deleteUser(
    user
  );


};









// =========================
// LOGOUT
// =========================

export const logout =
()=>signOut(auth);
