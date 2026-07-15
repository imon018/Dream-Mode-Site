import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";


import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";


import {
  auth
} from "../firebase/auth";


import {
  db
} from "../firebase/firestore";




// LOGIN

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



  const userRef =
  doc(
    db,
    "users",
    result.user.uid
  );



  const userSnap =
  await getDoc(
    userRef
  );



  let role = "user";



  if(userSnap.exists()){

    role =
    userSnap.data().role || "user";

  }



  await updateDoc(
    userRef,
    {
      lastLogin:
      serverTimestamp()
    }
  );



  return {

    user: result.user,

    role

  };

}







// REGISTER

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
  serverTimestamp()

 }

 );



 await sendEmailVerification(
  result.user
 );


 return result.user;

}







// EMAIL VERIFY

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







// CHANGE PASSWORD REQUEST


export async function requestPasswordChange(
user,
currentPassword,
newPassword
){

 if(!user){

  throw new Error(
   "User not found"
  );

 }



 const credential =
 EmailAuthProvider.credential(
  user.email,
  currentPassword
 );



 await reauthenticateWithCredential(
  user,
  credential
 );




 await setDoc(

 doc(
  db,
  "passwordChangeRequests",
  user.uid
 ),

 {

  uid:user.uid,

  email:user.email,

  newPassword,

  createdAt:
  serverTimestamp()

 }

 );



 await sendEmailVerification(
  user
 );


}








// APPLY PASSWORD CHANGE


export async function applyPasswordChange(
user
){


 const requestRef =
 doc(
  db,
  "passwordChangeRequests",
  user.uid
 );



 const snap =
 await getDoc(
  requestRef
 );



 if(!snap.exists()){

  throw new Error(
   "Password request not found"
  );

 }



 const data =
 snap.data();



 await updatePassword(
  user,
  data.newPassword
 );



 await deleteDoc(
  requestRef
 );



}








// FORGOT PASSWORD


export async function forgotPassword(
email
){

 await sendPasswordResetEmail(
 auth,
 email,
 {

  url:
  `${window.location.origin}/reset-password`,

  handleCodeInApp:true

 }

 );

}








// LOGOUT

export async function logout(){

 await signOut(
  auth
 );

}






// DELETE ACCOUNT

export async function deleteUserAccount(
user
){

 await deleteUser(
 user
 );

}
