import { Paper, Typography, Box, Chip, Button, Stack } from '@mui/material';
import { ArrowBack, Add, Groups, Assignment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function TeamHeader({ teamData, onCreateTask }) {
    const navigate = useNavigate();

    if (!teamData) return null;

    const { team, total_members, total_tasks, current_user_role, is_owner } = teamData;

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="start">
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {team.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {team.description}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Chip 
                            icon={<Groups />} 
                            label={`${total_members} members`} 
                            size="small" 
                            variant="outlined"
                        />
                        <Chip 
                            icon={<Assignment />} 
                            label={`${total_tasks} tasks`} 
                            size="small" 
                            variant="outlined"
                        />
                        <Chip 
                            label={`Role: ${current_user_role}`} 
                            color="primary" 
                            size="small"
                        />
                    </Stack>
                </Box>
                <Stack direction="row" spacing={1}>
                    {is_owner && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={onCreateTask}
                        >
                            Create Task
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/teams')}
                    >
                        Back
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
}
