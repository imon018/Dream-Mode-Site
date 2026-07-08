import { useEffect, useState } from "react";

import {
  getUsers,
  changeRole,
  togglePremium,
} from "../../services/adminService";

export default function Users() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
  const data = await getUsers();
  setUsers(data);
}

async function makeAdmin(user) {
  try {

    console.log("Admin Click:", user);

    await changeRole(
      user.id,
      user.role === "admin"
        ? "user"
        : "admin"
    );

    console.log("Role Updated");

    await loadUsers();

  } catch (error) {

    console.error(error);

  }
}

async function makePremium(user) {
  try {

    console.log("Premium Click:", user);

    await togglePremium(
      user.id,
      !user.premium
    );

    console.log("Premium Updated");

    await loadUsers();

  } catch (error) {

    console.error(error);

  }
}

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        Users
      </h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-900 text-white">

            <tr>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4">
                Role
              </th>

              <th className="p-4">
                Premium
              </th>
              <th className="p-4">
  Action
</th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-b"
              >

                <td className="p-4">
                  {user.email}
                </td>

                <td className="text-center">

                  {user.role}

                </td>

                <td className="text-center">

                  {user.premium
                    ? "YES"
                    : "NO"}

                </td>
                <td className="text-center space-x-2">

  <button
    onClick={() => makeAdmin(user)}
    className="bg-blue-600 text-white px-3 py-1 rounded"
  >
    {user.role === "admin"
      ? "Remove Admin"
      : "Make Admin"}
  </button>

  <button
    onClick={() => makePremium(user)}
    className="bg-green-600 text-white px-3 py-1 rounded ml-2"
  >
    {user.premium
      ? "Remove Premium"
      : "Make Premium"}
  </button>

</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
