import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


import {
  signOut,
  reload,
  onAuthStateChanged,
} from "firebase/auth";


import {
  doc,
  getDoc,
} from "firebase/firestore";


import {
  auth,
} from "../firebase/auth";


import {
  db,
} from "../firebase/firestore";



export const AuthContext = createContext();



export default function AuthProvider({
  children,
}) {



const [
  user,
  setUser
]=useState(null);



const [
  loading,
  setLoading
]=useState(true);






const logout = async()=>{


  await signOut(auth);


  setUser(null);


};









const buildUserData = async(firebaseUser)=>{


  const userRef =
  doc(
    db,
    "users",
    firebaseUser.uid
  );



  const userSnap =
  await getDoc(
    userRef
  );




  if(userSnap.exists()){


    const firestoreData =
    userSnap.data();




    return {


      ...firebaseUser,


      ...firestoreData,



      emailVerified:
      firestoreData.emailVerified || false,


    };


  }



  return {


    ...firebaseUser,


    emailVerified:
    false,


  };



};









const refreshUser = async()=>{


const firebaseUser =
auth.currentUser;



if(!firebaseUser){


  setUser(null);


  return;


}



try{


  await reload(firebaseUser);



  const updatedUser =
  await buildUserData(
    firebaseUser
  );



  setUser(
    updatedUser
  );



}catch(error){




}


};









useEffect(()=>{


const unsubscribe =

onAuthStateChanged(

auth,

async(firebaseUser)=>{


try{


if(!firebaseUser){


  setUser(null);


  setLoading(false);


  return;


}




const userData =

await buildUserData(

firebaseUser

);




setUser(

userData

);



}catch(error){





setUser(
firebaseUser
);



}

finally{


setLoading(false);


}



}

);





return ()=>unsubscribe();



},[]);









return (


<AuthContext.Provider


value={{

user,

setUser,

loading,

logout,

refreshUser,

}}


>


{children}


</AuthContext.Provider>



);


}









export function useAuth(){


return useContext(AuthContext);


}
