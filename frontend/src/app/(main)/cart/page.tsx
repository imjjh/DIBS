"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    ChevronRight,
    ShieldCheck,
    Truck,
    ArrowLeft,
    CreditCard,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { cartService, CartItemResponse } from '@/services/cartService';
import { orderService, OrderCreateRequest } from '@/services/orderService';
import { useAuthStore } from '@/store/useAuthStore';
import { AddressInput } from '@/components/common/AddressInput';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Shipping Address State
    const [shippingInfo, setShippingInfo] = useState({
        recipientName: '',
        recipientPhone: '',
        zipCode: '',
        shippingAddress: '',
        shippingAddressDetail: '',
        deliveryMemo: ''
    });

    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            setShippingInfo(prev => ({
                ...prev,
                recipientName: user.nickname || user.name || ''
            }));
        }
    }, [user]);

    const fetchCartItems = async () => {
        if (!isAuthenticated) return;
        try {
            setIsLoading(true);
            const response = await cartService.getCartItems();
            setCartItems(response.items);
        } catch (error) {
            console.error("Failed to fetch cart items:", error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        setMounted(true);
        fetchCartItems();
    }, []);

    if (!mounted) return null;

    const updateCount = async (productId: number, newCount: number) => {
        if (newCount < 1) return;

        try {
            await cartService.updateCartItemQuantity(productId, newCount);
            setCartItems(prev => prev.map(item =>
                item.productId === productId ? { ...item, quantity: newCount } : item
            ));
        } catch (error) {
            console.error("Failed to update quantity:", error);
            alert("수량 변경에 실패했습니다.");
        }
    };

    const removeItem = async (productId: number) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await cartService.removeCartItem(productId);
            setCartItems(prev => prev.filter(item => item.productId !== productId));
        } catch (error) {
            console.error("Failed to remove item:", error);
            alert("상품 삭제에 실패했습니다.");
        }
    };

    const handleOrder = async () => {
        if (cartItems.length === 0 || isSubmitting) return;
        if (!isAuthenticated) {
            alert('로그인이 필요한 서비스입니다.');
            router.push('/login');
            return;
        }

        // Validation
        if (!shippingInfo.recipientName || !shippingInfo.recipientPhone || !shippingInfo.shippingAddress || !shippingInfo.zipCode) {
            alert('배송 정보를 모두 입력해주세요.');
            return;
        }

        const confirmOrder = window.confirm(`총 ${cartItems.length}개의 상품을 주문하시겠습니까?`);
        if (!confirmOrder) return;

        try {
            setIsSubmitting(true);
            const orderRequest: OrderCreateRequest = {
                ...shippingInfo,
                orderItems: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            };

            await orderService.createOrder(orderRequest);
            alert('주문이 완료되었습니다!');
            router.push('/mypage');
        } catch (error: any) {
            console.error("Order Error:", error.response?.data || error.message);
            alert("주문 처리 중 오류가 발생했습니다.\n" + (error.response?.data?.message || "다시 시도해주세요."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingFee = totalPrice > 50000 || cartItems.length === 0 ? 0 : 3000;
    const finalPrice = totalPrice + shippingFee;

    if (!isAuthenticated) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-black mb-2 tracking-tight">로그인이 필요합니다</h2>
                <p className="text-muted-foreground mb-8">장바구니를 확인하려면 로그인을 해주세요.</p>
                <button
                    onClick={() => router.push('/login')}
                    className="px-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                >
                    로그인하러 가기
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="font-black text-muted-foreground uppercase tracking-widest text-sm">Loading your cart...</p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4">
                <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mb-8">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground opacity-20" />
                </div>
                <h2 className="text-3xl font-black mb-3">장바구니가 비어있습니다</h2>
                <p className="text-muted-foreground mb-10 text-lg">DIBS!의 엄선된 선착순 딜을 확인해보세요.</p>
                <Link
                    href="/store"
                    className="px-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center gap-2 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    쇼핑하러 가기
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-32">
            <div className="container mx-auto px-4 pt-12">
                <div className="flex flex-col gap-2 mb-12">
                    <h1 className="text-5xl font-black tracking-tighter">Shopping Cart</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-bold">장바구니</span>
                        <ChevronRight className="w-4 h-4 opacity-30" />
                        <span className="font-medium opacity-50">주문/결제</span>
                        <ChevronRight className="w-4 h-4 opacity-30" />
                        <span className="font-medium opacity-50">완료</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-background border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/[0.02]">
                            <div className="px-8 py-5 bg-secondary/10 border-b border-border flex items-center justify-between">
                                <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">Items ({cartItems.length})</span>
                                <button className="text-xs font-black text-muted-foreground hover:text-red-500 transition-colors uppercase tracking-[0.1em]">Clear All</button>
                            </div>

                            <div className="divide-y divide-border/50">
                                {cartItems.map((item) => (
                                    <div key={item.productId} className="p-8 flex flex-col md:flex-row gap-8 group">

                                        {/* Product Image */}
                                        <div className="relative w-full md:w-32 aspect-square bg-muted rounded-[2rem] overflow-hidden shadow-lg group-hover:shadow-primary/10 transition-all duration-500 shrink-0">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                                                    <ShoppingBag className="w-12 h-12" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{item.sellerName}</p>
                                                    <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{item.productName}</h3>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.productId)}
                                                    className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all active:scale-90"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap items-end justify-between pt-4">
                                                <div className="flex items-center bg-secondary/20 p-1.5 rounded-2xl border border-border/50">
                                                    <button
                                                        onClick={() => updateCount(item.productId, item.quantity - 1)}
                                                        className="p-2 hover:bg-background rounded-xl transition-all active:scale-90"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-12 text-center font-black text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateCount(item.productId, item.quantity + 1)}
                                                        className="p-2 hover:bg-background rounded-xl transition-all active:scale-90"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-black tracking-tighter">{(item.price * item.quantity).toLocaleString()}<span className="text-sm ml-1">원</span></p>
                                                    {item.quantity > 1 && (
                                                        <p className="text-xs text-muted-foreground font-bold">개당 {item.price.toLocaleString()}원</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Information Form */}
                        <AddressInput
                            value={shippingInfo}
                            onChange={setShippingInfo}
                        />

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-4 sticky top-24 space-y-6">
                            <div className="bg-background border border-border rounded-[2.5rem] p-8 shadow-2xl shadow-primary/5">
                                <h2 className="text-2xl font-black mb-8 tracking-tighter uppercase">Order Summary</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-muted-foreground">
                                        <span className="text-sm font-bold">상품 합계</span>
                                        <span className="text-lg font-black text-foreground">{totalPrice.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between items-center text-muted-foreground">
                                        <span className="text-sm font-bold">배송비</span>
                                        <span className="text-lg font-black text-foreground">
                                            {shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-8 mb-10">
                                    <div className="flex items-end justify-between mb-2">
                                        <span className="text-lg font-black uppercase tracking-widest text-muted-foreground">Total</span>
                                        <span className="text-4xl font-black tracking-tighter text-primary">{finalPrice.toLocaleString()}<span className="text-lg ml-1">원</span></span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleOrder}
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <CreditCard className="w-5 h-5" />
                                    )}
                                    {isSubmitting ? 'Processing...' : '주문 결제하기'}
                                </button>
                            </div>

                            {/* Security Badge */}
                            <div className="bg-secondary/10 rounded-[2rem] p-6 flex items-center justify-center gap-4 border border-border/50">
                                <Truck className="w-5 h-5 text-muted-foreground opacity-50" />
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Safe Global Shipping</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
