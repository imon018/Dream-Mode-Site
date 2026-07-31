import {
  useState,
  useEffect,
  useRef
} from "react";


import {
  FiEye,
  FiEyeOff,
  FiLock
} from "react-icons/fi";


import Button from "../../components/ui/Button";


import {
  successToast,
  errorToast
} from "../../components/ui/Toast";


import {
  auth
} from "../../firebase/auth";


import {
  createPasswordRequest
} from "../../services/passwordService";


import {
  setSocialUserPassword
} from "../../services/authService";


import { useAuth } from "../../context/AuthContext";




// ১ মিনিট কুলডাউন (সেকেন্ডে)
const COOLDOWN_SECONDS = 60;




export default function ChangePassword(){



const user =
auth.currentUser;


const { user: profileUser, refreshUser } =
useAuth();


// Only Google accounts that never set a password yet should see
// the simpler "Set Password" form. Normal email/password
// accounts never get an authProvider/hasPassword field at all,
// so they always fall through to the regular Change Password
// flow below.
const needsSetPassword =
profileUser?.authProvider === "google"
&&
profileUser?.hasPassword !== true;




const [
newPassword,
setNewPassword
]=useState("");


const [
confirmNewPassword,
setConfirmNewPassword
]=useState("");


const [
showNewPassword,
setShowNewPassword
]=useState(false);


const [
showConfirmNewPassword,
setShowConfirmNewPassword
]=useState(false);


const [
settingPassword,
setSettingPassword
]=useState(false);




const handleSetPassword =
async()=>{


if(settingPassword)
return;


if(!newPassword || !confirmNewPassword){

errorToast(
"Please fill all fields."
);

return;

}


if(newPassword.length < 6){

errorToast(
"Password must be at least 6 characters."
);

return;

}


if(newPassword !== confirmNewPassword){

errorToast(
"Passwords do not match."
);

return;

}


try{

setSettingPassword(true);

await setSocialUserPassword(
newPassword
);

await refreshUser?.();

setNewPassword("");
setConfirmNewPassword("");

successToast(
"Password set successfully. You can now log in with email & password too."
);

}
catch(error){

console.log(error);

errorToast(
error.message ||
"Password set করা যায়নি। আবার চেষ্টা করুন."
);

}
finally{

setSettingPassword(false);

}


};





const [
currentPassword,
setCurrentPassword
]=useState("");



const [
showCurrent,
setShowCurrent
]=useState(false);



const [
loading,
setLoading
]=useState(false);



const [
remainingSeconds,
setRemainingSeconds
]=useState(0);


const intervalRef =
useRef(null);


// প্রতিটা user এর জন্য আলাদা cooldown key,
// যাতে অন্য অ্যাকাউন্টে লগইন করলে আগের cooldown প্রভাব না ফেলে
const cooldownKey =
user
?
`pwdChangeCooldownUntil_${user.uid}`
:
null;




// =========================
// COOLDOWN TIMER START করার হেল্পার
// =========================

const startCooldownFrom =
(untilTimestamp)=>{


if(intervalRef.current){

clearInterval(
intervalRef.current
);

}



const tick =
()=>{

const secondsLeft =
Math.ceil(
(untilTimestamp - Date.now())
/
1000
);


if(secondsLeft <= 0){

setRemainingSeconds(0);


if(intervalRef.current){

clearInterval(
intervalRef.current
);

intervalRef.current = null;

}


if(cooldownKey){

localStorage.removeItem(
cooldownKey
);

}


return;

}


setRemainingSeconds(
secondsLeft
);

};



tick();


intervalRef.current =
setInterval(
tick,
1000
);


};




// =========================
// PAGE LOAD হলে আগের চলমান cooldown আছে কিনা চেক
// =========================

useEffect(()=>{


if(!cooldownKey){

return;

}


const savedUntil =
localStorage.getItem(
cooldownKey
);


if(savedUntil){


const untilTimestamp =
Number(
savedUntil
);


if(untilTimestamp > Date.now()){

startCooldownFrom(
untilTimestamp
);

}
else{

localStorage.removeItem(
cooldownKey
);

}


}



return ()=>{

if(intervalRef.current){

clearInterval(
intervalRef.current
);

}

};


// eslint-disable-next-line react-hooks/exhaustive-deps
},[]);









const handleChangePassword =
async()=>{


if(!user){


errorToast(
"User session expired. Please login again."
);


return;


}




// কুলডাউন চলাকালীন ক্লিক ঠেকানোর extra safety
// (বাটন disabled থাকবে, তাও guard হিসেবে রাখা হলো)
if(remainingSeconds > 0){

errorToast(
`Please wait ${remainingSeconds}s before trying again.`
);

return;

}




if(!currentPassword){


errorToast(
"Enter your current password."
);


return;


}




try{


setLoading(true);




// create password request

await createPasswordRequest(
user
);





setCurrentPassword("");





successToast(

"Please check your email for changing password."

);




// কুলডাউন শুরু + localStorage এ সেভ (রিফ্রেশ করলেও ঠিক থাকবে)

const untilTimestamp =
Date.now() + COOLDOWN_SECONDS * 1000;


if(cooldownKey){

localStorage.setItem(
cooldownKey,
String(
untilTimestamp
)
);

}


startCooldownFrom(
untilTimestamp
);



}
catch(error){


console.log(error);



errorToast(
error.message
);



}
finally{


setLoading(false);


}



};








if(needsSetPassword){

return (

<div className="
min-h-screen
bg-[#FAF7F2]
p-4
text-gray-900
space-y-3
">


<div className="
bg-white
rounded-lg
p-4
border
border-gray-100
shadow-sm
text-center
">

<h1 className="
text-xl
font-bold
">

Set Password

</h1>

<p className="
text-xs
text-gray-500
mt-1
">

You signed up with Google, so no password is set yet.
Set one below so you can also log in with email &amp; password.

</p>

</div>



<div className="
bg-white
rounded-lg
p-4
border
border-gray-100
shadow-sm
">


<div className="
relative
">

<FiLock
className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"
/>

<input
type={
showNewPassword
?
"text"
:
"password"
}
placeholder="New Password"
value={newPassword}
onChange={(e)=>
setNewPassword(
e.target.value
)
}
className="
w-full
h-12
bg-[#FAF7F2]
rounded-lg
border
border-gray-100
pl-10
pr-10
text-sm
outline-none
focus:border-amber-500
"
/>

<button
type="button"
onClick={()=>
setShowNewPassword(
!showNewPassword
)
}
className="
absolute
right-3
top-1/2
-translate-y-1/2
text-gray-400
"
>
{
showNewPassword
?
<FiEyeOff/>
:
<FiEye/>
}
</button>

</div>



<div className="
relative
mt-3
">

<FiLock
className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"
/>

<input
type={
showConfirmNewPassword
?
"text"
:
"password"
}
placeholder="Confirm Password"
value={confirmNewPassword}
onChange={(e)=>
setConfirmNewPassword(
e.target.value
)
}
className="
w-full
h-12
bg-[#FAF7F2]
rounded-lg
border
border-gray-100
pl-10
pr-10
text-sm
outline-none
focus:border-amber-500
"
/>

<button
type="button"
onClick={()=>
setShowConfirmNewPassword(
!showConfirmNewPassword
)
}
className="
absolute
right-3
top-1/2
-translate-y-1/2
text-gray-400
"
>
{
showConfirmNewPassword
?
<FiEyeOff/>
:
<FiEye/>
}
</button>

</div>



<p className="
text-xs
text-gray-500
mt-3
">

✓ Password must contain minimum 6 characters.

</p>



<Button
onClick={handleSetPassword}
disabled={settingPassword}
className="
w-full
h-12
rounded-lg
mt-4
text-sm
font-semibold
"
>
{
settingPassword
?
"Saving..."
:
"Save Password"
}
</Button>


</div>


</div>

);

}




return (

<div className="
min-h-screen
bg-[#FAF7F2]
p-4
text-gray-900
space-y-3
">







<div className="
bg-white
rounded-lg
p-4
border
border-gray-100
shadow-sm
text-center
">


<h1 className="
text-xl
font-bold
">

Change Password

</h1>



<p className="
text-xs
text-gray-500
mt-1
">

Please check your email to verify password change.

</p>


</div>









<div className="
bg-white
rounded-lg
p-4
border
border-gray-100
shadow-sm
">





<div className="
relative
">



<FiLock

className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"

/>





<input


type={

showCurrent

?

"text"

:

"password"

}



placeholder="Current Password"



value={
currentPassword
}



onChange={(e)=>

setCurrentPassword(
e.target.value
)

}



className="
w-full
h-12
bg-[#FAF7F2]
rounded-lg
border
border-gray-100
pl-10
pr-10
text-sm
outline-none
focus:border-amber-500
"

/>






<button

type="button"

onClick={()=>


setShowCurrent(
!showCurrent
)

}


className="
absolute
right-3
top-1/2
-translate-y-1/2
text-gray-400
"

>


{

showCurrent

?

<FiEyeOff/>

:

<FiEye/>

}


</button>




</div>









<p className="
text-xs
text-gray-500
mt-3
">


✓ We will send a verification email before changing your password.


</p>








<Button

onClick={
handleChangePassword
}

disabled={
loading || remainingSeconds > 0
}

className="
w-full
h-12
rounded-lg
mt-4
text-sm
font-semibold
"

>


{

loading

?

"Sending..."

:

remainingSeconds > 0

?

`Resend in ${remainingSeconds}s`

:

"Change Password"

}


</Button>






</div>







</div>

);


}
