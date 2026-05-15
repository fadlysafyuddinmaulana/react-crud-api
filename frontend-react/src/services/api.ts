import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authtoken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // debug: log request method/url and whether token is present
  try {
    console.debug(
      "API request",
      config.method,
      config.url,
      token ? "token: present" : "token: missing",
    );
  } catch (e) {
    // ignore
  }
  return config;
});

export default api;
