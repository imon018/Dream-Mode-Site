import {
  useEffect,
  useState,
} from "react";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  deleteUser,
} from "firebase/auth";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

import {
  getUserProfile,
  updateUserProfile,
} from "../services/userService";

import {
  uploadSingleImage,
} from "../services/uploadService";

import {
  changePassword,
} from "../services/authService";

import {
  db,
} from "../firebase/firestore";

import Button from "../components/ui/Button";

import {
  successToast,
  errorToast,
} from "../components/ui/Toast";



export default function Profile() {


  const {
    user,
  } = useAuth();


  const navigate =
    useNavigate();



  const [loading,setLoading] =
    useState(true);


  const [saving,setSaving] =
    useState(false);


  const [changingPassword,setChangingPassword] =
    useState(false);


  const [deletingAccount,setDeletingAccount] =
    useState(false);




  const [name,setName] =
    useState("");


  const [phone,setPhone] =
    useState("");


  const [address,setAddress] =
    useState("");



  const [photoURL,setPhotoURL] =
    useState("");



  const [photoFile,setPhotoFile] =
    useState(null);




  const [newPassword,setNewPassword] =
    useState("");


  const [confirmPassword,setConfirmPassword] =
    useState("");


  const [showPassword,setShowPassword] =
    useState(false);



  const [activities,setActivities] =
    useState([]);



  const [activityLoading,setActivityLoading] =
    useState(true);






  useEffect(()=>{


    const loadProfile =
      async()=>{


        if(!user){

          setLoading(false);

          return;

        }



        try{


          const profile =
            await getUserProfile(
              user.uid
            );



          if(profile){


            setName(
              profile.name || ""
            );


            setPhone(
              profile.phone || ""
            );


            setAddress(
              profile.address || ""
            );


            setPhotoURL(
              profile.photoURL || ""
            );


          }



        }catch(error){


          console.log(error);


          errorToast(
            "Failed to load profile."
          );


        }finally{


          setLoading(false);


        }


      };



    loadProfile();


  },[user]);







  const addActivity =
    async(
      type,
      message
    )=>{


      if(!user)
        return;



      try{


        const activityRef =
          doc(
            db,
            "users",
            user.uid,
            "activity",
            crypto.randomUUID()
          );



        await setDoc(
          activityRef,
          {

            type,

            message,

            createdAt:
              serverTimestamp(),

          }
        );



      }catch(error){


        console.log(
          "Activity error:",
          error
        );


      }


    };

  useEffect(()=>{


    const loadActivities =
      async()=>{


        if(!user)
          return;



        try{


          const activityRef =
            collection(
              db,
              "users",
              user.uid,
              "activity"
            );



          const snapshot =
            await getDocs(
              activityRef
            );



          const data =
            snapshot.docs
              .map((item)=>({

                id:item.id,

                ...item.data(),

              }))
              .sort(
                (a,b)=>{

                  const first =
                    a.createdAt?.seconds || 0;


                  const second =
                    b.createdAt?.seconds || 0;


                  return second - first;

                }
              );



          setActivities(data);



        }catch(error){


          console.log(error);


        }finally{


          setActivityLoading(false);


        }


      };



    loadActivities();


  },[user]);






  const profileCompletion =
    (
      [
        name,
        phone,
        address,
        photoURL,
      ].filter(Boolean).length / 4
    ) * 100;

  const handleSave =
    async()=>{


      if(!user)
        return;




      if(phone){


        const phoneRegex =
          /^01[3-9]\d{8}$/;



        if(!phoneRegex.test(phone)){


          errorToast(
            "Enter valid Bangladesh phone number."
          );


          return;


        }


      }




      try{


        setSaving(true);



        let imageUrl =
          photoURL;




        if(photoFile){


          const uploaded =
            await uploadSingleImage(
              photoFile
            );



          imageUrl =
            uploaded.imageUrl;


        }





        await updateUserProfile(

          user.uid,

          {

            name,

            phone,

            address,

            photoURL:imageUrl,

          }

        );





        setPhotoURL(
          imageUrl
        );



        setPhotoFile(null);





        await addActivity(

          "profile_update",

          "Profile information updated"

        );





        successToast(

          "Profile updated successfully."

        );



      }catch(error){


        console.log(error);



        errorToast(
          error.message
        );



      }finally{


        setSaving(false);


      }



    };







  const handleRemovePhoto =
    async()=>{


      try{


        setPhotoURL("");

        setPhotoFile(null);




        await updateUserProfile(

          user.uid,

          {

            photoURL:"",

          }

        );





        await addActivity(

          "photo_remove",

          "Profile photo removed"

        );





        successToast(

          "Profile photo removed."

        );



      }catch(error){


        errorToast(
          error.message
        );


      }



    };

  const handleChangePassword =
    async()=>{


      if(
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


        setChangingPassword(true);




        await changePassword(

          user,

          newPassword

        );





        await addActivity(

          "password_change",

          "Password changed"

        );





        setNewPassword("");

        setConfirmPassword("");





        successToast(

          "Password changed successfully."

        );



      }catch(error){


        console.log(error);



        errorToast(
          error.message
        );



      }finally{


        setChangingPassword(false);


      }



    };









  const handleDeleteAccount =
    async()=>{


      if(!user)
        return;




      const confirmDelete =
        window.confirm(

          "Are you sure you want to delete your account?"

        );




      if(!confirmDelete)
        return;





      try{


        setDeletingAccount(true);





        const activityRef =
          collection(

            db,

            "users",

            user.uid,

            "activity"

          );





        const snapshot =
          await getDocs(
            activityRef
          );





        for(
          const item of snapshot.docs
        ){


          await deleteDoc(

            doc(

              db,

              "users",

              user.uid,

              "activity",

              item.id

            )

          );


        }





        await deleteDoc(

          doc(

            db,

            "users",

            user.uid

          )

        );





        await deleteUser(
          user
        );





        successToast(

          "Account deleted successfully."

        );





        navigate("/");



      }catch(error){


        console.log(error);



        errorToast(
          error.message
        );



      }finally{


        setDeletingAccount(false);


      }



    };

  if(!user){

    return (

      <div className="max-w-6xl mx-auto py-20 text-center">

        Please login first.

      </div>

    );

  }



  if(loading){

    return (

      <div className="max-w-6xl mx-auto py-20 text-center">

        Loading Profile...

      </div>

    );

  }





  return (

    <div className="max-w-7xl mx-auto px-6 py-12">


      <h1 className="text-4xl font-bold mb-8">

        My Profile

      </h1>




      <div className="grid lg:grid-cols-3 gap-8">



        {/* Profile Card */}


        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">


          <img

            src={
              photoURL ||
              "https://via.placeholder.com/200"
            }

            alt="Profile"

            className="w-40 h-40 rounded-full object-cover mx-auto border-4"

          />




          <input

            type="file"

            accept="image/*"

            disabled={saving}

            className="mt-5 w-full"

            onChange={(e)=>
              setPhotoFile(
                e.target.files[0]
              )
            }

          />




          {photoURL && (

            <button

              onClick={handleRemovePhoto}

              className="mt-3 text-red-600"

            >

              Remove Photo

            </button>

          )}






          <h2 className="text-2xl font-bold mt-6">

            {name || "Dream Mode User"}

          </h2>



          <p className="text-gray-500 mt-2">

            {user.email}

          </p>





          <div className="mt-6 text-left">


            <div className="flex justify-between mb-2">

              <span>

                Profile Completion

              </span>


              <span className="font-bold">

                {Math.round(profileCompletion)}%

              </span>


            </div>



            <div className="w-full bg-gray-200 rounded-full h-3">


              <div

                className="bg-primary h-3 rounded-full"

                style={{

                  width:
                  `${profileCompletion}%`

                }}

              />


            </div>



          </div>



        </div>






        {/* Edit Profile */}



        <div className="lg:col-span-2">


          <div className="bg-white rounded-3xl shadow-xl p-8">


            <h2 className="text-2xl font-bold mb-6">

              Edit Profile

            </h2>




            <div className="grid md:grid-cols-2 gap-5">



              <input

                className="border rounded-xl p-3"

                placeholder="Name"

                value={name}

                onChange={(e)=>
                  setName(e.target.value)
                }

              />




              <input

                className="border rounded-xl p-3 bg-gray-100"

                value={user.email}

                readOnly

              />





              <input

                className="border rounded-xl p-3"

                placeholder="Phone"

                value={phone}

                onChange={(e)=>
                  setPhone(e.target.value)
                }

              />





              <input

                className="border rounded-xl p-3"

                placeholder="Address"

                value={address}

                onChange={(e)=>
                  setAddress(e.target.value)
                }

              />



            </div>




            <Button

              onClick={handleSave}

              disabled={saving}

              className="w-full mt-6"

            >

              {
                saving
                ?
                "Saving..."
                :
                "Save Changes"
              }

            </Button>



          </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">


            <h2 className="text-2xl font-bold mb-6">

              Account Information

            </h2>



            <div className="space-y-4">


              <p>

                <b>User ID:</b>

                <br />

                {user.uid}

              </p>



              <p>

                <b>Email:</b>

                <br />

                {user.email}

              </p>



            </div>



          </div>






          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">


            <h2 className="text-2xl font-bold mb-6">

              Recent Activity

            </h2>




            {
              activityLoading

              ?

              <p>
                Loading activity...
              </p>


              :


              activities.length === 0


              ?

              <p className="text-gray-500">

                No activity found.

              </p>


              :


              <div className="space-y-4">


                {
                  activities.map(
                    (activity)=>(


                      <div

                        key={activity.id}

                        className="border rounded-xl p-4"

                      >


                        <p className="font-medium">

                          {activity.message}

                        </p>



                      </div>


                    )

                  )

                }


              </div>


            }


          </div>






          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">


            <h2 className="text-2xl font-bold mb-6">

              Quick Actions

            </h2>




            <div className="grid md:grid-cols-2 gap-4">



              <Link

                to="/my-orders"

                className="border rounded-2xl p-5"

              >

                📦 My Orders

              </Link>




              <Link

                to="/wishlist"

                className="border rounded-2xl p-5"

              >

                ❤️ Wishlist

              </Link>



            </div>



          </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">


            <h2 className="text-2xl font-bold mb-6">

              Security

            </h2>



            <input

              type={
                showPassword
                ?
                "text"
                :
                "password"
              }

              className="w-full border rounded-xl p-3 mb-4"

              placeholder="New Password"

              value={newPassword}

              onChange={(e)=>
                setNewPassword(
                  e.target.value
                )
              }

            />




            <input

              type={
                showPassword
                ?
                "text"
                :
                "password"
              }

              className="w-full border rounded-xl p-3"

              placeholder="Confirm Password"

              value={confirmPassword}

              onChange={(e)=>
                setConfirmPassword(
                  e.target.value
                )
              }

            />

                      <label className="flex items-center gap-2 mt-4">

  <input
    type="checkbox"
    checked={showPassword}
    onChange={() =>
      setShowPassword(!showPassword)
    }
  />

  Show Password

</label>




            <Button

  onClick={handleChangePassword}

  disabled={changingPassword}

  className="w-full mt-5"

>

  {
    changingPassword
    ?
    "Updating..."
    :
    "Change Password"
  }

</Button>



          </div>







          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">


            <h2 className="text-2xl font-bold text-red-600">

              Danger Zone

            </h2>



            <p className="mt-3 text-gray-600">

              Delete your account permanently.

            </p>




            <Button

              onClick={handleDeleteAccount}

              disabled={deletingAccount}

              className="bg-red-600 w-full mt-5"

            >

              {
                deletingAccount
                ?
                "Deleting..."
                :
                "Delete Account"
              }


            </Button>



          </div>




        </div>



      </div>



    </div>

  );


}
