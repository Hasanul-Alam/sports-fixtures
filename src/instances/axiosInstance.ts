import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-MOBILE-API-TOKEN": "startstartups_token_for_mobile_api",
  },
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Example: You could trigger logout or refresh token logic here
      console.warn("Unauthorized - Token may be expired or invalid.");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
