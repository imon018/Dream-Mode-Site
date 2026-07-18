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


import useAuth from "../../hooks/useAuth";


import {
  createDeleteAccountRequest
} from "../../services/deleteAccountService";






export default function DeleteAccount(){



const {
  user
} = useAuth();





const [
password,
setPassword
]=useState("");



const [
showPassword,
setShowPassword
]=useState(false);



const [
loading,
setLoading
]=useState(false);








const handleDeleteRequest =
async()=>{



if(!user){


errorToast(
"User session expired."
);


return;


}






if(!password){


errorToast(
"Enter your password."
);


return;


}







const confirm =
window.confirm(

"Are you sure? Your account will be permanently deleted after email verification."

);






if(!confirm){

return;

}









try{


setLoading(true);







await createDeleteAccountRequest(

user

);








setPassword("");





successToast(

"Verification email sent. Please check your inbox."

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







{/* HEADER */}

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
text-red-600
">

Delete Account

</h1>



<p className="
text-xs
text-gray-500
mt-1
">

Please verify your email before deleting your account.

</p>


</div>









{/* FORM CARD */}


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

showPassword

?

"text"

:

"password"

}



placeholder="Enter your password"



value={
password
}



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
focus:border-red-500
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









<p className="
text-xs
text-gray-500
mt-3
">


✓ A verification email will be sent before account deletion.


</p>







<p className="
text-xs
text-red-500
mt-2
">


⚠ This action cannot be undone after verification.


</p>









<Button


onClick={
handleDeleteRequest
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
bg-red-600
"


>


{

loading

?

"Sending..."

:

"Delete Account"

}



</Button>








</div>









</div>

);


}
