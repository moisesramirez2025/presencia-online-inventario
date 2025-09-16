// import axios from "axios";

// export const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
//   withCredentials: false,
//   headers: { "Content-Type": "application/json" },
// });

// api.interceptors.request.use((config) => {
//   const t = localStorage.getItem("token");
//   if (t) {
//     config.headers.Authorization = `Bearer ${t}`;
//   }
//   return config;
// });

import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  withCredentials: true,  // CAMBIADO A TRUE
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Añade interceptor de respuesta para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// En tu archivo de configuración de axios, agrega:
api.interceptors.request.use((config) => {
  console.log('🔄 Request to:', config.baseURL + config.url);
  console.log('📋 Headers:', config.headers);
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response from:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.config?.url, error.response?.status);
    console.error('📋 Error details:', error.response?.data);
    return Promise.reject(error);
  }
);