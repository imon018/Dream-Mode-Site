import { useState } from "react";

import Button from "../../components/ui/Button";

import {
  uploadSingleImage,
} from "../../services/uploadService";

import {
  addBanner,
} from "../../services/firestoreBannerService";

export default function HeroBanners() {

  const [title,setTitle] =
    useState("");

  const [subtitle,setSubtitle] =
    useState("");

  const [buttonText,setButtonText] =
    useState("");

  const [image,setImage] =
    useState(null);

  const handleSubmit =
  async(e)=>{

    e.preventDefault();

    if(!image) return;

    const uploaded =
      await uploadSingleImage(
        image
      );

    await addBanner({

      title,

      subtitle,

      buttonText,

      image:
        uploaded.imageUrl,

      createdAt:
        Date.now(),

    });

    alert(
      "Banner Added"
    );

    setTitle("");
    setSubtitle("");
    setButtonText("");
    setImage(null);

  };

  return (

    <div className="max-w-2xl">

      <h1 className="text-3xl font-bold mb-8">
        Hero Banner Manager
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          className="w-full border p-3 rounded-xl"
          placeholder="Title"
          value={title}
          onChange={(e)=>
            setTitle(
              e.target.value
            )
          }
        />

        <input
          className="w-full border p-3 rounded-xl"
          placeholder="Subtitle"
          value={subtitle}
          onChange={(e)=>
            setSubtitle(
              e.target.value
            )
          }
        />

        <input
          className="w-full border p-3 rounded-xl"
          placeholder="Button Text"
          value={buttonText}
          onChange={(e)=>
            setButtonText(
              e.target.value
            )
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e)=>
            setImage(
              e.target.files[0]
            )
          }
        />

        <Button
          type="submit"
          className="w-full"
        >
          Save Banner
        </Button>

      </form>

    </div>

  );
}
