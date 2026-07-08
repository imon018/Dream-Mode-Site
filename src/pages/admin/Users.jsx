import { useEffect, useState } from "react";

import { getUsers } from "../../services/adminService";
import {
  changeRole,
  togglePremium,
} from "../../services/adminService";

export default function Users() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    async function makeAdmin() {

}
    const data = await getUsers();
    setUsers(data);
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

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
