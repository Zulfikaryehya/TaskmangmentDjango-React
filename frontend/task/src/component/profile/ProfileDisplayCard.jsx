import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const ProfileInfoItem = ({ icon: Icon, label, value, color }) => (
  <Box
    sx={{
      display: "flex",
      gap: 2,
      p: 2,
      bgcolor: "grey.50",
      borderRadius: 2,
      transition: "all 0.2s",
      "&:hover": {
        bgcolor: "grey.100",
        transform: "translateY(-2px)",
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
        borderRadius: 2,
        bgcolor: `${color}.50`,
        color: `${color}.main`,
      }}
    >
      <Icon />
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
      >
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5, wordBreak: "break-word" }}>
        {value || (
          <Typography component="span" variant="body1" color="text.disabled" fontStyle="italic">
            Not set
          </Typography>
        )}
      </Typography>
    </Box>
  </Box>
);

const ProfileDisplayCard = ({ profile }) => {
  return (
    <Card
      elevation={4}
      sx={{
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          px: 3,
          py: 4,
          color: "white",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "white",
              color: "primary.main",
              fontSize: "2rem",
              fontWeight: 700,
              boxShadow: 3,
            }}
          >
            {profile.username?.[0]?.toUpperCase() || <PersonIcon fontSize="large" />}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {profile.username}
            </Typography>
            <Chip
              label="Active"
              size="small"
              sx={{
                mt: 1,
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>
        </Stack>
      </Box>

      {/* Content Section */}
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <ProfileInfoItem
            icon={EmailIcon}
            label="Email Address"
            value={profile.email}
            color="success"
          />
          <ProfileInfoItem
            icon={PhoneIcon}
            label="Phone Number"
            value={profile.phone}
            color="info"
          />
          <Box>
            <Divider sx={{ my: 2 }} />
            <ProfileInfoItem
              icon={InfoIcon}
              label="Bio"
              value={profile.bio}
              color="warning"
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProfileDisplayCard;
