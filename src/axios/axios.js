import axios from 'axios';

// Create an axios instance
const instance = axios.create({
    baseURL: "http://localhost:5000", // Replace with your API base URL
});

// Add a request interceptor
instance.interceptors.request.use(
    config => {
        // Get the token from localStorage
        const token = localStorage.getItem('jwtToken');
        
        // If the token exists, attach it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    error => {
        // Handle the error
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            window.onbeforeunload = null;
            window.removeEventListener('beforeunload', () => {});
            localStorage.removeItem('jwtToken');
            window.location.replace('/');
        }
        return Promise.reject(error);
    }
);

export default instance;