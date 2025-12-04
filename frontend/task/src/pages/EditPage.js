import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTaskPage() {
    const { id } = useParams(); // Get task ID from URL
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("medium");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [notAuthorized, setNotAuthorized] = useState(false);
    const navigate = useNavigate();

    // Load existing task data
        useEffect(() => {
        const loadTask = async () => {
            try {
                const token = localStorage.getItem("access_token");
                
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await api.get(`tasks/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const task = response.data;
                setTitle(task.title);
                setDescription(task.description);
                setStatus(task.status);
                setDueDate(task.due_date);
                setPriority(task.priority);
                setLoading(false);
            } catch (err) {
                setLoading(true);
                
                // Check if it's a 403 (Forbidden) or 404 (Not Found) error
                if (err.response?.status === 403 || err.response?.status === 404) {
                    setNotAuthorized(true);
                    setTimeout(() => {
                        navigate("/tasks");
                    }, 2000); // Redirect after 2 seconds
                } else {
                    setError("Failed to load task. Please try again.");
                }
                console.log(err);
            }
        };
        loadTask();
    }, [id, navigate]);

    const handleUpdateTask = async (e) => {
        e.preventDefault();

        //validation for due date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(dueDate);
        if (selectedDate < today) {
            setError("Due date cannot be in the past.");
            return;
        }
        try {
        const token = localStorage.getItem("access_token");
        const response = await api.patch(
            `tasks/${id}/`,
            {
                title,
                description,
                status,
                due_date: dueDate,
                priority,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        alert("Task updated successfully!");
        navigate("/tasks");
        console.log("Task updated successfully:", response.data);
    }catch (err) {
        setError("Failed to update task. Please try again.");
        console.log(err);
    }}

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading task...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Task</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                <form onSubmit={handleUpdateTask} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            id="description"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"  
                            required
                        />
                    </div>
                
                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="pending">Pending</option>
                            {/* <option value="in_progress">In Progress</option> */}
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/tasks")}
                            className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold"
                        >
                            Update Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );


}