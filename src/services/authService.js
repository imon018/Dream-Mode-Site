import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";


import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
  deleteDoc,
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



let role =
"user";



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

user:
result.user,

role

};

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
serverTimestamp()

}

);



await sendEmailVerification(
result.user
);



return result.user;

}









// =========================
// RESEND EMAIL VERIFY
// =========================

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
// PASSWORD CHANGE REQUEST
// =========================

export async function requestPasswordChange(

user,

currentPassword

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





const token =
crypto.randomUUID();






await setDoc(

doc(

db,

"passwordChangeRequests",

user.uid

),

{

uid:user.uid,

email:user.email,

token,

verified:false,

createdAt:
serverTimestamp()

}

);



return true;


}









// =========================
// APPLY PASSWORD CHANGE
// =========================

export async function applyPasswordChange(

user,

newPassword

){

if(!user){

throw new Error(
"User not found"
);

}





if(!newPassword){

throw new Error(
"Password required."
);

}





if(newPassword.length < 6){

throw new Error(
"Password must be at least 6 characters."
);

}





await updatePassword(

user,

newPassword

);





await deleteDoc(

doc(

db,

"passwordChangeRequests",

user.uid

)

);




return true;


}









// =========================
// VERIFY PASSWORD CHANGE LINK
// =========================

export async function verifyPasswordChangeLink(
token
){

if(!token){

throw new Error(
"Invalid password change link."
);

}


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

email,

{

url:

`${window.location.origin}/reset-password`,

handleCodeInApp:true

}

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
