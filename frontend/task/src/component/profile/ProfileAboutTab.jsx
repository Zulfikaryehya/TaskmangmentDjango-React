import React from "react";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

const InfoCard = ({ icon: Icon, title, value, gradient, colorScheme }) => {
  return (
    <div
      className={`bg-gradient-to-r ${gradient} border ${colorScheme.border} rounded-2xl p-5 transition-all duration-300 hover:shadow-lg ${colorScheme.hover} transform hover:-translate-y-1`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 bg-gradient-to-br ${colorScheme.iconGradient} rounded-xl flex items-center justify-center shadow-lg`}
        >
          <Icon className="text-white text-2xl" />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
            {title}
          </p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

const BioCard = ({ bio }) => {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:from-pink-100 hover:to-rose-100 transform hover:-translate-y-1">
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
            <InfoIcon className="text-white text-2xl" />
          </div>
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
            Bio
          </p>
        </div>
        <p className="text-base leading-relaxed text-gray-700 pl-1">
          {bio || (
            <span className="text-gray-400 italic">
              No bio added yet. Tell us about yourself!
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default function ProfileAboutTab({ profile }) {
  return (
    <div className="space-y-4">
      {/* Email Card */}
      <InfoCard
        icon={EmailIcon}
        title="Email Address"
        value={profile.email}
        gradient="from-purple-50 to-indigo-50"
        colorScheme={{
          border: "border-purple-100",
          hover: "hover:from-purple-100 hover:to-indigo-100",
          iconGradient: "from-purple-500 to-indigo-600",
        }}
      />

      {/* Phone Card */}
      <InfoCard
        icon={PhoneIcon}
        title="Phone Number"
        value={
          profile.phone || (
            <span className="text-gray-400 italic font-normal">Not set</span>
          )
        }
        gradient="from-cyan-50 to-blue-50"
        colorScheme={{
          border: "border-cyan-100",
          hover: "hover:from-cyan-100 hover:to-blue-100",
          iconGradient: "from-cyan-500 to-blue-600",
        }}
      />

      {/* Bio Card */}
      <BioCard bio={profile.bio} />
    </div>
  );
}
