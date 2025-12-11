import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateTasksPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("medium");
    const [error, setError] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const navigate = useNavigate();

    const handleCreateTask = async (e) => {
        e.preventDefault();

        //validation for due date
        const today = new Date();
        const selectedDate = new Date(dueDate);
        if (selectedDate < today) {
            setError("Due date cannot be in the past.");
            return;
        }
        try {
        const token = localStorage.getItem("access_token");
        const response = await api.post(
            "tasks/",
            {
                title,
                description,
                status,
                due_date: dueDate,
                priority,
                assigned_to: assignedTo,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        alert("Task created successfully!");
        navigate("/tasks");
        console.log("Task created successfully:", response.data);
    }catch (err) {
        setError("Failed to create task. Please try again.");
        console.log(err);
    }}

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create New Task</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Title"
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
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"  
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                        <input
                            id="assignedTo"
                            type="text" 
                            placeholder="Assign To (username)"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                            id="dueDate"
                            type="date"
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            id="status"
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
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold"
                    >
                        Create Task
                    </button>
                </form>
            </div>
        </div>
    );


}