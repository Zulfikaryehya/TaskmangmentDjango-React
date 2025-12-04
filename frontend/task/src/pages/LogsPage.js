import React, { useEffect, useState } from 'react';
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";

export default function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const navigate = useNavigate();

    const loadLogs = async () => {
        try {
          const token = localStorage.getItem("access_token");
            const response = await api.get("logs/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setLogs(response.data);
            console.log("Logs loaded:", response.data);
        } catch (error) {
            setError("Failed to load logs. Please try again.");
            console.log(error);
        }
        };

    useEffect(() => {
        loadLogs();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header 
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                navigate={navigate}
                handleLogout={handleLogout}
            />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-white">Activity Logs</h2>
                                <p className="text-blue-100 mt-2">Track all task activities and changes</p>
                            </div>
                            <div className="text-white text-right">
                                <p className="text-sm text-blue-100">Total Logs</p>
                                <p className="text-3xl font-bold">{logs.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mx-8 mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Table Section */}
                    <div className="p-8">
                        {logs.length === 0 && !error ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No activity logs yet</h3>
                                <p className="mt-2 text-gray-500">Activity logs will appear here as tasks are created, updated, or deleted.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Timestamp
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    User
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                    Action
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                    </svg>
                                                    Task ID
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {logs.map((log, index) => (
                                            <tr key={log.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(log.timestamp).toLocaleString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <span className="text-blue-600 font-semibold text-sm">
                                                                {log.user.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-sm font-medium text-gray-900">{log.user}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                                        log.action.includes('created') ? 'bg-green-100 text-green-800' :
                                                        log.action.includes('updated') ? 'bg-blue-100 text-blue-800' :
                                                        log.action.includes('deleted') ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-800 text-sm font-mono">
                                                        #{log.task_id}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}