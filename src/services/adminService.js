import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase/firestore";



// =========================
// GET ALL USERS
// =========================

export async function getUsers(search = "") {

  const usersRef =
    collection(
      db,
      "users"
    );


  const q =
    query(
      usersRef,
      orderBy(
        "createdAt",
        "desc"
      )
    );


  const snapshot =
    await getDocs(q);



  let users =
    snapshot.docs.map(
      (doc)=>({

        id: doc.id,

        ...doc.data(),

      })
    );



  // Search filter

  if(search.trim()) {

    users =
      users.filter(
        (user)=>

          user.email
          ?.toLowerCase()
          .includes(
            search
            .toLowerCase()
          )

      );

  }



  return users;

}






// =========================
// CHANGE ROLE
// =========================

export async function changeRole(
  userId,
  role
){

  const userRef =
    doc(
      db,
      "users",
      userId
    );


  await updateDoc(
    userRef,
    {

      role,

    }
  );

}








// =========================
// DELETE USER
// =========================

export async function deleteUser(
  userId
){

  const userRef =
    doc(
      db,
      "users",
      userId
    );


  await deleteDoc(
    userRef
  );

}
