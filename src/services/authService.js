import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";


import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";


import {
  httpsCallable
} from "firebase/functions";


import {
  auth
} from "../firebase/auth";


import {
  db
} from "../firebase/firestore";


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




// Email verification check

if(

userSnap.exists()

&&

userSnap.data().emailVerified !== true

){


await signOut(auth);


throw new Error(

"Please verify your email first."

);

}




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

emailVerified:false,

createdAt:

serverTimestamp()

}

);







// Create custom verification email request

await setDoc(

doc(

db,

"emailVerificationRequests",

result.user.uid

),

{

uid:

result.user.uid,


email,


name,


token:

crypto.randomUUID(),


verified:false,


createdAt:

serverTimestamp()

}

);







// Stop auto login after registration

await signOut(auth);






return result.user;


}


// =========================
// RESEND VERIFICATION
// CUSTOM EMAIL
// NO LOGIN REQUIRED
// =========================

export async function resendVerificationEmail(

email

){


if(!email){


throw new Error(

"Email required."

);


}





const q =

query(

collection(

db,

"users"

),

where(

"email",

"==",

email

)

);






const snapshot =

await getDocs(q);






if(snapshot.empty){


throw new Error(

"No account found with this email."

);


}






const userDoc =

snapshot.docs[0];






const userData =

userDoc.data();







await setDoc(

doc(

db,

"emailVerificationRequests",

userDoc.id

),

{

uid:

userDoc.id,


email:

userData.email,


name:

userData.name || "",


token:

crypto.randomUUID(),


verified:false,


createdAt:

serverTimestamp()

}

);






return true;


}


// =========================
// CHANGE PASSWORD REQUEST
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

uid:

user.uid,


email:

user.email,


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

"Use cloud function."

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







const createResetRequest =

httpsCallable(

functions,

"createPasswordResetRequest"

);







await createResetRequest({

email

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
