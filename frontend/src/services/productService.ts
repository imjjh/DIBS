import api from '@/lib/axios';
import { Product, ApiResponse } from '@/types';

export const productService = {
    getProducts: async (): Promise<Product[]> => {
        const response = await api.get<ApiResponse<Product[]>>('/products');
        return response.data.data;
    },

    createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
        const response = await api.post<ApiResponse<Product>>('/products', productData);
        return response.data.data;
    },

    deleteProduct: async (id: number): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/products/${id}`);
    },

    getProductById: async (id: number): Promise<Product> => {
        const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
        return response.data.data;
    },
};
