import { createContext, useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth } from "../firebase/auth";
import { db } from "../firebase/firestore";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (!firebaseUser) {
            setUser(null);
            setLoading(false);
            return;
          }

          const userRef = doc(
            db,
            "users",
            firebaseUser.uid
          );

          const userSnap =
            await getDoc(userRef);

          if (userSnap.exists()) {
            setUser({
              ...firebaseUser,
              ...userSnap.data(),
            });
          } else {
            setUser(firebaseUser);
          }
        } catch (error) {
          console.log(error);
          setUser(firebaseUser);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
   
