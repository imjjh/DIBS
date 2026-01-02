import api from '@/lib/axios';
import { Product, ApiResponse, ProductSearchParams, ProductListResponse } from '@/types';

export const productService = {
    getProducts: async (params?: ProductSearchParams): Promise<ProductListResponse> => {
        const response = await api.get<ApiResponse<ProductListResponse>>('/api/product', { params });
        return response.data.data;
    },

    createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
        const response = await api.post<ApiResponse<Product>>('/api/product', productData);
        return response.data.data;
    },

    deleteProduct: async (id: number): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/api/product/${id}`);
    },

    getProductById: async (id: number): Promise<Product> => {
        const response = await api.get<ApiResponse<Product>>(`/api/product/${id}`);
        return response.data.data;
    },
};
