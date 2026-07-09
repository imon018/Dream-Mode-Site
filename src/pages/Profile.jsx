import { useEffect, useState } from "react";

import useAuth from "../hooks/useAuth";

import {
  getUserProfile,
  updateUserProfile,
} from "../services/userService";

import { uploadSingleImage } from "../services/uploadService";

import {
  successToast,
  errorToast,
} from "../components/ui/Toast";

import Button from "../components/ui/Button";

export default function Profile() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [photoURL, setPhotoURL] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);

        if (profile) {
          setName(profile.name || "");
          setPhone(profile.phone || "");
          setAddress(profile.address || "");
          setPhotoURL(profile.photoURL || "");
        }
      } catch (err) {
        console.error(err);
        errorToast("Failed to load profile.");
      }

      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      let imageUrl = photoURL;

      if (photoFile) {
        const uploaded = await uploadSingleImage(photoFile);
        imageUrl = uploaded.imageUrl;
      }

      await updateUserProfile(user.uid, {
        name,
        phone,
        address,
        photoURL: imageUrl,
      });

      setPhotoURL(imageUrl);

      successToast("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      errorToast(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        Please login first.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold mb-8">
        My Profile
      </h1>

      <div className="bg-white shadow-xl rounded-2xl p-8">

        <div className="flex flex-col items-center mb-8">

          <img
            src={
              photoURL ||
              "https://via.placeholder.com/150?text=Profile"
            }
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-gray-200"
          />

          <input
            type="file"
            accept="image/*"
            className="mt-4"
            onChange={(e) =>
              setPhotoFile(e.target.files[0])
            }
          />

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="font-medium">
              Full Name
            </label>

            <input
              className="w-full border rounded-xl p-3 mt-2"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div>
            <label className="font-medium">
              Email
            </label>

            <input
              className="w-full border rounded-xl p-3 mt-2 bg-gray-100"
              value={user.email}
              readOnly
            />
          </div>

          <div>
            <label className="font-medium">
              Phone Number
            </label>

            <input
              className="w-full border rounded-xl p-3 mt-2"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />
          </div>

          <div>
            <label className="font-medium">
              Address
            </label>

            <input
              className="w-full border rounded-xl p-3 mt-2"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
            />
          </div>

        </div>

        <Button
          onClick={handleSave}
          className="w-full mt-8"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </Button>

      </div>
    </div>
  );
}
