import { useEffect, useMemo, useState } from "react";

import {
  FiUsers,
  FiShoppingCart,
  FiBox,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";

import { getUsers } from "../../services/adminService";

import {
  getProductsFromDB,
} from "../../services/firestoreProductService";

import {
  getAllOrders,
} from "../../services/orderService";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  Line,
  Bar,
} from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

export default function Dashboard() {

  const [loading, setLoading] =
    useState(true);

  const [users, setUsers] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {

      const [
        usersData,
        productsData,
        ordersData,
      ] = await Promise.all([
        getUsers(),
        getProductsFromDB(),
        getAllOrders(),
      ]);

      setUsers(usersData);
      setProducts(productsData);
      setOrders(ordersData);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }

  const stats =
    useMemo(() => {

      const admins =
        users.filter(
          (user) =>
            user.role === "admin"
        ).length;

      const revenue =
        orders.reduce(
          (sum, order) =>
            sum +
            Number(
              order.total || 0
            ),
          0
        );

      return {
        users: users.length,
        admins,
        products:
          products.length,
        orders:
          orders.length,
        revenue,
      };

    }, [
      users,
      products,
      orders,
    ]);

  const cards = [
    {
      title: "Users",
      value: stats.users,
      icon: <FiUsers size={28} />,
    },

    {
      title: "Admins",
      value: stats.admins,
      icon: <FiUsers size={28} />,
    },

    {
      title: "Products",
      value: stats.products,
      icon: <FiBox size={28} />,
    },

    {
      title: "Orders",
      value: stats.orders,
      icon:
        <FiShoppingCart size={28} />,
    },

    {
      title: "Revenue",
      value:
        `৳ ${stats.revenue}`,
      icon:
        <FiDollarSign size={28} />,
    },
  ];

  const revenueData = {
    labels: [
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
    ],

    datasets: [
      {
        label: "Revenue",

        data: [
          stats.revenue * 0.25,
          stats.revenue * 0.5,
          stats.revenue * 0.75,
          stats.revenue,
        ],

        borderColor:
          "#C9A227",

        backgroundColor:
          "rgba(201,162,39,0.15)",

        tension: 0.4,

        fill: true,
      },
    ],
  };

  const overviewData = {
    labels: [
      "Products",
      "Orders",
      "Users",
      "Admins",
    ],

    datasets: [
      {
        label:
          "Store Overview",

        data: [
          stats.products,
          stats.orders,
          stats.users,
          stats.admins,
        ],

        backgroundColor: [
          "#C9A227",
          "#3B82F6",
          "#10B981",
          "#F97316",
        ],
      },
    ],
  };

  const recentOrders =
    [...orders]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      )
      .slice(0, 5);

  if (loading) {

    return (
      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-primary
      text-white
      ">
        Loading Dashboard...
      </div>
    );

  }

  return (

    <div className="
w-full
min-h-screen
bg-primary
text-white
">

      {/* HERO */}

      <div className="
      bg-gradient-to-r
      from-primary
      to-secondary
      border-b
      border-accent/20
      p-6
      md:p-8
      rounded-3xl
      mb-8
      ">

        <div className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-6
        ">

          <div>

            <div className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            bg-accent/10
            border
            border-accent/20
            text-accent
            font-semibold
            mb-4
            ">

              <FiTrendingUp />

              Dream Mode Analytics

            </div>

            <h1 className="
            text-3xl
            md:text-5xl
            font-black
            ">
              Admin Dashboard
            </h1>

            <p className="
            text-gray-400
            mt-3
            ">
              Manage products, orders,
              users and store growth.
            </p>

          </div>

          <div className="
          bg-black/20
          backdrop-blur-md
          border
          border-accent/20
          rounded-3xl
          p-6
          min-w-[250px]
          ">

            <p className="
            text-gray-400
            text-sm
            ">
              Total Revenue
            </p>

            <h2 className="
            text-4xl
            font-black
            text-accent
            mt-2
            ">
              ৳ {stats.revenue}
            </h2>

            <p className="
            mt-2
            text-green-400
            text-sm
            ">
              Store Performance
            </p>

          </div>

        </div>

      </div>


      {/* STATS */}

      <div className="
      grid
      grid-cols-2
      xl:grid-cols-5
      gap-4
      md:gap-6
      ">

        {cards.map((card) => (

          <div
            key={card.title}
            className="
            bg-secondary
            border
            border-accent/20
            rounded-3xl
            p-5
            shadow-xl
            hover:border-accent
            transition
            "
          >

            <div className="
            flex
            justify-between
            items-center
            ">

              <div>

                <p className="
                text-gray-400
                text-sm
                ">
                  {card.title}
                </p>

                <h3 className="
                text-2xl
                md:text-3xl
                font-black
                mt-2
                ">
                  {card.value}
                </h3>

              </div>

              <div className="
              text-accent
              text-3xl
              ">
                {card.icon}
              </div>

            </div>

          </div>

        ))}

      </div>


      {/* CHARTS */}

      <div className="
      mt-8
      grid
      grid-cols-1
      xl:grid-cols-2
      gap-6
      ">

        <div className="
        bg-secondary
        rounded-3xl
        p-6
        border
        border-accent/20
        shadow-xl
        ">

          <h2 className="
          text-2xl
          font-bold
          mb-6
          ">
            Revenue Analytics
          </h2>

          <Line
            data={revenueData}
          />

        </div>

        <div className="
        bg-secondary
        rounded-3xl
        p-6
        border
        border-accent/20
        shadow-xl
        ">

          <h2 className="
          text-2xl
          font-bold
          mb-6
          ">
            Store Overview
          </h2>

          <Bar
            data={overviewData}
          />

        </div>

      </div>


      {/* QUICK ACTIONS */}

      <div className="
      mt-8
      grid
      grid-cols-2
      lg:grid-cols-4
      gap-4
      ">

        <div className="
        bg-secondary
        border
        border-accent/20
        rounded-3xl
        p-5
        text-center
        ">
          <h3 className="font-bold">
            Products
          </h3>

          <p className="
          text-gray-400
          text-sm
          mt-2
          ">
            Manage Store Items
          </p>
        </div>

        <div className="
        bg-secondary
        border
        border-accent/20
        rounded-3xl
        p-5
        text-center
        ">
          <h3 className="font-bold">
            Orders
          </h3>

          <p className="
          text-gray-400
          text-sm
          mt-2
          ">
            Track Customer Orders
          </p>
        </div>

        <div className="
        bg-secondary
        border
        border-accent/20
        rounded-3xl
        p-5
        text-center
        ">
          <h3 className="font-bold">
            Users
          </h3>

          <p className="
          text-gray-400
          text-sm
          mt-2
          ">
            User Management
          </p>
        </div>

        <div className="
        bg-secondary
        border
        border-accent/20
        rounded-3xl
        p-5
        text-center
        ">
          <h3 className="font-bold">
            Revenue
          </h3>

          <p className="
          text-gray-400
          text-sm
          mt-2
          ">
            Store Earnings
          </p>
        </div>

      </div>


      {/* RECENT ORDERS */}

      <div className="
      mt-8
      bg-secondary
      border
      border-accent/20
      rounded-3xl
      p-6
      shadow-xl
      ">

        <div className="
        flex
        justify-between
        items-center
        mb-6
        ">

          <h2 className="
          text-2xl
          font-bold
          ">
            Recent Orders
          </h2>

          <span className="
          text-accent
          text-sm
          ">
            Latest 5 Orders
          </span>

        </div>


        {recentOrders.length === 0 ? (

          <div className="
          text-center
          py-10
          text-gray-400
          ">
            No Orders Found
          </div>

        ) : (

          <>
            {/* Desktop */}

            <div className="
            hidden
            lg:block
            overflow-x-auto
            ">

              <table className="
              w-full
              ">
                <thead>

                  <tr className="
                  border-b
                  border-accent/20
                  text-left
                  ">

                    <th className="py-4">
                      Customer
                    </th>

                    <th className="py-4">
                      Status
                    </th>

                    <th className="py-4">
                      Total
                    </th>

                    <th className="py-4">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentOrders.map(
                    (order) => (

                    <tr
                      key={order.id}
                      className="
                      border-b
                      border-white/5
                      "
                    >

                      <td className="py-4">
                        {
                          order.customerName
                        }
                      </td>

                      <td className="py-4">
                        <span className="
                        px-3
                        py-1
                        rounded-full
                        bg-accent/10
                        text-accent
                        text-sm
                        ">
                          {
                            order.status
                          }
                        </span>
                      </td>

                      <td className="py-4">
                        ৳ {order.total}
                      </td>

                      <td className="py-4">
                        {
                          new Date(
                            order.createdAt
                          ).toLocaleDateString()
                        }
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>


            {/* Mobile */}

            <div className="
            lg:hidden
            space-y-4
            ">

              {recentOrders.map(
                (order) => (

                <div
                  key={order.id}
                  className="
                  bg-primary
                  rounded-2xl
                  p-4
                  border
                  border-accent/10
                  "
                >

                  <div className="
                  flex
                  justify-between
                  items-center
                  ">
                    <h3 className="
                    font-bold
                    ">
                      {
                        order.customerName
                      }
                    </h3>

                    <span className="
                    text-accent
                    text-sm
                    ">
                      {
                        order.status
                      }
                    </span>
                  </div>

                  <p className="
                  text-gray-400
                  text-sm
                  mt-2
                  ">
                    ৳ {order.total}
                  </p>

                  <p className="
                  text-gray-500
                  text-xs
                  mt-1
                  ">
                    {
                      new Date(
                        order.createdAt
                      ).toLocaleDateString()
                    }
                  </p>

                </div>

              ))}

            </div>

          </>

        )}

      </div>

    </div>

  );

}