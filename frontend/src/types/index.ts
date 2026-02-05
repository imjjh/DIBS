export interface ApiResponse<T> {
    message: string;
    data: T;
}

export interface User {
    id: number;
    email: string;
    name: string;
    nickname?: string;
    points: number;
    roles: string[];
}

export interface LoginCredentials {
    username?: string; // Standard login uses username
    email?: string;
    password?: string;
}

export interface SignupCredentials {
    username: string;
    password?: string;
    email: string;
    nickname?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export enum ProductStatus {
    ON_SALE = 'ON_SALE',
    RESERVED = 'RESERVED',
    SOLD_OUT = 'SOLD_OUT',
    PREPARING = 'PREPARING'
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stockQuantity?: number;
    status: ProductStatus;
    imageUrl?: string;
    category?: string;
    discountRate?: number;
    sellerId?: number;
}

export interface ProductDetail extends Product {
    sellerName: string;
}

export interface ProductSearchParams {
    page?: number;
    size?: number;
    keyword?: string;
    category?: string;
    lastProductId?: number;
}

export interface PagedResponse<T> {
    items: T[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
}

export interface ProductListResponse extends PagedResponse<Product> { }

export enum CouponType {
    FIXED_AMOUNT = 'FIXED_AMOUNT',
    PERCENTAGE = 'PERCENTAGE'
}

export interface Coupon {
    id: number;
    name: string;
    type: CouponType;
    discountValue: number;
    minOrderPrice: number;
    totalQuantity: number;
    remainingQuantity: number;
    validFrom: string;
    validTo: string;
}

export interface UserCoupon {
    id: number;
    userId: number;
    couponId: number;
    isUsed: boolean;
    usedAt?: string;
    coupon: Coupon; // Included for convenience
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
    SHIPPING = 'SHIPPING',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export interface OrderItemSimpleResponse {
    productId: number;
    productName: string;
    productImageUrl: string;
    quantity: number;
    price: number;
}

export interface OrderSimpleResponse {
    id: number;
    orderName: string;
    totalPrice: number;
    status: OrderStatus;
    orderedAt: string;
    representativeImageUrl?: string;
}

export interface OrderItemDetailResponse {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    imageUrl: string;
    stockQuantity: number;
    productStatus: ProductStatus;
}

export interface OrderDetailResponse {
    orderId: number;
    orderName: string;
    orderedAt: string;
    status: OrderStatus;
    totalPrice: number;
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    shippingAddressDetail: string;
    zipCode: string;
    deliveryMemo?: string;
    orderItems: OrderItemDetailResponse[];
}

export interface OrderSearchRequest {
    page?: number;
    size?: number;
    // Add other search fields if OrderSearchRequestDto has them
}

export interface OrderListResponse extends PagedResponse<OrderSimpleResponse> { }

export interface CartItem {
    id: number; // Cart ID or Product ID depending on implementation
    productId: number;
    userId: number;
    count: number;
    product: Product;
}

export enum ApplicationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export interface SellerApplication {
    id: number;
    userId: number;
    businessName: string;
    businessNumber: string;
    status: string; // "대기 중", "승인", "거절" (Backend CaseBuilder result)
    rejectReason?: string;
}

export interface SellerApplicationRequest {
    businessName: string;
    businessNumber: string;
}

export interface SellerApplicationSearchRequest {
    page?: number;
    size?: number;
}

export interface SellerApplicationListResponse extends PagedResponse<SellerApplication> { }
