import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 10000
});

export function withHeaders({ role, userId } = {}) {
  const headers = {};
  if (role) headers["x-user-role"] = role;
  if (userId) headers["x-user-id"] = String(userId);
  return { headers };
}
