import {
  useState
} from "react";

import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

import useAuth from "../../hooks/useAuth";

import {
  changePassword,
} from "../../services/authService";

import Button from "../../components/ui/Button";

import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";



export default function ChangePassword(){


const { user } = useAuth();

const [currentPassword,setCurrentPassword]=
useState("");

const [newPassword,setNewPassword]=
useState("");

const [confirmPassword,setConfirmPassword]=
useState("");

const [loading,setLoading]=
useState(false);

const [showCurrent,setShowCurrent]=
useState(false);

const [showNew,setShowNew]=
useState(false);

const [showConfirm,setShowConfirm]=
useState(false);





const passwordStrength=()=>{

if(newPassword.length<6)
return{
text:"Weak",
color:"text-red-500"
};

if(
/^(?=.*[A-Za-z])(?=.*\d).{6,}$/
.test(newPassword)
){
return{
text:"Strong",
color:"text-green-600"
};
}

return{
text:"Medium",
color:"text-amber-500"
};

};





const handleChangePassword=
async()=>{

if(
!currentPassword||
!newPassword||
!confirmPassword
){

errorToast(
"Fill all password fields."
);

return;

}



if(newPassword.length<6){

errorToast(
"Password must be at least 6 characters."
);

return;

}



if(newPassword!==confirmPassword){

errorToast(
"Passwords do not match."
);

return;

}



try{

setLoading(true);

await changePassword(

user,

currentPassword,

newPassword

);



setCurrentPassword("");

setNewPassword("");

setConfirmPassword("");



successToast(
"Password changed successfully. Verification email sent."
);

}
catch(error){

console.log(error);

if(
error.code==="auth/wrong-password"||
error.code==="auth/invalid-credential"
){

errorToast(
"Current password is incorrect."
);

}
else if(
error.code==="auth/requires-recent-login"
){

errorToast(
"Please login again and try."
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

const strength = passwordStrength();

return (

<div className="space-y-6">

  <div>

    <h1 className="
      text-3xl
      font-bold
      text-gray-900
    ">
      Change Password
    </h1>

    <p className="
      mt-2
      text-sm
      text-gray-500
    ">
      Update your password to keep your account secure.
    </p>

  </div>




  <div className="
    bg-card
    border
    border-border
    rounded-3xl
    shadow-luxury
    p-6
  ">

    <div className="space-y-5">


      {/* Current Password */}

      <div className="relative">

        <FiLock
          className="
          absolute
          left-4
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
          h-14
          rounded-2xl
          border
          border-border
          pl-12
          pr-12
          outline-none
          focus:ring-2
          focus:ring-amber-500/20
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
          right-4
          top-1/2
          -translate-y-1/2
          text-gray-500
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





      {/* New Password */}

      <div className="relative">

        <FiShield
          className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
          "
        />

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
          h-14
          rounded-2xl
          border
          border-border
          pl-12
          pr-12
          outline-none
          focus:ring-2
          focus:ring-amber-500/20
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
          right-4
          top-1/2
          -translate-y-1/2
          text-gray-500
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





      {/* Confirm Password */}

      <div className="relative">

        <FiCheckCircle
          className="
          absolute
          left-4
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
          h-14
          rounded-2xl
          border
          border-border
          pl-12
          pr-12
          outline-none
          focus:ring-2
          focus:ring-amber-500/20
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
          right-4
          top-1/2
          -translate-y-1/2
          text-gray-500
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





      {/* Password Strength */}

      <div className="
        rounded-2xl
        border
        border-border
        p-4
        bg-gray-50
      ">

        <div className="
          flex
          items-center
          justify-between
          mb-2
        ">

          <span className="text-sm text-gray-600">
            Password Strength
          </span>

          <span className={strength.color}>
            {strength.text}
          </span>

        </div>

        <p className="
          text-sm
          text-gray-500
        ">
          ✓ At least 6 characters
        </p>

      </div>





      <Button

        onClick={handleChangePassword}

        disabled={loading}

        className="
          w-full
          h-14
          rounded-2xl
          text-base
          font-semibold
        "

      >

        {
          loading
          ?
          "Updating..."
          :
          "Change Password"
        }

      </Button>

    </div>

  </div>

</div>

);

}
