import {
  useState
} from "react";


import {
  FiEye,
  FiEyeOff,
  FiLock
} from "react-icons/fi";


import {
  requestPasswordChange
} from "../../services/authService";


import Button from "../../components/ui/Button";


import {
  successToast,
  errorToast
} from "../../components/ui/Toast";


import {
  auth
} from "../../firebase/auth";


import {
  useNavigate
} from "react-router-dom";


export default function ChangePassword(){


const user =
auth.currentUser;


  const navigate = useNavigate();



const [
currentPassword,
setCurrentPassword
]=useState("");



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
showCurrent,
setShowCurrent
]=useState(false);



const [
showNew,
setShowNew
]=useState(false);



const [
showConfirm,
setShowConfirm
]=useState(false);






const getStrength = ()=>{


if(!newPassword){

return {

text:"",
width:"0%",
color:"bg-gray-200"

};

}




if(newPassword.length < 6){

return {

text:"Weak",

width:"33%",

color:"bg-red-500"

};

}





if(
newPassword.length >= 6 &&
!/[A-Z]/.test(newPassword)
){

return {

text:"Medium",

width:"66%",

color:"bg-yellow-500"

};

}




return {

text:"Strong",

width:"100%",

color:"bg-green-500"

};


};





const strength =
getStrength();









const handleChangePassword =
async()=>{


if(
!currentPassword ||
!newPassword ||
!confirmPassword
){

errorToast(
"Fill all password fields."
);

return;

}




if(newPassword.length < 6){

errorToast(
"Password must be at least 6 characters."
);

return;

}




if(newPassword !== confirmPassword){

errorToast(
"Passwords do not match."
);

return;

}






try{


setLoading(true);





await requestPasswordChange(

user,

currentPassword,

newPassword

);






setCurrentPassword("");

setNewPassword("");

setConfirmPassword("");





successToast(
  "Please check your email for changing password."
);


navigate(
  "/verify-email",
  {
    state:{
      email:user.email,
      type:"password-change"
    }
  }
);




}
catch(error){


console.log(error);



if(
error.code==="auth/invalid-credential" ||
error.code==="auth/wrong-password"
){


errorToast(
"Current password is incorrect."
);


}

else{


errorToast(
error.message
);


}



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
">

Change Password

</h1>



<p className="
text-xs
text-gray-500
mt-1
">

Please Check Your Email To Verify For Changing Password.

</p>


</div>









{/* FORM */}

<div className="
bg-white
rounded-lg
p-4
border
border-gray-100
shadow-sm
">


<div className="
space-y-3
">








{/* CURRENT PASSWORD */}


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


value={currentPassword}


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









{/* NEW PASSWORD */}


<div className="relative">


<input

type={
showNew
?
"text"
:
"password"
}


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
pr-10
text-sm
outline-none
focus:border-amber-500
"

/>




<button

type="button"

onClick={()=>
setShowNew(
!showNew
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
showNew
?
<FiEyeOff/>
:
<FiEye/>
}


</button>


</div>








{/* STRENGTH */}


<div>


<div className="
h-2
bg-gray-200
rounded-full
overflow-hidden
">


<div

className={`
h-full
transition-all
${strength.width}
${strength.color}
`}

/>


</div>



{
strength.text &&

<p className="
text-xs
text-gray-500
mt-1
">

Password strength:
{strength.text}

</p>

}


</div>









{/* CONFIRM PASSWORD */}



<div className="
relative
">


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
px-4
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







<p className="
text-xs
text-gray-500
">

✓ Password must be at least 6 characters.

</p>







<Button

onClick={handleChangePassword}

disabled={loading}

className="
w-full
h-12
rounded-lg
mt-3
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







</div>

);


}
