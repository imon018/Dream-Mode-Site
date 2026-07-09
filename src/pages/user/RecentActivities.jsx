import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase/firestore";
import useAuth from "../../hooks/useAuth";

import {
  FiEdit,
  FiTrash2,
  FiShoppingBag,
  FiLock,
  FiActivity,
} from "react-icons/fi";

export default function RecentActivities() {
  const { user } = useAuth();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const ref = collection(
          db,
          "users",
          user.uid,
          "activity"
        );

        const snapshot = await getDocs(ref);

        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort(
            (a, b) =>
              (b.createdAt?.seconds || 0) -
              (a.createdAt?.seconds || 0)
          );

        setActivities(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [user]);

  const getIcon = (message = "") => {
    const text = message.toLowerCase();

    if (text.includes("remove"))
      return <FiTrash2 className="text-red-500 text-xl" />;

    if (text.includes("password"))
      return <FiLock className="text-yellow-500 text-xl" />;

    if (text.includes("order"))
      return <FiShoppingBag className="text-blue-500 text-xl" />;

    if (text.includes("update"))
      return <FiEdit className="text-green-500 text-xl" />;

    return <FiActivity className="text-purple-500 text-xl" />;
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        Please login first.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Recent Activities
      </h1>

      <div className="bg-white rounded-3xl shadow-lg p-8">

        {loading ? (

          <div className="text-center py-10">
            Loading activities...
          </div>

        ) : activities.length === 0 ? (

          <div className="text-center py-10 text-gray-500">
            No recent activity found.
          </div>

        ) : (

          <div className="space-y-5">

            {activities.map((activity) => (

              <div
                key={activity.id}
                className="flex items-start gap-4 border rounded-2xl p-5 hover:shadow-md transition"
              >

                <div>
                  {getIcon(activity.message)}
                </div>

                <div className="flex-1">

                  <h3 className="font-semibold text-lg">
                    {activity.message}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    {activity.createdAt?.toDate
                      ? activity.createdAt
                          .toDate()
                          .toLocaleString()
                      : ""}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
  );
}
