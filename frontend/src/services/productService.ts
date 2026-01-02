import api from '@/lib/axios';
import { Product, ApiResponse, ProductSearchParams, ProductListResponse, ProductDetail } from '@/types';

export const productService = {
    getProducts: async (params?: ProductSearchParams): Promise<ProductListResponse> => {
        const response = await api.get<ApiResponse<ProductListResponse>>('/product', { params });
        return response.data.data;
    },

    createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
        const response = await api.post<ApiResponse<Product>>('/product', productData);
        return response.data.data;
    },

    deleteProduct: async (id: number): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/product/${id}`);
    },

    getProductById: async (id: number): Promise<ProductDetail> => {
        const response = await api.get<ApiResponse<ProductDetail>>(`/product/${id}`);
        return response.data.data;
    },
};
