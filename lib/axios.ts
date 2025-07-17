import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/en/api",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
  // accsept all the orgin
  withCredentials: true,
});
