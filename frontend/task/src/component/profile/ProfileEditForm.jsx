import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  Box,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Info as InfoIcon,
  Save as SaveIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

const ProfileEditForm = ({ profile, loading, onInputChange, onSubmit }) => {
  const handleChange = (field) => (event) => {
    onInputChange(field, event.target.value);
  };

  return (
    <Card
      elevation={4}
      sx={{
        height: "100%",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3, pb: 2, borderBottom: 2, borderColor: "divider" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: "primary.50",
              color: "primary.main",
            }}
          >
            <EditIcon fontSize="large" />
          </Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Edit Profile
          </Typography>
        </Stack>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <Stack spacing={3}>
            {/* Phone Input */}
            <TextField
              fullWidth
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              value={profile.phone || ""}
              onChange={handleChange("phone")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
              helperText="Your contact phone number"
            />

            {/* Bio Textarea */}
            <TextField
              fullWidth
              label="Bio"
              placeholder="Tell us about yourself..."
              value={profile.bio || ""}
              onChange={handleChange("bio")}
              multiline
              rows={6}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignItems: "flex-start", mt: 1.5 }}>
                    <InfoIcon color="action" />
                  </InputAdornment>
                ),
              }}
              helperText="A short description about yourself"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{
                py: 1.5,
                mt: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  background: "grey.400",
                },
                transition: "all 0.2s",
              }}
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;
