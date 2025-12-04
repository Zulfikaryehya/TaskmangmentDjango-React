import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Auto-refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      try {
        const refresh = localStorage.getItem("refresh_token");
        const newToken = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
          refresh,
        });

        localStorage.setItem("access_token", newToken.data.access);

        // Retry original request
        error.config.headers["Authorization"] = `Bearer ${newToken.data.access}`;
        return api(error.config);

      } catch (err) {
        console.log("Refresh failed");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
