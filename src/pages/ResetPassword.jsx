import {
  useState
} from "react";


import {
  useSearchParams,
  useNavigate
} from "react-router-dom";


import {
  getFunctions,
  httpsCallable
} from "firebase/functions";


import {
  FiLock,
  FiEye,
  FiEyeOff
} from "react-icons/fi";


import {
  functions
} from "../firebase/functions";


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





const token =
params.get(
"token"
);






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









const handleReset =
async()=>{



if(!token){


errorToast(
"Invalid reset link."
);


return;


}





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





const resetPassword =

httpsCallable(

getFunctions(),

"resetPassword"

);







await resetPassword({

token,

password

});







successToast(

"Password updated successfully."

);







setTimeout(()=>{


navigate(
"/login"
);


},1500);





}
catch(error){


console.log(error);



errorToast(

error.message ||

"Password reset failed."

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
items-center
justify-center
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

Reset Password

</h1>





<p

className="
text-xs
text-gray-500
mt-1
"

>

Create your new password.

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






{/* NEW PASSWORD */}


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

onClick={handleReset}

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






</div>






</div>





</div>


);


}
