import {
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";


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



export default function Login() {


  const navigate =
    useNavigate();


  const location =
    useLocation();





  const [email,setEmail] =
    useState("");



  const [password,setPassword] =
    useState("");



  const [unverifiedUser,setUnverifiedUser] =
    useState(null);







  const handleLogin =
  async(e)=>{


    e.preventDefault();



    try{


      const result =
        await login(
          email,
          password
        );



      await result.user.reload();





      if(!result.user.emailVerified){


        setUnverifiedUser(
          result.user
        );


        await logout();



        errorToast(
          "Please verify your email first."
        );


        return;


      }





      successToast(
        "Login Successful"
      );






      const redirect =
        new URLSearchParams(
          location.search
        )
        .get("redirect");





      if(redirect){


        navigate(
          `/${redirect}`
        );


        return;


      }







      if(
        result.user.role === "admin"
      ){

        navigate(
          "/admin"
        );


      }else{


        navigate(
          "/profile"
        );


      }






    }catch(err){



      let message =
        "Login failed. Please try again.";





      switch(err.code){


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
          "Login failed. Please try again.";

      }





      errorToast(
        message
      );



    }


  };









  const handleResendVerification =
  async()=>{


    try{


      if(!unverifiedUser)
        return;




      await resendVerificationEmail(
        unverifiedUser
      );



      successToast(
        "Verification email sent again."
      );



    }catch(err){


      errorToast(
        err.message
      );


    }


  };









  return (


    <div className="max-w-md mx-auto py-20 px-6">



      <h1 className="text-3xl font-bold mb-6">

        Login

      </h1>







      <form

        onSubmit={handleLogin}

        className="space-y-4"

      >





        <input

          className="w-full border p-3 rounded-xl"

          placeholder="Email"

          value={email}

          onChange={(e)=>
            setEmail(
              e.target.value
            )
          }

        />







        <input

          type="password"

          className="w-full border p-3 rounded-xl"

          placeholder="Password"

          value={password}

          onChange={(e)=>
            setPassword(
              e.target.value
            )
          }

        />







        <Button

          type="submit"

          className="w-full"

        >

          Login

        </Button>








        <div className="text-center space-y-3">


  <Link

    to="/forgot-password"

    className="block text-blue-600 hover:underline text-sm font-medium"

  >

    Forgot Password?

  </Link>





  <p className="text-sm text-gray-600">

    Don't have an account?

    {" "}

    <Link

      to="/register"

      className="text-blue-600 font-semibold hover:underline"

    >

      Register Now

    </Link>


  </p>


</div>







        {
          unverifiedUser && (


            <button

              type="button"

              onClick={
                handleResendVerification
              }

              className="w-full text-blue-600 font-medium mt-3"

            >

              Resend Verification Email

            </button>


          )

        }






      </form>



    </div>


  );

}
