import {
  useEffect,
  useState
} from "react";


import {
  useNavigate
} from "react-router-dom";


import {
  verifyPasswordChangeLink
} from "../services/authService";


import {
  successToast,
  errorToast
} from "../components/ui/Toast";





export default function PasswordChangeVerify(){


const navigate =
useNavigate();



const [
loading,
setLoading
]=useState(true);




const [
message,
setMessage
]=useState(
"Verifying your email..."
);






useEffect(()=>{


verifyPasswordChange();


},[]);








const verifyPasswordChange =
async()=>{


try{



await verifyPasswordChangeLink();







successToast(
"Password changed successfully."
);






setMessage(
"Password changed successfully. Redirecting to login..."
);







setTimeout(()=>{


navigate(
"/login"
);


},3000);





}
catch(error){


console.log(error);



errorToast(
error.message
);



setMessage(
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
flex
items-center
justify-center
">


<div className="
bg-white
rounded-2xl
shadow-lg
border
border-gray-100
p-8
max-w-md
w-full
text-center
">





<div className="
text-5xl
mb-5
">

📧

</div>






<h1 className="
text-2xl
font-bold
mb-4
">

Password Change Verification

</h1>






<p className="
text-gray-600
text-sm
">

{message}

</p>







{
loading &&

<div className="
mt-6
text-amber-600
font-semibold
">

Checking...

</div>

}



</div>


</div>

);


}
