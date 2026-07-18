import {
  useState
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






export default function ForgotPassword(){



const [
email,
setEmail
]=useState("");



const [
loading,
setLoading
]=useState(false);








const handleReset =
async()=>{


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



}
catch(error){


console.log(error);



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

"Sending..."

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
