import {
  useState
} from "react";


import {
  useNavigate,
  useLocation,
} from "react-router-dom";


import {
  FiLock,
  FiEye,
  FiEyeOff
} from "react-icons/fi";


import {
  setSocialUserPassword
} from "../services/authService";


import {
  successToast,
  errorToast,
} from "../components/ui/Toast";


import { useAuth } from "../context/AuthContext";


import Button from "../components/ui/Button";




// =========================
// SET PASSWORD
// Shown right after a Google
// sign-up, so the user can also set a
// password and log in normally later.
// =========================

export default function SetPassword(){


const navigate =
useNavigate();


const location =
useLocation();


const { refreshUser } =
useAuth();


const redirect =
location.state?.redirect || null;


const role =
location.state?.role || "user";




const [
password,
setPassword
]=useState("");



const [
confirmPassword,
setConfirmPassword
]=useState("");



const [
showPassword,
setShowPassword
]=useState(false);



const [
showConfirm,
setShowConfirm
]=useState(false);



const [
loading,
setLoading
]=useState(false);




const goNext = ()=>{

if(redirect){

navigate(`/${redirect}`);

return;

}

if(role === "admin"){

navigate("/admin");

}else{

navigate("/profile");

}

};




const handleSetPassword =
async()=>{


if(loading)
return;



if(!password || !confirmPassword){


errorToast(
"Please fill all fields."
);


return;


}



if(password.length < 6){


errorToast(
"Password must be at least 6 characters."
);


return;


}



if(password !== confirmPassword){


errorToast(
"Passwords do not match."
);


return;


}




try{


setLoading(true);


await setSocialUserPassword(
password
);


await refreshUser?.();


successToast(
"Password set successfully."
);


goNext();


}
catch(error){




let message =
"Password set করা যায়নি। আবার চেষ্টা করুন.";


if(error.code === "auth/requires-recent-login"){

message =
"নিরাপত্তার জন্য অনুগ্রহ করে আবার sign in করুন এবং পুনরায় চেষ্টা করুন.";

}


errorToast(
error.message || message
);


}
finally{


setLoading(false);


}


};




const handleSkip = ()=>{

goNext();

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
text-gray-900
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
"

>

Set a Password

</h1>



<p

className="
text-xs
text-gray-500
mt-1
"

>

Set a password so you can also log in with email &amp; password next time.

</p>


</div>




{/* FORM */}


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



{/* PASSWORD */}


<div

className="
relative
"

>


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

showPassword

?

"text"

:

"password"

}



placeholder="New Password"



value={password}



onChange={(e)=>

setPassword(
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


setShowPassword(
!showPassword
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

showPassword

?

<FiEyeOff/>

:

<FiEye/>

}


</button>



</div>




{/* CONFIRM PASSWORD */}


<div

className="
relative
mt-3
"

>


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

showConfirm

?

"text"

:

"password"

}



placeholder="Confirm Password"



value={confirmPassword}



onChange={(e)=>

setConfirmPassword(
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


setShowConfirm(
!showConfirm
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

showConfirm

?

<FiEyeOff/>

:

<FiEye/>

}


</button>



</div>



<p

className="
text-xs
text-gray-500
mt-3
"

>

✓ Password must contain minimum 6 characters.

</p>



<Button

onClick={handleSetPassword}

disabled={loading}

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

"Saving..."

:

"Save Password"

}


</Button>



<button

type="button"

onClick={handleSkip}

disabled={loading}

className="
w-full
text-center
text-sm
text-gray-500
mt-3
hover:underline
"

>

Skip for now

</button>



</div>




</div>



</div>

);


}
