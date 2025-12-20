import { 
    Paper, 
    Typography, 
    Box, 
    Button, 
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip
} from '@mui/material';
import { Assignment, Add, PlayArrow, CheckCircle, Delete, CalendarToday, Person } from '@mui/icons-material';

export default function TasksList({ 
    tasks, 
    title, 
    emptyMessage, 
    currentUserId,
    isOwner,
    onUpdateStatus,
    onDeleteTask,
    showCreateButton,
    onCreateTask 
}) {
    if (!tasks) return null;

    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
    const pendingCount = tasks.filter(t => t.status === 'pending').length;

    const statusColors = {
        'completed': 'success',
        'in-progress': 'info',
        'pending': 'warning'
    };

    const priorityColors = {
        'high': 'error',
        'medium': 'warning',
        'low': 'success'
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        await onUpdateStatus(taskId, newStatus);
    };

    const handleDelete = async (taskId, taskTitle) => {
        if (window.confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
            await onDeleteTask(taskId);
        }
    };

    const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toLocaleDateString() : 'No due date';
    };

    return (
        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
            {/* Header Section */}
            <Box 
                sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    p: 3,
                    color: 'white'
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Assignment sx={{ fontSize: 32 }} />
                        <Box>
                            <Typography variant="h5" fontWeight="bold">
                                {title}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
                            </Typography>
                        </Box>
                    </Box>
                    {showCreateButton && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={onCreateTask}
                            sx={{
                                bgcolor: 'white',
                                color: 'primary.main',
                                fontWeight: 600,
                                '&:hover': {
                                    bgcolor: 'grey.100',
                                    transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            New Task
                        </Button>
                    )}
                </Box>

                {/* Stats Chips */}
                <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip 
                        label={`${pendingCount} Pending`} 
                        size="small"
                        sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontWeight: 600
                        }}
                    />
                    <Chip 
                        label={`${inProgressCount} In Progress`} 
                        size="small"
                        sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontWeight: 600
                        }}
                    />
                    <Chip 
                        label={`${completedCount} Completed`} 
                        size="small"
                        sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontWeight: 600
                        }}
                    />
                </Box>
            </Box>

            {/* Tasks Content */}
            {tasks.length === 0 ? (
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center"
                    py={8}
                    px={3}
                >
                    <Assignment sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        {emptyMessage}
                    </Typography>
                    {showCreateButton && (
                        <Button 
                            variant="contained" 
                            startIcon={<Add />}
                            onClick={onCreateTask}
                            sx={{ mt: 2 }}
                        >
                            Create First Task
                        </Button>
                    )}
                </Box>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.50' }}>
                                <TableCell sx={{ fontWeight: 700 }}>Task</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Assigned To</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow 
                                    key={task.id}
                                    sx={{
                                        '&:hover': { bgcolor: 'action.hover' },
                                        bgcolor: task.is_assigned_to_me ? 'primary.lighter' : 'inherit'
                                    }}
                                >
                                    <TableCell>
                                        <Box>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Typography variant="body1" fontWeight="600">
                                                    {task.title}
                                                </Typography>
                                                {task.is_assigned_to_me && (
                                                    <Chip 
                                                        label="Your Task" 
                                                        size="small" 
                                                        color="primary"
                                                        sx={{ height: 20 }}
                                                    />
                                                )}
                                            </Box>
                                            {task.description && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    {task.description}
                                                </Typography>
                                            )}
                                            <Typography variant="caption" color="text.secondary">
                                                By: {task.created_by.username}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <Person fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                {task.assigned_to?.username || 'Unassigned'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={task.priority} 
                                            color={priorityColors[task.priority]} 
                                            size="small"
                                            sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={task.status.replace('-', ' ')} 
                                            color={statusColors[task.status]} 
                                            size="small"
                                            sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <CalendarToday fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                {formatDate(task.due_date)}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box display="flex" justifyContent="center" gap={0.5}>
                                            {task.is_assigned_to_me && task.status !== 'completed' && (
                                                <>
                                                    {task.status === 'pending' && (
                                                        <Tooltip title="Start Task">
                                                            <IconButton
                                                                color="primary"
                                                                size="small"
                                                                onClick={() => handleStatusUpdate(task.id, 'in-progress')}
                                                            >
                                                                <PlayArrow />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {task.status === 'in-progress' && (
                                                        <Tooltip title="Mark Complete">
                                                            <IconButton
                                                                color="success"
                                                                size="small"
                                                                onClick={() => handleStatusUpdate(task.id, 'completed')}
                                                            >
                                                                <CheckCircle />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </>
                                            )}
                                            {isOwner && (
                                                <Tooltip title="Delete Task">
                                                    <IconButton
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleDelete(task.id, task.title)}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
}
