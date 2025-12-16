import React from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import {
  Phone as PhoneIcon,
  Info as InfoIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

export default function ProfileEditTab({
  profile,
  loading,
  onInputChange,
  onSubmit,
  userGradient,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-6">
        <TextField
          fullWidth
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          value={profile.phone || ""}
          onChange={(e) => onInputChange("phone", e.target.value)}
          InputProps={{
            startAdornment: <PhoneIcon className="text-gray-400 mr-2" />,
            className: "rounded-xl",
          }}
          className="bg-gray-50"
        />

        <TextField
          fullWidth
          label="Bio"
          placeholder="Tell us about yourself..."
          value={profile.bio || ""}
          onChange={(e) => onInputChange("bio", e.target.value)}
          multiline
          rows={6}
          InputProps={{
            startAdornment: (
              <InfoIcon className="text-gray-400 mr-2 self-start mt-3" />
            ),
            className: "rounded-xl",
          }}
          className="bg-gray-50"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          className={`py-4 text-lg font-bold normal-case rounded-xl shadow-lg bg-gradient-to-r ${userGradient} hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1`}
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
