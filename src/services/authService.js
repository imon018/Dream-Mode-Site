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




// Email Verification

await sendEmailVerification(
result.user
);



return result.user;


}







// =========================
// SEND VERIFICATION EMAIL
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







// =========================
// CHANGE PASSWORD
// =========================

export async function changePassword(

user,

currentPassword,

newPassword

){


if(!user){

throw new Error(
"User not found"
);

}




// Current password verify

const credential =

EmailAuthProvider.credential(

user.email,

currentPassword

);




await reauthenticateWithCredential(

user,

credential

);





// Update password

await updatePassword(

user,

newPassword

);






// Send verification email again

await sendEmailVerification(

user

);



return true;


}








// =========================
// FORGOT PASSWORD
// =========================

export async function forgotPassword(
email
){

await sendPasswordResetEmail(

auth,

email

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
