import PasskeyManager from "../../components/auth/PasskeyManager";




export default function PasskeySettings(){


  return(

    <div className="
    min-h-screen
    bg-[#FAF7F2]
    p-4
    text-gray-900
    space-y-3
    ">


      <div className="
      bg-white
      rounded-lg
      p-4
      border
      border-gray-100
      shadow-sm
      text-center
      ">

        <h1 className="
        text-xl
        font-bold
        ">

          Passkey Setup

        </h1>

        <p className="
        text-xs
        text-gray-500
        mt-1
        ">

          Password ছাড়াই Fingerprint/Face Unlock দিয়ে Login করতে
          একটি Passkey যোগ করুন।

        </p>

      </div>


      <PasskeyManager/>


    </div>

  );


}
