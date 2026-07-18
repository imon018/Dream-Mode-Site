import {
  useEffect,
  useState,
} from "react";


import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";


import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";


import {
  httpsCallable
} from "firebase/functions";


import {
  db
} from "../firebase/firestore";


import {
  functions
} from "../firebase/firebaseConfig";


import {
  successToast,
  errorToast,
} from "../components/ui/Toast";








export default function DeleteAccountVerify(){



const navigate =
useNavigate();



const [
searchParams
]=useSearchParams();



const token =
searchParams.get("token");






const [
requestData,
setRequestData
]=useState(null);




const [
requestId,
setRequestId
]=useState(null);




const [
message,
setMessage
]=useState(
"Verifying delete request..."
);



const [
loading,
setLoading
]=useState(false);









useEffect(()=>{


findRequest();


},[]);









const findRequest =
async()=>{


try{


if(!token){

throw new Error(
"Invalid delete link."
);

}





const q =
query(

collection(
db,
"deleteAccountRequests"
),

where(
"token",
"==",
token
)

);





const snap =
await getDocs(q);





if(snap.empty){

throw new Error(
"Expired delete link."
);

}





const deleteDocData =
snap.docs[0];





setRequestId(
deleteDocData.id
);



setRequestData(
deleteDocData.data()
);





setMessage(
"Are you sure you want to permanently delete your account?"
);



}
catch(error){


errorToast(
error.message
);


setMessage(
error.message
);


}



};









const handleDelete =
async()=>{


try{


setLoading(true);





if(!requestData){

throw new Error(
"Invalid request."
);

}





const deleteAccount =
httpsCallable(
functions,
"deleteAccount"
);






await deleteAccount({

uid:
requestData.uid

});








await deleteDoc(

doc(

db,

"deleteAccountRequests",

requestId

)

);







successToast(
"Account deleted successfully."
);





setMessage(
"Account deleted successfully."
);





setTimeout(()=>{


navigate("/");


},2000);






}
catch(error){


console.log(error);



errorToast(
error.message
);



setMessage(
error.message
);


}
finally{


setLoading(false);


}



};









return (

<div className="
min-h-screen
bg-[#FAF7F2]
flex
items-center
justify-center
p-4
">


<div className="
bg-white
rounded-2xl
shadow-lg
p-8
max-w-md
w-full
text-center
">



<div className="
text-5xl
mb-5
">
⚠️
</div>



<h1 className="
text-2xl
font-bold
mb-4
">

Delete Account

</h1>




<p className="
text-gray-600
mb-6
">

{message}

</p>





{

requestData &&

<>


<button

onClick={handleDelete}

disabled={loading}

className="
w-full
h-12
bg-red-600
text-white
rounded-xl
font-semibold
"

>

{

loading

?

"Deleting..."

:

"Yes, Delete My Account"

}

</button>





<button

onClick={()=>navigate("/")}

className="
w-full
h-12
bg-gray-100
mt-3
rounded-xl
"

>

No, Cancel

</button>



</>

}





</div>


</div>


);


}
