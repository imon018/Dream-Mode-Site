const {
  onDocumentCreated
} = require("firebase-functions/v2/firestore");


const {
  onCall
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





// =========================
// SEND PASSWORD CHANGE EMAIL
// =========================

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

nodemailer.createTransport({

service:"gmail",

auth:{

user:
gmailEmail.value(),

pass:
gmailPassword.value()

}

});





const link =

`https://dream-mode-site-eight.vercel.app/password-change-verify?token=${data.token}`;







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









// =========================
// CHANGE PASSWORD FUNCTION
// =========================


exports.changePassword =


onCall(

async(request)=>{


const {

uid,

password

}=request.data;





if(!uid || !password){

throw new Error(
"Invalid password request"
);

}




if(password.length < 6){

throw new Error(
"Password must be at least 6 characters"
);

}







await admin.auth()
.updateUser(

uid,

{

password:password

}

);





return {

success:true

};


}

);
