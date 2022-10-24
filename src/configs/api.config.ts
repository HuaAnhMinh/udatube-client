import axios, { AxiosInstance } from "axios";
import endpoints from "./endpoints.config";

const api: AxiosInstance = axios.create({
  baseURL: endpoints.base,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 1800000,
});

export default api;