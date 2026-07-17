import {
  useEffect,
  useState
} from "react";


import {
  useSearchParams,
  useNavigate
} from "react-router-dom";


import {
  auth
} from "../firebase/auth";


import {
  db
} from "../firebase/firestore";


import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc
} from "firebase/firestore";


import {
  updatePassword
} from "firebase/auth";


import {
  successToast,
  errorToast
} from "../components/ui/Toast";





export default function PasswordChangeVerify(){


const navigate =
useNavigate();



const [
searchParams
]=useSearchParams();



const token =
searchParams.get(
"token"
);




const [
newPassword,
setNewPassword
]=useState("");



const [
confirmPassword,
setConfirmPassword
]=useState("");



const [
loading,
setLoading
]=useState(false);



const [
message,
setMessage
]=useState(
"Verifying password change..."
);



const [
requestData,
setRequestData
]=useState(null);



const [
requestDoc,
setRequestDoc
]=useState(null);









useEffect(()=>{

checkRequest();

},[]);









const checkRequest =
async()=>{


try{


if(!token){


throw new Error(
"Invalid password change link."
);

}




const q =
query(

collection(
db,
"passwordChangeRequests"
),

where(
"token",
"==",
token
)

);





const result =
await getDocs(q);





if(result.empty){


throw new Error(
"Invalid or expired link."
);


}





const docSnap =
result.docs[0];





const data =
docSnap.data();





setRequestDoc(
docSnap
);



setRequestData(
data
);





setMessage(
"Please enter your new password."
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



};









const handlePasswordChange =
async()=>{


try{


if(!auth.currentUser){


throw new Error(
"Please login again."
);


}





if(!newPassword || !confirmPassword){


throw new Error(
"Fill all password fields."
);


}





if(newPassword.length < 6){


throw new Error(
"Password must be at least 6 characters."
);


}





if(newPassword !== confirmPassword){


throw new Error(
"Passwords do not match."
);


}




setLoading(true);





await updatePassword(

auth.currentUser,

newPassword

);






if(requestDoc){


await deleteDoc(

requestDoc.ref

);


}







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


},2000);





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

🔐

</div>





<h1 className="
text-2xl
font-bold
mb-4
">

Password Change

</h1>





<p className="
text-sm
text-gray-600
mb-6
">

{message}

</p>





{
requestData &&

<div className="
space-y-3
">


<input

type="password"

placeholder="New Password"

value={newPassword}

onChange={(e)=>
setNewPassword(
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
px-4
outline-none
focus:border-amber-500
"

/>





<input

type="password"

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
px-4
outline-none
focus:border-amber-500
"

/>





<button

onClick={
handlePasswordChange
}

disabled={loading}

className="
w-full
h-12
bg-amber-500
text-white
rounded-lg
font-semibold
disabled:opacity-50
"

>


{

loading

?

"Updating..."

:

"Update Password"

}


</button>



</div>

}





</div>


</div>

);


}
