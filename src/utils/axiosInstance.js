import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

axiosInstance.interceptors.request.use(
  (requestConfig) => {
    const apiKey = import.meta.env.VITE_SUPABASE_KEY;
    const token = sessionStorage.getItem("jwt_token");

    requestConfig.headers["apikey"] = apiKey;
    requestConfig.headers["Authorization"] = `Bearer ${token}`;

    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
