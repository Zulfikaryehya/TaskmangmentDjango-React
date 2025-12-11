import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../component/Header";
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaInfoCircle, FaBriefcase, FaSave, FaCheckCircle } from "react-icons/fa";
export default function UserProfilePage() {
  const [profile, setProfile] = useState(null); // ✅ Changed from {} to null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load_user_info = async () => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors
      const token = localStorage.getItem("access_token");

      const response = await api.get("profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const profileData = {
        ...response.data,
        phone: response.data.phone || "",
        bio: response.data.bio || "",
        role: response.data.role || "member",
      };

      setProfile(profileData);
      setLoading(false);
      console.log("✅ Profile loaded successfully");
      
    } catch (error) {
      setLoading(false);
      console.error("❌ Error loading profile:", error);
      console.error("Response data:", error.response?.data);
      
      // Parse backend errors
      if (error.response?.data) {
        const backendError = error.response.data;
        
        if (typeof backendError === 'string') {
          setError(backendError);
        } else if (backendError.error) {
          setError(backendError.error);
        } else if (backendError.detail) {
          setError(backendError.detail);
        } else {
          setError("Failed to load profile. Please try again.");
        }
      } else if (error.message) {
        setError(`Error: ${error.message}`);
      } else {
        setError("Failed to load profile. Please check your connection.");
      }
    }
  };
  // Fetch profile on load

  useEffect(() => {
    load_user_info();
  }, []);

  const handelInputChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
    setError(""); // Clear errors when user types
    setSuccess(""); // Clear success message when user edits
  };

  const handel_change = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success
    setLoading(true);
    
    try {
      const token = localStorage.getItem("access_token");
      const response = await api.patch(
        "profile/",
        {
          phone: profile.phone,
          bio: profile.bio,
          role: profile.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update profile with response data
      const updatedProfile = {
        ...response.data,
        phone: response.data.phone || "",
        bio: response.data.bio || "",
        role: response.data.role || "member",
      };
      setProfile(updatedProfile);
      setLoading(false);
      
      console.log("✅ Profile updated successfully:", response.data);
      
      // Show success message
      setSuccess("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      setLoading(false);
      console.error("❌ Error updating profile:", err);
      console.error("Response data:", err.response?.data);
      
      // Parse backend errors and display them
      if (err.response?.data) {
        const backendErrors = err.response.data;
        let errorMessages = [];
        
        // Handle different error formats from backend
        if (typeof backendErrors === 'string') {
          errorMessages.push(backendErrors);
        } else if (typeof backendErrors === 'object') {
          // Handle field-specific errors
          Object.entries(backendErrors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => {
                errorMessages.push(`${field}: ${msg}`);
              });
            } else {
              errorMessages.push(`${field}: ${messages}`);
            }
          });
        }
        
        // Display all errors
        const errorText = errorMessages.length > 0 
          ? errorMessages.join(". ") 
          : "Failed to update profile. Please try again.";
        setError(errorText);
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError("Failed to update profile. Please check your connection.");
      }
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <FaInfoCircle className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">No profile data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className=""> 
       <Header title="User Profile" subtitle="View and edit your profile information" />
    
     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        
      <div className="max-w-6xl mx-auto">
        {/* Header */}
     

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-5 rounded-lg shadow-lg animate-pulse">
            <div className="flex items-start">
              <FaInfoCircle className="text-red-500 text-2xl mr-4 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-red-800 font-bold text-lg mb-1">Error</h3>
                <p className="text-red-700 font-medium leading-relaxed whitespace-pre-line">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-5 rounded-lg shadow-lg">
            <div className="flex items-start">
              <FaSave className="text-green-500 text-2xl mr-4 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-green-800 font-bold text-lg mb-1">Success</h3>
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Display Card */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-full p-4">
                  <FaUser className="text-4xl text-blue-500" />
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{profile.username}</h2>
                  <p className="text-blue-100 capitalize">{profile.role}</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Email */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="mt-1">
                  <FaEnvelope className="text-2xl text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
                  <p className="text-lg text-gray-800 font-medium break-all">{profile.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="mt-1">
                  <FaPhone className="text-2xl text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone Number</p>
                  <p className="text-lg text-gray-800 font-medium">
                    {profile.phone || <span className="text-gray-400 italic">Not set</span>}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="mt-1">
                  <FaInfoCircle className="text-2xl text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Bio</p>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    {profile.bio || <span className="text-gray-400 italic">No bio added yet</span>}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="mt-1">
                  <FaBriefcase className="text-2xl text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Role</p>
                  <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
                    {profile.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2 border-gray-200">
              <FaEdit className="text-3xl text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
            </div>

            <form onSubmit={handel_change} className="space-y-6">
              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaPhone className="text-purple-500" />
                  <span>Phone Number</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={profile.phone}
                  onChange={(e) => handelInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Bio Textarea */}
              <div>
                <label htmlFor="bio" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaInfoCircle className="text-orange-500" />
                  <span>Bio</span>
                </label>
                <textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={profile.bio}
                  onChange={(e) => handelInputChange('bio', e.target.value)}
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                />
              </div>

              {/* Role Select */}
              <div>
                <label htmlFor="role" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaBriefcase className="text-red-500" />
                  <span>Role</span>
                </label>
                <select
                  id="role"
                  value={profile.role}
                  onChange={(e) => handelInputChange('role', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize transition-all cursor-pointer"
                >
                  <option value="leader">Leader</option>
                  <option value="member">Member</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    </div>
   
  );
}
