import useCart from "../hooks/useCart";
import Button from "./ui/Button";

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

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

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-primary text-sm">৳ {item.price} x {item.quantity || 1}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                    aria-label={`Decrease quantity for ${item.name}`}
                  >
                    −
                  </button>

                  <div className="px-2">{item.quantity || 1}</div>

                  <button
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                    aria-label={`Increase quantity for ${item.name}`}
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>

            </div>
          ))}

          <div className="mt-4 font-bold">Total: ৳ {total}</div>

          <Button onClick={clearCart} className="w-full mt-4">
            Clear Cart
          </Button>
        </>
      )}

    </div>
  );
}
