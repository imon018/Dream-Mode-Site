import {
  useEffect,
  useState,
} from "react";


import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";


import {
  auth
} from "../firebase/auth";


import {
  applyPasswordChange
} from "../services/authService";


import {
  successToast,
  errorToast,
} from "../components/ui/Toast";


import {
  doc,
  getDoc,
} from "firebase/firestore";


import {
  db
} from "../firebase/firestore";




export default function VerifyEmail(){


const location =
useLocation();


const navigate =
useNavigate();




const email =
location.state?.email || "";





const [
message,
setMessage
]=useState(
"Please verify your email from your inbox."
);




const [
loading,
setLoading
]=useState(false);








const checkVerification =
async()=>{


try{


setLoading(true);




const user =
auth.currentUser;




if(!user){


errorToast(
"Please login again."
);


return;


}







await user.reload();






if(!user.emailVerified){


errorToast(
"Email is not verified yet."
);


return;


}







// =========================
// PASSWORD CHANGE VERIFY
// =========================


const requestSnap =
await getDoc(
  doc(
    db,
    "passwordChangeRequests",
    user.uid
  )
);



if(requestSnap.exists()){

  const requestData =
  requestSnap.data();


  if(requestData.uid !== user.uid){

    throw new Error(
      "Invalid password change request."
    );

  }


  await applyPasswordChange(
    user
  );


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



  return;

}








// =========================
// REGISTER VERIFY
// =========================


successToast(
"Email verified successfully."
);



navigate(
"/login"
);




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
max-w-xl
mx-auto
py-20
px-6
">


<div className="
bg-white
rounded-2xl
shadow-lg
p-8
text-center
">





<div className="
text-6xl
mb-6
">

📧

</div>





<h1 className="
text-3xl
font-bold
mb-4
">

Check Your Email

</h1>






<p className="
text-gray-600
mb-4
">

We've sent a verification link to:

</p>





<p className="
font-semibold
text-lg
break-all
mb-8
">

{email}

</p>







<p className="
text-gray-500
mb-8
">

{message}

</p>







<button

onClick={checkVerification}

disabled={loading}

className="
w-full
bg-blue-600
text-white
py-3
rounded-xl
hover:bg-blue-700
disabled:opacity-50
"

>

{

loading

?

"Checking..."

:

"I Have Verified Email"

}


</button>







<div className="
mt-4
">

<Link

to="/login"

className="
text-blue-600
hover:underline
"

>

Go To Login

</Link>


</div>






</div>


</div>

);


}
