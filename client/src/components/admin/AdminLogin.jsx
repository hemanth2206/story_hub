import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post("http://localhost:3000/admin-api/login", { email, password });

      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        navigate("/admin-profile");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError("Incorrect email or password");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-10">
      <form 
        onSubmit={handleLogin} 
        className="p-4 border rounded shadow-lg" 
        style={{ width: "350px", background: "#f8f9fa" }}
      >
        <h3 className="text-center mb-3">Admin Login</h3>

        {error && <p className="text-danger text-center">{error}</p>}

        <label className="form-label">Email</label>
        <input 
          type="email" 
          placeholder="Email" 
          className="form-control mb-2" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />

        <label className="form-label">Password</label>
        <input 
          type="password" 
          placeholder="Password" 
          className="form-control mb-2" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        <button type="submit" className="btn btn-primary w-100 mt-2">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
