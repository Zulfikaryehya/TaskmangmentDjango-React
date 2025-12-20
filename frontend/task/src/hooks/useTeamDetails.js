import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export default function useTeamDetails(teamId) {
    const [teamData, setTeamData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedMemberTasks, setSelectedMemberTasks] = useState([]);

    const loadTeamDetails = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            const response = await api.get(`teams/${teamId}/details/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeamData(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load team details');
            console.error('Error loading team details:', err);
        } finally {
            setLoading(false);
        }
    }, [teamId]);

    const loadMemberTasks = useCallback(async (memberId) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await api.get(`teams/${teamId}/members/${memberId}/tasks/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedMemberTasks(response.data.tasks);
        } catch (err) {
            console.error('Error loading member tasks:', err);
        }
    }, [teamId]);

    const handleMemberClick = useCallback((member) => {
        setSelectedMember(member);
        loadMemberTasks(member.id);
    }, [loadMemberTasks]);

    const updateTaskStatus = useCallback(async (taskId, newStatus) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await api.patch(
                `teams/${teamId}/tasks/${taskId}/update-status/`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            await loadTeamDetails();
            
            if (selectedMember) {
                await loadMemberTasks(selectedMember.id);
            }
            
            return { 
                success: true,
                message: response.data.message || 'Task status updated successfully'
            };
        } catch (err) {
            console.error('Error updating task status:', err);
            return { 
                success: false, 
                error: err.response?.data?.error || 'Failed to update task status' 
            };
        }
    }, [teamId, selectedMember, loadTeamDetails, loadMemberTasks]);

    const deleteTask = useCallback(async (taskId) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await api.delete(
                `teams/${teamId}/tasks/${taskId}/delete/`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            await loadTeamDetails();
            
            if (selectedMember) {
                await loadMemberTasks(selectedMember.id);
            }
            
            return { 
                success: true,
                message: response.data.message || 'Task deleted successfully'
            };
        } catch (err) {
            console.error('Error deleting task:', err);
            return { 
                success: false, 
                error: err.response?.data?.error || 'Failed to delete task' 
            };
        }
    }, [teamId, selectedMember, loadTeamDetails, loadMemberTasks]);

    useEffect(() => {
        loadTeamDetails();
    }, [loadTeamDetails]);

    return {
        teamData,
        loading,
        error,
        selectedMember,
        selectedMemberTasks,
        loadTeamDetails,
        handleMemberClick,
        updateTaskStatus,
        deleteTask,
        setSelectedMember
    };
}
