import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
  Stack,
  Box,
  CircularProgress,
  Paper,
  InputAdornment
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import UserList from './UserList';

export default function AddMemberDialog({
  open,
  onClose,
  onSubmit,
  selectedTeam,
  availableUsers,
  loadingUsers,
  searchQuery,
  setSearchQuery,
  selectedUserId,
  selectedUsername,
  onUserSelect,
  filteredUsers
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            Add Member to {selectedTeam?.name}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={2}>
          {/* Search field */}
          <TextField
            autoFocus
            label="Search Users"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username or email..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Loading state */}
          {loadingUsers ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: 'background.default',
              }}
            >
              <PeopleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography color="text.secondary">
                {availableUsers.length === 0
                  ? 'All users are already members of this team'
                  : 'No users match your search'}
              </Typography>
            </Paper>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} available
              </Typography>
              
              {/* Users list */}
              <UserList
                users={filteredUsers}
                selectedUserId={selectedUserId}
                onUserSelect={onUserSelect}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!selectedUsername || loadingUsers}
          startIcon={<PersonAddIcon />}
        >
          Add Member
        </Button>
      </DialogActions>
    </Dialog>
  );
}
