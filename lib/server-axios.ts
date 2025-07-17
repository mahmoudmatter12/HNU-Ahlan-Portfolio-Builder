import axios from "axios";
import { getUserIdHeader } from "./auth-headers";

// Server-side axios instance (for use in server components/API routes)
export const serverApi = axios.create({
  baseURL: "http://localhost:3000/en/api",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach interceptor to include x-user-id header for server-side requests
serverApi.interceptors.request.use(
  async (config) => {
    const userId = await getUserIdHeader();
    if (userId) {
      config.headers["x-user-id"] = userId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
