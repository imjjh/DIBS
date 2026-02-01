import axios from '@/lib/axios';
import { ApiResponse } from '@/types';

export interface CartItemResponse {
    productId: number;
    productName: string;
    imageUrl: string;
    price: number;
    quantity: number;
    sellerName: string;
}

export interface PagedResponse<T> {
    items: T[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
}

export const cartService = {
    /**
     * 장바구니 목록 조회 (페이징)
     */
    getCartItems: async (page: number = 1, size: number = 10): Promise<PagedResponse<CartItemResponse>> => {
        const response = await axios.get<ApiResponse<PagedResponse<CartItemResponse>>>('/cart-items', {
            params: { page, size } // PageableRequest가 1-based -> 0-based 변환 처리함
        });
        return response.data.data;
    },

    /**
     * 장바구니에 상품 추가
     */
    addToCart: async (productId: number, quantity: number): Promise<void> => {
        await axios.post('/cart-items', { productId, quantity });
    },

    /**
     * 장바구니 아이템 수량 변경
     */
    updateCartItemQuantity: async (productId: number, quantity: number): Promise<void> => {
        await axios.patch(`/cart-items/${productId}`, null, {
            params: { quantity }
        });
    },

    /**
     * 장바구니에서 아이템 삭제
     */
    removeCartItem: async (productId: number): Promise<void> => {
        await axios.delete(`/cart-items/${productId}`);
    }
};
