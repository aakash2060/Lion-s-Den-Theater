
import { useEffect, useState } from "react";
import { FaTrashAlt, FaUserSlash } from "react-icons/fa";

interface User {
  id: number;
  username: string;
  email: string;
  role: "User" | "Admin";
  status: "Active" | "Banned";
}

const mockUsers: User[] = [
  { id: 1, username: "john_doe", email: "john@example.com", role: "User", status: "Active" },
  { id: 2, username: "admin_kate", email: "kate@example.com", role: "Admin", status: "Active" },
  { id: 3, username: "banned_user", email: "banned@example.com", role: "User", status: "Banned" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Replace with API call later
    setUsers(mockUsers);
  }, []);

  const toggleBan = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: user.status === "Active" ? "Banned" : "Active" } : user
      )
    );
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="p-8 text-white min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <h1 className="text-4xl font-bold mb-6 text-center">👥 Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="py-2 px-4">Username</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-700">
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    user.status === "Active" ? "bg-green-600" : "bg-red-600"
                  }`}>{user.status}</span>
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <button onClick={() => toggleBan(user.id)}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm">
                    {user.status === "Active" ? <FaUserSlash /> : "Unban"}
                  </button>
                  <button onClick={() => deleteUser(user.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
