"use client";

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Package, MapPin, Truck, AlertCircle, ShoppingBag, CreditCard } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { orderService } from '@/services/orderService';
import { OrderDetailResponse, ProductStatus } from '@/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { isAuthenticated, checkAuth } = useAuthStore();
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrderDetail();
        }
    }, [isAuthenticated, id]);

    const fetchOrderDetail = async () => {
        try {
            setIsLoading(true);
            const data = await orderService.getOrder(Number(id));
            setOrder(data);
        } catch (error) {
            console.error(error);
            // alert('주문 정보를 불러오는데 실패했습니다.');
            // router.back();
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!order) return;
        if (!confirm('정말로 주문을 취소하시겠습니까? \n(취소 시 재고가 복구됩니다)')) return;

        const addToCart = confirm('취소한 상품들을 장바구니에 다시 담으시겠습니까?');

        try {
            await orderService.cancelOrder(order.id, addToCart);
            alert('주문이 취소되었습니다.');
            fetchOrderDetail(); // Refresh data
        } catch (error) {
            console.error(error);
            alert('주문 취소 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-20 flex justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-secondary rounded-full mb-4" />
                    <div className="h-4 w-40 bg-secondary rounded" />
                </div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-black tracking-tight">주문 상세</h1>
                </div>

                {/* Status Card */}
                <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-primary/5 mb-8 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-bold text-muted-foreground">
                                    {new Date(order.orderedAt).toLocaleString()}
                                </span>
                                <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                                <span className="text-sm font-bold text-muted-foreground">
                                    주문번호 {order.id}
                                </span>
                            </div>
                            <h2 className="text-4xl font-black text-primary mb-2 line-clamp-1">
                                {order.orderName}
                            </h2>
                            <p className={cn(
                                "text-lg font-bold",
                                order.status === 'CANCELLED' ? "text-red-500" : "text-blue-500"
                            )}>
                                {order.status}
                            </p>
                        </div>

                        {(order.status === 'PENDING' || order.status === 'PAYMENT_COMPLETED') && (
                            <button
                                onClick={handleCancelOrder}
                                className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors"
                            >
                                주문 취소
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Items */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Order Items */}
                        <div className="bg-card border border-border rounded-[2rem] p-6 md:p-8">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                주문 상품 <span className="text-primary">{order.orderItems.length}</span>
                            </h3>
                            <div className="space-y-6">
                                {order.orderItems.map((item) => (
                                    <div key={item.productId} className="flex gap-5 items-start">
                                        <div className="w-24 h-24 bg-secondary rounded-2xl overflow-hidden shrink-0 border border-border/50">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    <Package className="w-8 h-8 opacity-20" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <Link href={`/store/${item.productId}`} className="font-bold text-lg hover:underline truncate pr-4">
                                                    {item.productName}
                                                </Link>
                                            </div>
                                            <p className="text-muted-foreground font-medium mb-3">
                                                {(item.price || 0).toLocaleString()}원 · {item.quantity || 0}개
                                            </p>
                                            <div className="flex gap-2">
                                                <span className={cn(
                                                    "text-xs font-bold px-2 py-1 rounded-lg bg-secondary",
                                                    item.productStatus === 'SOLD_OUT' && "text-red-500 bg-red-50"
                                                )}>
                                                    {item.productStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-card border border-border rounded-[2rem] p-6 md:p-8">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                결제 정보
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-muted-foreground font-medium">
                                    <span>총 상품 금액</span>
                                    <span>{order.totalPrice.toLocaleString()}원</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground font-medium">
                                    <span>배송비</span>
                                    <span>0원</span>
                                </div>
                                <div className="h-px bg-border my-2" />
                                <div className="flex justify-between text-lg font-black text-primary">
                                    <span>최종 결제 금액</span>
                                    <span>{(order.totalPrice || 0).toLocaleString()}원</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Shipping */}
                    <div className="space-y-8">
                        <div className="bg-card border border-border rounded-[2rem] p-6 md:p-8 sticky top-24">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                <Truck className="w-5 h-5" />
                                배송지 정보
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">받는 분</p>
                                    <p className="font-bold">{order.recipientName}</p>
                                    <p className="text-sm text-muted-foreground font-medium mt-0.5">{order.recipientPhone}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">주소</p>
                                    <p className="font-bold mb-0.5">({order.zipCode})</p>
                                    <p className="text-sm font-medium">{order.shippingAddress}</p>
                                    <p className="text-sm font-medium">{order.shippingAddressDetail}</p>
                                </div>
                                {order.deliveryMemo && (
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">배송 메모</p>
                                        <div className="bg-secondary/30 p-3 rounded-xl">
                                            <p className="text-sm font-medium text-muted-foreground">"{order.deliveryMemo}"</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
