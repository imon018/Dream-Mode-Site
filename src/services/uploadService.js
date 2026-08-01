export const uploadSingleImage = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();

  return {
    imageUrl: data.secure_url,
    publicId: data.public_id,
  };
};

export const uploadImages = async (files) => {
  const uploadedImages = [];

  for (const file of files) {
    const image = await uploadSingleImage(file);
    uploadedImages.push(image);
  }

  return uploadedImages;
};

// Permanently deletes an already-uploaded image from Cloudinary.
// publicId comes from the object returned by uploadSingleImage/uploadImages.
// Safe to call even if publicId is missing/null (older images saved before
// publicId tracking existed) - it just resolves without doing anything.
export const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) return null;

  const response = await fetch("/api/delete-cloudinary-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId }),
  });

  if (!response.ok) {
    throw new Error("Cloudinary delete failed");
  }

  return response.json();
};
