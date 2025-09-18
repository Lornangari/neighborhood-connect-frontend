// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
});

// Request interceptor → attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor → refresh token if expired
api.interceptors.response.use(
  (response) => response, // ✅ normal response
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and we haven’t retried yet → try refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token");

        // Call Django SimpleJWT refresh endpoint
        const res = await axios.post("http://localhost:8000/api/token/refresh/", {
          refresh,
        });

        // Save new access token
        localStorage.setItem("access", res.data.access);

        // Update axios header
        api.defaults.headers.common["Authorization"] =
          "Bearer " + res.data.access;

        // Retry the failed request with new token
        originalRequest.headers["Authorization"] = "Bearer " + res.data.access;
        return api(originalRequest);
      } catch (err) {
        // Refresh failed → force logout
        console.error("❌ Token refresh failed:", err.response?.data || err);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
