import React, { useState } from "react";
import { Fade } from "@mui/material";
import { Toaster } from "react-hot-toast";
import Header from "../component/Header";
import { useProfile } from "../hooks/useProfile";
import { LoadingState, NoProfileState } from "../component/profile/ProfileStates";
import ProfileHeroBanner from "../component/profile/ProfileHeroBanner";
import ProfileHeader from "../component/profile/ProfileHeader";
import ProfileTabs from "../component/profile/ProfileTabs";
import ProfileAboutTab from "../component/profile/ProfileAboutTab";
import ProfileEditTab from "../component/profile/ProfileEditTab";
import TabPanel from "../component/profile/TabPanel";

export default function UserProfilePage() {
  const { profile, loading, handleInputChange, handleSubmit } = useProfile();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Loading state
  if (loading && !profile) {
    return <LoadingState />;
  }

  // No profile state
  if (!profile) {
    return <NoProfileState />;
  }

  const gradients = [
    "from-purple-600 to-indigo-600",
    "from-pink-500 to-rose-500",
    "from-cyan-500 to-blue-500",
  ];

  const userGradient = gradients[profile.username.length % gradients.length];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pb-12">
        <Toaster position="top-right" />

        {/* Hero Banner */}
        <ProfileHeroBanner userGradient={userGradient} />

        <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
            {/* Profile Header */}
            <ProfileHeader profile={profile} userGradient={userGradient} />

            {/* Tabs */}
            <ProfileTabs tabValue={tabValue} onTabChange={handleTabChange} />

            {/* Tab Content */}
            <div className="p-8">
              {/* About Tab */}
              <TabPanel value={tabValue} index={0}>
                <Fade in={tabValue === 0} timeout={500}>
                  <div>
                    <ProfileAboutTab profile={profile} />
                  </div>
                </Fade>
              </TabPanel>

              {/* Edit Tab */}
              <TabPanel value={tabValue} index={1}>
                <Fade in={tabValue === 1} timeout={500}>
                  <div>
                    <ProfileEditTab
                      profile={profile}
                      loading={loading}
                      onInputChange={handleInputChange}
                      onSubmit={handleSubmit}
                      userGradient={userGradient}
                    />
                  </div>
                </Fade>
              </TabPanel>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
