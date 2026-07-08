import { useState } from "react";
import Button from "../../components/ui/Button";
import { addProductToDB } from "../../services/firestoreProductService";
import { uploadImage } from "../../services/uploadService";
import { successToast, errorToast } from "../../components/ui/Toast";

export default function AddProduct() {
  const [name, setName] = useState("");
const [category, setCategory] = useState("");
const [description, setDescription] = useState("");
const [price, setPrice] = useState("");
const [stock, setStock] = useState("");
const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
  !name ||
  !category ||
  !description ||
  !price ||
  !stock ||
  !image
) {
  errorToast("Please fill in all fields.");
  return;
}

try {
      let imageUrl = "";

      if (image) {
        imageUrl = await uploadImage(image);
      }

      await addProductToDB({
  name,
  category,
  description,
  price: Number(price),
  stock: Number(stock),
  image: imageUrl,
  createdAt: new Date(),
});

      successToast("Product added successfully!");

      setName("");
setCategory("");
setDescription("");
setPrice("");
setStock("");
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
  placeholder="Category"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
/>
        
<textarea
  className="w-full border p-3 rounded-xl"
  rows={4}
  placeholder="Product Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

        <input
  type="number"
  className="w-full border p-3 rounded-xl"
  placeholder="Price"
  value={price}
  onChange={(e) => setPrice(e.target.value)}
/>

<input
  type="number"
  className="w-full border p-3 rounded-xl"
  placeholder="Stock Quantity"
  value={stock}
  onChange={(e) => setStock(e.target.value)}
/>

        <input
          type="file"
          className="w-full"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <Button
  type="submit"
  className="w-full"
>
  Save Product
</Button>

      </form>

    </div>
  );
}
