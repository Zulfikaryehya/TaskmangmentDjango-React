import { useState, useCallback } from 'react';
import api from '../api/axios';

export default function useTeamManagement() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch teams
  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await api.get('teams/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      showSnackbar('Failed to load teams', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch available users for a team
  const fetchAvailableUsers = useCallback(async (teamId) => {
    try {
      setLoadingUsers(true);
      const token = localStorage.getItem('access_token');
      const response = await api.get(`teams/${teamId}/available-users/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableUsers(response.data.available_users || []);
    } catch (error) {
      console.error('Error fetching available users:', error);
      showSnackbar('Failed to load available users', 'error');
      setAvailableUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Create team
  const createTeam = async (teamName, teamDescription) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await api.post(
        'teams/create/',
        { name: teamName, description: teamDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showSnackbar(response.data.message || 'Team created successfully!');
      await fetchTeams();
      return { success: true };
    } catch (error) {
      console.error('Error creating team:', error);
      const errorData = error.response?.data || {};
      showSnackbar(errorData.error || 'Failed to create team', 'error');
      return { success: false, errors: errorData };
    }
  };

  // Add member to team
  const addMember = async (teamId, username) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await api.post(
        `teams/${teamId}/add-member/`,
        { username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showSnackbar(response.data.message || 'Member added successfully!');
      await fetchTeams();
      return { success: true };
    } catch (error) {
      console.error('Error adding member:', error);
      showSnackbar(
        error.response?.data?.error || 'Failed to add member',
        'error'
      );
      return { success: false };
    }
  };

  return {
    teams,
    loading,
    availableUsers,
    loadingUsers,
    snackbar,
    showSnackbar,
    handleCloseSnackbar,
    fetchTeams,
    fetchAvailableUsers,
    createTeam,
    addMember,
  };
}
