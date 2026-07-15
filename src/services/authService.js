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
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";


import {
  auth
} from "../firebase/auth";


import {
  db
} from "../firebase/firestore";




// =========================
// LOGIN
// =========================

export async function login(
  email,
  password
){

  const result =
  await signInWithEmailAndPassword(
    auth,
    email,
    password
  );



  await updateDoc(

    doc(
      db,
      "users",
      result.user.uid
    ),

    {

      lastLogin:
      serverTimestamp()

    }

  );



  return result.user;

}






// =========================
// REGISTER
// =========================

export async function register(
  email,
  password,
  name
){

  const result =
  await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );



  await setDoc(

    doc(
      db,
      "users",
      result.user.uid
    ),

    {

      name,

      email,

      phone:"",

      address:"",

      photoURL:"",

      role:"user",

      createdAt:
      serverTimestamp(),

    }

  );



  await sendEmailVerification(
    result.user
  );



  return result.user;

}






// =========================
// EMAIL VERIFICATION
// =========================

export async function sendVerificationEmail(
user
){

  if(!user){

    throw new Error(
      "User not found"
    );

  }


  await sendEmailVerification(
    user
  );

}






export async function resendVerificationEmail(
user
){

  if(!user){

    throw new Error(
      "User not found"
    );

  }


  await sendEmailVerification(
    user
  );

}







// =========================
// CHANGE PASSWORD EMAIL
// =========================

export async function requestPasswordChange(
email
){

  const actionCodeSettings = {


    url:
    `${window.location.origin}/reset-password`,


    handleCodeInApp:true,


  };



  await sendPasswordResetEmail(

    auth,

    email,

    actionCodeSettings

  );


}








// =========================
// FORGOT PASSWORD
// =========================

export async function forgotPassword(
email
){

  const actionCodeSettings = {


    url:
    `${window.location.origin}/reset-password`,


    handleCodeInApp:true,


  };



  await sendPasswordResetEmail(

    auth,

    email,

    actionCodeSettings

  );


}








// =========================
// DELETE ACCOUNT
// =========================

export async function deleteUserAccount(
user
){

  if(!user){

    throw new Error(
      "User not found"
    );

  }



  await deleteUser(
    user
  );


}








// =========================
// LOGOUT
// =========================

export async function logout(){

  await signOut(
    auth
  );

}
