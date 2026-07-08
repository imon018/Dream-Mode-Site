import useAuth from "../../hooks/useAuth";
import { useState, useEffect } from "react";

import { uploadImages } from "../../services/uploadService";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase/firestore";

export default function AdminProfile() {
  const { user } = useAuth();

  const [uploading, setUploading] = useState(false);
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    if (user?.photoURL) {
      setPhoto(user.photoURL);
    }
  }, [user]);

  const handlePhotoUpload = async (e) => {
    try {
      setUploading(true);

      const file = e.target.files[0];

      if (!file) return;

      const uploaded = await uploadImages([file]);

      const photoURL = uploaded[0].imageUrl;

      setPhoto(photoURL);

      await updateDoc(
        doc(db, "users", user.uid),
        {
          photoURL,
        }
      );

      alert("Photo uploaded successfully");

      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Admin Profile
      </h1>

      <div className="mb-8 flex flex-col items-center">

        <img
          src={
            photo ||
            "https://via.placeholder.com/150"
          }
          alt="Admin"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
        />

        <label className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl cursor-pointer">

          {uploading
            ? "Uploading..."
            : "Change Photo"}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />

        </label>

      </div>

      <div className="space-y-5">

        <div>
          <p className="text-gray-500">
            Email
          </p>

          <h2 className="text-xl font-semibold">
            {user?.email}
          </h2>
        </div>

        <div>
          <p className="text-gray-500">
            UID
          </p>

          <h2 className="text-lg break-all">
            {user?.uid}
          </h2>
        </div>

        <div>
          <p className="text-gray-500">
            Role
          </p>

          <span className="bg-blue-600 text-white px-4 py-2 rounded-full">
            {user?.role || "Admin"}
          </span>
        </div>

      </div>

    </div>
  );
}
