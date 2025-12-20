import { Paper, Typography, List, ListItem, ListItemButton, ListItemText, Chip, Box } from '@mui/material';
import { Stars } from '@mui/icons-material';

export default function TeamMembersSidebar({ members, selectedMember, onMemberClick }) {
    return (
        <Paper elevation={2} sx={{ p: 2, position: 'sticky', top: 24 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Team Members
            </Typography>
            <List disablePadding>
                {members?.map((member) => (
                    <ListItem key={member.id} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={selectedMember?.id === member.id}
                            onClick={() => onMemberClick(member)}
                            sx={{
                                borderRadius: 2,
                                border: selectedMember?.id === member.id ? 2 : 1,
                                borderColor: selectedMember?.id === member.id ? 'primary.main' : 'divider',
                                '&.Mui-selected': {
                                    bgcolor: 'primary.lighter',
                                },
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                }
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography fontWeight="medium">
                                            {member.username}
                                        </Typography>
                                        {member.is_current_user && (
                                            <Chip label="You" size="small" color="primary" />
                                        )}
                                        {member.role === 'owner' && (
                                            <Stars fontSize="small" sx={{ color: 'warning.main' }} />
                                        )}
                                    </Box>
                                }
                                secondary={
                                    <Typography variant="caption" textTransform="capitalize">
                                        {member.role}
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}
