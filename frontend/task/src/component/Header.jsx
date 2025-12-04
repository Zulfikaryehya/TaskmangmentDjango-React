import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Header({ statusFilter, setStatusFilter, navigate, handleLogout }) {
    const [isSuperuser, setIsSuperuser] = useState(false);

    useEffect(() => {
        // Check if user is superuser
        const checkSuperuser = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await api.get('check-superuser/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIsSuperuser(response.data.is_superuser);
            } catch (error) {
                console.error('Error checking superuser status:', error);
                setIsSuperuser(false);
            }
        };
        checkSuperuser();
    }, []);

    return (   
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <div className="flex gap-4 items-center">
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
                Filter:
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button
              onClick={() => navigate("/create-task")}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-md"
            >
              + New Task
            </button>

            {/* View Logs Button - Only for superusers */}
            {isSuperuser && (
              <button
                onClick={() => navigate("/logs")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-md flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Logs
              </button>
            )}

            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>);
}