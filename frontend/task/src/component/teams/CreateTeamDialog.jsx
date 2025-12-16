import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';

export default function CreateTeamDialog({
  open,
  onClose,
  onSubmit,
  teamName,
  setTeamName,
  teamDescription,
  setTeamDescription,
  errors
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
            Create New Team
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={3}>
          <TextField
            autoFocus
            label="Team Name"
            fullWidth
            required
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name?.[0]}
            placeholder="Enter team name"
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
            error={!!errors.description}
            helperText={errors.description?.[0]}
            placeholder="Describe your team's purpose..."
          />
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!teamName.trim()}
          startIcon={<AddIcon />}
        >
          Create Team
        </Button>
      </DialogActions>
    </Dialog>
  );
}
