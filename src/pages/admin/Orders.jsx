import { useEffect, useState } from "react";

import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/orderService";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await getAllOrders();
    setOrders(data);
  };

  const changeStatus = async (
    id,
    status
  ) => {
    await updateOrderStatus(id, status);

    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? { ...order, status }
          : order
      )
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Orders
      </h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Total
              </th>

              <th className="p-4 text-left">
                Items
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Action
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
                  ৳ {order.total}
                </td>

                <td className="p-4">
                  {order.items?.length || 0}
                </td>

                <td className="p-4">
                  {order.status ||
                    "Pending"}
                </td>

                <td className="p-4">
                  <select
                    value={
                      order.status ||
                      "Pending"
                    }
                    onChange={(e) =>
                      changeStatus(
                        order.id,
                        e.target.value
                      )
                    }
                    className="border rounded-lg px-3 py-2"
                  >
                    <option>
                      Pending
                    </option>

                    <option>
                      Processing
                    </option>

                    <option>
                      Delivered
                    </option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
