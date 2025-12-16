import React from "react";
import { CircularProgress } from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";
import Header from "../Header";

export function LoadingState() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <CircularProgress size={80} thickness={4} />
          <p className="mt-4 text-xl text-gray-700 font-semibold">
            Loading profile...
          </p>
        </div>
      </div>
    </>
  );
}

export function NoProfileState() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <InfoIcon className="text-6xl text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 font-semibold">
            No profile data available
          </p>
        </div>
      </div>
    </>
  );
}
