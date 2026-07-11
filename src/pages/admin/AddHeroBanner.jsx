import {
  useState,
} from "react";

import {
  uploadSingleImage,
} from "../../services/uploadService";

import {
  saveHeroBanner,
} from "../../services/heroService";

import Button from "../../components/ui/Button";

import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";


export default function AddHeroBanner(){

  const [image,setImage] =
    useState(null);

  const [preview,setPreview] =
    useState("");

  const [loading,setLoading] =
    useState(false);



  const handleImageChange =
    (e)=>{

      const file =
        e.target.files[0];


      if(file){

        setImage(file);

        setPreview(
          URL.createObjectURL(file)
        );

      }

    };



  const handleSubmit =
    async(e)=>{

      e.preventDefault();


      if(!image){

        errorToast(
          "Please select an image."
        );

        return;

      }


      try{

        setLoading(true);


        const uploaded =
          await uploadSingleImage(
            image
          );


        await saveHeroBanner({

          imageUrl:
            uploaded.imageUrl,


          publicId:
            uploaded.publicId,


          updatedAt:
            new Date(),

        });



        successToast(
          "Hero banner updated!"
        );


        setImage(null);

        setPreview("");


        const input =
          document.getElementById(
            "hero-image"
          );


        if(input){
          input.value="";
        }


      }catch(err){

        errorToast(
          err.message ||
          "Upload failed"
        );

      }finally{

        setLoading(false);

      }

    };



  return (

    <div
      className="
        max-w-xl
        mx-auto
        px-6
        py-12
      "
    >

      <h1
        className="
          text-3xl
          font-bold
          mb-8
        "
      >
        Upload Hero Banner
      </h1>



      <form
        onSubmit={handleSubmit}
        className="
          space-y-6
        "
      >


        {
          preview && (

            <img
              src={preview}
              alt="Preview"
              className="
                w-full
                rounded-2xl
                shadow
              "
            />

          )
        }



        <input
          id="hero-image"
          type="file"
          accept="image/*"
          className="
            w-full
          "
          onChange={
            handleImageChange
          }
        />



        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >

          {
            loading
            ?
            "Uploading..."
            :
            "Save Hero Banner"
          }

        </Button>


      </form>


    </div>

  );

}
