const {
  onDocumentCreated
} = require("firebase-functions/v2/firestore");


const {
  onCall,
  HttpsError
} = require("firebase-functions/v2/https");


const {
  defineSecret
} = require("firebase-functions/params");


const admin =
require("firebase-admin");


const nodemailer =
require("nodemailer");



admin.initializeApp();





const gmailEmail =
defineSecret(
  "GMAIL_EMAIL"
);



const gmailPassword =
defineSecret(
  "GMAIL_PASSWORD"
);





const WEBSITE_URL =
"https://dream-mode-site-eight.vercel.app";









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






const link =

`${WEBSITE_URL}/verify-email?token=${data.token}`;







await transporter.sendMail({



from:

`"Dream Mode" <${gmailEmail.value()}>`,



to:

data.email,



subject:

"Verify Your Dream Mode Account",




html:


`

<div style="font-family:Arial;padding:20px">


<h2>
Welcome to Dream Mode
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
Dream Mode Team
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





const link =

`${WEBSITE_URL}/password-change-verify?token=${data.token}`;







await transporter.sendMail({


from:

`"Dream Mode" <${gmailEmail.value()}>`,



to:

data.email,



subject:

"Password Change Verification",




html:


`

<div style="font-family:Arial;padding:20px">


<h2>
Dream Mode Password Change
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
Dream Mode Team
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





const link =

`${WEBSITE_URL}/reset-password?token=${data.token}`;







await transporter.sendMail({



from:

`"Dream Mode" <${gmailEmail.value()}>`,



to:

data.email,



subject:

"Reset Your Dream Mode Password",




html:


`

<div style="font-family:Arial;padding:20px">


<h2>
Dream Mode Password Reset
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
Dream Mode Team
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







const link =

`${WEBSITE_URL}/delete-account-verify?token=${data.token}`;








await transporter.sendMail({



from:

`"Dream Mode" <${gmailEmail.value()}>`,




to:

data.email,




subject:

"Delete Account Verification",




html:


`

<div style="font-family:Arial;padding:20px">


<h2>
Dream Mode Account Delete
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
Dream Mode Team
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
