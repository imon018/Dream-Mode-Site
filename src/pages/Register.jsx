import {
  useState
} from "react";


import {
  useNavigate,
  Link
} from "react-router-dom";


import {
  FiUser,
  FiMail,
  FiLock
} from "react-icons/fi";


import {
  register
} from "../services/authService";


import {
  successToast,
  errorToast,
} from "../components/ui/Toast";


import Button from "../components/ui/Button";




export default function Register() {


const navigate =
useNavigate();



const [
loading,
setLoading
]=useState(false);


  
const [
name,
setName
]=useState("");



const [
email,
setEmail
]=useState("");



const [
password,
setPassword
]=useState("");






const handleRegister = async (e) => {

e.preventDefault();


if(loading)
return;


setLoading(true);




if (!name || !email || !password) {


errorToast(
"Please fill in all fields."
);


return;


}





try {


await register(

email,

password,

name

);





successToast(

"Verification email sent."

);





navigate("/verify-email", {

state: {

email

},

});




} catch (err) {

errorToast(
err.message
);

}

finally {

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


<FiUser size={22}/>


</div>





<h1

className="
text-xl
font-bold
"

>

Create Account

</h1>





<p

className="
text-xs
text-gray-500
mt-1
"

>

Create your Dream Mode account.

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

onSubmit={handleRegister}

className="
space-y-3
"

>







{/* NAME */}



<div

className="
relative
"

>


<FiUser

className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"

/>





<input


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

placeholder="Full Name"



value={name}



onChange={(e)=>

setName(
e.target.value
)

}



/>



</div>









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

placeholder="Email Address"



value={email}



onChange={(e)=>

setEmail(
e.target.value
)

}



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


type="password"



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

placeholder="Password"



value={password}



onChange={(e)=>

setPassword(
e.target.value
)

}



/>



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

"Registering..."

:

"Register"

}

</Button>








<div

className="
text-center
text-sm
text-gray-600
"

>


Already have an account?


{" "}



<Link

to="/login"

className="
text-amber-600
font-semibold
"

>


Login Now


</Link>



</div>







</form>



</div>






</div>





</div>


);


}
