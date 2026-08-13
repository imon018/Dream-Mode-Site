import {
  useEffect,
  useState,
} from "react";


import {
  FiKey,
  FiTrash2,
  FiPlus,
  FiSmartphone,
} from "react-icons/fi";


import Button from "../ui/Button";


import {
  successToast,
  errorToast,
} from "../ui/Toast";


import {
  isPasskeySupported,
  registerPasskey,
  getMyPasskeys,
  removePasskey,
} from "../../services/passkeyService";




export default function PasskeyManager(){


const supported =
isPasskeySupported();


const [
passkeys,
setPasskeys
]=useState([]);


const [
loading,
setLoading
]=useState(true);


const [
adding,
setAdding
]=useState(false);


const [
deletingId,
setDeletingId
]=useState(null);




const loadPasskeys =
async()=>{

  try{

    setLoading(true);

    const list =
    await getMyPasskeys();

    setPasskeys(list);

  }catch (error) {
    console.error(error);
  }finally{

    setLoading(false);

  }

};




useEffect(()=>{

  if(supported){

    loadPasskeys();

  }else{

    setLoading(false);

  }

// eslint-disable-next-line react-hooks/exhaustive-deps
},[]);




const handleAddPasskey =
async()=>{

  if(adding)
    return;

  try{

    setAdding(true);

    await registerPasskey();

    successToast(
      "Passkey সফলভাবে সেটআপ হয়েছে।"
    );

    await loadPasskeys();

  }catch(error){


    errorToast(
      error.message ||
      "Passkey সেটআপ করা যায়নি।"
    );

  }finally{

    setAdding(false);

  }

};




const handleDelete =
async(id)=>{

  if(deletingId)
    return;

  const confirmed =
  window.confirm(
    "এই Passkey টি রিমুভ করতে চান?"
  );

  if(!confirmed)
    return;

  try{

    setDeletingId(id);

    await removePasskey(id);

    successToast(
      "Passkey রিমুভ করা হয়েছে।"
    );

    await loadPasskeys();

  }catch(error){


    errorToast(
      "Passkey রিমুভ করা যায়নি।"
    );

  }finally{

    setDeletingId(null);

  }

};




if(!supported){

  return(

    <div className="
    bg-white
    rounded-lg
    p-4
    border
    border-gray-100
    shadow-sm
    ">

      <h2 className="
      text-lg
      font-bold
      flex
      items-center
      gap-2
      ">

        <FiKey/>
        Passkey Login

      </h2>

      <p className="
      text-xs
      text-gray-500
      mt-2
      ">

        আপনার এই ব্রাউজার/ডিভাইস Passkey সাপোর্ট করে না।
        Chrome, Safari অথবা Edge-এর সাম্প্রতিক ভার্সন ব্যবহার করুন।

      </p>

    </div>

  );

}




return(

  <div className="
  bg-white
  rounded-lg
  p-4
  border
  border-gray-100
  shadow-sm
  ">


    <div className="
    flex
    items-center
    justify-between
    flex-wrap
    gap-2
    ">

      <div>

        <h2 className="
        text-lg
        font-bold
        flex
        items-center
        gap-2
        ">

          <FiKey/>
          Passkey Login

        </h2>

        <p className="
        text-xs
        text-gray-500
        mt-1
        ">

          Password ছাড়াই fingerprint, face unlock বা স্ক্রিন-লক
          দিয়ে দ্রুত লগইন করতে Passkey সেটআপ করুন।

        </p>

      </div>

      <Button
        onClick={handleAddPasskey}
        disabled={adding}
        className="
        h-10
        px-4
        rounded-lg
        text-sm
        font-semibold
        flex
        items-center
        gap-2
        w-auto
        "
      >

        <FiPlus/>
        {
          adding
          ?
          "সেটআপ হচ্ছে..."
          :
          "Add Passkey"
        }

      </Button>

    </div>



    <div className="mt-4 space-y-2">

      {
        loading
        ?
        <p className="text-xs text-gray-400">
          লোড হচ্ছে...
        </p>
        :
        passkeys.length === 0
        ?
        <p className="text-xs text-gray-400">
          এখনও কোনো Passkey সেটআপ করা হয়নি।
        </p>
        :
        passkeys.map((pk)=>(

          <div
            key={pk.id}
            className="
            flex
            items-center
            justify-between
            gap-3
            border
            border-gray-100
            rounded-lg
            p-3
            "
          >

            <div className="
            flex
            items-center
            gap-3
            min-w-0
            ">

              <div className="
              w-9
              h-9
              rounded-full
              bg-[#FFF7E8]
              text-amber-500
              flex
              items-center
              justify-center
              shrink-0
              ">

                <FiSmartphone/>

              </div>

              <div className="min-w-0">

                <p className="
                text-sm
                font-semibold
                truncate
                ">

                  {pk.label}

                </p>

                <p className="text-xs text-gray-400">

                  {
                    pk.createdAt
                    ?
                    `Added: ${new Date(pk.createdAt).toLocaleDateString()}`
                    :
                    ""
                  }

                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={()=>handleDelete(pk.id)}
              disabled={deletingId === pk.id}
              className="
              text-red-500
              hover:bg-red-50
              w-9
              h-9
              rounded-lg
              flex
              items-center
              justify-center
              shrink-0
              disabled:opacity-50
              "
            >

              <FiTrash2/>

            </button>

          </div>

        ))
      }

    </div>


  </div>

);


}
