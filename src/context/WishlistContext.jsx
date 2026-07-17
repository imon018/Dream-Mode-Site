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


import {
  successToast,
  errorToast,
} from "../components/ui/Toast";



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







  useEffect(()=>{


    const loadWishlist = async()=>{


      if(!user){

        setWishlist([]);

        setLoading(false);

        return;

      }



      try{


        const data =
          await getUserWishlist(
            user.uid
          );



        setWishlist(
          data
        );



      }catch(error){


        console.log(error);



      }finally{


        setLoading(false);


      }


    };



    loadWishlist();



  },[user]);










  const isWishlisted = (
    productId
  )=>{


    return wishlist.some(
      item =>
        item.productId === productId
        ||
        item.product?.id === productId
    );


  };









  const toggleWishlist = async(
    product
  )=>{


    if(!user){


      errorToast(
        "Please login first"
      );


      return;


    }

    
    const exists =
      wishlist.find(
        item =>
          item.productId === product.id
      );





    try{



      if(exists){



        await removeWishlistItem(
          exists.firestoreId
        );



        setWishlist(
          prev =>
            prev.filter(
              item =>
                item.firestoreId !==
                exists.firestoreId
            )
        );



        successToast(
          "Removed from wishlist"
        );




      }

      else{



        await addWishlistItem(
          user.uid,
          product
        );



        setWishlist(
          prev => [
            ...prev,

            {

              productId:
                product.id,

              product,

            }

          ]
        );



        successToast(
          "Added to wishlist"
        );



      }




    }catch(error){


      console.log(error);


      errorToast(
        error.message
      );


    }



  };



const removeFromWishlist = async(
  id
)=>{

  try{

    await removeWishlistItem(
      id
    );


    setWishlist(

      prev =>

      prev.filter(

        item =>

        item.firestoreId !== id

      )

    );


    successToast(
      "Removed from wishlist"
    );


  }catch(error){

    console.log(error);


    errorToast(
      error.message
    );

  }

};



  return (


    <WishlistContext.Provider


      value={{

        wishlist,

        loading,

        toggleWishlist,

        isWishlisted,

        removeFromWishlist,

      }}


    >


      {children}


    </WishlistContext.Provider>


  );


}
