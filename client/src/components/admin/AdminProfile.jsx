import { useEffect, useState } from "react";
import axios from "axios";

function AdminProfile() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");


  async function fetchUsers() {
    try {
      const res = await axios.get("http://localhost:3000/admin-api/all-users");
      console.log("API Response:", res.data); 
      setUsers(res.data.payload || []); 
      setError("");
    } catch (err) {
      setError("Failed to fetch users.");
    }
  }

  
  async function toggleBlock(userId) {
    try {
        const res = await axios.put(`http://localhost:3000/admin-api/toggle-block/${userId}`);
        setUsers(users.map(user => 
            user._id === userId ? { ...user, isActive: res.data.isActive } : user
        ));
    } catch (err) {
        setError("Failed to update user status.");
    }
}


  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Admin Profile</h2>
      {error && <p className="text-danger">{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user._id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role === "author" ? "Writer" : user.role === "user" ? "Reader" : user.role}</td>

                <td>{user.isActive ? "Active" : "Blocked"}</td>
                <td>
                  <button 
                    className={`btn ${user.isActive ? "btn-danger" : "btn-success"}`} 
                    onClick={() => toggleBlock(user._id)}
                  >
                    {user.isActive ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProfile;
