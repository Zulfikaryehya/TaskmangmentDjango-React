import { useState, useEffect } from "react";
import api from "../api/axios";

export default function useLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await api.get("logs/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs(response.data);
      console.log("Logs loaded:", response.data);
    } catch (error) {
      setError("Failed to load logs. Please try again.");
      console.error("Error loading logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return {
    logs,
    error,
    loading,
    loadLogs,
  };
}
