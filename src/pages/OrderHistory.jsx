import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { getUserOrders } from "../services/orderService";
import Spinner from "../components/Spinner";

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const data = await getUserOrders(user.email);
      setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="border p-4 rounded-xl mb-4"
          >

            <p className="font-bold">
              Order ID: {order.id}
            </p>

            <p>Total: ৳ {order.total}</p>

          </div>
        ))
      )}

    </div>
  );
}
