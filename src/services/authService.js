import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";



import {
doc,
setDoc,
updateDoc,
getDoc,
addDoc,
collection,
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
// RESEND REGISTER VERIFY
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
