import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("login/", {
                username,
                password,
            });
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            console.log("Login successful:", response.data);
            // Handle successful login (e.g., store token, redirect)
            navigate("/tasks");
        } catch (err) {
            setError("Login failed. Please check your credentials.");

        }
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="text" 
            placeholder="Username" 
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/register" className="text-blue-500 hover:underline">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
    }
export default LoginPage;