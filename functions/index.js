const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");

const admin = require("firebase-admin");
const nodemailer = require("nodemailer");


admin.initializeApp();


// ==========================
// SECRETS
// ==========================

const gmailEmail =
defineSecret("GMAIL_EMAIL");


const gmailPassword =
defineSecret("GMAIL_PASSWORD");





// ==========================
// SEND PASSWORD CHANGE EMAIL
// ==========================


exports.sendPasswordChangeEmail =

onDocumentCreated(

{

document:
"passwordChangeRequests/{uid}",


secrets:[
gmailEmail,
gmailPassword
]

},


async(event)=>{


const data =
event.data.data();



const uid =
event.params.uid;



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

`https://dream-mode-site.vercel.app/password-change-verify}`;





await transporter.sendMail({

from:

`"Dream Mode" <${gmailEmail.value()}>`,


to:

data.email,


subject:

"Password Change Request",


html:

`

<div style="font-family:Arial">

<h2>
Password Change Request
</h2>


<p>
We received a request to change your Dream Mode account password.
</p>


<p>
Click the button below to verify password change:
</p>


<a href="${link}"

style="
background:#F59E0B;
color:white;
padding:12px 20px;
border-radius:8px;
text-decoration:none;
display:inline-block;
">

Verify Password Change

</a>


<p>
If you did not request this, ignore this email.
</p>


<br/>

<p>
Dream Mode Team
</p>


</div>

`

});


return null;


});
