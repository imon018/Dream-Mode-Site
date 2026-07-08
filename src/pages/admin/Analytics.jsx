import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firestore";

import {
  FiUsers,
  FiShoppingCart,
  FiBox,
  FiDollarSign,
} from "react-icons/fi";

export default function Analytics() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const usersSnap = await getDocs(
        collection(db, "users")
      );

      const productsSnap = await getDocs(
        collection(db, "products")
      );

      const ordersSnap = await getDocs(
        collection(db, "orders")
      );

      let revenue = 0;

      ordersSnap.docs.forEach((doc) => {
        const order = doc.data();

        revenue += Number(order.total || 0);
      });

      setStats({
        users: usersSnap.size,
        products: productsSnap.size,
        orders: ordersSnap.size,
        revenue,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const cards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: <FiUsers size={30} />,
    },
    {
      title: "Total Products",
      value: stats.products,
      icon: <FiBox size={30} />,
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: <FiShoppingCart size={30} />,
    },
    {
      title: "Revenue",
      value: `৳ ${stats.revenue}`,
      icon: <FiDollarSign size={30} />,
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Analytics
      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl shadow p-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <div className="text-blue-600">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Store Overview
        </h2>

        <p className="text-gray-600">
          Users: {stats.users}
        </p>

        <p className="text-gray-600">
          Products: {stats.products}
        </p>

        <p className="text-gray-600">
          Orders: {stats.orders}
        </p>

        <p className="text-gray-600">
          Revenue: ৳ {stats.revenue}
        </p>
      </div>
    </div>
  );
}
