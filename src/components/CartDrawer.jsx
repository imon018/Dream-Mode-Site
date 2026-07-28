import useCart from "../hooks/useCart";
import Button from "./ui/Button";
import { getEffectivePrice } from "../utils/helpers";

export default function CartDrawer() {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div className="fixed right-0 top-0 w-80 h-full bg-white shadow-lg p-5">

      <h2 className="text-xl font-bold mb-4">
        Your Cart
      </h2>

      {cart.length === 0 ? (
        <p>No items</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="mb-4 border-b pb-2">

              <p>{item.name}</p>

              <p className="text-primary">
                ৳ {getEffectivePrice(item)}
              </p>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>

            </div>
          ))}

          <Button onClick={clearCart} className="w-full mt-4">
            Clear Cart
          </Button>
        </>
      )}

    </div>
  );
}
