import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send HttpOnly cookies with every request
});

// Response interceptor for handling token refresh on 401
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't retried yet, attempt token refresh
        // Skip refresh/redirect logic for /auth/me - just let it fail so AuthContext sets user=null
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/me')) {
            originalRequest._retry = true;

            try {
                // Refresh endpoint reads refresh_token from HttpOnly cookie
                await axios.post('/api/auth/refresh', {}, { withCredentials: true });

                // Retry original request — new cookies are set by the refresh response
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
