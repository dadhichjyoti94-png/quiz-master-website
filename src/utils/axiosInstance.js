import axios from 'axios';

// `localhost` is only valid while developing on the same machine as the API.
// A public deployment must receive its API URL through the hosting environment.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : undefined);

export const apiConfigurationError = !API_BASE_URL
    ? 'Website API is not configured. Set NEXT_PUBLIC_API_URL to the live backend URL and redeploy.'
    : null;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use((config) => {
    if (apiConfigurationError) {
        return Promise.reject(new Error(apiConfigurationError));
    }

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('qm_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => Promise.reject(error));

export default axiosInstance;
