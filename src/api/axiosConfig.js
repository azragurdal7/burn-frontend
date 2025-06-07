import axios from "axios";

// .env dosyasından backend URL’yi al
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL, // artık localhost değil
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const loginAdmin = (url, data) => api.post(url, data);
export const loginDoctor = (url, data) => api.post(url, data);

export default api;
