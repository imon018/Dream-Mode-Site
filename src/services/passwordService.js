import {
  db
} from "../firebase/firestore";


import {
  doc,
  setDoc,
  deleteDoc,
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


const requestRef =
doc(
db,
"passwordChangeRequests",
user.uid
);


// আগের leftover request (যদি থাকে) আগে delete করে দিচ্ছি,
// যাতে নিচের setDoc সবসময় সত্যিকারের "create" হয় এবং
// Cloud Function এর onDocumentCreated trigger ঠিকমতো ফায়ার করে।
// আগেরটা না থাকলেও deleteDoc error দেয় না, তাই safe।

await deleteDoc(
requestRef
).catch(
()=>{}
);


await setDoc(
requestRef,
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
