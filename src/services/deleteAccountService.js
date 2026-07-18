import {
  db
} from "../firebase/firestore";


import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";





// =========================
// CREATE DELETE ACCOUNT REQUEST
// =========================

export async function createDeleteAccountRequest(

user,

password

){



if(!user){

throw new Error(
"User not found."
);

}





if(!password){

throw new Error(
"Password required."
);

}






// Generate verification token

const token =
crypto.randomUUID();







await setDoc(


doc(

db,

"deleteAccountRequests",

user.uid

),


{


uid:user.uid,


email:user.email,


password,


token,


verified:false,


createdAt:
serverTimestamp()


}


);






return token;


}
