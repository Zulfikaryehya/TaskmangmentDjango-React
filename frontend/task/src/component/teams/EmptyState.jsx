import {
  Paper,
  Typography,
  Button,
  Box,
  Stack,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  RocketLaunch as RocketIcon
} from '@mui/icons-material';

export default function EmptyState({ onCreateTeam }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 8,
          textAlign: 'center',
          maxWidth: 600,
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${alpha('#667eea', 0.03)} 0%, ${alpha('#764ba2', 0.03)} 100%)`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#667eea', 0.1)} 0%, transparent 70%)`,
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              p: 3,
              borderRadius: '50%',
              bgcolor: alpha('#667eea', 0.1),
              mb: 3,
            }}
          >
            <PeopleIcon sx={{ fontSize: 64, color: 'primary.main' }} />
          </Box>
          
          <Stack spacing={2} alignItems="center">
            <Typography variant="h4" fontWeight={700} color="text.primary">
              No Teams Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, lineHeight: 1.7 }}>
              Start building your dream team! Create your first team and invite members to collaborate on amazing projects together.
            </Typography>
            
            <Box sx={{ pt: 2 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<RocketIcon />}
                onClick={onCreateTeam}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Create Your First Team
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
