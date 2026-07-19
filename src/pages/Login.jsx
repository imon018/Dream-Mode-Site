import {
  useState
} from "react";


import {
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";


import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff
} from "react-icons/fi";


import {
  login,
  logout,
  resendVerificationEmail,
} from "../services/authService";


import {
  successToast,
  errorToast,
} from "../components/ui/Toast";


import Button from "../components/ui/Button";






export default function Login(){



const navigate =
useNavigate();



const location =
useLocation();






const [
email,
setEmail
]=useState("");





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





const [
showResend,
setShowResend
]=useState(false);








const handleLogin =
async(e)=>{


e.preventDefault();




if(loading)
return;






try{


setLoading(true);


setShowResend(false);





const result =
await login(

email,

password

);





const user =
result.user;



await user.reload();





successToast(
"Login Successful"
);








const redirect =

new URLSearchParams(
location.search
)

.get(
"redirect"
);







if(redirect){


navigate(
`/${redirect}`
);


return;


}







if(
result.role === "admin"
){


navigate(
"/admin"
);


}

else{


navigate(
"/profile"
);


}



catch(error){



console.log(
"LOGIN ERROR:",
error
);





if(
error.message ===
"Please verify your email first."
){


setShowResend(true);



errorToast(
"Please verify your email first."
);



return;


}






let message =
"Login failed. Please try again.";





switch(error.code){


case "auth/user-not-found":


message =
"এই email দিয়ে কোনো account পাওয়া যায়নি.";


break;



case "auth/wrong-password":


message =
"Password ভুল হয়েছে.";


break;



case "auth/invalid-credential":


message =
"Email অথবা Password ভুল হয়েছে.";


break;



case "auth/invalid-email":


message =
"সঠিক email address দিন.";


break;



case "auth/too-many-requests":


message =
"অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন.";


break;



default:


message =
error.message ||
"Login failed.";


}





errorToast(
message
);



}

finally{


setLoading(false);


}



};










// =========================
// RESEND VERIFICATION EMAIL
// LOGIN NOT REQUIRED
// CUSTOM MAIL
// =========================


const handleResendVerification =
async()=>{


try{



if(!email){


errorToast(
"Email required."
);


return;


}





await resendVerificationEmail(

email

);





successToast(

"Verification email sent again."

);




}

catch(error){


console.log(error);



errorToast(

error.message

);


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

Login

</h1>





<p

className="
text-xs
text-gray-500
mt-1
"

>

Login to your Dream Mode account.

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






<form

onSubmit={handleLogin}

className="
space-y-3
"

>









{/* EMAIL */}



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
text-sm
outline-none
focus:border-amber-500
"

/>



</div>









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



placeholder="Password"



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



<div

className="
text-right
"

>

<Link

to="/forgot-password"

className="
text-xs
text-amber-600
font-semibold
hover:underline
"

>

Forgot Password?

</Link>


</div>








<Button

type="submit"

disabled={loading}

className="
w-full
h-12
rounded-lg
text-sm
font-semibold
"

>


{

loading

?

"Logging..."

:

"Login"

}



</Button>









<div

className="
text-center
text-sm
text-gray-600
"

>

Don't have an account?

{" "}



<Link

to="/register"

className="
text-amber-600
font-semibold
"

>

Register Now

</Link>



</div>









{

showResend && (

<button

type="button"

onClick={handleResendVerification}

className="
w-full
text-sm
text-amber-600
font-medium
hover:underline
"

>

Resend Verification Email

</button>


)

}








</form>







</div>






</div>







</div>


);


}
