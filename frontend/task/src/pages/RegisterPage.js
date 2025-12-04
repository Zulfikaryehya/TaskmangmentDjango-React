import React from 'react';
import { useState } from "react";
import api from "../api/axios";
import {  Link, useNavigate} from "react-router-dom";
const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const[email, setEmail] = useState("");
    const [password, setPassword] = useState("");   
    const[confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async(e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if(!username || !email || !password) {
            setError("All fields are required.");
            return;
        }

        if(password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            const response = await api.post("register/", {
                username,
                email,
                password,
            });
            console.log("Registration successful:", response.data);
            // Handle successful registration (e.g., redirect to login)
            navigate("/login");
        }catch (err) {
            setError("Registration failed. Please try again.");
        }
    }
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <form onSubmit={handleRegister} className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input  
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="password" 
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="password" 
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold"
                >
                    Register
                </button>
            </form>
            <p className="text-center mt-4 text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                    Login
                </Link>
            </p>
        </div>
    </div>
);
}
export default RegisterPage;