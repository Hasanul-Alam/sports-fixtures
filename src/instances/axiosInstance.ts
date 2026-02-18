import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://au.testing.smartb.com.au/soc-api/",
  timeout: 10000,
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - Token may be expired or invalid.");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
