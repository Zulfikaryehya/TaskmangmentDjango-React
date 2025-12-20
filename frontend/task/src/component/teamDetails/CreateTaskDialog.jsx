import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Alert,
    Stack
} from '@mui/material';
import api from '../../api/axios';

export default function CreateTaskDialog({ 
    open, 
    onClose, 
    teamId, 
    members, 
    onTaskCreated 
}) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        assigned_to: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (event) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.assigned_to) {
            setError('Please select a team member to assign the task');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');

            const taskData = {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                due_date: formData.due_date,
                assigned_to: formData.assigned_to,
                status: 'pending'
            };

            console.log('Sending task data:', taskData);

            const response = await api.post(
                `teams/${teamId}/tasks/create/`,
                taskData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log('Task created successfully:', response.data);

            // Reset form
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                due_date: '',
                assigned_to: ''
            });
            setError('');
            onTaskCreated();
            onClose();
        } catch (err) {
            console.error('Error creating task:', err);
            console.error('Error response:', err.response?.data);

            const errorMsg = err.response?.data?.details
                ? JSON.stringify(err.response.data.details)
                : err.response?.data?.error || 'Failed to create task';

            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            priority: 'medium',
            due_date: '',
            assigned_to: ''
        });
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create Team Task</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack spacing={2}>
                        {error && (
                            <Alert severity="error" onClose={() => setError('')}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            label="Task Title"
                            required
                            fullWidth
                            value={formData.title}
                            onChange={handleChange('title')}
                        />

                        <TextField
                            label="Description"
                            required
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={handleChange('description')}
                        />

                        <TextField
                            label="Assign To"
                            required
                            fullWidth
                            select
                            value={formData.assigned_to}
                            onChange={handleChange('assigned_to')}
                        >
                            <MenuItem value="">Select a team member</MenuItem>
                            {members?.map((member) => (
                                <MenuItem key={member.id} value={member.username}>
                                    {member.username} ({member.role})
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Priority"
                            required
                            fullWidth
                            select
                            value={formData.priority}
                            onChange={handleChange('priority')}
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </TextField>

                        <TextField
                            label="Due Date"
                            type="date"
                            required
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.due_date}
                            onChange={handleChange('due_date')}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Task'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
