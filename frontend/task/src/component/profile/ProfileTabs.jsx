import React from "react";
import { Tabs, Tab } from "@mui/material";
import { Info as InfoIcon, Edit as EditIcon } from "@mui/icons-material";

export default function ProfileTabs({ tabValue, onTabChange }) {
  return (
    <div className="border-b border-gray-200 px-8">
      <Tabs
        value={tabValue}
        onChange={onTabChange}
        variant="fullWidth"
        className="min-h-0"
      >
        <Tab
          icon={<InfoIcon />}
          iconPosition="start"
          label="About"
          className="text-base font-semibold normal-case"
        />
        <Tab
          icon={<EditIcon />}
          iconPosition="start"
          label="Edit Profile"
          className="text-base font-semibold normal-case"
        />
      </Tabs>
    </div>
  );
}
