import api from '@/lib/axios';
import {
    ApiResponse,
    OrderListResponse,
    OrderDetailResponse,
    OrderSearchRequest
} from '@/types';

export interface OrderItemRequest {
    productId: number;
    quantity: number;
}

export interface OrderCreateRequest {
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    shippingAddressDetail: string;
    zipCode: string;
    deliveryMemo?: string;
    orderItems: OrderItemRequest[];
}

export const orderService = {
    /**
     * 주문 목록 조회
     */
    searchOrders: async (params?: OrderSearchRequest): Promise<OrderListResponse> => {
        const response = await api.get<ApiResponse<OrderListResponse>>('/orders', { params });
        return response.data.data;
    },

    /**
     * 주문 상세 조회
     */
    getOrder: async (orderId: number): Promise<OrderDetailResponse> => {
        const response = await api.get<ApiResponse<OrderDetailResponse>>(`/orders/${orderId}`);
        return response.data.data;
    },

    /**
     * 주문 생성 (가주문)
     */
    createOrder: async (orderData: OrderCreateRequest): Promise<void> => {
        await api.post<ApiResponse<void>>('/orders', orderData);
    },

    /**
     * 주문 취소
     */
    cancelOrder: async (orderId: number, addToCart: boolean = false): Promise<void> => {
        await api.post<ApiResponse<void>>(`/orders/${orderId}/cancel`, null, {
            params: { addToCart }
        });
    }
};
