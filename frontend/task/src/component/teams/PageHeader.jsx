import {
  Paper,
  Typography,
  Button,
  Stack,
  Box,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Group as GroupIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

export default function PageHeader({ onCreateTeam, teamCount = 0 }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 5,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
        }
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={3}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Box>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
            <Box 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                p: 1.5, 
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <GroupIcon sx={{ fontSize: 36, color: 'white' }} />
            </Box>
            <Typography
              variant="h3"
              sx={{ 
                color: 'white', 
                fontWeight: 800,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                letterSpacing: '-0.5px'
              }}
            >
              Team Management
            </Typography>
          </Stack>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255,255,255,0.95)', 
              mb: 2,
              fontSize: '1.05rem',
              fontWeight: 500
            }}
          >
            Manage your teams and collaborate with members
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            <Chip 
              icon={<StarIcon sx={{ color: 'white !important' }} />}
              label={`${teamCount} Active Teams`}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.25)', 
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                fontSize: '0.95rem',
                height: 36,
              }}
            />
            <Chip 
              icon={<TrendingUpIcon sx={{ color: 'white !important' }} />}
              label="Collaborate Better"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.25)', 
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                fontSize: '0.95rem',
                height: 36,
              }}
            />
          </Stack>
        </Box>
        <Button
          variant="contained"
          color="success"
          size="large"
          startIcon={<AddIcon />}
          onClick={onCreateTeam}
          sx={{
            fontWeight: 700,
            fontSize: '1.05rem',
            bgcolor: 'white',
            color: 'primary.main',
            px: 4,
            py: 1.8,
            borderRadius: 3,
            boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
            textTransform: 'none',
            minWidth: 200,
            '&:hover': { 
              bgcolor: 'rgba(255,255,255,0.95)',
              transform: 'translateY(-3px)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Create New Team
        </Button>
      </Stack>
    </Paper>
  );
}
