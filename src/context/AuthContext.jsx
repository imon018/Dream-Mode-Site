import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


import {
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


import {
  signOut,
} from "firebase/auth";



export const AuthContext = createContext();


export default function AuthProvider({
  children,
}) {


  const [
    user,
    setUser
  ] = useState(null);



  const [
    loading,
    setLoading
  ] = useState(true);







  useEffect(()=>{


    const logout = async()=>{

  await signOut(auth);

  setUser(null);

};


    const unsubscribe = onAuthStateChanged(

      auth,

      async(firebaseUser)=>{


        try{


          if(!firebaseUser){


            setUser(null);

            setLoading(false);

            return;

          }






          const userRef = doc(

            db,

            "users",

            firebaseUser.uid

          );





          const userSnap = await getDoc(
            userRef
          );






          if(userSnap.exists()){


            setUser({

              ...firebaseUser,

              ...userSnap.data(),

            });



          }else{


            setUser(firebaseUser);


          }






        }catch(error){


          console.log(error);


          setUser(firebaseUser);


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

      }}

    >

      {children}


    </AuthContext.Provider>


  );


}








export function useAuth(){


  return useContext(AuthContext);


}
