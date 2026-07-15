import {
  useState
} from "react";


import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";


import {
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";


import {
  auth
} from "../firebase/auth";


import Button from "../components/ui/Button";


import {
 successToast,
 errorToast
} from "../components/ui/Toast";





export default function ResetPassword(){


const [
params
]=useSearchParams();


const navigate =
useNavigate();



const code =
params.get(
"oobCode"
);



const [
password,
setPassword
]=useState("");



const [
confirm,
setConfirm
]=useState("");



const handleReset =
async()=>{


if(password !== confirm){

errorToast(
"Passwords do not match"
);

return;

}



try{


await verifyPasswordResetCode(

auth,

code

);



await confirmPasswordReset(
  auth,
  code,
  password
);


localStorage.setItem(
  "passwordResetDone",
  "true"
);


successToast(
  "Password updated."
);


navigate(
  "/login"
);



}
catch(error){


errorToast(
error.message
);


}


};







return (

<div className="
max-w-md
mx-auto
py-20
px-6
">


<h1 className="
text-3xl
font-bold
mb-6
">

Reset Password

</h1>



<input

type="password"

placeholder="New Password"

className="
w-full
border
p-3
rounded-xl
mb-4
"

onChange={(e)=>
setPassword(
e.target.value
)
}

/>




<input

type="password"

placeholder="Confirm Password"

className="
w-full
border
p-3
rounded-xl
mb-4
"

onChange={(e)=>
setConfirm(
e.target.value
)
}

/>




<Button

onClick={handleReset}

className="
w-full
"

>

Save Password

</Button>


</div>

);


}
