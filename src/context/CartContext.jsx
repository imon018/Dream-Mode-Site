import {
  createContext,
  useEffect,
  useState,
} from "react";


export const CartContext =
  createContext({
    cart: [],
    cartCount: 0,
    addToCart: () => {},
    removeFromCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
  });



export default function CartProvider({
  children
}) {


  const [cart,setCart] =
    useState(()=>{


      try {

        const savedCart =
          localStorage.getItem(
            "dream_cart"
          );

        if (!savedCart) return [];

        const parsed = JSON.parse(savedCart);

        return Array.isArray(parsed)
          ? parsed
          : [];

      } catch (_err) {

        return [];

      }


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








  const safeCart =
    Array.isArray(cart)
      ? cart
      : [];



  const cartCount =
    safeCart.reduce(

      (sum,item)=>

      sum + (item.quantity || 0),

      0

    );








  return (


    <CartContext.Provider

      value={{

        cart: safeCart,

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
