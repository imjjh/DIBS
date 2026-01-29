import api from '@/lib/axios';
import { ApiResponse } from '@/types';

export const imageService = {
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<ApiResponse<string>>('/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    },
};
