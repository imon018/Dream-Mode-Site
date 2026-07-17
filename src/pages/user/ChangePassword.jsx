import {
  useState
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







export default function ChangePassword(){



const user =
auth.currentUser;





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








const handleChangePassword =
async()=>{


if(!user){


errorToast(
"User session expired. Please login again."
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
loading
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

"Change Password"

}


</Button>







</div>









</div>

);


}
