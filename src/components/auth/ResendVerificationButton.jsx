import {
  useEffect,
  useState,
} from "react";

import {
  auth,
} from "../../firebase/auth";

import {
  resendVerificationEmail,
} from "../../services/authService";

import {
  successToast,
  errorToast,
} from "../ui/Toast";

const STORAGE_KEY =
  "verificationEmailLastSent";

const COOLDOWN = 60;

export default function ResendVerificationButton(){

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    cooldown,
    setCooldown,
  ] = useState(0);

  const [
    lastSent,
    setLastSent,
  ] = useState(null);

  useEffect(()=>{

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if(!saved)
      return;

    const time =
      Number(saved);

    setLastSent(time);

    const diff =
      Math.floor(
        (Date.now()-time)/1000
      );

    if(diff < COOLDOWN){

      setCooldown(
        COOLDOWN-diff
      );

    }

  },[]);

  useEffect(()=>{

    if(cooldown<=0)
      return;

    const timer =
      setInterval(()=>{

        setCooldown(prev=>{

          if(prev<=1){

            clearInterval(timer);

            return 0;

          }

          return prev-1;

        });

      },1000);

    return ()=>clearInterval(timer);

  },[cooldown]);

  const handleResend =
  async()=>{

    try{

      setLoading(true);

      await resendVerificationEmail(
        auth.currentUser
      );

      const now =
        Date.now();

      localStorage.setItem(
        STORAGE_KEY,
        now.toString()
      );

      setLastSent(now);

      setCooldown(
        COOLDOWN
      );

      successToast(
        "Verification email sent."
      );

    }catch(error){

      errorToast(
        error.message
      );

    }finally{

      setLoading(false);

    }

  };

  return(

    <div className="mt-4 text-center">

  {
    lastSent && (

      <>

        <p className="text-xs text-gray-500">

          Last sent:

        </p>

        <p className="font-medium mb-3">

          {
            new Date(lastSent).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )
          }

        </p>

      </>

    )
  }

  {

    cooldown > 0

    ?

    <div>

      <p className="text-xs text-gray-500">

        Resend available after:

      </p>

      <p className="font-semibold text-amber-600">

        {cooldown} seconds

      </p>

    </div>

    :

    <button

      type="button"

      disabled={loading}

      onClick={handleResend}

      className="
      text-amber-600
      font-medium
      hover:underline
      disabled:text-gray-400
      "

    >

      {

        loading

        ?

        "Sending..."

        :

        "Resend Verification Email"

      }

    </button>

  }

</div>

  );

}
