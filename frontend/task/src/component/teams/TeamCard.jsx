import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
  Chip,
  Box,
  Avatar,
  IconButton,
  Tooltip,
  alpha
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  People as PeopleIcon,
  ArrowForward as ArrowForwardIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
];

export default function TeamCard({ team, onAddMember, onViewDetails }) {
  const gradient = gradients[team.id % gradients.length];
  const teamInitial = team.name.charAt(0).toUpperCase();

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          borderColor: 'primary.main',
          '& .team-card-header': {
            background: gradient,
          },
          '& .team-card-actions': {
            opacity: 1,
            transform: 'translateY(0)',
          },
          '& .arrow-icon': {
            transform: 'translateX(4px)',
          }
        },
      }}
    >
      {/* Header with gradient */}
      <Box 
        className="team-card-header"
        sx={{ 
          background: alpha('#667eea', 0.08),
          p: 3,
          position: 'relative',
          transition: 'all 0.4s',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: gradient,
            opacity: 0,
            transition: 'opacity 0.4s',
          },
          '&:hover::before': {
            opacity: 0.1,
          }
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: gradient,
              fontSize: '1.5rem',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {teamInitial}
          </Avatar>
          <IconButton size="small" sx={{ opacity: 0.6 }}>
            <MoreVertIcon />
          </IconButton>
        </Stack>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          fontWeight={700}
          gutterBottom
          sx={{
            mb: 1.5,
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {team.name}
        </Typography>
        
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2.5,
            minHeight: 44,
            lineHeight: 1.6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {team.description || 'No description provided'}
        </Typography>
        
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            icon={<PeopleIcon sx={{ fontSize: 16 }} />}
            label={`Team #${team.id}`}
            size="small"
            sx={{
              bgcolor: alpha('#667eea', 0.08),
              color: 'primary.main',
              fontWeight: 600,
              border: 'none',
            }}
          />
          <Chip
            icon={<GroupIcon sx={{ fontSize: 16 }} />}
            label="Active"
            size="small"
            sx={{
              bgcolor: alpha('#43e97b', 0.12),
              color: 'success.main',
              fontWeight: 600,
              border: 'none',
            }}
          />
        </Stack>
      </CardContent>
      
      <CardActions 
        className="team-card-actions"
        sx={{ 
          p: 2.5, 
          pt: 0,
          gap: 1,
          opacity: 0.7,
          transform: 'translateY(-4px)',
          transition: 'all 0.3s',
        }}
      >
        <Tooltip title="Add team member" arrow>
          <Button
            fullWidth
            size="medium"
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => onAddMember(team)}
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                transform: 'scale(1.03)',
              }
            }}
          >
            Add Member
          </Button>
        </Tooltip>
        <Tooltip title="View team details" arrow>
          <Button
            fullWidth
            size="medium"
            variant="contained"
            endIcon={<ArrowForwardIcon className="arrow-icon" sx={{ transition: 'transform 0.3s' }} />}
            onClick={() => onViewDetails(team.id)}
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              background: gradient,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transform: 'scale(1.03)',
              }
            }}
          >
            View Details
          </Button>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
