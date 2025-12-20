import api from '@/lib/axios';
import { Product } from '@/types';

export const productService = {
    getProducts: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>('/products');
        return response.data;
    },

    createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
        const response = await api.post<Product>('/products', productData);
        return response.data;
    },

    deleteProduct: async (id: number): Promise<void> => {
        await api.delete(`/products/${id}`);
    },

    getProductById: async (id: number): Promise<Product> => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },
};
