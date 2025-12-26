import api from '@/lib/axios';
import { LoginCredentials, SignupCredentials, User, AuthResponse, ApiResponse } from '@/types';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
        return response.data.data;
    },

    signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', credentials);
        return response.data.data;
    },

    getMe: async (): Promise<User> => {
        const response = await api.get<ApiResponse<User>>('/auth/me');
        return response.data.data;
    },

    logout: async (): Promise<void> => {
        await api.post<ApiResponse<void>>('/auth/logout');
    },
};
