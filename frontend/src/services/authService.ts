import api from '@/lib/axios';
import { LoginCredentials, SignupCredentials, User, AuthResponse, ApiResponse } from '@/types';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<User> => {
        const response = await api.post<ApiResponse<User>>('/auth/login', credentials);
        return response.data.data;
    },

    signup: async (credentials: SignupCredentials): Promise<void> => {
        await api.post<ApiResponse<void>>('/auth/register', credentials);
    },

    getMe: async (): Promise<User> => {
        const response = await api.get<ApiResponse<User>>('/auth/me');
        return response.data.data;
    },

    logout: async (): Promise<void> => {
        await api.post<ApiResponse<void>>('/auth/logout');
    },

    validUsername: async (username: string): Promise<void> => {
        await api.post<ApiResponse<void>>('/auth/validUsername', { username });
    },

    forgotPassword: async (email: string): Promise<void> => {
        await api.post<ApiResponse<void>>('/auth/forgot-password', { email });
    },
};
