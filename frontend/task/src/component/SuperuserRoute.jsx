import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';

export default function SuperuserRoute({ children }) {
    const [isSuperuser, setIsSuperuser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
            } finally {
                setLoading(false);
            }
        };
        checkSuperuser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }
    
    return isSuperuser ? children : <Navigate to="/tasks" replace />;
}
