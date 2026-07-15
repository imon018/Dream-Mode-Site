import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  FaWhatsapp,
} from "react-icons/fa";

import {
  useSettings
} from "../context/SettingsContext";


export default function WhatsAppButton() {


  const buttonRef = useRef(null);

  const {
    settings
  } = useSettings();


  const [position,setPosition] = useState({

    x: window.innerWidth - 90,

    y: window.innerHeight - 120,

  });



  const [dragging,setDragging] = useState(false);


  const offset = useRef({

    x:0,

    y:0,

  });





  useEffect(()=>{

    const saved =
      localStorage.getItem(
        "whatsapp-position"
      );


    if(saved){

      const oldPosition =
        JSON.parse(saved);


      const safePosition = {

        x: Math.min(
          oldPosition.x,
          window.innerWidth - 70
        ),

        y: Math.min(
          oldPosition.y,
          window.innerHeight - 70
        ),

      };


      setPosition(safePosition);

    }


  },[]);





  const startDrag = (e)=>{


    setDragging(true);


    const clientX =
      e.touches
      ? e.touches[0].clientX
      : e.clientX;


    const clientY =
      e.touches
      ? e.touches[0].clientY
      : e.clientY;



    offset.current = {

      x:
      clientX - position.x,

      y:
      clientY - position.y,

    };


  };






  const drag = (e)=>{


    if(!dragging) return;



    const clientX =
      e.touches
      ? e.touches[0].clientX
      : e.clientX;


    const clientY =
      e.touches
      ? e.touches[0].clientY
      : e.clientY;



    const newPosition = {


      x:
      clientX - offset.current.x,


      y:
      clientY - offset.current.y,


    };



    setPosition(newPosition);


  };







  const stopDrag = ()=>{


    setDragging(false);


    localStorage.setItem(

      "whatsapp-position",

      JSON.stringify(position)

    );


  };




  return (


    <a

      ref={buttonRef}


      href={
        settings.whatsapp
          ? `https://wa.me/${settings.whatsapp}`
          : "#"
      }


      target="_blank"

      rel="noopener noreferrer"


      onMouseDown={startDrag}

      onMouseMove={drag}

      onMouseUp={stopDrag}


      onTouchStart={startDrag}

      onTouchMove={drag}

      onTouchEnd={stopDrag}


      style={{

        left:position.x,

        top:position.y,

        touchAction:"none",

      }}


      className="
        fixed
        z-[9999]
        w-14
        h-14
        rounded-full
        flex
        items-center
        justify-center

        border-2
        border-amber-500

        bg-white/20

        backdrop-blur-xl

        shadow-2xl

        cursor-grab

        active:cursor-grabbing

        transition-transform

        hover:scale-110

      "


    >


      <FaWhatsapp

        className="
          text-3xl
          text-amber-500
        "

      />


    </a>


  );


}
