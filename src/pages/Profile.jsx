import { useEffect, useState } from "react";

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
  logout,
} from "../services/authService";

import {
  deleteUser,
} from "firebase/auth";

import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

import {
  successToast,
  errorToast,
} from "../components/ui/Toast";

import Button from "../components/ui/Button";

import { Link, useNavigate } from "react-router-dom";


export default function Profile() {

  const { user } = useAuth();

  const navigate = useNavigate();


  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [deletingAccount, setDeletingAccount] =
    useState(false);


  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [photoURL, setPhotoURL] =
    useState("");

  const [photoFile, setPhotoFile] =
    useState(null);


  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);


  const [profileData, setProfileData] =
    useState(null);


  useEffect(() => {

    const loadProfile = async () => {

      if (!user) {

        setLoading(false);

        return;

      }


      try {

        const profile =
          await getUserProfile(
            user.uid
          );


        if (profile) {

          setProfileData(profile);

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


      } catch (error) {

        console.log(error);

        errorToast(
          "Failed to load profile."
        );

      }


      setLoading(false);

    };


    loadProfile();

  }, [user]);

  const addActivity = async (
    type,
    message
  ) => {

    if (!user) return;

    try {

      const activityRef = doc(
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
            new Date(),
        }
      );


    } catch (error) {

      console.log(
        "Activity error:",
        error
      );

    }

  };



  const handleSave = async () => {

    if (!user) return;


    if (phone) {

      const phoneRegex =
        /^01[3-9]\d{8}$/;


      if (!phoneRegex.test(phone)) {

        errorToast(
          "Enter valid Bangladesh phone number."
        );

        return;

      }

    }


    try {

      setSaving(true);


      let imageUrl =
        photoURL;


      if (photoFile) {

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
          photoURL: imageUrl,
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


    } catch (error) {

      console.log(error);

      errorToast(
        error.message
      );


    } finally {

      setSaving(false);

    }

  };



  const handleRemovePhoto = async () => {

    setPhotoFile(null);

    setPhotoURL("");


    await updateUserProfile(
      user.uid,
      {
        photoURL: "",
      }
    );


    await addActivity(
      "photo_remove",
      "Profile photo removed"
    );


    successToast(
      "Profile photo removed."
    );

  };



  const handleChangePassword = async () => {

    if (!newPassword) {

      errorToast(
        "Enter new password."
      );

      return;

    }


    if (newPassword.length < 6) {

      errorToast(
        "Password must be at least 6 characters."
      );

      return;

    }


    if (newPassword !== confirmPassword) {

      errorToast(
        "Passwords do not match."
      );

      return;

    }


    try {

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


    } catch (error) {

      console.log(error);

      errorToast(
        error.message
      );


    } finally {

      setChangingPassword(false);

    }

  };

  const [activities, setActivities] =
    useState([]);


  const [activityLoading, setActivityLoading] =
    useState(true);



  useEffect(() => {

    const loadActivities = async () => {

      if (!user) return;


      try {

        const activityRef =
          collection(
            db,
            "users",
            user.uid,
            "activity"
          );


        const snapshot =
          await getDocs(activityRef);


        const data =
          snapshot.docs
            .map((item) => ({
              id: item.id,
              ...item.data(),
            }))
            .sort(
              (a, b) =>
                b.createdAt?.seconds -
                a.createdAt?.seconds
            );


        setActivities(data);


      } catch (error) {

        console.log(error);

      } finally {

        setActivityLoading(false);

      }

    };


    loadActivities();

  }, [user]);




  const profileCompletion =
    [
      name,
      phone,
      address,
      photoURL,
    ].filter(Boolean).length / 4 * 100;




  const handleDeleteAccount = async () => {

    if (!user) return;


    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete your account?"
      );


    if (!confirmDelete)
      return;



    try {

      setDeletingAccount(true);


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


    } catch (error) {

      console.log(error);


      errorToast(
        error.message
      );


    } finally {

      setDeletingAccount(false);

    }

  };

  if (!user) {

    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        Please login first.
      </div>
    );

  }


  if (loading) {

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
            onChange={(e) =>
              setPhotoFile(
                e.target.files[0]
              )
            }
          />


          {photoURL && (

            <button
              onClick={handleRemovePhoto}
              disabled={saving}
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

              <span className="font-medium">
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





        <div className="lg:col-span-2 space-y-8">



          <div className="bg-white rounded-3xl shadow-xl p-8">


            <h2 className="text-2xl font-bold mb-6">
              Edit Profile
            </h2>


            <div className="grid md:grid-cols-2 gap-5">


              <input
                className="border rounded-xl p-3"
                placeholder="Name"
                value={name}
                disabled={saving}
                onChange={(e) =>
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
                disabled={saving}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />



              <input
                className="border rounded-xl p-3"
                placeholder="Address"
                value={address}
                disabled={saving}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
              />


            </div>



            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-6"
            >

              {saving
                ? "Saving..."
                : "Save Changes"}

            </Button>


          </div>

                    {/* Account Information */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-2xl font-bold mb-6">
              Account Information
            </h2>


            <div className="space-y-4">


              <div className="flex justify-between border-b pb-3">

                <span className="font-medium">
                  User ID
                </span>


                <span className="text-gray-500 text-sm break-all">
                  {user.uid}
                </span>


              </div>



              <div className="flex justify-between border-b pb-3">

                <span className="font-medium">
                  Email
                </span>


                <span className="text-gray-500">
                  {user.email}
                </span>


              </div>



              <div className="flex justify-between border-b pb-3">

                <span className="font-medium">
                  Member Since
                </span>


                <span className="text-gray-500">

                  {user.metadata?.creationTime
                    ? new Date(
                        user.metadata.creationTime
                      ).toLocaleDateString()
                    : "N/A"}

                </span>


              </div>


            </div>


          </div>





          {/* Activity History */}


          <div className="bg-white rounded-3xl shadow-xl p-8">


            <h2 className="text-2xl font-bold mb-6">
              Recent Activity
            </h2>



            {
              activityLoading ? (

                <p>
                  Loading activity...
                </p>

              ) : activities.length === 0 ? (

                <p className="text-gray-500">
                  No activity found.
                </p>

              ) : (

                <div className="space-y-4">


                  {activities.map((activity) => (

                    <div
                      key={activity.id}
                      className="border rounded-xl p-4"
                    >

                      <p className="font-medium">
                        {activity.message}
                      </p>


                      <p className="text-sm text-gray-500 mt-1">

                        {activity.createdAt?.toDate
                          ? activity.createdAt
                              .toDate()
                              .toLocaleString()
                          : ""}

                      </p>


                    </div>

                  ))}


                </div>

              )

            }


          </div>





          {/* Quick Actions */}


          <div className="bg-white rounded-3xl shadow-xl p-8">


            <h2 className="text-2xl font-bold mb-6">
              Quick Actions
            </h2>



            <div className="grid md:grid-cols-2 gap-4">


              <Link
                to="/my-orders"
                className="border rounded-2xl p-5 hover:bg-gray-50"
              >

                <h3 className="font-bold text-lg">
                  📦 My Orders
                </h3>


                <p className="text-gray-500 mt-2">
                  View your order history
                </p>


              </Link>




              <Link
                to="/wishlist"
                className="border rounded-2xl p-5 hover:bg-gray-50"
              >

                <h3 className="font-bold text-lg">
                  ❤️ Wishlist
                </h3>


                <p className="text-gray-500 mt-2">
                  Saved products
                </p>


              </Link>


            </div>


          </div>

                    {/* Security */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-2xl font-bold mb-6">
              Security
            </h2>


            <div className="space-y-5">


              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className="w-full border rounded-xl p-3"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
              />



              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className="w-full border rounded-xl p-3"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />



              <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                />


                Show Password

              </label>




              <Button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="w-full"
              >

                {changingPassword
                  ? "Updating..."
                  : "Change Password"}

              </Button>

              </div>


          </div>





          {/* Danger Zone */}


          <div className="bg-white rounded-3xl shadow-xl p-8">


            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Danger Zone
            </h2>



            <p className="text-gray-600 mb-5">

              Delete your account permanently.
              This action cannot be undone.

            </p>



            <Button
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
              className="bg-red-600 hover:bg-red-700 w-full"
            >

              {deletingAccount
                ? "Deleting..."
                : "Delete Account"}

            </Button>


          </div>



        </div>


      </div>


    </div>

  );

}
