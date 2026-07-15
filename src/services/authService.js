import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";


import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";


import {
  auth,
} from "../firebase/auth";


import {
  db,
} from "../firebase/firestore";


import {
  createAdminNotification,
  createUserNotification,
} from "../utils/notificationHelper";




import {
  getSettings,
} from "./settingsService";






// =================================
// LOGIN
// =================================


export const login = async(
  email,
  password
)=>{


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



  await setDoc(

    userRef,

    {

      lastLogin:
      serverTimestamp(),

    },

    {
      merge:true,
    }

  );





  const settings =
  await getSettings();




  await createUserNotification({

    userId:
    result.user.uid,


    title:
    `🔐 New Login - ${settings.storeName}`,


    message:
    `Your ${settings.storeName} account was logged in successfully.`,


    type:
    "system",

  });




  return result;


};









// =================================
// REGISTER
// =================================


export const register = async(
  name,
  email,
  password
)=>{


try{


const result =
await createUserWithEmailAndPassword(

  auth,

  email,

  password

);





await sendEmailVerification(
  result.user
);






const userRef =
doc(

db,

"users",

result.user.uid

);





await setDoc(

userRef,

{

name,

email,

phone:"",

address:"",

photoURL:"",

role:"user",

createdAt:
serverTimestamp(),

},

{

merge:true

}

);






const settings =
await getSettings();






// USER WELCOME NOTIFICATION


await createUserNotification({

userId:
result.user.uid,


title:
`🎉 Welcome to ${settings.storeName}`,


message:
`Your ${settings.storeName} account has been created successfully.`,


type:
"system",

});








// ADMIN NEW USER NOTIFICATION


await createAdminNotification({

title:
"👤 New User Registered",


message:
`${name} created a new account in ${settings.storeName}.`,


type:
"system",

});







return result;



}

catch(error){


console.log(
"Register error:",
error
);


throw error;


}


};









// =================================
// RESEND EMAIL VERIFICATION
// =================================


export const resendVerificationEmail =
async(user)=>{


await sendEmailVerification(
user
);


};









// =================================
// FORGOT PASSWORD
// =================================


export const forgotPassword =
async(email)=>{


await sendPasswordResetEmail(

auth,

email

);


};









// =================================
// CHANGE PASSWORD
// =================================


export const changePassword =
async(
user,
newPassword
)=>{


await updatePassword(

user,

newPassword

);


};









// =================================
// SEND VERIFICATION EMAIL
// =================================


export const sendVerificationEmail =
async(user)=>{


await sendEmailVerification(
user
);


};









// =================================
// DELETE ACCOUNT
// =================================


export const deleteUserAccount =
async(user)=>{


await deleteUser(
user
);


};









// =================================
// LOGOUT
// =================================


export const logout = ()=>{


return signOut(
auth
);


};
