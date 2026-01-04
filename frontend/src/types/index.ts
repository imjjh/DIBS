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
    SOLD_OUT = 'SOLD_OUT'
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

export interface ProductListResponse {
    items: Product[];
    totalElements: number;
    page: number;
    size: number;
    totalPages: number;
}

export interface Event {
    id: number;
    title: string;
    productId: number;
    eventPrice: number;
    limitQuantity: number;
    remainingQuantity: number;
    startAt: string;
    endAt: string;
}

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
    PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
    SHIPPING = 'SHIPPING',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export interface Order {
    id: number;
    buyerId: number;
    totalPrice: number;
    discountPrice: number;
    usedPoints: number;
    earnPoints: number;
    finalPrice: number;
    status: OrderStatus;
    deliveryAt?: string;
    orderItems: OrderItem[];
}

export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    orderPrice: number;
    count: number;
    product?: Product; // Included for convenience
}

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

export interface SellerApplicationListResponse {
    items: SellerApplication[];
    totalElements: number;
    page: number;
    size: number;
    totalPages: number;
}
export interface SellerApplication {
    id: number;
    userId: number;
    businessName: string;
    businessNumber: string;
    status: string;
    rejectReason?: string;
}

export interface SellerApplicationListResponse {
    items: SellerApplication[];
    totalElements: number;
    page: number;
    size: number;
    totalPages: number;
}
