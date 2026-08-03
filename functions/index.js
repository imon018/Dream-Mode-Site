const {
  onDocumentCreated
} = require("firebase-functions/v2/firestore");


const {
  onCall,
  onRequest,
  HttpsError
} = require("firebase-functions/v2/https");


const {
  defineSecret
} = require("firebase-functions/params");


const admin =
require("firebase-admin");


const nodemailer =
require("nodemailer");


const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require("@simplewebauthn/server");


admin.initializeApp();



async function getWebsiteUrl(){

const snap =
await admin.firestore()
.collection("settings")
.doc("store")
.get();


if(
snap.exists &&
snap.data().websiteUrl
){

return snap.data().websiteUrl.replace(/\/$/, "");

}


throw new Error(
"Website URL not found"
);


}



// =================================================
// PASSKEY (WEBAUTHN) — RELYING PARTY CONFIG
// Website URL চেঞ্জ হলে (Admin Settings থেকে) Passkey-র
// RP ID/Origin ও automatically সেই নতুন ডোমেইন অনুযায়ী সেট
// হয়ে যাবে। ডিফল্ট Vercel ডোমেইন fallback হিসেবে রাখা আছে
// যাতে settings/store ডকুমেন্টে websiteUrl সেট না থাকলেও ভেঙে না পড়ে।
// =================================================

async function getPasskeyRpConfig(){

  const snap =
  await admin.firestore()
  .collection("settings")
  .doc("store")
  .get();

  const data =
  (snap.exists && snap.data()) || {};

  const origin =
  (
    data.websiteUrl ||
    "https://dream-mode-site-eight.vercel.app"
  ).replace(/\/$/, "");

  let rpID = "localhost";

  try{

    rpID = new URL(origin).hostname;

  }catch(err){

    console.log("Invalid websiteUrl for passkey RP:", err);

  }

  const rpName =
  (data.storeName && data.storeName.trim()) ||
  "DREAM MODE";

  return { rpID, rpName, origin };

}



async function getStoreName(){

const snap =
await admin.firestore()
.collection("settings")
.doc("store")
.get();


if(
snap.exists &&
snap.data().storeName
){

return snap.data().storeName.trim();

}


return "DREAM MODE";

}



const gmailEmail =
defineSecret(
  "GMAIL_EMAIL"
);



const gmailPassword =
defineSecret(
  "GMAIL_PASSWORD"
);













// =================================================
// MAIL TRANSPORTER
// =================================================


function createTransporter(){


return nodemailer.createTransport({

service:"gmail",

auth:{


user:
gmailEmail.value(),


pass:
gmailPassword.value()


}

});


}









// =================================================
// SEND EMAIL VERIFICATION EMAIL
// REGISTER REQUIRED
// =================================================


exports.sendVerificationEmail =


onDocumentCreated(

{

document:

"emailVerificationRequests/{requestId}",


secrets:[

gmailEmail,

gmailPassword

]


},


async(event)=>{


const data =
event.data.data();



if(!data){

return null;

}





const transporter =

createTransporter();



const WEBSITE_URL =
await getWebsiteUrl();

const STORE_NAME =
await getStoreName();


const link =

`${WEBSITE_URL}/verify-email?token=${data.token}`;







await transporter.sendMail({



from:

`"${STORE_NAME}" <${gmailEmail.value()}>`,


to:

data.email,



subject:

`Verify Your ${STORE_NAME} Account`,




html:


`

<div style="font-family:Arial;padding:20px">


<h2>
Welcome to ${STORE_NAME}
</h2>



<p>
Hi ${data.name},
</p>



<p>
Thank you for creating an account.
Please verify your email address.
</p>



<a href="${link}"

style="
display:inline-block;
background:#F59E0B;
color:white;
padding:12px 20px;
border-radius:8px;
text-decoration:none;
font-weight:bold;
">

Verify Email

</a>



<p>
If you did not create this account, ignore this email.
</p>



<p>
${STORE_NAME} Team
</p>


</div>

`

});





return null;


});


// =================================================
// CREATE PASSWORD RESET REQUEST
// LOGIN NOT REQUIRED
// =================================================


exports.createPasswordResetRequest =


onCall(

async(request)=>{


const {

email

}=request.data;





if(!email){


throw new HttpsError(

"invalid-argument",

"Email required."

);

}






try{



const userRecord =

await admin.auth()

.getUserByEmail(

email

);






const token =

crypto.randomUUID();







await admin.firestore()

.collection(

"passwordResetRequests"

)

.doc(

token

)

.set({

uid:

userRecord.uid,


email,


token,


verified:false,


createdAt:

admin.firestore.FieldValue.serverTimestamp()


});






return {


success:true


};



}

catch(error){


console.log(error);





if(error.code === "auth/user-not-found"){


throw new HttpsError(

"not-found",

"No account found with this email."

);


}






throw new HttpsError(

"internal",

"Password reset request failed."

);


}



}

);


// =================================================
// RESEND VERIFICATION EMAIL
// LOGIN NOT REQUIRED
// =================================================


exports.resendVerificationEmail =


onCall(

async(request)=>{


const {

email

}=request.data;




if(!email){


throw new HttpsError(

"invalid-argument",

"Email required."

);

}




let userRecord;


try{

userRecord =

await admin.auth()

.getUserByEmail(

email

);

}

catch(error){

throw new HttpsError(

"not-found",

"No account found with this email."

);

}




const userDoc =

await admin.firestore()

.collection("users")

.doc(userRecord.uid)

.get();




if(

userDoc.exists

&&

userDoc.data().emailVerified === true

){

throw new HttpsError(

"already-exists",

"This email is already verified."

);

}




const token =

crypto.randomUUID();




try{

// Creating a brand new document (instead of
// updating the old one) does two things:
// 1) Admin SDK write bypasses Firestore rules,
//    so no "Missing or insufficient permissions".
// 2) A new doc re-triggers sendVerificationEmail
//    (onDocumentCreated), which an update would not.

await admin.firestore()

.collection("emailVerificationRequests")

.doc(token)

.set({

uid:

userRecord.uid,


email,


name:

userDoc.exists

? (userDoc.data().name || "")

: "",


token,


verified:false,


createdAt:

admin.firestore.FieldValue.serverTimestamp()

});




return {

success:true

};

}

catch(error){

console.log(error);


throw new HttpsError(

"internal",

"Failed to resend verification email."

);

}


}

);


// =================================================
// VERIFY EMAIL TOKEN
// LOGIN NOT REQUIRED
// =================================================


exports.verifyEmailToken =


onCall(

async(request)=>{


const {

token

}=request.data;




if(!token){


throw new HttpsError(

"invalid-argument",

"Token required."

);

}




try{


// The person clicking the email link is
// NOT logged in (signOut happens right
// after registration), so a client-side
// updateDoc on users/{uid} would fail
// Firestore rules ("Missing or
// insufficient permissions"). Doing this
// with the Admin SDK bypasses rules -
// the token itself (unguessable, single
// use) is what proves the request is
// legitimate.

const snap =

await admin.firestore()

.collection("emailVerificationRequests")

.where("token","==",token)

.limit(1)

.get();




if(snap.empty){


throw new HttpsError(

"not-found",

"Verification link expired or invalid."

);

}




const requestDoc =

snap.docs[0];


const data =

requestDoc.data();




await admin.firestore()

.collection("users")

.doc(data.uid)

.set(

{

emailVerified:true

},

{

merge:true

}

);




await requestDoc.ref.delete();




return {

success:true,

email:data.email

};

}

catch(error){


if(error instanceof HttpsError){

throw error;

}


console.log(error);


throw new HttpsError(

"internal",

"Email verification failed."

);

}


}

);


// =================================================
// SEND PASSWORD CHANGE EMAIL
// LOGIN REQUIRED
// =================================================


exports.sendPasswordChangeEmail =


onDocumentCreated(

{

document:

"passwordChangeRequests/{requestId}",


secrets:[

gmailEmail,

gmailPassword

]


},


async(event)=>{


const data =
event.data.data();



if(!data){

return null;

}




const transporter =
createTransporter();


const WEBSITE_URL =
await getWebsiteUrl();


const STORE_NAME =
await getStoreName();



const link =

`${WEBSITE_URL}/password-change-verify?token=${data.token}`;







await transporter.sendMail({


from:

`"${STORE_NAME}" <${gmailEmail.value()}>`,


to:

data.email,



subject:

`${STORE_NAME} Password Change Verification`,



html:


`

<div style="font-family:Arial;padding:20px">


<h2>
${STORE_NAME} Password Change
</h2>



<p>
You requested to change your password.
</p>



<a href="${link}"

style="
display:inline-block;
background:#F59E0B;
color:white;
padding:12px 20px;
border-radius:8px;
text-decoration:none;
font-weight:bold;
">

Change Password

</a>



<p>
If you did not request this, ignore this email.
</p>



<p>
${STORE_NAME} Team
</p>


</div>

`

});





return null;


});


// =================================================
// SEND FORGOT PASSWORD EMAIL
// LOGIN NOT REQUIRED
// =================================================


exports.sendForgotPasswordEmail =


onDocumentCreated(

{

document:

"passwordResetRequests/{requestId}",


secrets:[

gmailEmail,

gmailPassword

]


},


async(event)=>{


const data =
event.data.data();



if(!data){

return null;

}





const transporter =
createTransporter();


const WEBSITE_URL =
await getWebsiteUrl();


const STORE_NAME =
await getStoreName();




const link =

`${WEBSITE_URL}/reset-password?token=${data.token}`;







await transporter.sendMail({



from:

`"${STORE_NAME}" <${gmailEmail.value()}>`,



to:

data.email,



subject:

`Reset Your ${STORE_NAME} Password`,




html:


`

<div style="font-family:Arial;padding:20px">


<h2>
${STORE_NAME} Password Reset
</h2>



<p>
You requested to reset your password.
</p>



<a href="${link}"

style="
display:inline-block;
background:#F59E0B;
color:white;
padding:12px 20px;
border-radius:8px;
text-decoration:none;
font-weight:bold;
">

Reset Password

</a>



<p>
If you did not request this, ignore this email.
</p>



<p>
${STORE_NAME} Team
</p>


</div>

`

});





return null;


});









// =================================================
// CHANGE PASSWORD
// LOGIN REQUIRED
// =================================================


exports.changePassword =


onCall(

async(request)=>{


const {

uid,

password

}=request.data;




if(!uid || !password){


throw new HttpsError(

"invalid-argument",

"Invalid password request."

);

}





if(password.length < 6){


throw new HttpsError(

"invalid-argument",

"Password must be at least 6 characters."

);

}





try{


await admin.auth()

.updateUser(

uid,

{

password

}

);





return {


success:true


};



}

catch(error){


console.log(error);



throw new HttpsError(

"internal",

"Unable to update password."

);


}



}

);




// =================================================
// RESET PASSWORD
// LOGIN NOT REQUIRED
// =================================================


exports.resetPassword =


onCall(

async(request)=>{


const {

token,

password

}=request.data;





if(!token || !password){


throw new HttpsError(

"invalid-argument",

"Invalid reset request."

);

}





if(password.length < 6){


throw new HttpsError(

"invalid-argument",

"Password must be at least 6 characters."

);

}





try{



const snapshot =

await admin.firestore()

.collection(

"passwordResetRequests"

)

.where(

"token",

"==",

token

)

.get();







if(snapshot.empty){


throw new HttpsError(

"not-found",

"Invalid or expired reset link."

);


}






const resetDoc =

snapshot.docs[0];




const data =

resetDoc.data();







await admin.auth()

.updateUser(

data.uid,

{

password

}

);






await resetDoc.ref.delete();







return {


success:true


};




}

catch(error){

console.log(error);

if(error instanceof HttpsError){

throw error;

}


throw new HttpsError(
"internal",
"Password reset failed."
);

}


}

);


// =================================================
// SEND DELETE ACCOUNT EMAIL
// =================================================


exports.sendDeleteAccountEmail =


onDocumentCreated(

{

document:

"deleteAccountRequests/{requestId}",


secrets:[

gmailEmail,

gmailPassword

]


},


async(event)=>{


const data =

event.data.data();



if(!data){

return null;

}





const transporter =

createTransporter();



const WEBSITE_URL =
await getWebsiteUrl();


const STORE_NAME =
await getStoreName();




const link =

`${WEBSITE_URL}/delete-account-verify?token=${data.token}`;








await transporter.sendMail({



from:

`"${STORE_NAME}" <${gmailEmail.value()}>`,



to:

data.email,




subject:

`${STORE_NAME} Account Delete Verification`,



html:


`

<div style="font-family:Arial;padding:20px">


<h2>
${STORE_NAME} Account Delete
</h2>



<p>
You requested to permanently delete your account.
</p>



<p>
Click the button below to confirm deletion.
</p>



<a href="${link}"

style="
display:inline-block;
background:#DC2626;
color:white;
padding:12px 20px;
border-radius:8px;
text-decoration:none;
font-weight:bold;
">

Confirm Delete Account

</a>



<p>
If you did not request this, ignore this email.
</p>


<p>
${STORE_NAME} Team
</p>

</div>

`

});






return null;


});









// =================================================
// VERIFY DELETE ACCOUNT
// =================================================


exports.verifyDeleteAccount =


onCall(

async(request)=>{


const {

token

}=request.data;





if(!token){


throw new HttpsError(

"invalid-argument",

"Token required."

);


}





try{





const snapshot =

await admin.firestore()

.collection(

"deleteAccountRequests"

)

.where(

"token",

"==",

token

)

.get();








if(snapshot.empty){


throw new HttpsError(

"not-found",

"Delete request not found."

);


}








const requestDoc =

snapshot.docs[0];





const data =

requestDoc.data();









await admin.auth()

.deleteUser(

data.uid

);








await admin.firestore()

.collection(

"users"

)

.doc(

data.uid

)

.delete();








await requestDoc.ref.delete();







return {


success:true


};






}

catch(error){


console.log(error);



throw new HttpsError(

"internal",

error.message

);


}




}

);



// =================================================
// SITEMAP.XML
// =================================================

exports.sitemap = onRequest(async (req, res) => {

  const settingsSnap = await admin
    .firestore()
    .collection("settings")
    .doc("store")
    .get();

  const settings = settingsSnap.data() || {};

  const site = (
    settings.websiteUrl ||
    "https://dream-mode-site-eight.vercel.app"
  ).replace(/\/$/, "");

  const landingPages = await admin
  .firestore()
  .collection("landingPages")
  .where("status", "==", "published")
  .get();

let landingUrls = "";

landingPages.forEach((doc) => {
  landingUrls += `
<url>
  <loc>${site}/landing/${doc.data().slug}</loc>
</url>`;
});

  const products = await admin
    .firestore()
    .collection("products")
    .get();

  let urls = "";

  products.forEach((doc) => {

    urls += `
<url>
  <loc>${site}/product/${doc.id}</loc>
</url>`;

  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>
  <loc>${site}</loc>
</url>

<url>
  <loc>${site}/products</loc>
</url>

<url>
  <loc>${site}/categories</loc>
</url>

<url>
  <loc>${site}/shop</loc>
</url>

<url>
  <loc>${site}/about</loc>
</url>

<url>
  <loc>${site}/contact</loc>
</url>

<url>
  <loc>${site}/about-us</loc>
</url>

<url>
  <loc>${site}/faqs</loc>
</url>

<url>
  <loc>${site}/page/returnpolicy</loc>
</url>

<url>
  <loc>${site}/page/refundpolicy</loc>
</url>

<url>
  <loc>${site}/page/shippingpolicy</loc>
</url>

<url>
  <loc>${site}/page/privacypolicy</loc>
</url>

<url>
  <loc>${site}/page/terms</loc>
</url>

${urls}
${landingUrls}

</urlset>`;

  res.set("Content-Type", "application/xml");

  res.send(xml);

});




// =================================================
// ROBOTS.TXT
// =================================================

exports.robots = onRequest(async (req, res) => {

  const settingsSnap = await admin
    .firestore()
    .collection("settings")
    .doc("store")
    .get();

  const settings = settingsSnap.data() || {};

  const site = (
    settings.websiteUrl ||
    "https://dream-mode-site-eight.vercel.app"
  ).replace(/\/$/, "");

  res.set("Content-Type", "text/plain");

  res.send(`User-agent: *

Allow: /

Disallow: /admin/
Disallow: /profile/
Disallow: /login
Disallow: /register
Disallow: /checkout
Disallow: /cart
Disallow: /wishlist

Sitemap: ${site}/sitemap.xml`);
});



// =================================================
// PASSKEY — GENERATE REGISTRATION OPTIONS
// LOGIN REQUIRED (Passkey Setup: User Settings / Admin Settings)
// =================================================

exports.generatePasskeyRegistrationOptions =

onCall(
async(request)=>{

  if(!request.auth){

    throw new HttpsError(
      "unauthenticated",
      "Please login first."
    );

  }

  const uid = request.auth.uid;

  const userSnap =
  await admin.firestore()
  .collection("users")
  .doc(uid)
  .get();

  const userData =
  (userSnap.exists && userSnap.data()) || {};

  const existingSnap =
  await admin.firestore()
  .collection("passkeyCredentials")
  .where("uid", "==", uid)
  .get();

  const excludeCredentials =
  existingSnap.docs.map((d)=>({
    id: d.id,
    transports: d.data().transports || [],
  }));

  const { rpID, rpName } =
  await getPasskeyRpConfig();

  const options =
  await generateRegistrationOptions({
    rpName,
    rpID,
    userName: userData.email || uid,
    userDisplayName: userData.name || userData.email || "User",
    attestationType: "none",
    excludeCredentials,
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "preferred",
    },
  });

  await admin.firestore()
  .collection("users")
  .doc(uid)
  .set(
    {
      passkeyChallenge: options.challenge,
      passkeyChallengeExpiresAt: Date.now() + 5 * 60 * 1000,
    },
    { merge: true }
  );

  return options;

}
);



// =================================================
// PASSKEY — VERIFY REGISTRATION
// LOGIN REQUIRED
// =================================================

exports.verifyPasskeyRegistration =

onCall(
async(request)=>{

  if(!request.auth){

    throw new HttpsError(
      "unauthenticated",
      "Please login first."
    );

  }

  const uid = request.auth.uid;

  const { response, label } = request.data || {};

  if(!response){

    throw new HttpsError(
      "invalid-argument",
      "Missing registration response."
    );

  }

  const userRef =
  admin.firestore()
  .collection("users")
  .doc(uid);

  const userSnap = await userRef.get();

  const userData =
  (userSnap.exists && userSnap.data()) || {};

  if(
    !userData.passkeyChallenge ||
    !userData.passkeyChallengeExpiresAt ||
    userData.passkeyChallengeExpiresAt < Date.now()
  ){

    throw new HttpsError(
      "deadline-exceeded",
      "Passkey setup expired. Please try again."
    );

  }

  const { rpID, origin } =
  await getPasskeyRpConfig();

  let verification;

  try{

    verification =
    await verifyRegistrationResponse({
      response,
      expectedChallenge: userData.passkeyChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

  }catch(error){

    console.log("PASSKEY REGISTRATION VERIFY ERROR:", error);

    throw new HttpsError(
      "invalid-argument",
      "Passkey could not be verified."
    );

  }

  if(!verification.verified || !verification.registrationInfo){

    throw new HttpsError(
      "invalid-argument",
      "Passkey could not be verified."
    );

  }

  const {
    credential,
    credentialDeviceType,
    credentialBackedUp,
  } = verification.registrationInfo;

  const credRef =
  admin.firestore()
  .collection("passkeyCredentials")
  .doc(credential.id);

  const credSnap = await credRef.get();

  if(credSnap.exists){

    throw new HttpsError(
      "already-exists",
      "This passkey is already registered."
    );

  }

  await credRef.set({
    uid,
    publicKey: Buffer.from(credential.publicKey),
    counter: credential.counter,
    transports: credential.transports || [],
    deviceType: credentialDeviceType,
    backedUp: credentialBackedUp,
    label: (label && String(label).slice(0, 60)) || "Passkey",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastUsedAt: null,
  });

  await userRef.set(
    {
      passkeyChallenge: admin.firestore.FieldValue.delete(),
      passkeyChallengeExpiresAt: admin.firestore.FieldValue.delete(),
    },
    { merge: true }
  );

  return {
    verified: true,
    credentialId: credential.id,
  };

}
);



// =================================================
// PASSKEY — LIST MY PASSKEYS
// LOGIN REQUIRED
// =================================================

exports.listPasskeys =

onCall(
async(request)=>{

  if(!request.auth){

    throw new HttpsError(
      "unauthenticated",
      "Please login first."
    );

  }

  const snap =
  await admin.firestore()
  .collection("passkeyCredentials")
  .where("uid", "==", request.auth.uid)
  .get();

  const passkeys =
  snap.docs
  .map((d)=>{

    const data = d.data();

    return {
      id: d.id,
      label: data.label || "Passkey",
      deviceType: data.deviceType || "singleDevice",
      backedUp: !!data.backedUp,
      createdAt:
        data.createdAt && data.createdAt.toDate
          ? data.createdAt.toDate().toISOString()
          : null,
      lastUsedAt:
        data.lastUsedAt && data.lastUsedAt.toDate
          ? data.lastUsedAt.toDate().toISOString()
          : null,
    };

  })
  .sort((a, b)=>{

    return (
      new Date(b.createdAt || 0) -
      new Date(a.createdAt || 0)
    );

  });

  return { passkeys };

}
);



// =================================================
// PASSKEY — DELETE
// LOGIN REQUIRED
// =================================================

exports.deletePasskey =

onCall(
async(request)=>{

  if(!request.auth){

    throw new HttpsError(
      "unauthenticated",
      "Please login first."
    );

  }

  const { credentialId } = request.data || {};

  if(!credentialId){

    throw new HttpsError(
      "invalid-argument",
      "credentialId is required."
    );

  }

  const credRef =
  admin.firestore()
  .collection("passkeyCredentials")
  .doc(credentialId);

  const credSnap = await credRef.get();

  if(
    !credSnap.exists ||
    credSnap.data().uid !== request.auth.uid
  ){

    throw new HttpsError(
      "permission-denied",
      "Passkey not found."
    );

  }

  await credRef.delete();

  return { deleted: true };

}
);



// =================================================
// PASSKEY — GENERATE AUTHENTICATION (LOGIN) OPTIONS
// LOGIN NOT REQUIRED (usernameless / discoverable passkey login)
// =================================================

exports.generatePasskeyAuthenticationOptions =

onCall(
async()=>{

  const { rpID } =
  await getPasskeyRpConfig();

  const options =
  await generateAuthenticationOptions({
    rpID,
    userVerification: "preferred",
  });

  const challengeRef =
  admin.firestore()
  .collection("passkeyLoginChallenges")
  .doc();

  await challengeRef.set({
    challenge: options.challenge,
    createdAt: Date.now(),
  });

  return {
    options,
    challengeId: challengeRef.id,
  };

}
);



// =================================================
// PASSKEY — VERIFY AUTHENTICATION (LOGIN)
// LOGIN NOT REQUIRED
// Returns a Firebase custom token on success so the client
// can call signInWithCustomToken().
// =================================================

exports.verifyPasskeyLogin =

onCall(
async(request)=>{

  const { challengeId, response } = request.data || {};

  if(!challengeId || !response){

    throw new HttpsError(
      "invalid-argument",
      "Missing authentication response."
    );

  }

  const challengeRef =
  admin.firestore()
  .collection("passkeyLoginChallenges")
  .doc(challengeId);

  const challengeSnap = await challengeRef.get();

  if(!challengeSnap.exists){

    throw new HttpsError(
      "failed-precondition",
      "PASSKEY_LOGIN_EXPIRED"
    );

  }

  const { challenge, createdAt } = challengeSnap.data();

  // এক-বার ব্যবহারযোগ্য চ্যালেঞ্জ — যাচাইয়ের আগেই মুছে ফেলা হচ্ছে
  // replay attack ঠেকানোর জন্য।
  await challengeRef.delete();

  if(Date.now() - createdAt > 5 * 60 * 1000){

    throw new HttpsError(
      "deadline-exceeded",
      "PASSKEY_LOGIN_EXPIRED"
    );

  }

  const credentialId = response.id;

  if(!credentialId){

    throw new HttpsError(
      "invalid-argument",
      "Invalid passkey response."
    );

  }

  const credRef =
  admin.firestore()
  .collection("passkeyCredentials")
  .doc(credentialId);

  const credSnap = await credRef.get();

  if(!credSnap.exists){

    throw new HttpsError(
      "not-found",
      "PASSKEY_NOT_SETUP"
    );

  }

  const credData = credSnap.data();

  const { rpID, origin } =
  await getPasskeyRpConfig();

  let verification;

  try{

    verification =
    await verifyAuthenticationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: credentialId,
        // admin SDK ফেরত দেয় Node Buffer হিসেবে, যেটা ইতিমধ্যে
        // Uint8Array-এর subclass — তাই আলাদা conversion লাগে না।
        publicKey: credData.publicKey,
        counter: credData.counter,
        transports: credData.transports || [],
      },
    });

  }catch(error){

    console.log("PASSKEY LOGIN VERIFY ERROR:", error);

    throw new HttpsError(
      "permission-denied",
      "Passkey verification failed."
    );

  }

  if(!verification.verified){

    throw new HttpsError(
      "permission-denied",
      "Passkey verification failed."
    );

  }

  await credRef.update({
    counter: verification.authenticationInfo.newCounter,
    lastUsedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const userRef =
  admin.firestore()
  .collection("users")
  .doc(credData.uid);

  const userSnap = await userRef.get();

  if(!userSnap.exists){

    throw new HttpsError(
      "not-found",
      "Account not found."
    );

  }

  const role =
  userSnap.data().role || "user";

  await userRef.set(
    {
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  const token =
  await admin.auth().createCustomToken(credData.uid);

  return { token, role };

}
);
