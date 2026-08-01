import { useState, useEffect } from "react";

import Button from "../../components/ui/Button";

import {
  FiImage,
  FiTrash2,
  FiEdit2,
} from "react-icons/fi";

import {
  uploadSingleImage,
  deleteImageFromCloudinary,
} from "../../services/uploadService";

import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";

export default function Categories() {

  const [categories,setCategories]=useState([]);

  const [name,setName]=useState("");

  const [image,setImage]=useState(null);

  const [preview,setPreview]=useState("");

  const [loading,setLoading]=useState(false);

  const [editingId,setEditingId]=useState(null);



  useEffect(()=>{

    loadCategories();

  },[]);



  async function loadCategories(){

    const data=await getCategories();

    setCategories(data);

  }



  const handleImage=(e)=>{

    const file=e.target.files[0];

    if(!file) return;

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );

  };



  async function handleSubmit(e){

    e.preventDefault();

    if(!name){

      errorToast("Category name required");

      return;

    }

    if(!editingId && !image){

      errorToast("Please upload image");

      return;

    }

    try{

      setLoading(true);

      let imageUrl="";

      let imagePublicId="";

      if(image){

        const uploaded=
        await uploadSingleImage(image);

        imageUrl=
        uploaded.imageUrl;

        imagePublicId=
        uploaded.publicId;

      }

      if(editingId){

        const oldCategory =
        categories.find(
          c=>c.id===editingId
        );

        await updateCategory(

          editingId,

          {

            name,

            ...(imageUrl && {
              imageUrl,
              imagePublicId,
            }),

          }

        );

        if(
          imageUrl &&
          oldCategory?.imagePublicId
        ){

          try{

            await deleteImageFromCloudinary(
              oldCategory.imagePublicId
            );

          }catch(err){

            console.log(
              "Old category image delete failed",
              err
            );

          }

        }

        successToast(
          "Category updated."
        );

      }

      else{

        await addCategory({

          name,

          imageUrl,

          imagePublicId,

        });

        successToast(
          "Category added."
        );

      }

      setName("");

      setImage(null);

      setPreview("");

      setEditingId(null);

      loadCategories();

    }

    catch(err){

      console.log(err);

      errorToast(
        "Something went wrong."
      );

    }

    finally{

      setLoading(false);

    }

  }


  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 md:p-8">

      <div className="max-w-5xl mx-auto">

        <div className="mb-6 text-center">

          <h1 className="text-2xl font-black text-[#172033]">
            Categories
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Create and manage product categories
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="
            bg-white
            rounded-xl
            shadow-sm
            border
            border-gray-100
            p-5
            space-y-5
          "
        >

          {/* CATEGORY NAME */}

          <div>

            <label className="block font-bold text-sm mb-2">
              Category Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Example: Saree"
              className="
                w-full
                h-12
                rounded-lg
                border
                border-gray-200
                px-4
                outline-none
                focus:border-amber-400
              "
            />

          </div>

          {/* IMAGE */}

          <div>

            <label className="block font-bold text-sm mb-2">
              Category Image
            </label>

            <label
              htmlFor="category-image"
              className="
                h-36
                border-2
                border-dashed
                border-gray-300
                rounded-xl
                flex
                flex-col
                justify-center
                items-center
                cursor-pointer
                bg-[#FAF7F2]
                hover:border-amber-400
                transition
              "
            >

              <FiImage
                size={46}
                className="text-amber-500"
              />

              <p className="mt-3 font-semibold">
                Upload Category Image
              </p>

              <p className="text-xs text-gray-400">
                PNG / JPG / WEBP
              </p>

            </label>

            <input
              id="category-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />

          </div>

          {/* IMAGE PREVIEW */}

          {preview && (

            <div className="flex justify-center">

              <div
                className="
                  w-28
                  h-28
                  rounded-full
                  bg-white
                  border-2
                  border-amber-400
                  shadow-lg
                  overflow-hidden
                  p-3
                "
              >

                <img
                  src={preview}
                  alt=""
                  className="
                    w-full
                    h-full
                    object-contain
                  "
                />

              </div>

            </div>

          )}

          <Button
            type="submit"
            disabled={loading}
            className="
              w-full
              h-12
              rounded-lg
              bg-gradient-to-r
              from-amber-400
              to-amber-500
              text-white
              font-bold
            "
          >

            {loading
              ? "Saving..."
              : editingId
              ? "Update Category"
              : "Save Category"}

          </Button>

        </form>

        {/* CATEGORY LIST */}

        <div className="mt-8">

          <h2 className="font-black text-xl mb-5">
            Category List
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            {categories.map((category)=>(

              <div
                key={category.id}
                className="
                  bg-white
                  rounded-2xl
                  p-4
                  shadow-sm
                  border
                  border-gray-100
                "
              >

                <div
                  className="
                    w-24
                    h-24
                    rounded-full
                    mx-auto
                    bg-[#fafafa]
                    overflow-hidden
                    p-3
                    border
                  "
                >

                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="
                      w-full
                      h-full
                      object-contain
                    "
                  />

                </div>

                <h3
                  className="
                    mt-4
                    text-center
                    font-bold
                  "
                >
                  {category.name}
                </h3>

                <div className="flex gap-2 mt-4">

                  <button
                    type="button"
                    onClick={()=>{
                      setEditingId(category.id);
                      setName(category.name);
                      setPreview(category.imageUrl);
                    }}
                    className="
                      flex-1
                      h-10
                      rounded-lg
                      bg-amber-500
                      text-white
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <FiEdit2 />

                  </button>

                  <button
                    type="button"
                    onClick={async()=>{

                      if(
                        !window.confirm(
                          "Delete category?"
                        )
                      ) return;

                      await deleteCategory(
                        category.id
                      );

                      if(category.imagePublicId){

                        try{

                          await deleteImageFromCloudinary(
                            category.imagePublicId
                          );

                        }catch(err){

                          console.log(
                            "Category image delete failed",
                            err
                          );

                        }

                      }

                      successToast(
                        "Deleted."
                      );

                      loadCategories();

                    }}
                    className="
                      flex-1
                      h-10
                      rounded-lg
                      bg-red-500
                      text-white
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <FiTrash2 />

                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );

}



