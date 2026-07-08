import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import Button from "../components/ui/Button";
import { createOrder } from "../services/orderService";
import {
  successToast,
  errorToast,
} from "../components/ui/Toast";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const handleOrder = async () => {
    if (!user)
      return errorToast("Login required");

    if (cart.length === 0)
      return errorToast("Cart is empty");

    try {
      await createOrder({
        email: user.email,
        items: cart,
        total,
        status: "Pending",
        createdAt: new Date().toISOString(),
      });

      successToast(
        "Order placed successfully!"
      );

      clearCart();

      navigate("/order-success");
    } catch (err) {
      console.log(err);

      errorToast(
        err.message ||
          "Failed to place order"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold">
        Checkout
      </h1>

      <div className="mt-8 space-y-3">
        {cart.map((item, i) => (
          <div
            key={i}
            className="flex justify-between border-b py-2"
          >
            <span>{item.name}</span>

            <span>
              ৳ {item.price}
            </span>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-6">
        Total: ৳ {total}
      </h2>

      <Button
        className="mt-6 w-full"
        onClick={handleOrder}
      >
        Place Order
      </Button>
    </div>
  );
}
