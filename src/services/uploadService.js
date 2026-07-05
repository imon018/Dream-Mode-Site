import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/storage";

export const uploadImage = async (file) => {
  const imageRef = ref(storage, `products/${Date.now()}_${file.name}`);

  await uploadBytes(imageRef, file);

  const url = await getDownloadURL(imageRef);

  return url;
};
