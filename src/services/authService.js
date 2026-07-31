import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  getAdditionalUserInfo,
  linkWithCredential,
  signOut,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile,
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
  notifyUserRegistered,
  notifyUserLogin,
  notifyAdminLogin,
} from "./notificationService";


import {
  httpsCallable
} from "firebase/functions";


import {
  auth,
  googleProvider,
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



  if (role === "admin") {
  await notifyAdminLogin({
    uid: result.user.uid,
    displayName:
      userSnap.data()?.name ||
      result.user.displayName ||
      "Admin",
  });
} else {
  await notifyUserLogin({
    uid: result.user.uid,
  });
}
  


return {


user:

result.user,


role


};


}


// =========================
// SOCIAL LOGIN (GOOGLE)
// =========================

async function socialLogin(provider, providerName) {

  const result =
  await signInWithPopup(
    auth,
    provider
  );


  const user =
  result.user;


  const additionalInfo =
  getAdditionalUserInfo(result);


  const isNewUser =
  additionalInfo?.isNewUser || false;


  const userRef =
  doc(
    db,
    "users",
    user.uid
  );


  const userSnap =
  await getDoc(userRef);


  let role = "user";
  let hasPassword = false;


  if (!userSnap.exists()) {

    // Brand new account created via Google sign-in.

    await setDoc(userRef, {
      name: user.displayName || "",
      email: user.email || "",
      phone: "",
      address: "",
      photoURL: user.photoURL || "",
      role: "user",
      // Social providers already verify the email address.
      emailVerified: true,
      authProvider: providerName,
      hasPassword: false,
      createdAt: serverTimestamp(),
    });

    await notifyUserRegistered({
      uid: user.uid,
      displayName: user.displayName || "",
      email: user.email || "",
      role: "user",
    });

    hasPassword = false;

  } else {

    const data = userSnap.data();

    role = data.role || "user";

    hasPassword = data.hasPassword === true;

    const updates = {
      lastLogin: serverTimestamp(),
    };

    // Google already verifies the email address on its end, so
    // if this Firestore doc was created before this feature (or
    // via a normal email/password signup that was never
    // verified), self-heal it here instead of leaving it stuck
    // as "Not Verified" forever.
    if (data.emailVerified !== true) {
      updates.emailVerified = true;
    }

    await updateDoc(userRef, updates);

    if (role === "admin") {
      await notifyAdminLogin({
        uid: user.uid,
        displayName: data.name || user.displayName || "Admin",
      });
    } else {
      await notifyUserLogin({
        uid: user.uid,
      });
    }

  }


  return {
    user,
    role,
    isNewUser,
    hasPassword,
  };

}


export async function loginWithGoogle() {

  return socialLogin(
    googleProvider,
    "google"
  );

}


// =========================
// SET PASSWORD (FOR SOCIAL LOGIN USERS)
// Lets a Google-signed-in user add an
// email+password credential so they can
// also log in normally next time.
// =========================

export async function setSocialUserPassword(password) {

  const user =
  auth.currentUser;

  if (!user) {

    throw new Error(
      "User not found"
    );

  }

  if (!user.email) {

    throw new Error(
      "No email available for this account."
    );

  }

  const credential =
  EmailAuthProvider.credential(
    user.email,
    password
  );

  await linkWithCredential(
    user,
    credential
  );

  await updateDoc(
    doc(db, "users", user.uid),
    {
      hasPassword: true,
    }
  );

  return true;

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


await updateProfile(result.user, {
  displayName: name,
});


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

await notifyUserRegistered({
  uid: result.user.uid,
  displayName: name,
  email,
  role: "user",
});

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



// Writing directly to
// "emailVerificationRequests" from the
// client fails here: the doc already
// exists from registration, so this
// write is an "update", and the rules
// only allow admins to update that
// collection ("Missing or insufficient
// permissions").
//
// Also, sendVerificationEmail (the Cloud
// Function that emails the link) only
// triggers on document CREATE, not
// update - so even if the write were
// allowed, no email would go out.
//
// Fix: call a Cloud Function that uses
// the Admin SDK (bypasses rules) and
// creates a brand new request document,
// which re-triggers the email.

const resend =

httpsCallable(

functions,

"resendVerificationEmail"

);



await resend({

email

});




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
