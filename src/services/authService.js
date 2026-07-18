import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";


import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";


import {
  auth
} from "../firebase/auth";


import {
  db
} from "../firebase/firestore";


import {
  httpsCallable
} from "firebase/functions";


import {
  functions
} from "../firebase/functions";







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
// RESEND VERIFICATION
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
// CHANGE PASSWORD
// LOGIN REQUIRED
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





return token;


}









// =========================
// APPLY PASSWORD CHANGE
// =========================

export async function applyPasswordChange(){

throw new Error(
"Use cloud function for password update."
);

}









// =========================
// VERIFY PASSWORD LINK
// =========================

export async function verifyPasswordChangeLink(
token
){


if(!token){

throw new Error(
"Invalid token"
);

}



return true;


}









// =========================
// FORGOT PASSWORD
// CUSTOM EMAIL
// NO LOGIN REQUIRED
// =========================

export async function forgotPassword(

email

){


if(!email){

throw new Error(
"Email required."
);

}





const token =
crypto.randomUUID();







const resetRef =

doc(

db,

"passwordResetRequests",

token

);







await setDoc(

resetRef,

{

email,

token,

verified:false,

createdAt:
serverTimestamp()

}

);







const sendMail =

httpsCallable(

functions,

"sendForgotPasswordEmail"

);





await sendMail({

requestId:token

});







return true;


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
