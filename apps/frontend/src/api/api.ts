import axios from "axios";
import { auth } from '../auth/auth.ts';

const api = axios.create({
  baseURL: "http://localhost:3300",
});

api.interceptors.request.use((config:any) => {
  const token = auth.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
