export const API_URL =
  import.meta.env.VITE_API_URL || "https://startupforgeServer1.onrender.com";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  timeout: 15000,
  headers: { "Content-Type": "application/json" }
});