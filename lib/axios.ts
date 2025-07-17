import axios from "axios";

// Client-side axios instance (for use in client components)
export const api = axios.create({
  baseURL: "http://localhost:3000/en/api",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Server-side axios instance (for use in server components/API routes)
export const serverApi = axios.create({
  baseURL: "http://localhost:3000/en/api",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set user ID header for client-side requests
export const setUserIdHeader = (userId: string | null) => {
  if (userId) {
    api.defaults.headers.common["x-user-id"] = userId;
  } else {
    delete api.defaults.headers.common["x-user-id"];
  }
};
