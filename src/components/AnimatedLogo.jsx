import {
  useEffect,
  useRef,
} from "react";

// এনিমেটেড স্টোর লোগো — একবার পুরো এনিমেশন চলবে, শেষ হলে
// লোগোটা শেষ ফ্রেমে (স্থির) থেমে থাকবে, এরপর প্রতি ১০ সেকেন্ড
// পরপর আবার প্রথম থেকে এনিমেশনটা রিপিট হবে।
//
// প্রথমবার পেজ লোড হওয়ার সাথে সাথেই এনিমেশন অটো-প্লে হয় (মিউট
// করা থাকায় ব্রাউজারের অটোপ্লে পলিসিতে আটকায় না)। ভিডিওতে কোনো
// সাউন্ড ব্যবহার হয় না, তাই মিউট করাতে ভিজ্যুয়ালি কোনো পার্থক্য
// পড়ে না।

const REPEAT_INTERVAL_MS = 10000;


export default function AnimatedLogo({

  src = "/logo/dm-logo-animation.mp4",
  fallbackSrc,
  className = "",

}) {


  const videoRef = useRef(null);


  useEffect(()=>{

    const video = videoRef.current;

    if(!video) return;


    // src বদলে গেলে (যেমন Admin নতুন লোগো আপলোড করার পর Settings
    // লাইভ রিফ্রেশ হলে) ভিডিও এলিমেন্টকে নতুন সোর্স রি-লোড করতে
    // বলা হচ্ছে, নাহলে ব্রাউজার পুরনো ভিডিওই দেখাতে থাকবে।
    video.load();


    // পেজ লোডের সাথে সাথে প্রথমবার প্লে করা হচ্ছে
    const tryPlay = ()=>{
      video.currentTime = 0;
      video.play().catch(()=>{
        // অটোপ্লে ব্লক হলেও সমস্যা নেই, লোগোটা প্রথম ফ্রেমে
        // স্থির দেখাবে, অ্যাপ ভাঙবে না।
      });
    };

    tryPlay();


    // প্রতি ১০ সেকেন্ড পরপর আবার শুরু থেকে প্লে করার জন্য টাইমার
    const intervalId = setInterval(()=>{

      tryPlay();

    }, REPEAT_INTERVAL_MS);


    return ()=>{
      clearInterval(intervalId);
    };

  },[src]);


  return (

    <video

      ref={videoRef}

      className={className}

      muted

      playsInline

      preload="auto"

      // লুপ ইচ্ছাকৃতভাবে দেওয়া হয়নি — এনিমেশন শেষ হলে ব্রাউজার
      // নিজে থেকেই শেষ ফ্রেমে থেমে থাকে, আর উপরের useEffect-এর
      // টাইমার ১০ সেকেন্ড পরপর আবার চালু করে দেয়।

    >

      <source
        src={src}
        type="video/mp4"
      />

      {
        fallbackSrc && (
          <img
            src={fallbackSrc}
            alt="logo"
            className={className}
          />
        )
      }

    </video>

  );

}
