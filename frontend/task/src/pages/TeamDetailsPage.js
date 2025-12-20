import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, 
    Grid, 
    CircularProgress, 
    Alert, 
    Box, 
    Button, 
    Snackbar, 
    Paper,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Divider,
    Stack,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { 
    ArrowBack, 
    Add, 
    Assignment, 
    People, 
    Person,
    CalendarToday,
    PlayArrow,
    CheckCircle,
    Delete,
    Close,
} from '@mui/icons-material';
import useTeamDetails from '../hooks/useTeamDetails';
import Header from '../component/Header';
import CreateTaskDialog from '../component/teamDetails/CreateTaskDialog';



export default function TeamDetailsPage() {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    const {
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
    } = useTeamDetails(teamId);

    const showToast = (message, severity = 'success') => {
        setToast({ open: true, message, severity });
    };

    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') return;
        setToast({ ...toast, open: false });
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    const handleTaskCreated = () => {
        loadTeamDetails();
        if (selectedMember) {
            handleMemberClick(selectedMember);
        }
        showToast('Task created successfully!', 'success');
    };

    const handleUpdateStatus = async (taskId, newStatus) => {
        const result = await updateTaskStatus(taskId, newStatus);
        if (result.success) {
            showToast(result.message, 'success');
            setTaskDialogOpen(false);
        } else {
            showToast(result.error, 'error');
        }
    };

    const handleDeleteTask = async (taskId) => {
        const result = await deleteTask(taskId);
        if (result.success) {
            showToast(result.message, 'success');
            setTaskDialogOpen(false);
        } else {
            showToast(result.error, 'error');
        }
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setTaskDialogOpen(true);
    };

    const handleCloseTaskDialog = () => {
        setTaskDialogOpen(false);
        setSelectedTask(null);
    };

    const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toLocaleDateString() : 'No due date';
    };

    const statusColors = {
        'completed': '#4caf50',
        'in-progress': '#2196f3',
        'pending': '#ff9800'
    };

    const priorityColors = {
        'high': '#f44336',
        'medium': '#ff9800',
        'low': '#4caf50'
    };

    const currentUserId = teamData?.members?.find(m => m.is_current_user)?.id;
    const displayTasks = selectedMember ? selectedMemberTasks : teamData?.tasks || [];
    const completedCount = displayTasks.filter(t => t.status === 'completed').length;
    const inProgressCount = displayTasks.filter(t => t.status === 'in-progress').length;
    const pendingCount = displayTasks.filter(t => t.status === 'pending').length;

    if (loading) {
        return (
            <>
                <Header handleLogout={handleLogout} />
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="calc(100vh - 64px)"
                    sx={{ bgcolor: '#f5f5f5' }}
                >
                    <CircularProgress size={60} />
                </Box>
            </>
        );
    }

    if (error && !teamData) {
        return (
            <>
                <Header handleLogout={handleLogout} />
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="calc(100vh - 64px)"
                    sx={{ bgcolor: '#f5f5f5' }}
                >
                    <Box sx={{ maxWidth: 400, p: 3 }}>
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                        <Button 
                            variant="contained" 
                            fullWidth
                            onClick={() => navigate('/teams')}
                        >
                            Back to Teams
                        </Button>
                    </Box>
                </Box>
            </>
        );
    }

    return (
        <>
            <Header handleLogout={handleLogout} />
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 4 }}>
                <Container maxWidth="xl" sx={{ pt: 3 }}>
                    {/* Page Header */}
                    <Box sx={{ mb: 3 }}>
                        <Button 
                            startIcon={<ArrowBack />} 
                            onClick={() => navigate('/teams')}
                            sx={{ mb: 2, color: '#666' }}
                        >
                            Back to Teams
                        </Button>
                        
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                                        {teamData?.name}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {teamData?.description}
                                    </Typography>
                                </Box>
                                {teamData?.is_owner && (
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => setShowCreateDialog(true)}
                                        sx={{ 
                                            bgcolor: '#1976d2',
                                            '&:hover': { bgcolor: '#1565c0' }
                                        }}
                                    >
                                        New Task
                                    </Button>
                                )}
                            </Box>
                        </Paper>
                    </Box>

                    <Grid container spacing={3}>
                        {/* Sidebar - Team Members */}
                        <Grid item xs={12} md={3}>
                            <Paper sx={{ p: 2 }}>
                                <Box display="flex" alignItems="center" gap={1} mb={2}>
                                    <People color="primary" />
                                    <Typography variant="h6" fontWeight="bold">
                                        Team Members
                                    </Typography>
                                </Box>
                                
                                <Button
                                    fullWidth
                                    variant={!selectedMember ? 'contained' : 'outlined'}
                                    onClick={() => setSelectedMember(null)}
                                    sx={{ mb: 2, justifyContent: 'flex-start' }}
                                >
                                    <Assignment sx={{ mr: 1 }} />
                                    All Tasks
                                </Button>

                                <Divider sx={{ my: 2 }} />

                                <List sx={{ p: 0 }}>
                                    {teamData?.members?.map((member) => (
                                        <ListItem key={member.id} disablePadding sx={{ mb: 1 }}>
                                            <ListItemButton
                                                selected={selectedMember?.id === member.id}
                                                onClick={() => handleMemberClick(member)}
                                                sx={{
                                                    borderRadius: 1,
                                                    '&.Mui-selected': {
                                                        bgcolor: '#e3f2fd',
                                                        '&:hover': { bgcolor: '#bbdefb' }
                                                    }
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: '#1976d2' }}>
                                                        {member.username.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Typography variant="body2">
                                                                {member.username}
                                                            </Typography>
                                                            {member.is_current_user && (
                                                                <Chip label="You" size="small" color="primary" />
                                                            )}
                                                        </Box>
                                                    }
                                                    secondary={
                                                        member.id === teamData.owner 
                                                            ? 'Owner' 
                                                            : 'Member'
                                                    }
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>

                        {/* Main Content - Tasks */}
                        <Grid item xs={12} md={9}>
                            <Paper sx={{ p: 3 }}>
                                {/* Tasks Header */}
                                <Box mb={3}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        {selectedMember 
                                            ? `${selectedMember.username}'s Tasks${selectedMember.is_current_user ? ' (Your Tasks)' : ''}`
                                            : 'All Team Tasks'
                                        }
                                    </Typography>
                                    
                                    {/* Stats */}
                                    <Box display="flex" gap={2} mt={2}>
                                        <Chip 
                                            label={`${pendingCount} Pending`}
                                            sx={{ bgcolor: '#fff3e0', color: '#e65100' }}
                                        />
                                        <Chip 
                                            label={`${inProgressCount} In Progress`}
                                            sx={{ bgcolor: '#e3f2fd', color: '#0d47a1' }}
                                        />
                                        <Chip 
                                            label={`${completedCount} Completed`}
                                            sx={{ bgcolor: '#e8f5e9', color: '#1b5e20' }}
                                        />
                                    </Box>
                                </Box>

                                {/* Tasks Grid */}
                                {displayTasks.length === 0 ? (
                                    <Box 
                                        display="flex" 
                                        flexDirection="column" 
                                        alignItems="center" 
                                        justifyContent="center"
                                        py={8}
                                    >
                                        <Assignment sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            {selectedMember ? 'No tasks assigned yet' : 'No tasks in this team yet'}
                                        </Typography>
                                        {!selectedMember && teamData?.is_owner && (
                                            <Button 
                                                variant="contained" 
                                                startIcon={<Add />}
                                                onClick={() => setShowCreateDialog(true)}
                                                sx={{ mt: 2 }}
                                            >
                                                Create First Task
                                            </Button>
                                        )}
                                    </Box>
                                ) : (
                                    <Grid container spacing={2}>
                                        {displayTasks.map((task) => (
                                            <Grid item xs={12} sm={6} md={4} key={task.id}>
                                                <Card 
                                                    elevation={1}
                                                    sx={{
                                                        height: '100%',
                                                        border: task.is_assigned_to_me ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            boxShadow: 3,
                                                            transform: 'translateY(-4px)'
                                                        }
                                                    }}
                                                >
                                                    <CardActionArea 
                                                        onClick={() => handleTaskClick(task)}
                                                        sx={{ height: '100%' }}
                                                    >
                                                        <CardContent>
                                                            {/* Title & Priority */}
                                                            <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                                                                <Typography 
                                                                    variant="h6" 
                                                                    fontWeight="600"
                                                                    sx={{ 
                                                                        flex: 1,
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical',
                                                                    }}
                                                                >
                                                                    {task.title}
                                                                </Typography>
                                                            </Box>

                                                            {/* Description */}
                                                            <Typography 
                                                                variant="body2" 
                                                                color="text.secondary" 
                                                                sx={{ 
                                                                    mb: 2,
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    minHeight: 40
                                                                }}
                                                            >
                                                                {task.description || 'No description'}
                                                            </Typography>

                                                            <Divider sx={{ my: 2 }} />

                                                            {/* Info */}
                                                            <Stack spacing={1}>
                                                                <Box display="flex" gap={1}>
                                                                    <Chip 
                                                                        label={task.priority}
                                                                        size="small"
                                                                        sx={{ 
                                                                            bgcolor: priorityColors[task.priority],
                                                                            color: 'white',
                                                                            textTransform: 'capitalize'
                                                                        }}
                                                                    />
                                                                    <Chip 
                                                                        label={task.status.replace('-', ' ')}
                                                                        size="small"
                                                                        sx={{ 
                                                                            bgcolor: statusColors[task.status],
                                                                            color: 'white',
                                                                            textTransform: 'capitalize'
                                                                        }}
                                                                    />
                                                                </Box>

                                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                                    <Person fontSize="small" sx={{ color: '#757575' }} />
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {task.assigned_to?.username || 'Unassigned'}
                                                                    </Typography>
                                                                </Box>

                                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                                    <CalendarToday fontSize="small" sx={{ color: '#757575' }} />
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {formatDate(task.due_date)}
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Task Details Dialog */}
                    <Dialog 
                        open={taskDialogOpen} 
                        onClose={handleCloseTaskDialog}
                        maxWidth="sm"
                        fullWidth
                    >
                        {selectedTask && (
                            <>
                                <DialogTitle sx={{ bgcolor: '#fafafa', pb: 2 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="start">
                                        <Box flex={1}>
                                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                                {selectedTask.title}
                                            </Typography>
                                            <Box display="flex" gap={1} flexWrap="wrap">
                                                <Chip 
                                                    label={selectedTask.priority}
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: priorityColors[selectedTask.priority],
                                                        color: 'white',
                                                        textTransform: 'capitalize'
                                                    }}
                                                />
                                                <Chip 
                                                    label={selectedTask.status.replace('-', ' ')}
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: statusColors[selectedTask.status],
                                                        color: 'white',
                                                        textTransform: 'capitalize'
                                                    }}
                                                />
                                                {selectedTask.is_assigned_to_me && (
                                                    <Chip 
                                                        label="Your Task" 
                                                        size="small" 
                                                        color="primary"
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                        <IconButton onClick={handleCloseTaskDialog}>
                                            <Close />
                                        </IconButton>
                                    </Box>
                                </DialogTitle>

                                <DialogContent sx={{ mt: 2 }}>
                                    <Stack spacing={3}>
                                        {/* Description */}
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: '#1976d2' }}>
                                                Description
                                            </Typography>
                                            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                                                <Typography variant="body2">
                                                    {selectedTask.description || 'No description provided'}
                                                </Typography>
                                            </Paper>
                                        </Box>

                                        <Divider />

                                        {/* Details */}
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: '#1976d2' }}>
                                                Details
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Assigned To
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="600">
                                                        {selectedTask.assigned_to?.username || 'Unassigned'}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Created By
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="600">
                                                        {selectedTask.created_by?.username}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Due Date
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="600">
                                                        {formatDate(selectedTask.due_date)}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Priority
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="600" sx={{ textTransform: 'capitalize' }}>
                                                        {selectedTask.priority}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Stack>
                                </DialogContent>

                                <DialogActions sx={{ p: 2.5, bgcolor: '#fafafa' }}>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Box>
                                            {teamData?.is_owner && (
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<Delete />}
                                                    onClick={() => {
                                                        if (window.confirm(`Delete "${selectedTask.title}"?`)) {
                                                            handleDeleteTask(selectedTask.id);
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </Box>
                                        <Box display="flex" gap={1}>
                                            {selectedTask.is_assigned_to_me && selectedTask.status !== 'completed' && (
                                                <>
                                                    {selectedTask.status === 'pending' && (
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<PlayArrow />}
                                                            onClick={() => handleUpdateStatus(selectedTask.id, 'in-progress')}
                                                        >
                                                            Start
                                                        </Button>
                                                    )}
                                                    {selectedTask.status === 'in-progress' && (
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            startIcon={<CheckCircle />}
                                                            onClick={() => handleUpdateStatus(selectedTask.id, 'completed')}
                                                        >
                                                            Complete
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                            <Button onClick={handleCloseTaskDialog} variant="outlined">
                                                Close
                                            </Button>
                                        </Box>
                                    </Box>
                                </DialogActions>
                            </>
                        )}
                    </Dialog>

                    {/* Create Task Dialog */}
                    <CreateTaskDialog
                        open={showCreateDialog}
                        onClose={() => setShowCreateDialog(false)}
                        teamId={teamId}
                        members={teamData?.members}
                        onTaskCreated={handleTaskCreated}
                    />
                </Container>

                {/* Toast Notifications */}
                <Snackbar 
                    open={toast.open} 
                    autoHideDuration={4000} 
                    onClose={handleCloseToast}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <MuiAlert 
                        onClose={handleCloseToast} 
                        severity={toast.severity} 
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {toast.message}
                    </MuiAlert>
                </Snackbar>
            </Box>
        </>
    );
}
