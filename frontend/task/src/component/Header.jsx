import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaPlus, FaFilter, FaClipboardList, FaSignOutAlt, FaUser, FaTasks } from 'react-icons/fa';

export default function Header({ statusFilter, setStatusFilter, handleLogout }) {
    const navigate = useNavigate();
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

    const handleLogoutClick = () => {
        if (handleLogout) {
            handleLogout();
        } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/login");
        }
    };

    return (   
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo/Brand Section */}
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm">
                <FaTasks className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Task Manager</h1>
                <p className="text-blue-100 text-xs">Stay organized, stay productive</p>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex gap-3 items-center">
              {/* Filter Dropdown */}
              <div className="relative">
                <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-md rounded-lg px-4 py-2 border border-white border-opacity-20">
                  <FaFilter className="text-white text-sm mr-2" />
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-white font-medium focus:outline-none cursor-pointer appearance-none pr-8"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1.5em 1.5em',
                    }}
                  >
                    <option value="" className="bg-gray-800 text-white">All Tasks</option>
                    <option value="pending" className="bg-gray-800 text-white">Pending</option>
                    <option value="completed" className="bg-gray-800 text-white">Completed</option>
                  </select>
                </div>
              </div>

              {/* New Task Button */}
              <button
                onClick={() => navigate("/create-task")}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl flex items-center gap-2 border-2 border-green-400"
              >
                <FaPlus className="text-sm" />
                <span className="hidden sm:inline">New Task</span>
              </button>

              {/* View Logs Button - Only for superusers */}
              {isSuperuser && (
                <button
                  onClick={() => navigate("/logs")}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 backdrop-blur-md border border-white border-opacity-30 flex items-center gap-2"
                >
                  <FaClipboardList className="text-sm" />
                  <span className="hidden md:inline">Logs</span>
                </button>
              )}

              {/* User Profile Button */}
              <button
                onClick={() => navigate("/user-profile")}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 backdrop-blur-md border border-white border-opacity-30 flex items-center gap-2"
                title="View Profile"
              >
                <FaUser className="text-sm" />
                <span className="hidden md:inline">Profile</span>
              </button>

              {/* Logout Button */}
              <button 
                onClick={handleLogoutClick}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl flex items-center gap-2 border-2 border-red-400"
                title="Logout"
              >
                <FaSignOutAlt className="text-sm" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>);
}