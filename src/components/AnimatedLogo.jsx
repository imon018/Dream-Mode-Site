import {
  useEffect,
  useRef,
  useState,
} from "react";

// এনিমেটেড স্টোর লোগো — পেজ লোড হওয়ার সাথে সাথে ভিডিও এনিমেশন
// একবার প্লে হয়। এনিমেশন শেষ হলে ফটো (স্ট্যাটিক) লোগোতে ফিরে
// যায়, ফটো লোগো ১০ সেকেন্ড দেখানোর পর আবার ভিডিও এনিমেশনটা
// প্রথম থেকে প্লে হয় — এভাবে ভিডিও → ফটো (১০ সেকেন্ড) → ভিডিও →
// ফটো (১০ সেকেন্ড) ... চক্রটা বারবার চলতে থাকে।
//
// fallbackSrc না দেওয়া থাকলে (যেমন পুরনো কোনো ব্যবহার) আগের মতোই
// আচরণ করে: এনিমেশন শেষে ভিডিওটা শেষ ফ্রেমে থেমে থাকে, প্রতি ১০
// সেকেন্ড পরপর আবার শুরু থেকে প্লে হয়।
//
// প্রথমবার পেজ লোড হওয়ার সাথে সাথেই এনিমেশন অটো-প্লে হয় (মিউট
// করা থাকায় ব্রাউজারের অটোপ্লে পলিসিতে আটকায় না)। ভিডিওতে কোনো
// সাউন্ড ব্যবহার হয় না, তাই মিউট করাতে ভিজ্যুয়ালি কোনো পার্থক্য
// পড়ে না।

const PHOTO_LOGO_DURATION_MS = 10000;


export default function AnimatedLogo({

  src = "/logo/dm-logo-animation.mp4",
  fallbackSrc,
  className = "",

}) {


  const videoRef = useRef(null);

  // ফটো লোগো দেখানোর সময় ভিডিও এলিমেন্টটা DOM-এ রেখেই শুধু
  // লুকিয়ে রাখা হয় (unmount করা হয় না), যাতে বারবার নতুন করে
  // ভিডিও লোড করতে না হয়।
  const [showPhoto, setShowPhoto] = useState(false);


  useEffect(()=>{

    const video = videoRef.current;

    if(!video) return;


    let photoTimeoutId = null;


    // src বদলে গেলে (যেমন Admin নতুন লোগো আপলোড করার পর Settings
    // লাইভ রিফ্রেশ হলে) ভিডিও এলিমেন্টকে নতুন সোর্স রি-লোড করতে
    // বলা হচ্ছে, নাহলে ব্রাউজার পুরনো ভিডিওই দেখাতে থাকবে।
    video.load();

    setShowPhoto(false);


    const playVideo = ()=>{
      setShowPhoto(false);
      video.currentTime = 0;
      video.play().catch(()=>{
        // অটোপ্লে ব্লক হলেও সমস্যা নেই, লোগোটা প্রথম ফ্রেমে
        // স্থির দেখাবে, অ্যাপ ভাঙবে না।
      });
    };


    // ভিডিও এনিমেশন শেষ হলে —
    // fallbackSrc থাকলে: ফটো লোগোতে ফিরে যাওয়া হয়, ১০ সেকেন্ড পর
    // আবার ভিডিওটা শুরু থেকে প্লে করা হয়।
    // fallbackSrc না থাকলে: আগের আচরণ বজায় থাকে (শেষ ফ্রেমে
    // স্থির, ১০ সেকেন্ড পর রিপিট)।
    const handleEnded = ()=>{

      if(fallbackSrc){

        setShowPhoto(true);

        photoTimeoutId = setTimeout(()=>{
          playVideo();
        }, PHOTO_LOGO_DURATION_MS);

      }
      else{

        photoTimeoutId = setTimeout(()=>{
          playVideo();
        }, PHOTO_LOGO_DURATION_MS);

      }

    };

    video.addEventListener("ended", handleEnded);


    // পেজ লোডের সাথে সাথে প্রথমবার প্লে করা হচ্ছে
    playVideo();


    return ()=>{
      video.removeEventListener("ended", handleEnded);
      if(photoTimeoutId){
        clearTimeout(photoTimeoutId);
      }
    };

  },[src, fallbackSrc]);


  return (

    <div
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >

      <video

        ref={videoRef}

        className="w-full h-full object-contain"

        style={
          showPhoto
          ? { display: "none" }
          : undefined
        }

        muted

        playsInline

        preload="auto"

        // লুপ ইচ্ছাকৃতভাবে দেওয়া হয়নি — এনিমেশন শেষ হওয়ার
        // ইভেন্টটা (ended) হ্যান্ডেল করে উপরের useEffect ঠিক করে
        // দেয় এরপর ফটো লোগো দেখাবে নাকি ভিডিও আবার রিপ্লে হবে।

      >

        <source
          src={src}
          type="video/mp4"
        />

      </video>

      {
        showPhoto && fallbackSrc && (
          <img
            src={fallbackSrc}
            alt="logo"
            className="w-full h-full object-contain"
          />
        )
      }

    </div>

  );

}
