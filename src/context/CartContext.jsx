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


  const [cart, setCart] =
    useState(() => {

      const savedCart =
        localStorage.getItem(
          "dream_cart"
        );

      return savedCart
        ? JSON.parse(savedCart)
        : [];

    });





  useEffect(() => {

    localStorage.setItem(
      "dream_cart",
      JSON.stringify(cart)
    );


  }, [cart]);







  const addToCart = (product) => {


    setCart((prev)=>{


      const existing =
        prev.find(
          item =>
          item.id === product.id
        );



      if(existing){


        return prev.map(item =>

          item.id === product.id

          ?

          {
            ...item,
            quantity:
              item.quantity + 1
          }

          :

          item

        );


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








  const removeFromCart = (id)=>{


    setCart(prev =>

      prev.filter(
        item =>
        item.id !== id
      )

    );


  };








  const updateQuantity = (
    id,
    quantity
  )=>{


    if(quantity < 1)
      return;



    setCart(prev =>

      prev.map(item =>


        item.id === id

        ?

        {
          ...item,
          quantity
        }

        :

        item


      )

    );


  };







  const clearCart = ()=>{

    setCart([]);

  };






  return (

    <CartContext.Provider

      value={{

        cart,

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
