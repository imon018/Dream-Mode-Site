import { useState } from "react";
import Button from "../../components/ui/Button";
import { addProductToDB } from "../../services/firestoreProductService";
import { uploadImage } from "../../services/uploadService";
import { successToast, errorToast } from "../../components/ui/Toast";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      if (image) {
        imageUrl = await uploadImage(image);
      }

      await addProductToDB({
        name,
        price: Number(price),
        image: imageUrl
      });

      successToast("Product added successfully!");

      setName("");
      setPrice("");
      setImage(null);

    } catch (err) {
      errorToast(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-6">
        Add Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="w-full border p-3 rounded-xl"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded-xl"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="file"
          className="w-full"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <Button className="w-full">
          Save Product
        </Button>

      </form>

    </div>
  );
}
