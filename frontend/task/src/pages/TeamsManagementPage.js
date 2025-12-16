import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, CircularProgress, Typography } from '@mui/material';
import PageHeader from '../component/teams/PageHeader';
import TeamCard from '../component/teams/TeamCard';
import EmptyState from '../component/teams/EmptyState';
import CreateTeamDialog from '../component/teams/CreateTeamDialog';
import AddMemberDialog from '../component/teams/AddMemberDialog';
import NotificationSnackbar from '../component/teams/NotificationSnackbar';
import useTeamManagement from '../hooks/useTeamManagement';
import Header from '../component/Header';

export default function TeamsManagementPage() {
  const navigate = useNavigate();
  const {
    teams,
    loading,
    availableUsers,
    loadingUsers,
    snackbar,
    handleCloseSnackbar,
    fetchTeams,
    fetchAvailableUsers,
    createTeam,
    addMember,
  } = useTeamManagement();

  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  
  // Form states
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUsername, setSelectedUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Create team handlers
  const handleOpenCreateDialog = () => {
    setErrors({});
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setTeamName('');
    setTeamDescription('');
    setErrors({});
  };

  const handleCreateTeam = async () => {
    setErrors({});
    const result = await createTeam(teamName, teamDescription);
    if (result.success) {
      handleCloseCreateDialog();
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  // Add member handlers
  const handleOpenAddMemberDialog = (team) => {
    setSelectedTeam(team);
    setSelectedUsername('');
    setSelectedUserId('');
    setSearchQuery('');
    setErrors({});
    setOpenAddMemberDialog(true);
    fetchAvailableUsers(team.id);
  };

  const handleCloseAddMemberDialog = () => {
    setOpenAddMemberDialog(false);
    setSelectedTeam(null);
    setSelectedUsername('');
    setSelectedUserId('');
    setSearchQuery('');
    setErrors({});
  };

  const handleAddMember = async () => {
    if (!selectedUsername) return;
    
    const result = await addMember(selectedTeam.id, selectedUsername);
    if (result.success) {
      handleCloseAddMemberDialog();
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUserId(user.id);
    setSelectedUsername(user.username);
  };

  const handleViewDetails = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  // Filter users based on search query
  const filteredUsers = availableUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.first_name && user.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.last_name && user.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <>
        <Header />
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '80vh',
            gap: 3
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary" fontWeight={600}>
            Loading teams...
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'grey.50',
          pb: 6,
        }}
      >
        <Container maxWidth="xl" sx={{ pt: 4 }}>
          
          <PageHeader onCreateTeam={handleOpenCreateDialog} teamCount={teams.length} />

          {teams.length === 0 ? (
            <EmptyState onCreateTeam={handleOpenCreateDialog} />
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 3,
                gridAutoRows: 'auto',
              }}
            >
              {teams.map((team) => (
                <Box key={team.id}>
                  <TeamCard
                    team={team}
                    onAddMember={handleOpenAddMemberDialog}
                    onViewDetails={handleViewDetails}
                  />
                </Box>
              ))}
            </Box>
          )}

          <CreateTeamDialog
            open={openCreateDialog}
            onClose={handleCloseCreateDialog}
            onSubmit={handleCreateTeam}
            teamName={teamName}
            setTeamName={setTeamName}
            teamDescription={teamDescription}
            setTeamDescription={setTeamDescription}
            errors={errors}
          />

          <AddMemberDialog
            open={openAddMemberDialog}
            onClose={handleCloseAddMemberDialog}
            onSubmit={handleAddMember}
            selectedTeam={selectedTeam}
            availableUsers={availableUsers}
            loadingUsers={loadingUsers}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedUserId={selectedUserId}
            selectedUsername={selectedUsername}
            onUserSelect={handleUserSelect}
            filteredUsers={filteredUsers}
          />

          <NotificationSnackbar
            open={snackbar.open}
            message={snackbar.message}
            severity={snackbar.severity}
            onClose={handleCloseSnackbar}
          />
        </Container>
      </Box>
    </>
  );
}
