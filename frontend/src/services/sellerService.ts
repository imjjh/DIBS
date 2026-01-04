import api from '@/lib/axios';
import {
    SellerApplication,
    SellerApplicationRequest,
    SellerApplicationSearchRequest,
    SellerApplicationListResponse,
    ApiResponse
} from '@/types';

export const sellerService = {
    /**
     * 판매자 권한 신청
     */
    apply: async (data: SellerApplicationRequest): Promise<void> => {
        await api.post<ApiResponse<void>>('/seller/apply', data);
    },

    /**
     * 내 판매자 신청 현황 조회
     */
    getMyApplication: async (): Promise<SellerApplication> => {
        const response = await api.get<ApiResponse<SellerApplication>>('/seller/my-application');
        return response.data.data;
    },

    /**
     * [관리자] 판매자 신청 목록 조회
     */
    getApplications: async (params?: SellerApplicationSearchRequest): Promise<SellerApplicationListResponse> => {
        const response = await api.get<ApiResponse<SellerApplicationListResponse>>('/admin/seller-applications', { params });
        return response.data.data;
    },

    /**
     * [관리자] 판매자 신청 승인
     */
    approveApplication: async (id: number): Promise<void> => {
        await api.patch<ApiResponse<void>>(`/admin/seller/${id}`, { approve: true });
    },

    /**
     * [관리자] 판매자 신청 거절
     */
    rejectApplication: async (id: number, reason: string): Promise<void> => {
        await api.patch<ApiResponse<void>>(`/admin/seller/${id}`, { approve: false, rejectReason: reason });
    }
};
