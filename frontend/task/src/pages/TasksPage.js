import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const[error, setError] = useState("");
    const[statusFilter, setStatusFilter] = useState("");
    const navigate = useNavigate();
    
    const loadTasks = async (status='') => {
    try {
      const token = localStorage.getItem("access_token");

      const url= status ? `tasks/?status=${status}` : "tasks/";

      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data);
    } catch (error) {
        setError("Failed to load tasks. Please try again.");
        console.log(error);
    }
  };

  useEffect(() => {
    loadTasks(statusFilter);
  }, [statusFilter]);

  useEffect(() => {
   const token = localStorage.getItem("access_token");
   if (!token) {
       navigate("/login");
   }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  }

const handleDeleteTask = async (taskId) => {
    // Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await api.delete(`tasks/${taskId}/`, {
        headers: {  
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Task deleted successfully!");
      loadTasks(statusFilter); // Refresh the task list with current filter
    } catch (error) {
      setError("Failed to delete task. Please try again.");
      console.log(error);
    }
  }

  // Function to get status badge color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch(statusLower) {
      case 'completed':
      case 'done':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in progress':
      case 'in_progress':
      case 'inprogress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending':
      case 'todo':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Function to get priority badge color
  const getPriorityColor = (priority) => {
    const priorityLower = priority?.toLowerCase();
    switch(priorityLower) {
      case 'high':
      case 'urgent':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-orange-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Your Tasks</h1>
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
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Task Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{tasks.length}</span> {statusFilter ? `${statusFilter.replace('_', ' ')} ` : ''}task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {statusFilter ? `No ${statusFilter.replace('_', ' ')} tasks` : 'No tasks yet'}
            </h3>
            <p className="text-gray-500">
              {statusFilter ? `You don't have any ${statusFilter.replace('_', ' ')} tasks.` : 'Start by creating your first task!'}
            </p>
          </div>
        ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200"
            >
              {/* Task Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                {task.title}
              </h3>

              {/* Task Description */}
              <p className="text-gray-600 mb-4 line-clamp-3">
                {task.description || 'No description provided'}
              </p>

              {/* Status and Priority Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                  {task.priority || 'Normal'}
                </span>
              </div>

              {/* Due Date */}
              {task.due_date && (
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                </div>
              )}

              {/* Assigned To */}
              {task.assigned_to && (
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Assigned to: {task.assigned_to}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => navigate(`/tasks/${task.id}/edit`)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 font-semibold"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </main>
    </div>
  );
}