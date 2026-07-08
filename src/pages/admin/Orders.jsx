import { useEffect, useState } from "react";

import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/orderService";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data =
        await getAllOrders();

      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    id,
    status
  ) => {
    try {
      await updateOrderStatus(
        id,
        status
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id
            ? {
                ...order,
                status,
              }
            : order
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <p className="text-center">
        Loading orders...
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Orders Management
      </h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">
                  Customer
                </th>

                <th className="p-4 text-left">
                  Items
                </th>

                <th className="p-4 text-left">
                  Total
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {order.email}
                  </td>

                  <td className="p-4">
                    {order.items?.length ||
                      0}
                  </td>

                  <td className="p-4">
                    ৳ {order.total}
                  </td>

                  <td className="p-4">
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </td>

                  <td className="p-4">
                    <select
                      value={
                        order.status ||
                        "Pending"
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value
                        )
                      }
                      className="border rounded-lg px-3 py-2"
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
