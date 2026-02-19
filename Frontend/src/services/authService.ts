import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/api';

const AuthService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // Ignore errors
        }
        window.location.href = '/login';
    },

    isAuthenticated: (): boolean => {
        // Cannot check HttpOnly cookies from JS
        // Always return false - components should use useAuth().isAuthenticated
        return false;
    },
};

export default AuthService;
