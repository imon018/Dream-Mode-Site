import {
  db
} from "../firebase/firestore";


import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";





// =========================
// CREATE PASSWORD CHANGE REQUEST
// =========================

export async function createPasswordRequest(
user
){


if(!user){

throw new Error(
"User not found."
);

}




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
