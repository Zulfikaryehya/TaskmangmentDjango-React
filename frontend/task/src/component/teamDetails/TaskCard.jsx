import { Card, CardContent, CardActions, Typography, Box, Chip, Button, Stack, IconButton, Divider } from '@mui/material';
import { PlayArrow, CheckCircle, Delete, CalendarToday, Person } from '@mui/icons-material';

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

export default function TaskCard({ task, canUpdate, canDelete, onUpdateStatus, onDelete }) {
    const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toLocaleDateString() : 'No due date';
    };

    const handleStatusChange = async (newStatus) => {
        const result = await onUpdateStatus(task.id, newStatus);
        if (result.success) {
            // Success handled in parent
        } else {
            alert(result.error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
            const result = await onDelete(task.id);
            if (!result.success) {
                alert(result.error);
            }
        }
    };

    return (
        <Card 
            elevation={2}
            sx={{ 
                mb: 2,
                border: task.is_assigned_to_me ? 2 : 1,
                borderColor: task.is_assigned_to_me ? 'primary.main' : 'divider',
                bgcolor: task.is_assigned_to_me ? 'primary.lighter' : 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)'
                }
            }}
        >
            <CardContent sx={{ pb: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                            <Typography variant="h6" fontWeight="bold">
                                {task.title}
                            </Typography>
                            {task.is_assigned_to_me && (
                                <Chip 
                                    label="Your Task" 
                                    size="small" 
                                    color="primary" 
                                    variant="filled"
                                />
                            )}
                        </Box>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Chip 
                            label={task.priority} 
                            color={priorityColors[task.priority]} 
                            size="small"
                            sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                        />
                        <Chip 
                            label={task.status.replace('-', ' ')} 
                            color={statusColors[task.status]} 
                            size="small"
                            sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                        />
                    </Stack>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {task.description}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                    {task.assigned_to && (
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Person fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                                Assigned to: <strong>{task.assigned_to.username}</strong>
                            </Typography>
                        </Box>
                    )}
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <Person fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                            By: <strong>{task.created_by.username}</strong>
                        </Typography>
                    </Box>
                </Stack>

                {task.due_date && (
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                            Due: <strong>{formatDate(task.due_date)}</strong>
                        </Typography>
                    </Box>
                )}
            </CardContent>

            {(canUpdate || canDelete) && (
                <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between' }}>
                    <Stack direction="row" spacing={1}>
                        {canUpdate && task.status !== 'completed' && (
                            <>
                                {task.status === 'pending' && (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<PlayArrow />}
                                        onClick={() => handleStatusChange('in-progress')}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Start Task
                                    </Button>
                                )}
                                {task.status === 'in-progress' && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        startIcon={<CheckCircle />}
                                        onClick={() => handleStatusChange('completed')}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Mark Complete
                                    </Button>
                                )}
                            </>
                        )}
                    </Stack>
                    
                    {canDelete && (
                        <IconButton
                            color="error"
                            size="small"
                            onClick={handleDelete}
                            sx={{
                                '&:hover': {
                                    bgcolor: 'error.lighter',
                                    transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            <Delete />
                        </IconButton>
                    )}
                </CardActions>
            )}
        </Card>
    );
}
