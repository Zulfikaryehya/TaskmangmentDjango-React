import {
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Typography,
  Paper,
  Box,
  Stack,
  Divider
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';

export default function UserList({ users, selectedUserId, onUserSelect }) {
  if (users.length === 0) {
    return null;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        maxHeight: 300,
        overflow: 'auto',
      }}
    >
      <List sx={{ py: 0 }}>
        {users.map((user, index) => (
          <Box key={user.id}>
            <ListItem
              disablePadding
              secondaryAction={
                selectedUserId === user.id ? (
                  <Chip
                    label="Selected"
                    color="primary"
                    size="small"
                  />
                ) : null
              }
            >
              <ListItemButton
                selected={selectedUserId === user.id}
                onClick={() => onUserSelect(user)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.username}
                  secondary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                      {(user.first_name || user.last_name) && (
                        <Chip
                          label={`${user.first_name || ''} ${user.last_name || ''}`.trim()}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  }
                />
              </ListItemButton>
            </ListItem>
            {index < users.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Paper>
  );
}
