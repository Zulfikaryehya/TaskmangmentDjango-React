import React from "react";
import { Avatar, IconButton, Chip } from "@mui/material";
import {
  Camera as CameraIcon,
  VerifiedUser as VerifiedIcon,
  Star as StarIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

export default function ProfileHeader({ profile, userGradient }) {
  return (
    <div className="p-8 pb-6">
      <div className="flex flex-col items-center">
        <div className="relative group">
          <Avatar
            className={`w-36 h-36 text-6xl font-bold bg-gradient-to-r ${userGradient} border-4 border-white shadow-2xl -mt-24 transform transition-transform duration-300 group-hover:scale-105`}
          >
            {profile.username?.[0]?.toUpperCase()}
          </Avatar>
          <IconButton
            className="absolute bottom-1 right-1 bg-white shadow-lg hover:bg-gray-100"
            size="small"
          >
            <CameraIcon fontSize="small" />
          </IconButton>
        </div>

        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-4xl font-bold text-gray-800">
              {profile.username}
            </h1>
            <VerifiedIcon className="text-blue-500 text-3xl" />
          </div>

          <p className="text-gray-600 text-lg font-medium mb-4">
            {profile.email}
          </p>

          <div className="flex gap-2 justify-center flex-wrap">
            <Chip
              icon={<StarIcon className="text-green-600" />}
              label="Active Member"
              className="bg-green-50 text-green-700 font-semibold"
            />
            <Chip
              icon={<PersonIcon className="text-purple-600" />}
              label="Team Player"
              className="bg-purple-50 text-purple-700 font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
