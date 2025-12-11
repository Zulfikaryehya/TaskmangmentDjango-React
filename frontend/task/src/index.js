import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import CreateTasksPage from './pages/CreateTaskPage';
import EditTaskPage from './pages/EditPage';
import LogsPage from './pages/LogsPage';
import SuperuserRoute from './component/SuperuserRoute';
import UserProfilePage from './pages/UserProfilePage';
const router = createBrowserRouter ([
    {path: "/", element: <LoginPage />},
  {path: "/login", element: <LoginPage />},
  {path: "/register", element: <RegisterPage/>},
  {path: "/tasks", element: <TasksPage />},
  {path: "/create-task", element: <CreateTasksPage />},
  {path: "/tasks/:id/edit", element: <EditTaskPage />},
  {path : "logs", element: <SuperuserRoute><LogsPage /></SuperuserRoute>},
  {path : "user-profile", element: <UserProfilePage />},
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

