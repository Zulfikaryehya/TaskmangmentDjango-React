import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profileData = {
        ...response.data,
        phone: response.data.phone || "",
        bio: response.data.bio || "",
      };

      setProfile(profileData);
      console.log("✅ Profile loaded successfully");
    } catch (error) {
      console.error("❌ Error loading profile:", error);

      const backendError = error.response?.data;
      
      if (typeof backendError === "string") {
        toast.error(backendError);
      } else if (backendError?.error) {
        toast.error(backendError.error);
      } else if (backendError?.detail) {
        toast.error(backendError.detail);
      } else if (error.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Failed to load profile. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const response = await api.patch(
        "profile/",
        {
          phone: profile.phone,
          bio: profile.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedProfile = {
        ...response.data,
        phone: response.data.phone || "",
        bio: response.data.bio || "",
      };

      setProfile(updatedProfile);
      console.log("✅ Profile updated successfully:", response.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("❌ Error updating profile:", err);

      const backendErrors = err.response?.data;
      const errorMessages = [];

      if (typeof backendErrors === "string") {
        errorMessages.push(backendErrors);
      } else if (typeof backendErrors === "object") {
        Object.entries(backendErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => errorMessages.push(`${field}: ${msg}`));
          } else {
            errorMessages.push(`${field}: ${messages}`);
          }
        });
      }

      const errorText =
        errorMessages.length > 0
          ? errorMessages.join(". ")
          : err.message
          ? `Error: ${err.message}`
          : "Failed to update profile. Please check your connection.";

      toast.error(errorText);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  return {
    profile,
    loading,
    handleInputChange,
    handleSubmit,
  };
};
