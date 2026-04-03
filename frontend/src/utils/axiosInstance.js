import axios from 'axios';

const API_BASE = 'https://hospital-management-system-mern-9r6v.onrender.com/api';

// Central axios instance - automatically attaches the correct token
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Request interceptor: attach Bearer token from localStorage
axiosInstance.interceptors.request.use((config) => {
  // Try doctor token first, then user token
  const doctorToken = localStorage.getItem('doctorToken');
  const userToken = localStorage.getItem('token');
  const token = doctorToken || userToken;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
