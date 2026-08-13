import {
  useState,
  useEffect,
  useRef
} from "react";


import {
  FiMail,
  FiLock
} from "react-icons/fi";


import {
  Link
} from "react-router-dom";


import Button from "../components/ui/Button";


import {
  forgotPassword
} from "../services/authService";


import {
  successToast,
  errorToast
} from "../components/ui/Toast";




// ১ মিনিট কুলডাউন (সেকেন্ডে)
const COOLDOWN_SECONDS = 60;


// এই ব্রাউজারে forgot-password রিকোয়েস্টের কুলডাউন সেভ রাখার key
const COOLDOWN_KEY = "forgotPasswordCooldownUntil";






export default function ForgotPassword(){




const [
email,
setEmail
]=useState("");



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


localStorage.removeItem(
COOLDOWN_KEY
);


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


const savedUntil =
localStorage.getItem(
COOLDOWN_KEY
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
COOLDOWN_KEY
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


},[]);








const handleReset =
async()=>{


// কুলডাউন চলাকালীন ক্লিক ঠেকানোর extra safety
// (বাটন disabled থাকবে, তাও guard হিসেবে রাখা হলো)
if(remainingSeconds > 0){

errorToast(
`Please wait ${remainingSeconds}s before trying again.`
);

return;

}




if(!email){


errorToast(
"Please enter your email."
);


return;


}



try{


setLoading(true);





await forgotPassword(
email
);





successToast(

"Password reset email sent. Please check your inbox."

);





setEmail("");




// কুলডাউন শুরু + localStorage এ সেভ (রিফ্রেশ করলেও ঠিক থাকবে)

const untilTimestamp =
Date.now() + COOLDOWN_SECONDS * 1000;


localStorage.setItem(
COOLDOWN_KEY,
String(
untilTimestamp
)
);


startCooldownFrom(
untilTimestamp
);



}
catch(error){





errorToast(

error.message ||

"Failed to send reset email."

);


}
finally{


setLoading(false);


}



};









return (

<div

className="
min-h-screen
bg-[#FAF7F2]
p-4
flex
items-start
justify-center
pt-10
"

>




<div

className="
w-full
max-w-md
space-y-3
"

>






{/* HEADER */}


<div

className="
bg-white
rounded-lg
p-4
border
border-gray-100
shadow-sm
text-center
"

>


<div

className="
w-12
h-12
mx-auto
rounded-full
bg-[#FFF7E8]
flex
items-center
justify-center
text-amber-500
mb-3
"

>

<FiLock size={22}/>


</div>





<h1

className="
text-xl
font-bold
text-gray-900
"

>

Forgot Password

</h1>





<p

className="
text-xs
text-gray-500
mt-1
"

>

Enter your email to receive password reset link.

</p>




</div>









{/* FORM CARD */}



<div

className="
bg-white
rounded-lg
p-4
border
border-gray-100
shadow-sm
"

>






<div

className="
relative
"

>


<FiMail

className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"

/>






<input


type="email"


placeholder="Email Address"



value={email}



onChange={(e)=>

setEmail(
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
pr-3
text-sm
outline-none
focus:border-amber-500
"

/>



</div>






<p

className="
text-xs
text-gray-500
mt-3
"

>

✓ A verification email will be sent before changing your password.

</p>








<Button

onClick={handleReset}

disabled={loading || remainingSeconds > 0}

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

"Send Reset Link"

}



</Button>









<div

className="
text-center
mt-4
"

>


<Link

to="/login"

className="
text-sm
text-amber-600
font-semibold
hover:underline
"

>

Back to Login

</Link>




</div>




</div>






</div>




</div>


);


}
