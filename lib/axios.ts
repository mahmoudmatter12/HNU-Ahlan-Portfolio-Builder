import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // If using Next.js API routes
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});
