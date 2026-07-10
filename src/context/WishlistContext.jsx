import {
  createContext,
  useEffect,
  useState,
} from "react";

import useAuth from "../hooks/useAuth";

import {
  getUserWishlist,
  addWishlistItem,
  removeWishlistItem,
} from "../services/wishlistService";



export const WishlistContext =
  createContext();




export default function WishlistProvider({
  children,
}) {


  const {
    user,
  } = useAuth();



  const [
    wishlist,
    setWishlist,
  ] = useState([]);




  const [
    loading,
    setLoading,
  ] = useState(true);







  // LOAD FIRESTORE WISHLIST


  useEffect(()=>{


    const loadWishlist =
    async()=>{


      try{


        setLoading(true);



        if(!user){

          setWishlist([]);

          return;

        }



        const data =
          await getUserWishlist(
            user.uid
          );



        setWishlist(data);



      }
      catch(error){

        console.log(error);

      }
      finally{

        setLoading(false);

      }


    };



    loadWishlist();


  },[user]);









  // CHECK ITEM EXISTS



  const isWishlisted =
  (productId)=>{


    return wishlist.some(
      item =>
      item.productId === productId
    );


  };









  // ADD TO WISHLIST



  const addToWishlist =
  async(product)=>{


    if(!user){

      return;

    }



    const exists =
      isWishlisted(
        product.id
      );



    if(exists){

      return;

    }



    await addWishlistItem(
      user.uid,
      product
    );




    setWishlist(prev=>[

      ...prev,

      {

        productId:
          product.id,

        product,

      }

    ]);



  };









  // REMOVE



  const removeFromWishlist =
  async(productId)=>{



    const item =
      wishlist.find(
        item =>
        item.productId === productId
      );



    if(!item){

      return;

    }




    await removeWishlistItem(
      item.firestoreId
    );



    setWishlist(prev=>

      prev.filter(
        item =>
        item.productId !== productId
      )

    );



  };









  // TOGGLE HEART BUTTON



  const toggleWishlist =
  async(product)=>{


    const exists =
      isWishlisted(
        product.id
      );



    if(exists){


      await removeFromWishlist(
        product.id
      );


    }
    else{


      await addToWishlist(
        product
      );


    }


  };









  return (


    <WishlistContext.Provider


      value={{

        wishlist,

        loading,

        wishlistCount:
          wishlist.length,

        addToWishlist,

        removeFromWishlist,

        toggleWishlist,

        isWishlisted,

      }}


    >


      {children}


    </WishlistContext.Provider>


  );


}
