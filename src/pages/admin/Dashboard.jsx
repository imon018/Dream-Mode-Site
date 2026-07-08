import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/firestore";

import {
  FiUsers,
  FiShoppingCart,
  FiBox,
  FiDollarSign,
} from "react-icons/fi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const usersSnap = await getDocs(
        collection(db, "users")
      );

      const adminsSnap = await getDocs(
        query(
          collection(db, "users"),
          where("role", "==", "admin")
        )
      );

      const productsSnap = await getDocs(
        collection(db, "products")
      );

      const ordersSnap = await getDocs(
        collection(db, "orders")
      );

      let revenue = 0;

      ordersSnap.forEach((doc) => {
        revenue += Number(
          doc.data().total || 0
        );
      });

      setStats({
        users: usersSnap.size,
        admins: adminsSnap.size,
        products: productsSnap.size,
        orders: ordersSnap.size,
        revenue,
      });
    } catch (err) {
      console.log(err);
    }
  }

  const cards = [
    {
      title: "Users",
      value: stats.users,
      icon: <FiUsers size={30} />,
    },
    {
      title: "Admins",
      value: stats.admins,
      icon: <FiUsers size={30} />,
    },
    {
      title: "Products",
      value: stats.products,
      icon: <FiBox size={30} />,
    },
    {
      title: "Orders",
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
        Dashboard
      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
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
    </div>
  );
}
