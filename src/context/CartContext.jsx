import {
  createContext,
  useEffect,
  useState,
} from "react";


export const CartContext =
  createContext();



export default function CartProvider({
  children
}) {


  const [cart,setCart] =
    useState(()=>{


      const savedCart =
        localStorage.getItem(
          "dream_cart"
        );


      return savedCart
        ? JSON.parse(savedCart)
        : [];


    });






  useEffect(()=>{


    localStorage.setItem(
      "dream_cart",
      JSON.stringify(cart)
    );


  },[cart]);








  const addToCart = (product)=>{


    setCart(prev=>{


      const existing =
        prev.find(
          item =>
          item.id === product.id
        );




      if(existing){


        return prev.map(item=>{


          if(item.id === product.id){


            const maxStock =
              product.stock || 999;



            return {

              ...item,

              quantity:
                item.quantity < maxStock

                ?

                item.quantity + 1

                :

                item.quantity

            };


          }


          return item;


        });



      }





      return [

        ...prev,

        {

          ...product,

          quantity:1

        }

      ];



    });



  };








  const removeFromCart=(id)=>{


    setCart(prev=>

      prev.filter(
        item =>
        item.id !== id
      )

    );


  };








  const updateQuantity=(
    id,
    quantity
  )=>{


    setCart(prev=>

      prev.map(item=>{


        if(item.id === id){


          const max =
            item.stock || 999;



          return {

            ...item,

            quantity:
              Math.min(
                quantity,
                max
              )

          };


        }


        return item;


      })


    );


  };








  const clearCart=()=>{


    setCart([]);


  };








  const cartCount =
    cart.reduce(

      (sum,item)=>

      sum + item.quantity,

      0

    );








  return (


    <CartContext.Provider

      value={{

        cart,

        cartCount,

        addToCart,

        removeFromCart,

        updateQuantity,

        clearCart,

      }}

    >


      {children}


    </CartContext.Provider>


  );


}
