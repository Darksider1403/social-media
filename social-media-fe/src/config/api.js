import axios from "axios";

export const API_BASE_URL = "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to dynamically add the token to each request
api.interceptors.request.use(
  (config) => {
    // Get the latest token for each request
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
