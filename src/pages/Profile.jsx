import { useState } from "react";

import useAuth from "../hooks/useAuth";

import {
  FiEdit,
} from "react-icons/fi";

import {
  useNavigate,
} from "react-router-dom";

import {
  uploadImages,
} from "../services/uploadService";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  db,
} from "../firebase/firestore";

import ResendVerificationButton
from "../components/auth/ResendVerificationButton";

export default function Profile(){

  const {
    user,
  } = useAuth();

  const navigate =
    useNavigate();

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const createdAt =
    user?.metadata?.creationTime
      ? new Date(
          user.metadata.creationTime
        ).toLocaleString()
      : "N/A";

  const lastLogin =
    user?.metadata?.lastSignInTime
      ? new Date(
          user.metadata.lastSignInTime
        ).toLocaleString()
      : "N/A";

  const handlePhotoUpload =
    async(e)=>{

      try{

        setUploading(true);

        const file =
          e.target.files[0];

        if(!file)
          return;

        const uploaded =
          await uploadImages([
            file,
          ]);

        const photoURL =
          uploaded[0].imageUrl;

        await updateDoc(

          doc(
            db,
            "users",
            user.uid
          ),

          {
            photoURL,
          }

        );

        alert(
          "Profile photo updated"
        );

        window.location.reload();

      }catch(err){

        console.log(err);

        alert(
          "Upload failed"
        );

      }finally{

        setUploading(false);

      }

    };

  return(

    <div className="max-w-5xl mx-auto">

  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

    {/* HEADER */}

    <div className="bg-slate-900 text-white p-8">

      <div className="flex flex-col md:flex-row items-center gap-6">

        {/* IMAGE */}

        <div className="relative">

          {
            user?.photoURL

            ?

            <img

              src={user.photoURL}

              alt="User"

              className="
              w-24
              h-24
              rounded-full
              object-cover
              border-4
              border-blue-600
              "

            />

            :

            <div
              className="
              w-24
              h-24
              rounded-full
              bg-blue-600
              flex
              items-center
              justify-center
              text-4xl
              font-bold
              "
            >

              {
                user?.email
                ?.charAt(0)
                ?.toUpperCase()
              }

            </div>

          }

          <label
            className="
            absolute
            -bottom-2
            left-1/2
            -translate-x-1/2
            bg-blue-600
            text-white
            px-3
            py-1
            rounded-full
            text-xs
            cursor-pointer
            whitespace-nowrap
            "
          >

            {
              uploading
              ?
              "Uploading..."
              :
              "Change"
            }

            <input

              type="file"

              accept="image/*"

              className="hidden"

              onChange={
                handlePhotoUpload
              }

            />

          </label>

        </div>

        {/* INFO */}

        <div>

          <div className="flex items-center gap-3">

            <h1 className="text-3xl font-bold">

              {
                user?.name ||
                "User Profile"
              }

            </h1>

            <button

              onClick={()=>
                navigate("/profile/edit")
              }

              className="
              bg-white
              text-slate-900
              w-9
              h-9
              rounded-full
              flex
              items-center
              justify-center
              shadow-md
              "

            >

              <FiEdit size={18}/>

            </button>

          </div>

          <p className="text-gray-300 mt-2">

            {user?.email}

          </p>

          <div className="flex items-center gap-3 flex-wrap">

  {
    user?.emailVerified ?

    <span
      className="
      bg-green-100
      text-green-700
      px-4
      py-2
      rounded-full
      font-medium
      "
    >
      ✅ Verified
    </span>

    :

    <>

      <span
        className="
        bg-red-100
        text-red-700
        px-4
        py-2
        rounded-full
        font-medium
        "
      >
        ❌ Not Verified
      </span>

      <ResendVerificationButton/>

    </>

  }

</div>

          <span
            className="
            inline-block
            mt-3
            bg-blue-600
            px-4
            py-2
            rounded-full
            text-sm
            "
          >

            User

          </span>

        </div>

      </div>

    </div>

    {/* DETAILS */}

    <div className="p-8">

  <div className="grid md:grid-cols-2 gap-6">

    {/* PHONE */}

    <div className="border rounded-xl p-5">

      <p className="text-gray-500 mb-2">

        Phone Number

      </p>

      <h2 className="font-semibold">

        {
          user?.phone ||
          "Not Added"
        }

      </h2>

    </div>



    {/* ADDRESS */}

    <div className="border rounded-xl p-5">

      <p className="text-gray-500 mb-2">

        Address

      </p>

      <h2 className="font-semibold leading-7">

        {
          user?.address ||
          "Not Added"
        }

        <br/>

        {
          user?.postOffice
        }

        <br/>

        {
          user?.thana
        }

        <br/>

        {
          user?.district
        }

      </h2>

    </div>



    {/* EMAIL */}

    <div className="border rounded-xl p-5">

      <p className="text-gray-500 mb-2">

        Email Address

      </p>

      <h2 className="font-semibold break-all">

        {
          user?.email
        }

      </h2>

    </div>



    {/* USER ID */}

    <div className="border rounded-xl p-5">

      <p className="text-gray-500 mb-2">

        User ID

      </p>

      <h2 className="break-all text-sm">

        {
          user?.uid
        }

      </h2>

    </div>



    {/* CREATED */}

    <div className="border rounded-xl p-5">

      <p className="text-gray-500 mb-2">

        Account Created

      </p>

      <h2>

        {
          createdAt
        }

      </h2>

    </div>



    {/* LAST LOGIN */}

    <div className="border rounded-xl p-5">

      <p className="text-gray-500 mb-2">

        Last Login

      </p>

      <h2>

        {
          lastLogin
        }

      </h2>

    </div>



    {/* EMAIL VERIFIED */}

    <div className="border rounded-xl p-5">

      <p className="text-gray-500 mb-2">

        Email Verification

      </p>

      {
        user?.emailVerified

        ?

        <span className="
        bg-green-100
        text-green-700
        px-4
        py-2
        rounded-full
        font-medium
        ">

          ✅ Verified

        </span>

        :

        <span className="
        bg-red-100
        text-red-700
        px-4
        py-2
        rounded-full
        font-medium
        ">

          ❌ Not Verified

        </span>
      }

    </div>



    {/* ROLE */}

    <div className="border rounded-xl p-5">

      <p className="text-gray-500 mb-2">

        Role

      </p>

      <span className="
      bg-blue-600
      text-white
      px-4
      py-2
      rounded-full
      ">

        User

      </span>

    </div>

  </div>

</div>

</div>

</div>

);

}
